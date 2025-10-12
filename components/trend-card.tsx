"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTrendStore } from "@/stores/trend-store"

export default function TrendCard({ trend }: { trend: any }) {
  const toggleBookmark = useTrendStore((s: any) => s.toggleBookmark)
  const isBookmarked = useTrendStore((s: any) => s.bookmarks.includes(trend.id))

  const onShare = async () => {
    const shareData = {
      title: trend.title,
      text: trend.description,
      url: trend.url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(trend.url)
        alert("Link copied to clipboard")
      }
    } catch (e) {
      console.error("[v0] Share error:", e)
    }
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-pretty text-base md:text-lg">{trend.title}</CardTitle>
          <Badge variant="secondary">{trend.trendType}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{trend.category}</Badge>
          <Badge variant="outline">{trend.location}</Badge>
          <Badge variant="outline">{trend.source}</Badge>
          <span aria-hidden="true">•</span>
          <time className="text-muted-foreground">{new Date(trend.timestamp).toLocaleString()}</time>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{trend.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="default">Score {trend.popularityScore}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isBookmarked ? "secondary" : "outline"}
            onClick={() => toggleBookmark(trend.id)}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button variant="ghost" onClick={onShare} aria-label="Share trend">
            Share
          </Button>
          <Button asChild variant="link">
            <a href={trend.url} target="_blank" rel="noreferrer">
              Open
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
