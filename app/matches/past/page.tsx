import { DateTime } from 'luxon'

import Match, { getMatches } from '../Match'

export const revalidate = 10

const PastMatches = async () => {
  const matches = await getMatches()
  const today = Date.now()

  const todayMatches = matches
    .filter((m) => m.Date.getTime() < today && DateTime.fromJSDate(m.Date).toRelativeCalendar() !== 'today')
    .sort((a, b) => {
      return b.Date.getTime() - a.Date.getTime()
    })

  const byDate = todayMatches.reduce<Record<string, { key: string; matches: typeof todayMatches }>>(
    (byDate, m) => {
      const key = `${m.Date.getFullYear()}-${m.Date.getMonth()}-${m.Date.getDate()
        .toString()
        .padStart(2, '0')}`
      if (!byDate[key]) {
        byDate[key] = { key, matches: [] }
      }
      byDate[key].matches.push(m)

      return byDate
    },
    {}
  )

  return (
    <>
      {Object.values(byDate).map(({ key, matches }) => {
        return (
          <div key={key} className="flex flex-col">
            <div className="bg-white text-slate-500 p-2 text-center">{key}</div>
            <div className="flex flex-col">
              {matches.map((match) => (
                <Match key={match.MatchNumber} match={match} />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default PastMatches
