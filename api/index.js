import { Hono } from 'hono'

import leaderboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard statistics'
    }
  ])
})

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

// Esta es la forma antigua de hacer una peticion.
/* export default {
  async fetch (request, env, ctx) {
    return new Response(JSON.stringify(leaderboard), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
  }
} */

export default app
