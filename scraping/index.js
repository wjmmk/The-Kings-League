import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URLS = {
  leaderBoard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

const LEADERBOARD_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  wins: { selector: '.fs-table-text_4', typeOf: 'number' },
  loses: { selector: '.fs-table-text_5', typeOf: 'number' },
  scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
  concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
  yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
  redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
}

async function getLeaderBoard () {
  const $ = await scrape(URLS.leaderBoard)
  const $rows = $('table tbody tr')

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderBoard = []
  $rows.each((index, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text()
      const cleannedValue = cleanText(rawValue)

      const value = typeOf === 'number' ? Number(cleannedValue) : cleannedValue

      return [key, value]
    })
    // console.log(Object.fromEntries(leaderBoardEntries))
    leaderBoard.push(Object.fromEntries(leaderBoardEntries))
  })
  return leaderBoard
}

const leadboard = await getLeaderBoard()
const filePath = path.join(process.cwd(), './db/leaderboard.json')
await writeFile(filePath, JSON.stringify(leadboard, null, 2), 'utf-8')

console.log(leadboard)
