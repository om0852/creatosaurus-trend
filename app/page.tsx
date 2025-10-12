"use client"
import TrendFilters from "@/components/trend-filters"
import TrendList from "@/components/trend-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <header className="mb-6 flex flex-col items-start justify-between gap-3 md:mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">TrendPulse</h1>
          <p className="text-muted-foreground">
            Aggregate and explore trending topics by location, category, and source.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        {/* <TrendFilters />
        <TrendList /> */}
      </section>
    </main>
  )
}
