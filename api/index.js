import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'

import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'

const app = new Hono()

app.get('/', (ctx) => ctx.json([
  {
    endpoint: '/leaderboard',
    description: 'Returns the leaderboard statistics'
  },
  {
    endpoint: '/teams',
    description: 'Returns the teams statistics'
  },
  {
    endpoint: '/static/logos/id:',
    description: 'Returns the teams statistics'
  }
]))

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app
