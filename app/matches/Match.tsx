import { DateTime } from 'luxon'
import Image from 'next/image'

import MatchScore from './MatchScore'

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
    <div className="flex flex-col p-4 bg-white gap-2 border my-2 shadow" style={{ width: '100%' }}>
      <div className="flex">
        <div className="flex flex-col items-center" style={{ width: '35%' }}>
          <Image
            className="border"
            alt={props.match.HomeTeam + "'s Country Flag"}
            height={60}
            width={60}
            src={'https://countryflagsapi.com/png/' + props.match.HomeTeam.toLocaleLowerCase()}
          />
          <div className="text-center">{props.match.HomeTeam}</div>
        </div>
        <div className="flex flex-col gap-2" style={{ width: '30%' }}>
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
        </div>
        <div className="flex flex-col items-center" style={{ width: '35%' }}>
          <Image
            className="border"
            alt={props.match.AwayTeam + "'s Country Flag"}
            height={60}
            width={60}
            src={'https://countryflagsapi.com/png/' + props.match.AwayTeam.toLocaleLowerCase()}
          />
          <div className="text-center">{props.match.AwayTeam} </div>
        </div>
      </div>
      <MatchScore isStarted={isStarted} match={props.match} />
    </div>
  )
}

export default Match
