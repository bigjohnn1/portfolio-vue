import {
  buildContributionScale,
  computeStreaks,
  toContributionLevel,
} from '../../../shared/github'
import type {
  ContributionDay,
  GithubCommit,
  GithubLanguage,
  GithubStats,
} from '../../../shared/github'

interface GraphqlCalendarDay {
  date: string
  contributionCount: number
}

interface GraphqlRepository {
  name: string
  url: string
  stargazerCount: number
  languages: {
    edges: { size: number, node: { name: string, color: string | null } }[] | null
  } | null
}

interface GraphqlResponse {
  data?: {
    user: {
      login: string
      url: string
      followers: { totalCount: number }
      contributionsCollection: {
        totalCommitContributions: number
        totalPullRequestContributions: number
        totalIssueContributions: number
        contributionCalendar: {
          totalContributions: number
          weeks: { contributionDays: GraphqlCalendarDay[] }[]
        }
      }
      repositories: {
        totalCount: number
        nodes: GraphqlRepository[] | null
      }
    } | null
  }
  errors?: { message: string }[]
}

interface RestPushEvent {
  type: string
  created_at: string
  repo: { name: string }
  payload?: {
    commits?: { sha: string, message: string, distinct: boolean }[]
  }
}

const PROFILE_QUERY = `
query ($login: String!) {
  user(login: $login) {
    login
    url
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
    repositories(
      first: 100
      isFork: false
      privacy: PUBLIC
      ownerAffiliations: OWNER
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        name
        url
        stargazerCount
        languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}`

const FALLBACK_LANGUAGE_COLOR = '#8b949e'
const MAX_COMMITS = 6
const MAX_LANGUAGES = 6

const toLanguages = (repositories: GraphqlRepository[]): GithubLanguage[] => {
  const sizes = new Map<string, { size: number, color: string }>()

  for (const repo of repositories) {
    for (const edge of repo.languages?.edges ?? []) {
      const entry = sizes.get(edge.node.name)
      sizes.set(edge.node.name, {
        size: (entry?.size ?? 0) + edge.size,
        color: entry?.color ?? edge.node.color ?? FALLBACK_LANGUAGE_COLOR,
      })
    }
  }

  const total = [...sizes.values()].reduce((sum, entry) => sum + entry.size, 0)
  if (total === 0) return []

  return [...sizes.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, MAX_LANGUAGES)
    .map(([name, entry]) => ({
      name,
      color: entry.color,
      percent: Math.round((entry.size / total) * 1000) / 10,
    }))
}

const toCommits = (events: RestPushEvent[]): GithubCommit[] => {
  const commits: GithubCommit[] = []

  for (const event of events) {
    if (event.type !== 'PushEvent') continue

    const pushed = [...(event.payload?.commits ?? [])].reverse()
    for (const commit of pushed) {
      if (!commit.distinct) continue
      if (commits.some(existing => existing.sha === commit.sha)) continue

      commits.push({
        repo: event.repo.name,
        repoUrl: `https://github.com/${event.repo.name}`,
        message: commit.message.split('\n')[0]?.slice(0, 120) ?? '',
        sha: commit.sha.slice(0, 7),
        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        date: event.created_at,
      })

      if (commits.length >= MAX_COMMITS) return commits
    }
  }

  return commits
}

export default defineCachedEventHandler(
  async (event): Promise<GithubStats> => {
    const config = useRuntimeConfig(event)
    const token = config.githubToken
    const login = config.public.github.username

    if (!token) {
      throw createError({ statusCode: 503, statusMessage: 'github_token_missing' })
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': `${login}-portfolio`,
      'X-GitHub-Api-Version': '2022-11-28',
    }

    const [profile, events] = await Promise.all([
      $fetch<GraphqlResponse>('https://api.github.com/graphql', {
        method: 'POST',
        headers,
        timeout: 8000,
        body: { query: PROFILE_QUERY, variables: { login } },
      }),
      $fetch<RestPushEvent[]>(`https://api.github.com/users/${login}/events/public`, {
        headers,
        timeout: 8000,
        query: { per_page: 100 },
      }).catch(() => [] as RestPushEvent[]),
    ])

    const user = profile.data?.user
    if (!user) {
      throw createError({ statusCode: 502, statusMessage: 'github_unavailable' })
    }

    const rawDays = user.contributionsCollection.contributionCalendar.weeks.flatMap(
      week => week.contributionDays,
    )
    const scale = buildContributionScale(rawDays.map(day => day.contributionCount))
    const days: ContributionDay[] = rawDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: toContributionLevel(day.contributionCount, scale),
    }))

    const dayByDate = new Map(days.map(day => [day.date, day]))
    const weeks = user.contributionsCollection.contributionCalendar.weeks.map(week =>
      week.contributionDays
        .map(day => dayByDate.get(day.date))
        .filter((day): day is ContributionDay => Boolean(day)),
    )

    const repositories = user.repositories.nodes ?? []

    return {
      login: user.login,
      profileUrl: user.url,
      fetchedAt: new Date().toISOString(),
      totals: {
        contributions: user.contributionsCollection.contributionCalendar.totalContributions,
        commits: user.contributionsCollection.totalCommitContributions,
        pullRequests: user.contributionsCollection.totalPullRequestContributions,
        issues: user.contributionsCollection.totalIssueContributions,
        repositories: user.repositories.totalCount,
        stars: repositories.reduce((sum, repo) => sum + repo.stargazerCount, 0),
        followers: user.followers.totalCount,
      },
      streak: computeStreaks(days),
      calendar: {
        total: user.contributionsCollection.contributionCalendar.totalContributions,
        weeks,
      },
      languages: toLanguages(repositories),
      commits: toCommits(events),
    }
  },
  {
    name: 'github',
    group: 'api',
    getKey: () => 'stats',
    maxAge: 60 * 15,
    swr: true,
  },
)
