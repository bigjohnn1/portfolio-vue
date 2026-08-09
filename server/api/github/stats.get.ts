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

interface GraphqlCommitNode {
  oid: string
  messageHeadline: string
  committedDate: string
  url: string
  author: { user: { login: string } | null } | null
}

interface GraphqlContributedRepository {
  contributions: { totalCount: number }
  repository: {
    nameWithOwner: string
    url: string
    isPrivate: boolean
    languages: {
      edges: { size: number, node: { name: string, color: string | null } }[] | null
    } | null
    defaultBranchRef: {
      target: { history?: { nodes: (GraphqlCommitNode | null)[] | null } } | null
    } | null
  }
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
        totalRepositoriesWithContributedCommits: number
        contributionCalendar: {
          totalContributions: number
          weeks: { contributionDays: GraphqlCalendarDay[] }[]
        }
        commitContributionsByRepository: GraphqlContributedRepository[]
      }
      repositories: {
        totalCount: number
        nodes: { stargazerCount: number }[] | null
      }
    } | null
  }
  errors?: { message: string }[]
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
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
      commitContributionsByRepository(maxRepositories: 12) {
        contributions { totalCount }
        repository {
          nameWithOwner
          url
          isPrivate
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  nodes {
                    oid
                    messageHeadline
                    committedDate
                    url
                    author { user { login } }
                  }
                }
              }
            }
          }
        }
      }
    }
    repositories(
      first: 100
      isFork: false
      privacy: PUBLIC
      ownerAffiliations: OWNER
    ) {
      totalCount
      nodes { stargazerCount }
    }
  }
}`

const FALLBACK_LANGUAGE_COLOR = '#8b949e'
const MAX_COMMITS = 6
const MAX_LANGUAGES = 6
const MAX_MESSAGE_LENGTH = 120

const toLanguages = (contributed: GraphqlContributedRepository[]): GithubLanguage[] => {
  const weights = new Map<string, { weight: number, color: string }>()

  for (const entry of contributed) {
    const edges = entry.repository.languages?.edges ?? []
    const repoSize = edges.reduce((sum, edge) => sum + edge.size, 0)
    if (repoSize === 0) continue

    const commits = Math.max(1, entry.contributions.totalCount)

    for (const edge of edges) {
      const current = weights.get(edge.node.name)
      weights.set(edge.node.name, {
        weight: (current?.weight ?? 0) + commits * (edge.size / repoSize),
        color: current?.color ?? edge.node.color ?? FALLBACK_LANGUAGE_COLOR,
      })
    }
  }

  const total = [...weights.values()].reduce((sum, entry) => sum + entry.weight, 0)
  if (total === 0) return []

  return [...weights.entries()]
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, MAX_LANGUAGES)
    .map(([name, entry]) => ({
      name,
      color: entry.color,
      percent: Math.round((entry.weight / total) * 1000) / 10,
    }))
}

const toCommits = (contributed: GraphqlContributedRepository[], login: string): GithubCommit[] =>
  contributed
    .flatMap(entry =>
      (entry.repository.defaultBranchRef?.target?.history?.nodes ?? [])
        .filter((node): node is GraphqlCommitNode => node?.author?.user?.login === login)
        .map(node => ({
          repo: entry.repository.nameWithOwner,
          repoUrl: entry.repository.url,
          message: node.messageHeadline.slice(0, MAX_MESSAGE_LENGTH),
          sha: node.oid.slice(0, 7),
          url: node.url,
          date: node.committedDate,
        })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_COMMITS)

export default defineCachedEventHandler(
  async (event): Promise<GithubStats> => {
    const config = useRuntimeConfig(event)
    const token = config.githubToken
    const login = config.public.github.username

    if (!token) {
      throw createError({ statusCode: 503, statusMessage: 'github_token_missing' })
    }

    const profile = await $fetch<GraphqlResponse>('https://api.github.com/graphql', {
      method: 'POST',
      timeout: 8000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': `${login}-portfolio`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: { query: PROFILE_QUERY, variables: { login } },
    })

    const user = profile.data?.user
    if (!user) {
      throw createError({ statusCode: 502, statusMessage: 'github_unavailable' })
    }

    const contributions = user.contributionsCollection
    const rawDays = contributions.contributionCalendar.weeks.flatMap(week => week.contributionDays)
    const scale = buildContributionScale(rawDays.map(day => day.contributionCount))
    const days: ContributionDay[] = rawDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: toContributionLevel(day.contributionCount, scale),
    }))

    const dayByDate = new Map(days.map(day => [day.date, day]))
    const weeks = contributions.contributionCalendar.weeks.map(week =>
      week.contributionDays
        .map(day => dayByDate.get(day.date))
        .filter((day): day is ContributionDay => Boolean(day)),
    )

    const publicContributions = contributions.commitContributionsByRepository
      .filter(entry => !entry.repository.isPrivate)

    return {
      login: user.login,
      profileUrl: user.url,
      fetchedAt: new Date().toISOString(),
      totals: {
        contributions: contributions.contributionCalendar.totalContributions,
        commits: contributions.totalCommitContributions,
        pullRequests: contributions.totalPullRequestContributions,
        issues: contributions.totalIssueContributions,
        repositories: contributions.totalRepositoriesWithContributedCommits,
        stars: (user.repositories.nodes ?? []).reduce((sum, repo) => sum + repo.stargazerCount, 0),
        followers: user.followers.totalCount,
      },
      streak: computeStreaks(days),
      calendar: {
        total: contributions.contributionCalendar.totalContributions,
        weeks,
      },
      languages: toLanguages(publicContributions),
      commits: toCommits(publicContributions, user.login),
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
