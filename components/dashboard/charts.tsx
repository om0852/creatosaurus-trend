"use client"
import axios from "axios"
import useSWR from "swr"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => axios.get(url).then((r) => r.data)
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--muted))",
  "hsl(var(--accent))",
  "hsl(var(--border))",
]

function toChartData(record: Record<string, number>) {
  return Object.entries(record).map(([name, value]) => ({ name, value }))
}

export default function DashboardCharts() {
  const { data, error, isLoading } = useSWR("/api/trends?stats=1", fetcher)
  const stats = data?.stats || { categoryCounts: {}, locationCounts: {}, sourceCounts: {} }

  const categoryData = toChartData(stats.categoryCounts)
  const locationData = toChartData(stats.locationCounts)
  const sourceData = toChartData(stats.sourceCounts)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : error ? (
            <div className="text-destructive">Failed to load.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : error ? (
            <div className="text-destructive">Failed to load.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={locationData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={40}>
                  {locationData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card lg:col-span-2">
        <CardHeader>
          <CardTitle>Sources</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : error ? (
            <div className="text-destructive">Failed to load.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
