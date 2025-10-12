"use client"
import axios from "axios"
import useSWR from "swr"
import { useTrendStore } from "@/stores/trend-store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function TrendTable() {
  const filters = useTrendStore((s: any) => s.filters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const qs = useMemo(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]: any) => v && params.set(k, v))
    params.set("page", String(page))
    params.set("pageSize", String(pageSize))
    return params.toString()
  }, [filters, page, pageSize])

  const { data, isLoading, error } = useSWR(`/api/trends?${qs}`, fetcher)
  const items = data?.items || []
  const total = data?.total || 0
  const maxPage = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total: {total}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            Prev
          </Button>
          <span className="text-sm">
            Page {page} / {maxPage}
          </span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>
            Next
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive">
                  Failed to load.
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              items.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="max-w-[300px] truncate">{t.title}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell>{t.source}</TableCell>
                  <TableCell>{t.trendType}</TableCell>
                  <TableCell>{new Date(t.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{t.popularityScore}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
