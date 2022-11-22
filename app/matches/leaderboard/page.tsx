'use client'
import PocketBase from 'pocketbase'
import { use, useEffect, useState } from 'react'

import { TMatch } from '../Match'

interface Props {
  //
}

interface TLiga {
  liga_name: string
  user_id: string
  id: string
  created: string
  updated: string
}

interface TBet {
  away_score: number
  home_score: number
  created: string
  id: string
  match_number: number
  user_id: string
  updated: string
}

interface Api<T> {
  items: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

const useQuery = <T,>(
  key: string,
  fn: any,
  dep?: string | null
): { data: T | null; loading: boolean; refresh: VoidFunction } => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | '-'>('loading')
  const refresh = () => {
    setStatus('loading')
    fn()
      .then((d: T) => {
        setData(d as never)
      })
      .catch(() => {
        setStatus('error')
      })
  }
  useEffect(() => {
    if (!dep) return
    refresh()
  }, [dep])

  return { data, refresh, loading: status === 'loading' && data !== null }
}

const fetchMatches = async () => {
  const res = await fetch('https://fixturedownload.com/feed/json/fifa-world-cup-2022')
  const data = (await res.json()) as TMatch[]

  return data
}

const fetchMap = new Map<string, Promise<any>>()
function queryClient<QueryResult>(name: string, query: () => Promise<QueryResult>): Promise<QueryResult> {
  if (!fetchMap.has(name)) {
    fetchMap.set(name, query())
  }

  return fetchMap.get(name)!
}

export const revalidate = 10

const LeaderB = (props: Props) => {
  const [id, setId] = useState<string | null>(null)
  const { data } = useQuery<{ userids: string[] }>(
    'get-points',
    () => fetch('/api/points?id=' + id).then((r) => r.json()),
    id
  )

  useEffect(() => {
    const name = localStorage.getItem('login')
    if (name) {
      setId(name)
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="text-3xl">Leaderboard</div>
      <div className="flex flex-col">
        {data?.userids?.map((u, i) => (
          <div key={u} className="bg-white p-2 border flex justify-between">
            <div>
              {i + 1}. {u}
            </div>
            <div className="border px-2">0</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeaderB
