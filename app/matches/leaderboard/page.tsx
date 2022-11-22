'use client'
import { useEffect, useState } from 'react'

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

export const revalidate = 10

const LeaderB = () => {
  const [id, setId] = useState<string | null>(null)
  const { data } = useQuery<{ betsByUser: Record<string, { id: string; points: number }> }>(
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

  const users = Object.values(data?.betsByUser || {}).sort((a, b) => b.points - a.points)

  return (
    <div className="flex flex-col">
      <div className="text-3xl">Leaderboard</div>
      <div className="flex flex-col">
        {users.map((u, i) => (
          <div key={u.id} className="bg-white p-2 border flex justify-between">
            <div>
              {i + 1}. {u.id}
            </div>
            <div className="border px-2">{u.points}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeaderB
