"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function YouTubeTrending() {
  const [videos, setVideos] = useState([])
  const [region, setRegion] = useState('in')
  const [hl, setHl] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTrending = async () => {
    setLoading(true)
    setError('')
    try {
      const query = new URLSearchParams({ region, hl, maxResults: '12' })
      const res = await fetch(`/api/youtube-trend?${query.toString()}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed')
      setVideos(json.data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrending() }, [region, hl])

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">YouTube Trending</h3>
            <p className="text-sm text-muted-foreground">Top videos by region.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setRegion('us'); setHl('en') }}>Reset</Button>
            <Button onClick={fetchTrending}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm">Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} className="mt-1">
                <option value="us">US</option>
                <option value="in">India</option>
                <option value="jp">Japan</option>
                <option value="gb">UK</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Language (hl)</label>
              <select value={hl} onChange={e => setHl(e.target.value)} className="mt-1">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          {loading && <div className="text-muted-foreground">Loading videos…</div>}
          {error && <div className="text-destructive">Error: {error}</div>}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <article key={v.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                {v.thumbnails?.medium && (
                  <img src={v.thumbnails.medium.url} alt={v.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{v.title}</h4>
                  <p className="text-xs text-muted-foreground">{v.channel?.name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{v.stats?.viewCount || ''} views</span>
                    <a href={v.url} target="_blank" rel="noreferrer" className="text-primary">Watch</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
