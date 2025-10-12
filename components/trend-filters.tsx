"use client"
import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useTrendStore } from "@/stores/trend-store"

export default function TrendFilters() {
  // select individual pieces to avoid returning a fresh object each render
  const filters = useTrendStore((s: any) => s.filters)
  const setFilter = useTrendStore((s: any) => s.setFilter)
  const resetFilters = useTrendStore((s: any) => s.resetFilters)
  const options = useTrendStore((s: any) => s.options)
  const provider = useTrendStore((s: any) => s.provider)
  const setProvider = useTrendStore((s: any) => s.setProvider)
  const providerOptions = useTrendStore((s: any) => s.providerOptions)
  const setProviderOption = useTrendStore((s: any) => s.setProviderOption)
  
  

  const timeRangeLabel = useMemo(
    () => options.timeRanges.find((t: any) => t.value === filters.timeRange)?.label || "Past day",
    [filters.timeRange, options.timeRanges],
  )

  return (
    <div className="w-full rounded-lg border bg-card p-3 md:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Select value={provider} onValueChange={(v) => setProvider(v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mock">Mock</SelectItem>
            <SelectItem value="google-news">Google News (Apify)</SelectItem>
          </SelectContent>
        </Select>

        {/* Provider-specific options preview/control (compact) */}
        {provider === 'google-news' ? (
          <div className="col-span-1 md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-2">
            <Input placeholder="gl (country code)" value={providerOptions.gl} onChange={(e) => setProviderOption('gl', e.target.value)} />
            <Input placeholder="hl (interface lang)" value={providerOptions.hl} onChange={(e) => setProviderOption('hl', e.target.value)} />
            <Input placeholder="lr (result lang, e.g. lang_en)" value={providerOptions.lr} onChange={(e) => setProviderOption('lr', e.target.value)} />
            <Input placeholder="cr (country restriction)" value={providerOptions.cr} onChange={(e) => setProviderOption('cr', e.target.value)} />
            <Input placeholder="nfpr (0 or 1)" value={String(providerOptions.nfpr)} onChange={(e) => setProviderOption('nfpr', Number(e.target.value || 0))} />
            <Input placeholder="filter (0 or 1)" value={String(providerOptions.filter)} onChange={(e) => setProviderOption('filter', Number(e.target.value || 0))} />
            <Input placeholder="maxItems" value={String(providerOptions.maxItems)} onChange={(e) => setProviderOption('maxItems', Number(e.target.value || 200))} />
          </div>
        ) : null}

        <Select value={filters.location} onValueChange={(v) => setFilter("location", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {options.locations.map((loc: string) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(v) => setFilter("category", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {options.categories.map((c: string) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.source} onValueChange={(v) => setFilter("source", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {options.sources.map((s: string) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.trendType} onValueChange={(v) => setFilter("trendType", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Trend type" />
          </SelectTrigger>
          <SelectContent>
            {options.trendTypes.map((t: string) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <Input
          className="bg-background"
          placeholder="Search keywords..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {options.sorts.map((s: any) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.timeRange} onValueChange={(v) => setFilter("timeRange", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            {options.timeRanges.map((t: any) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Time: {timeRangeLabel}</span>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}
