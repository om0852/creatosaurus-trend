import { NextResponse } from "next/server"
import { MOCK_TRENDS } from "@/data/mock-trends"

// helpers
function byTimeRange(items: any[], timeRange: string) {
  if (!timeRange || timeRange === "all") return items
  const now = new Date().getTime()
  const ranges: Record<string, number> = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  }
  const windowMs = ranges[timeRange] || ranges["day"]
  return items.filter((t) => now - new Date(t.timestamp).getTime() <= windowMs)
}

function applyFilters(items: any[], params: URLSearchParams) {
  const location = params.get("location") || ""
  const category = params.get("category") || ""
  const source = params.get("source") || ""
  const trendType = params.get("trendType") || ""
  const search = (params.get("search") || "").toLowerCase()
  const timeRange = params.get("timeRange") || "day"

  let filtered = byTimeRange(items, timeRange)

  if (location && location !== "All") filtered = filtered.filter((t) => t.location === location)
  if (category && category !== "All") filtered = filtered.filter((t) => t.category === category)
  if (source && source !== "All") filtered = filtered.filter((t) => t.source === source)
  if (trendType && trendType !== "All") filtered = filtered.filter((t) => t.trendType === trendType)
  if (search) {
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search),
    )
  }
  return filtered
}

function applySort(items: any[], sort: string) {
  if (sort === "date") {
    return [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
  if (sort === "engagement" || sort === "popularity") {
    return [...items].sort((a, b) => b.popularityScore - a.popularityScore)
  }
  return items
}

function paginate(items: any[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return items.slice(start, end)
}

function buildStats(items: any[]) {
  const countBy = (key: string) =>
    items.reduce((acc: Record<string, number>, cur: any) => {
      acc[cur[key]] = (acc[cur[key]] || 0) + 1
      return acc
    }, {})
  return {
    sourceCounts: countBy("source"),
    categoryCounts: countBy("category"),
    locationCounts: countBy("location"),
  }
}

export async function GET(req: Request) {
  // In future: fetch from Google Trends, Reddit, News, X, YouTube, normalize here.
  const { searchParams } = new URL(req.url)

  // provider for external sources (e.g. ?provider=google-news)
  const provider = searchParams.get("provider") || "mock"

  // core params
  const sort = (searchParams.get("sort") || "popularity") as string
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10)
  const statsOnly = searchParams.get("stats") === "1"
  const all = searchParams.get("all") === "1"

  let baseItems = MOCK_TRENDS

  // If requesting Google News via Apify EasyAPI, fetch and normalize
  if (provider === "google-news") {
    try {
      baseItems = await fetchGoogleNewsFromApify(searchParams)
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || String(e) }, { status: 502 })
    }
  }

  const filtered = applyFilters(baseItems, searchParams)
  const sorted = applySort(filtered, sort)
  const total = sorted.length

  if (statsOnly) {
    return NextResponse.json({
      total,
      stats: buildStats(sorted),
    })
  }

  if (all) {
    return NextResponse.json({
      items: sorted,
      total,
      page: 1,
      pageSize: total,
      hasMore: false,
      stats: buildStats(sorted),
    })
  }

  const items = paginate(sorted, page, pageSize)
  const hasMore = page * pageSize < total

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    hasMore,
    stats: buildStats(sorted),
  })
}

// Fetch from Apify EasyAPI google-news-scraper actor and normalize results.
async function fetchGoogleNewsFromApify(params: URLSearchParams) {
  const APIFY_TOKEN = process.env.APIFY_API_TOKEN
  if (!APIFY_TOKEN) throw new Error('APIFY_API_TOKEN is not set')

  // Map query params to Apify input
  const query = params.get('query') || params.get('search') || ''
  const maxItemsParam = params.get('maxItems')
  const page = Number.parseInt(params.get('page') || '1', 10)
  const pageSize = Number.parseInt(params.get('pageSize') || '20', 10)

  // To support pagination we will request up to page * pageSize items and then slice locally.
  // Note: this can be inefficient for large page numbers. For production consider streaming/offset-support.
  const maxItems = Math.min(parseInt(maxItemsParam || String(page * pageSize || 100), 10) || page * pageSize || 100, 5000)

  const input: Record<string, any> = {
    maxItems,
  }
  if (query) input.query = query
  ;['gl', 'hl', 'lr', 'cr', 'nfpr', 'filter'].forEach((k) => {
    const v = params.get(k)
    if (v !== null) input[k] = /^\\d+$/.test(v) ? Number(v) : v
  })

  // Apify actor run endpoint. Using the act id style with waitForFinish=1.
  const apifyUrl = `https://api.apify.com/v2/acts/easyapi~google-news-scraper/runs?token=${encodeURIComponent(APIFY_TOKEN)}&waitForFinish=true&timeout=600000`

  const res = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Apify request failed: ${res.status} ${res.statusText} ${txt}`)
  }

  const data = await res.json().catch(() => ({}))

  // Try multiple possible locations for items in the Apify response
  let items: any[] = []
  if (Array.isArray(data)) items = data
  else if (data?.defaultDataset?.items) items = data.defaultDataset.items
  else if (data?.data?.defaultDataset?.items) items = data.data.defaultDataset.items
  else if (data?.output && Array.isArray(data.output)) items = data.output
  else if (data?.items && Array.isArray(data.items)) items = data.items
  else if (data?.results && Array.isArray(data.results)) items = data.results
  else if (data?.body && Array.isArray(data.body)) items = data.body

  // Normalize Apify items to the app trend format
  const normalized = items.map((it: any, i: number) => {
    const url = it.url || it.link || it.sourceUrl || it['url'] || it['link'] || ''
    const title = it.title || it.headline || it.name || ''
    const description = it.snippet || it.description || it.summary || it.text || ''
    const source = it.source || it.sourceName || it.domain || it.publisher || (it.author && it.author.name) || 'News'
    const published = it.publishedAt || it.datePublished || it.published || it.pubDate || it.publishedDate || null

    return {
      id: url ? `google-news:${encodeURIComponent(url)}` : `google-news:${i}`,
      title: title || description || url,
      description: description || title || '',
      category: 'News',
      location: params.get('gl') || 'Global',
      source: source,
      trendType: 'Latest',
      timestamp: published ? new Date(published).toISOString() : new Date().toISOString(),
      popularityScore: 0,
      url: url || '',
    }
  })

  // slice according to page/pageSize
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return normalized.slice(0, page * pageSize).slice(start, end)
}
