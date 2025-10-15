"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [filters, setFilters] = useState({
    enableTrendingSearches: true,
    trendingSearchesCountry: "IN",
    trendingSearchesTimeframe: "24",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState(null); // for modal

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/googleexplore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const result = await res.json();
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
fetchData();
  },[])
  const resetFilters = () => {
    setFilters({
      enableTrendingSearches: true,
      trendingSearchesCountry: "in",
      trendingSearchesTimeframe: "24",
    });
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Filter Bar */}
      <Card className="p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-end gap-4 justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium mb-1">Country</label>
              <select
                name="trendingSearchesCountry"
                value={filters.trendingSearchesCountry}
                onChange={handleChange}
                className="w-44 rounded-md border px-3 py-2"
              >
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="BR">Brazil</option>
                <option value="SG">Singapore</option>
                <option value="ZA">South Africa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Timeframe</label>
              <select
                name="trendingSearchesTimeframe"
                value={filters.trendingSearchesTimeframe}
                onChange={handleChange}
                className="w-44 rounded-md border px-3 py-2"
              >
                <option value="4">Last 4 hours</option>
                <option value="24">Last 24 hours</option>
                <option value="48">Last 48 hours</option>
                <option value="168">Last 7 days</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={fetchData} disabled={loading}>
              {loading ? "Fetching…" : "Apply"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 🔹 Results Section */}
      <main className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Trending Results</h3>
            <p className="text-sm text-muted-foreground">
              View real-time Google trending searches by country.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {!loading && `${data.length} result${data.length > 1 ? "s" : ""}`}
          </div>
        </div>

        <section className="w-full">
          {loading && (
            <div className="text-sm text-muted-foreground">Loading data…</div>
          )}

          {!loading && data.length > 0 && (
            <div className="grid gap-6">
              {data.map((item, i) => (
                <article
                  key={i}
                  className="border rounded-xl shadow-sm bg-card p-4 hover:shadow-md transition"
                >
                  {/* Meta Info */}
                  <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                   

                    
                  </div>

                  {/* Table */}
                  {item.trending_searches && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[600px] border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-3">Term</th>
                            <th className="py-2 px-3">Volume</th>
                            <th className="py-2 px-3">Related Terms</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.trending_searches.map((t, idx) => {
                            const showTerms = t.related_terms?.slice(0, 3) || [];
                            const hasMore =
                              t.related_terms &&
                              t.related_terms.length > showTerms.length;

                            return (
                              <tr
                                key={idx}
                                className="border-b hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-2 px-3 text-gray-500">
                                  {t.rank}
                                </td>
                                <td className="py-2 px-3 font-medium text-gray-800">
                                  {t.term}
                                </td>
                                <td className="py-2 px-3 text-gray-600">
                                  {t.trend_volume || "—"}
                                </td>
                                <td className="py-2 px-3 text-gray-600">
                                  {showTerms.length > 0 ? (
                                    <>
                                      <ul className="list-disc list-inside space-y-1">
                                        {showTerms.map((rel, j) => (
                                          <li key={j} className="text-xs">
                                            {rel}
                                          </li>
                                        ))}
                                      </ul>
                                      {hasMore && (
                                        <button
                                          onClick={() =>
                                            setSelectedTerms(t.related_terms)
                                          }
                                          className="text-blue-600 text-xs underline mt-1"
                                        >
                                          Show more
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
              No data found. Click <span className="font-medium">Apply</span> to
              fetch results.
            </div>
          )}
        </section>
      </main>

      {/* 🔹 Popup Modal for Related Terms */}
      {selectedTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 max-w-[90%] p-5 relative">
            <h3 className="text-lg font-semibold mb-3">
              Related Search Terms
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 max-h-60 overflow-y-auto">
              {selectedTerms.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedTerms(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
