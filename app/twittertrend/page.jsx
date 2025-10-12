"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Globe2 } from "lucide-react";

export default function Home() {
  const [country, setCountry] = useState("2");
  const [duration, setDuration] = useState("live");
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { id: "1", name: "World" },
    { id: "2", name: "United States" },
    { id: "3", name: "Canada" },
    { id: "4", name: "Mexico" },
    { id: "5", name: "United Kingdom" },
    { id: "6", name: "France" },
    { id: "7", name: "Germany" },
    { id: "8", name: "Italy" },
    { id: "9", name: "Spain" },
    { id: "10", name: "Portugal" },
    { id: "11", name: "Netherlands" },
    { id: "12", name: "Denmark" },
    { id: "13", name: "Austria" },
    { id: "14", name: "Belgium" },
    { id: "15", name: "Switzerland" },
    { id: "16", name: "Greece" },
    { id: "17", name: "Russian Federation" },
    { id: "18", name: "Turkey" },
    { id: "19", name: "Korea" },
    { id: "20", name: "Singapore" },
    { id: "21", name: "Indonesia" },
    { id: "22", name: "Philippines" },
    { id: "23", name: "Viet Nam" },
    { id: "24", name: "Thailand" },
    { id: "25", name: "Australia" },
    { id: "26", name: "Israel" },
    { id: "27", name: "United Arab Emirates" },
    { id: "28", name: "Saudi Arabia" },
    { id: "29", name: "Argentina" },
    { id: "30", name: "Brazil" },
    { id: "31", name: "Egypt" },
    { id: "32", name: "Nigeria" },
    { id: "33", name: "Kenya" },
    { id: "34", name: "South Africa" },
    { id: "35", name: "Japan" },
  ];

  const durations = [
    { label: "Live", value: "live" },
    { label: "Last 1 Hour", value: "1h" },
    { label: "Last 3 Hours", value: "3h" },
    { label: "Last 6 Hours", value: "6h" },
    { label: "Last 12 Hours", value: "12h" },
    { label: "Last 24 Hours", value: "24h" },
    { label: "Last 2 Days", value: "2d" },
    { label: "Last 3 Days", value: "3d" },
  ];

  const fetchTrends = async () => {
    setLoading(true);
    setTrends([]);
    try {
      const res = await fetch(`/api/twittertrend?country=${country}&duration=${duration}`);
      const data = await res.json();
      setTrends(data);
    } catch (err) {
      console.error(err);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [country, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex justify-center">
      <div className="max-w-5xl w-full space-y-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <Globe2 className="text-blue-600 w-7 h-7" />
            <h1 className="text-3xl font-bold text-gray-800">Twitter Trends</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Discover what’s trending across different regions and durations.
          </p>
        </div>

        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Filter Trends</h3>
              <p className="text-sm text-gray-500">
                Select country and time duration to explore real-time trends.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCountry("2");
                  setDuration("live");
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

                <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
                  ⏱ Duration
                </label>
                <select
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  {durations.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
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
                            #{i + 1} {t.trend}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t.description || t.location || ""}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {t.volume || ""}
                        </span>
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
