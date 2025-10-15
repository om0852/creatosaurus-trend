import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import GoogleNewsPage from '../googlenews/page'
import TwitterPage from '../twittertrend/page'
import YouTubePage from '../youtube/page'

const DashboardPage = () => {
  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">TrendPulse Dashboard</h1>
        </header>

        <section className="bg-card border rounded-lg p-4 shadow-sm">
          <Tabs defaultValue="google-news">
            <TabsList>
              <TabsTrigger value="google-news">News</TabsTrigger>
              <TabsTrigger value="twitter">Twitter Trends</TabsTrigger>
              <TabsTrigger value="youtube">YouTube Trending</TabsTrigger>
            </TabsList>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <TabsContent value="google-news">
                <h2 className="text-xl font-semibold mb-2">Google News (Apify)</h2>
                <p className="text-sm text-muted-foreground mb-4">Search news articles collected from Google News via the Apify scraper. Use the Filters panel to refine results.</p>
                <div className="bg-background border rounded-lg p-4">
                  <GoogleNewsPage />
                </div>
              </TabsContent>

              <TabsContent value="twitter">
                <h2 className="text-xl font-semibold mb-2">Twitter Trends</h2>
                <p className="text-sm text-muted-foreground mb-4">Live trending topics from Twitter by region and timeframe.</p>
                <TwitterPage />
              </TabsContent>

              <TabsContent value="youtube">
                <h2 className="text-xl font-semibold mb-2">YouTube Trending</h2>
                <p className="text-sm text-muted-foreground mb-4">Top trending YouTube videos for selected regions.</p>
                <YouTubePage />
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </div>
    </main>
  )
}



export default DashboardPage
