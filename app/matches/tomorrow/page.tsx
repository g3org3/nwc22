import { DateTime } from 'luxon'

import Match, { getMatches } from '../Match'

const TomorrowMatches = async () => {
  const matches = await getMatches()
  const today = Date.now()
  const todayMatches = matches.filter(
    (m) => m.Date.getTime() > today && DateTime.fromJSDate(m.Date).toRelativeCalendar() === 'tomorrow'
  )

  return (
    <>
      {todayMatches.map((match) => (
        <Match key={match.MatchNumber} match={match} />
      ))}
    </>
  )
}

export default TomorrowMatches
