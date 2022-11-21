import { DateTime } from 'luxon'

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

export const getMatches = async (): Promise<TMatchD[]> => {
  const res = await fetch('https://fixturedownload.com/feed/json/fifa-world-cup-2022')
  const data = (await res.json()) as TMatch[]

  return data.map((match) => {
    // @ts-ignore
    match.Date = new Date(match.DateUtc)

    return match as TMatchD
  })
}

export interface TMatch {
  MatchNumber: number
  RoundNumber: number
  DateUtc: string
  Location: string
  HomeTeam: string
  AwayTeam: string
  Group: string
  HomeTeamScore: number
  AwayTeamScore: number
}

export interface TMatchD extends TMatch {
  Date: Date
}

interface Props {
  match: TMatchD
}

const Match = (props: Props) => {
  const today = Date.now()
  const isStarted = props.match.Date.getTime() < today

  return (
    <div className="flex flex-col p-4 bg-white container gap-2 border">
      <div className="flex">
        <div className="flex flex-col items-center" style={{ width: '35%' }}>
          <div className="bg-red-400" style={{ width: '50px', height: '50px' }}></div>
          <div className="text-center">{props.match.HomeTeam}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center">
            <div>{props.match.Group}</div>
            <div>
              {DateTime.fromJSDate(props.match.Date).setLocale('us').toLocaleString(DateTime.TIME_SIMPLE)}
            </div>
            {!isStarted && (
              <div className="text-center">
                {DateTime.fromJSDate(props.match.Date).setLocale('es').toRelativeCalendar()}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              disabled={isStarted}
              name="homeScore"
              style={{ fontSize: '30px', height: '40px', width: '40px' }}
              className={isStarted ? 'text-center' : 'text-center border'}
            />
            <span>vs</span>
            <input
              disabled={isStarted}
              name="awayScore"
              style={{ fontSize: '30px', height: '40px', width: '40px' }}
              className={isStarted ? 'text-center' : 'text-center border'}
            />
          </div>
        </div>
        <div className="flex flex-col items-center" style={{ width: '35%' }}>
          <div className="bg-red-400" style={{ width: '50px', height: '50px' }}></div>
          <div className="text-center">{props.match.AwayTeam} </div>
        </div>
      </div>
      {isStarted ? (
        <div className="text-center font-bold">
          {props.match.HomeTeamScore} - {props.match.AwayTeamScore}
        </div>
      ) : (
        <button className={btn}>save</button>
      )}
    </div>
  )
}

export default Match
