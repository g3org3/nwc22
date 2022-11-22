import { DateTime } from 'luxon'

import Match, { getMatches } from '../Match'

const TodayMatches = async () => {
  const matches = await getMatches()
  const today = Date.now()
  const todayMatches = matches.filter(
    (m) => m.Date.getTime() < today && DateTime.fromJSDate(m.Date).toRelativeCalendar() === 'today'
  )

  return (
    <>
      {todayMatches.length === 0 && <div className="text-center text-3xl py-5">No matches today</div>}
      {todayMatches.map((match) => (
        <Match key={match.MatchNumber} match={match} />
      ))}
    </>
  )
}

export default TodayMatches
