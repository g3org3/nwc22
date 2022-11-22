// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PocketBase from 'pocketbase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id
  const client = new PocketBase('https://pocketbase-production-f6a9.up.railway.app')

  if (!id) {
    throw new Error('user id not found')
  }

  const ligas = await client.collection('user_ligas').getList(0, 10, { filter: `user_id = '${id}'` })
  const liga = ligas.items.length > 0 ? ligas.items[0].liga_name : null

  if (!liga) throw new Error('no liga found')

  const users = await client.collection('user_ligas').getList(0, 50, { filter: `liga_name = '${liga}'` })
  const userids = users.items.map((u) => u.user_id)

  const bets = (
    await client
      .collection('bets')
      .getList(0, 200, { filter: userids.map((u) => `user_id = '${u}'`).join(' || ') })
  ).items

  const betsByUser = bets.reduce((byId, bet) => {
    const id = bet.user_id as keyof typeof byId
    if (!byId[id]) {
      // @ts-ignore
      byId[id] = []
    }
    // @ts-ignore
    byId[id].push(bet)

    return byId
  }, {})

  const response = await fetch('https://fixturedownload.com/feed/json/fifa-world-cup-2022')
  const data = await response.json()

  // check points

  res.status(200).json({ bets, betsByUser, userids })
}
