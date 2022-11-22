'use client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PocketBase from 'pocketbase'
import { useEffect, useLayoutEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { TMatchD } from './Match'

interface Props {
  isStarted?: boolean
  match: TMatchD
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

const btn = [
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-slate-400',
  'focus:ring-offset-2',
  'focus:ring-offset-slate-50',
  'text-white',
  'font-semibold',
  'h-10',
  'px-6',
  'rounded-lg',
  'w-full',
  'flex',
  'items-center',
  'justify-center',
  'sm:w-auto',
  'bg-sky-500',
  'highlight-white/20',
  'hover:bg-sky-400',
].join(' ')

const useMutation = (fn: any, options?: { onSuccess?: VoidFunction; onError?: VoidFunction }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | '-'>('-')
  const { onSuccess, onError } = options || {}

  const mutate = (...payload: any) =>
    new Promise((resolve, reject) => {
      setStatus('loading')
      fn(...payload)
        .then(() => {
          if (typeof onSuccess === 'function') onSuccess()
          setStatus('success')
          resolve(true)
        })
        .catch(() => {
          if (typeof onError === 'function') onError()
          setStatus('error')
          reject()
        })
    })

  return { loading: status === 'loading', mutate, status }
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

const MatchScore = (props: Props) => {
  const [id, setId] = useState<string | null>(null)
  const client = new PocketBase('https://pocketbase-production-f6a9.up.railway.app')
  const createMatch = useMutation((data: any) => client.collection('bets').create(data))
  const updateMatch = useMutation((id: string, data: any) => client.collection('bets').update(id, data))
  const getMatch = useQuery<Api<TBet>>(
    'get-match',
    () =>
      client
        .collection('bets')
        .getList(0, 1, { filter: `user_id = '${id}' && match_number = ${props.match.MatchNumber}` }),
    id
  )
  const dbMatch = (getMatch.data?.items?.length || 0) > 0 ? getMatch.data?.items[0] : null

  useEffect(() => {
    const login = localStorage.getItem('login')
    if (login) {
      setId(login)
    }
  }, [])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const state = Object.values(e.target)
      .filter((x) => x.name)
      .map((x) => [x.name, x.value])
      .reduce((_, x) => ({ ..._, [x[0]]: x[1] }), {}) as { homeScore: string; awayScore: string }

    if (dbMatch?.id) {
      toast.promise(
        updateMatch.mutate(dbMatch.id, {
          match_number: props.match.MatchNumber,
          user_id: id,
          home_score: Number(state.homeScore) || 0,
          away_score: Number(state.awayScore) || 0,
        }),
        {
          loading: 'Loading...',
          success: 'Updated',
          error: 'Error',
        }
      )
    } else {
      toast
        .promise(
          createMatch.mutate({
            match_number: props.match.MatchNumber,
            user_id: id,
            home_score: Number(state.homeScore) || 0,
            away_score: Number(state.awayScore) || 0,
          }),
          {
            loading: 'Loading...',
            success: 'Success',
            error: 'Error',
          }
        )
        .then(() => {
          getMatch.refresh()
        })
    }
  }

  const homeScore = dbMatch?.home_score || ''
  const awayScore = dbMatch?.away_score || ''

  let points = 0
  let bgColor = 'bg-red-200'
  if (
    Number(homeScore) - Number(awayScore) > 0 &&
    props.match.HomeTeamScore - props.match.AwayTeamScore > 0
  ) {
    points = 1
    bgColor = 'bg-green-200'
  }
  if (
    Number(homeScore) - Number(awayScore) < 0 &&
    props.match.HomeTeamScore - props.match.AwayTeamScore < 0
  ) {
    points = 1
    bgColor = 'bg-green-200'
  }
  if (homeScore == props.match.HomeTeamScore && awayScore == props.match.AwayTeamScore) {
    points = 3
    bgColor = 'bg-green-400'
  }

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <div className="flex gap-2 justify-center items-center">
          <input
            disabled={createMatch.loading || props.isStarted}
            type="number"
            name="homeScore"
            defaultValue={homeScore}
            style={{ fontSize: '30px', height: '45px', width: '45px' }}
            className={props.isStarted ? 'bg-slate-100 text-slate-400 text-center' : 'text-center border'}
          />
          <span>vs</span>
          <input
            disabled={createMatch.loading || props.isStarted}
            type="number"
            name="awayScore"
            defaultValue={awayScore}
            style={{ fontSize: '30px', height: '45px', width: '45px' }}
            className={props.isStarted ? 'bg-slate-100 text-slate-400 text-center' : 'text-center border'}
          />
        </div>
        {props.isStarted ? (
          <div>
            <div className={'text-center font-bold ' + bgColor}>
              real score: {props.match.HomeTeamScore} - {props.match.AwayTeamScore}
            </div>
            <div className="text-center">+{points}</div>
          </div>
        ) : (
          <>
            {!id && (
              <Link className={btn} href="/login">
                login
              </Link>
            )}
            <button
              disabled={createMatch.loading}
              type="submit"
              className={btn}
              style={{ display: !id ? 'none' : 'block' }}
            >
              {createMatch.loading ? 'loading...' : 'save'}
            </button>
          </>
        )}
        <Toaster position="top-center" reverseOrder={false} />
      </form>
    </>
  )
}

export default MatchScore
