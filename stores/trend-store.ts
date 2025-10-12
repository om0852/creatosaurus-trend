"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { CONSTANTS } from "@/data/mock-trends"

const DEFAULT_FILTERS = {
  location: "Global",
  category: "All",
  source: "All",
  timeRange: "day", // hour | day | week | month
  trendType: "All",
  sort: "popularity", // popularity | date | engagement
  search: "",
}

const DEFAULT_PAGINATION = {
  pageSize: 20,
}

export const useTrendStore = create(
  persist(
    (set, get: any) => ({
      // filters
      filters: DEFAULT_FILTERS,
      setFilter: (key: string, value: string) => set((state: any) => ({ filters: { ...state.filters, [key]: value } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

        // provider and provider-specific options (for external sources like Apify)
        provider: 'mock',
        setProvider: (p: string) => set({ provider: p }),
        providerOptions: {
          gl: '',
          hl: '',
          lr: '',
          cr: '',
          nfpr: 0,
          filter: 1,
          maxItems: 200,
        },
        setProviderOption: (key: string, value: any) => set((s: any) => ({ providerOptions: { ...s.providerOptions, [key]: value } })),

      // pagination helpers (used by useSWRInfinite via key)
      pageSize: DEFAULT_PAGINATION.pageSize,
      setPageSize: (n: number) => set({ pageSize: n }),

      // bookmarks
      bookmarks: [] as string[],
      toggleBookmark: (id: string) => {
        const { bookmarks } = get()
        if (bookmarks.includes(id)) {
          set({ bookmarks: bookmarks.filter((b: string) => b !== id) })
        } else {
          set({ bookmarks: [...bookmarks, id] })
        }
      },
      isBookmarked: (id: string) => get().bookmarks.includes(id),

      // constants for UI
      options: {
        locations: ["All", ...CONSTANTS.LOCATIONS],
        categories: ["All", ...CONSTANTS.CATEGORIES],
        sources: ["All", ...CONSTANTS.SOURCES],
        trendTypes: ["All", ...CONSTANTS.TREND_TYPES],
        timeRanges: [
          { label: "Past hour", value: "hour" },
          { label: "Past day", value: "day" },
          { label: "Past week", value: "week" },
          { label: "Past month", value: "month" },
        ],
        sorts: [
          { label: "Popularity", value: "popularity" },
          { label: "Date", value: "date" },
          { label: "Engagement", value: "engagement" },
        ],
      },
    }),
    {
      name: "trendpulse-store",
      partialize: (state: any) => ({
        filters: state.filters,
        bookmarks: state.bookmarks,
        pageSize: state.pageSize,
        provider: state.provider,
        providerOptions: state.providerOptions,
      }),
    },
  ),
)
