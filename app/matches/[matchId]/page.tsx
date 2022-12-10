'use client'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

import Match, { getMatches, TMatch, TMatchD } from '../Match'

interface Props {
  params?: {
    matchId?: string | null
  }
  searchParams?: {
    liga?: string | null
  }
}

const useQuery = <T,>(
  key: string,
  fn: any,
  dep: string | null
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

interface TBet {
  away_score: number
  home_score: number
  created: string
  id: string
  match_number: number
  user_id: string
  updated: string
}

export const revalidate = 10

const MatchId = (props: Props) => {
  const [id, setId] = useState<string | null>(null)
  useEffect(() => {
    const login = localStorage.getItem('login')
    if (login) {
      setId(login)
    }
  }, [])
  const matchId = props.params?.matchId || ''
  const liga = props.searchParams?.liga || ''

  const { data } = useQuery<{
    match: TMatch
    history: { bet: TBet; points: number; id: string }[]
  }>(
    'get-history',
    () => fetch('/api/history?id=' + id + '&matchId=' + matchId + '&liga=' + liga).then((r) => r.json()),
    id
  )
  let match: TMatchD | null = null
  if (data?.match) {
    // @ts-ignore
    match = data.match
    // @ts-ignore
    match.Date = new Date(match.DateUtc)
  }

  const getIsInvalid = (r: any) =>
    match?.Date &&
    DateTime.fromJSDate(match.Date).diff(DateTime.fromISO(r.bet.updated.split(' ').join('T'))).milliseconds <
      0

  return (
    <>
      {match && <Match isViewOthers match={match} />}
      <div className="shadow">
        <table className="table-auto w-full bg-white p-2 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Prediction</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {data?.history.map((r) => (
              <tr className="border" key={r.id}>
                <td className="p-2">{r.id}</td>
                <td className="p-2 text-center">
                  {r.bet.home_score} - {r.bet.away_score}
                </td>
                <td
                  className={
                    getIsInvalid(r) ? 'p-2 text-center font-mono text-red-600' : 'p-2 text-center font-mono'
                  }
                  title={r.bet.updated}
                >
                  <>
                    {DateTime.fromISO(r.bet.updated.split(' ').join('T')).toLocaleString(
                      DateTime.DATETIME_SHORT
                    )}
                  </>
                </td>
                <td className="p-2 text-center">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MatchId
