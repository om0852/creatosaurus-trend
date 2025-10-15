"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Globe2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [country, setCountry] = useState("india");
  const [duration, setDuration] = useState("live");
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { id: "worldwide", name: "Worldwide" },
    { id: "united-states", name: "United States" },
    { id: "canada", name: "Canada" },
    { id: "japan", name: "Japan" },
    { id: "united-kingdom", name: "United Kingdom" },
    { id: "india", name: "India" },
    { id: "brazil", name: "Brazil" },
    { id: "germany", name: "Germany" },
  ];

  const durations = [
    { label: "Live", value: "live" },
    { label: "Last 1 Hour", value: "1h" },
    { label: "Last 3 Hours", value: "3h" },
    { label: "Last 6 Hours", value: "6h" },
  ];

  const fetchTrends = async () => {
    setLoading(true);
    setTrends([]);
    try {
      const res = await fetch(`/api/twittertrend?country=${country}`);
      const data = await res.json();
      setTrends(data || []);
    } catch (err) {
      console.error(err);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [country]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex justify-center">
      <div className="max-w-5xl w-full space-y-8">
       
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Filter Trends</h3>
           
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCountry("worldwide");
                  fetchTrends();
                }}
              >
                Reset
              </Button>
              <Button
                onClick={fetchTrends}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Refreshing
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </div>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Filters */}
              <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌎 Country
                </label>
                <select
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trends List */}
              <div className="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full rounded-md" />
                    ))}
                  </div>
                ) : trends.length ? (
                  <ul className="divide-y divide-gray-100">
                    {trends.map((t, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            #{t.rank} {t.topic}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t.last_updated || ""}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {t.tweet_volume || ""}
                        </span>
                        <Link
                          href={`https://x.com/search?q=${encodeURIComponent(t.topic)}&src=trend_click`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 font-medium"
                        >
                          <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/badges/48/long-arrow-right.png"
                            alt="arrow"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    No trends available for this selection.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
