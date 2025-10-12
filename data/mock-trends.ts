// Generates a consistent mock dataset for TrendPulse.

const CATEGORIES = ["Technology", "Sports", "Entertainment", "Finance", "Science", "Politics", "Lifestyle"]
const LOCATIONS = ["Global", "United States", "Europe", "Asia", "South America", "Africa", "Oceania"]
const SOURCES = ["Google Trends", "Reddit", "News", "X", "YouTube"]
const TREND_TYPES = ["New", "Hot", "Rising", "Latest"]

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function createTrend(i: number) {
  const category = randomItem(CATEGORIES)
  const location = randomItem(LOCATIONS)
  const source = randomItem(SOURCES)
  const trendType = randomItem(TREND_TYPES)
  const days = randomInt(0, 30)
  const timestamp = daysAgo(days).toISOString()
  const pop = randomInt(10, 1000)
  const title = `${category} ${trendType} Topic #${i}`
  const description = `A ${trendType.toLowerCase()} ${category.toLowerCase()} trend from ${source} in ${location}.`

  return {
    id: `mock-${i}`,
    title,
    description,
    category,
    location,
    source,
    trendType,
    timestamp,
    popularityScore: pop,
    url: `https://example.com/trend/${i}`,
  }
}

export const MOCK_TRENDS = Array.from({ length: 180 }, (_, i) => createTrend(i + 1))

export const CONSTANTS = {
  CATEGORIES,
  LOCATIONS,
  SOURCES,
  TREND_TYPES,
}
