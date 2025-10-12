"use client"
import useSWRInfinite from "swr/infinite"
import axios from "axios"
import TrendCard from "./trend-card"
import { Button } from "@/components/ui/button"
import { useTrendStore } from "@/stores/trend-store"
import { useMemo, useCallback } from "react"

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function TrendList() {
  const filters = useTrendStore((s: any) => s.filters)
  const pageSize = useTrendStore((s: any) => s.pageSize)
  const provider = useTrendStore((s: any) => s.provider)
  const providerOptions = useTrendStore((s: any) => s.providerOptions)

  const qs = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.location) params.set("location", filters.location)
    if (filters.category) params.set("category", filters.category)
    if (filters.source) params.set("source", filters.source)
    if (filters.trendType) params.set("trendType", filters.trendType)
    if (filters.search) params.set("search", filters.search)
    if (filters.timeRange) params.set("timeRange", filters.timeRange)
    if (filters.sort) params.set("sort", filters.sort)
    if (provider) params.set('provider', provider)

    // provider options (Apify params)
    if (providerOptions) {
      if (providerOptions.gl) params.set('gl', providerOptions.gl)
      if (providerOptions.hl) params.set('hl', providerOptions.hl)
      if (providerOptions.lr) params.set('lr', providerOptions.lr)
      if (providerOptions.cr) params.set('cr', providerOptions.cr)
      if (providerOptions.nfpr !== undefined) params.set('nfpr', String(providerOptions.nfpr))
      if (providerOptions.filter !== undefined) params.set('filter', String(providerOptions.filter))
      if (providerOptions.maxItems !== undefined) params.set('maxItems', String(providerOptions.maxItems))
    }
    return params.toString()
  }, [filters, provider, providerOptions])

  const getKey = useCallback(
    (pageIndex: number, previousPageData: any) => {
      if (previousPageData && !previousPageData.hasMore) return null
      const page = pageIndex + 1
      const base = "/api/trends"
      const paramString = `${qs ? `?${qs}&` : "?"}page=${page}&pageSize=${pageSize}`
      return `${base}${paramString}`
    },
    [qs, pageSize],
  )

  const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  })

  const items = (data || []).flatMap((d) => d.items || [])
  const total = data?.[0]?.total ?? 0
  const hasMore = data?.[data.length - 1]?.hasMore ?? false

  return (
    <div className="space-y-3">
      {error && <div className="text-destructive">Failed to load trends.</div>}
      {items.length === 0 && !isLoading && <div className="text-muted-foreground">No results.</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t: any) => (
          <TrendCard key={t.id} trend={t} />
        ))}
      </div>

      <div className="flex items-center justify-center py-4">
        {hasMore ? (
          <Button variant="secondary" onClick={() => setSize(size + 1)} disabled={isValidating}>
            {isValidating ? "Loading…" : "Load more"}
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `Showing ${items.length} of ${total}`}
          </span>
        )}
      </div>
    </div>
  )
}
