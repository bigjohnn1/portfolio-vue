export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  date: string
  count: number
  level: ContributionLevel
}

export interface GithubLanguage {
  name: string
  color: string
  percent: number
}

export interface GithubCommit {
  repo: string
  repoUrl: string
  message: string
  sha: string
  url: string
  date: string
}

export interface GithubStats {
  login: string
  profileUrl: string
  fetchedAt: string
  totals: {
    contributions: number
    commits: number
    pullRequests: number
    issues: number
    repositories: number
    stars: number
    followers: number
  }
  streak: {
    current: number
    longest: number
  }
  calendar: {
    total: number
    weeks: ContributionDay[][]
  }
  languages: GithubLanguage[]
  commits: GithubCommit[]
}

export type ContributionScale = [number, number, number]

export const buildContributionScale = (counts: number[]): ContributionScale => {
  const active = counts.filter(count => count > 0).sort((a, b) => a - b)
  if (active.length === 0) return [1, 2, 3]

  const quantile = (ratio: number) =>
    active[Math.min(active.length - 1, Math.floor(active.length * ratio))] ?? 1

  const first = Math.max(1, quantile(0.25))
  const second = Math.max(first + 1, quantile(0.5))
  const third = Math.max(second + 1, quantile(0.75))

  return [first, second, third]
}

export const toContributionLevel = (count: number, scale: ContributionScale): ContributionLevel => {
  if (count <= 0) return 0
  if (count <= scale[0]) return 1
  if (count <= scale[1]) return 2
  if (count <= scale[2]) return 3
  return 4
}

export const computeStreaks = (days: ContributionDay[], today = new Date()) => {
  let longest = 0
  let running = 0

  for (const day of days) {
    running = day.count > 0 ? running + 1 : 0
    if (running > longest) longest = running
  }

  const todayKey = today.toISOString().slice(0, 10)
  let current = 0

  for (let index = days.length - 1; index >= 0; index--) {
    const day = days[index]
    if (!day || day.date > todayKey) continue
    if (day.count > 0) {
      current++
      continue
    }
    if (day.date === todayKey) continue
    break
  }

  return { current, longest }
}
