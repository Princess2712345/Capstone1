import type { Doctor } from '~/utils/types'

export type LoadFilter = 'all' | 'open' | 'tight' | 'hot' | 'full'

export const LOAD_FILTERS: { id: LoadFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'tight', label: 'Filling' },
  { id: 'hot', label: 'Near cap' },
  { id: 'full', label: 'At cap' }
]

export function loadRatio(d: Doctor) {
  return d.dailyCap > 0 ? d.todayLoad / d.dailyCap : 1
}

export function matchesLoad(d: Doctor, filter: LoadFilter) {
  const r = loadRatio(d)
  if (filter === 'all') return true
  if (filter === 'full') return d.todayLoad >= d.dailyCap
  if (filter === 'hot') return r >= 0.85 && d.todayLoad < d.dailyCap
  if (filter === 'tight') return r >= 0.6 && r < 0.85
  return r < 0.6
}

export function sortByLoad(docs: Doctor[]) {
  return [...docs].sort((a, b) => loadRatio(b) - loadRatio(a) || a.name.localeCompare(b.name))
}

export function loadCount(docs: Doctor[], filter: LoadFilter) {
  return docs.filter(d => matchesLoad(d, filter)).length
}
