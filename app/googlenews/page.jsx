"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function timeAgo(dateStr) {
  try {
    const d = new Date(dateStr)
    const diff = Date.now() - d.getTime()
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hours = Math.floor(min / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch (err) {
    return dateStr
  }
}

function truncate(text, n = 140) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n - 1) + '…' : text
}

const Page = () => {
  const [filters, setFilters] = useState({
    query: '',
    maxItems: 100,
    gl: 'in',
    hl: 'en',
    lr: 'lang_en',
    cr: 'in',
    time_period: 'last_week',
  })

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }
useEffect(()=>{
fetchData();
},[])
  const fetchData = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams(filters).toString()
      const res = await fetch(`/api/googlenews?${query}`)
      const result = await res.json()
      setData(result.data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters / Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Filters</h4>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFilters({ query: '', maxItems: 100, gl: 'us', hl: 'en', lr: 'lang_en', cr: 'us', time_period: 'last_week' })}>Reset</Button>
                <Button size="sm" onClick={fetchData} disabled={loading}>{loading ? 'Fetching…' : 'Apply'}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Search</label>
                  <Input name="query" value={filters.query} onChange={handleChange} placeholder="e.g. climate, AI, elections" />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Max Items</label>
                  <Input type="number" name="maxItems" value={filters.maxItems} onChange={handleChange} min={10} step={10} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Country (gl)</label>
                  <select name="gl" value={filters.gl} onChange={handleChange} className="w-full rounded-md border px-3 py-2">
                    <option value="us">United States</option>
                    <option value="in">India</option>
                    <option value="gb">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">UI Language (hl)</label>
                  <select name="hl" value={filters.hl} onChange={handleChange} className="w-full rounded-md border px-3 py-2">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Result Language (lr)</label>
                  <select name="lr" value={filters.lr} onChange={handleChange} className="w-full rounded-md border px-3 py-2">
                    <option value="lang_en">English</option>
                    <option value="lang_fr">French</option>
                    <option value="lang_es">Spanish</option>
                    <option value="lang_de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Time Period</label>
                  <select name="time_period" value={filters.time_period} onChange={handleChange} className="w-full rounded-md border px-3 py-2">
                    <option value="last_hour">Last Hour</option>
                    <option value="last_day">Last Day</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Results area */}
        <main className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold"> News · Trending</h3>
            </div>
            <div className="text-sm text-muted-foreground">{!loading && `${data.length} results`}</div>
          </div>

          <section>
            {loading && <div className="text-sm text-muted-foreground">Loading news…</div>}

            {!loading && data.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((item, i) => (
                  <article key={item.position ?? i} className="border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition bg-card">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-44 object-cover" />
                    ) : (
                      <div className="w-full h-44 bg-muted" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-primary hover:underline">{truncate(item.title, 100)}</a>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{timeAgo(item.date)}</div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">{truncate(item.snippet, 160)}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{item.domain ?? item.source ?? 'source'}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Rank #{item.position ?? i + 1}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">No trending data found. Click <span className="font-medium">Apply</span> to fetch results.</div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Page
