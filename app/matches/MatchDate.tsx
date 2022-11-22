'use client'
import { DateTime } from 'luxon'

import { TMatchD } from './Match'

interface Props {
  match: TMatchD
  isStarted?: boolean
}

const MatchDate = (props: Props) => {
  return (
    <>
      <div>
        {DateTime.fromISO(props.match.DateUtc.split(' ').join('T'))
          .setLocale('us')
          .toLocaleString(DateTime.TIME_SIMPLE)}
      </div>
      {!props.isStarted && (
        <div className="text-center">
          {DateTime.fromISO(props.match.DateUtc.split(' ').join('T')).setLocale('es').toRelativeCalendar()}
        </div>
      )}
    </>
  )
}

export default MatchDate
