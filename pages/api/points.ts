// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DateTime } from 'luxon'
import type { NextApiRequest, NextApiResponse } from 'next'
import PocketBase from 'pocketbase'

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

interface TBet {
  away_score: number
  home_score: number
  created: string
  id: string
  match_number: number
  user_id: string
  updated: string
}

function calcPoints(match: TMatch, bet: TBet): number {
  const matchDate = DateTime.fromISO(match.DateUtc.split(' ').join('T'))
  const betDate = DateTime.fromISO(bet.updated.split(' ').join('T'))
  const diff = matchDate.diff(betDate).milliseconds
  const validDate = true //diff >= 0

  if (!validDate) return 0

  let points = 0
  if (bet.home_score - bet.away_score > 0 && match.HomeTeamScore - match.AwayTeamScore > 0) {
    points = 1
  }
  if (bet.home_score - bet.away_score < 0 && match.HomeTeamScore - match.AwayTeamScore < 0) {
    points = 1
  }
  if (bet.home_score - bet.away_score == 0 && match.HomeTeamScore - match.AwayTeamScore == 0) {
    points = 1
  }
  if (bet.home_score == match.HomeTeamScore && bet.away_score == match.AwayTeamScore) {
    points = 3
  }

  return points
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id
  const client = new PocketBase('https://pocketbase-production-f6a9.up.railway.app')

  if (!id) {
    throw new Error('user id not found')
  }

  let liga = req.query.liga

  if (!req.query.liga) {
    const ligas = await client.collection('user_ligas').getList(0, 10, { filter: `user_id = '${id}'` })
    liga = ligas.items.length > 0 ? ligas.items[0].liga_name : null
  }

  if (!liga) throw new Error('no liga found')

  const users = await client.collection('user_ligas').getList(0, 50, { filter: `liga_name = '${liga}'` })
  const userids = users.items.map((u) => u.user_id)

  // @ts-ignore
  const bets: TBet[] = (
    await client
      .collection('bets')
      .getList(0, 600, { filter: userids.map((u) => `user_id = '${u}'`).join(' || ') })
  ).items

  const response = await fetch('https://fixturedownload.com/feed/json/fifa-world-cup-2022')
  const matches = (await response.json()) as TMatch[]

  const byMatchNumber: Record<number, TMatch> = matches
    .filter((m) => m.HomeTeamScore !== null)
    .reduce<Record<number, TMatch>>((byId, m) => {
      byId[m.MatchNumber] = m

      return byId
    }, {})

  const betsByUser = bets.reduce<Record<string, any>>((byId, bet) => {
    const id = bet.user_id as keyof typeof byId
    if (!byId[id]) {
      byId[id] = { id, points: 0, bets: [] }
    }
    // byId[id].bets.push(bet)
    if (byMatchNumber[bet.match_number]) {
      byId[id].points += calcPoints(byMatchNumber[bet.match_number], bet)
    }

    return byId
  }, {})

  res.status(200).json({ betsByUser })
}
