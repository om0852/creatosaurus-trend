"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Sparkline({ seriesData = {}, width = 320, height = 48 }) {
  const containerRef = useRef(null);
  const [hover, setHover] = useState(null); // {index, x, y, date, value}

  const entries = useMemo(
    () => Object.entries(seriesData || {}).filter(([k]) => k !== "isPartial"),
    [seriesData]
  );
  if (!entries.length) return null;

  // For now render the first series only (most responses have one series like 'ai')
  const [seriesKey, seriesDataMap] = entries[0];
  const pointsArr = useMemo(
    () => Object.entries(seriesDataMap || {}),
    [seriesDataMap]
  );
  const values = pointsArr.map(([, v]) => Number(v) || 0);
  const dates = pointsArr.map(([d]) => d);

  const max = Math.max(...values);
  const min = Math.min(...values);
  const len = values.length;
  const step = len > 1 ? width / (len - 1) : width;

  const coords = values.map((val, i) => {
    const x = i * step;
    const y =
      max === min ? height / 2 : height - ((val - min) / (max - min)) * height;
    return {
      x,
      y,
      date: dates[i],
      value: values[i],
      isPartial: !!(seriesData?.isPartial && seriesData.isPartial[dates[i]]),
    };
  });

  const polyPoints = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const areaD =
    coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    ` L ${width} ${height} L 0 ${height} Z`;

  // mouse handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onLeave() {
      setHover(null);
    }
    el.addEventListener("mouseleave", onLeave);
    return () => el.removeEventListener("mouseleave", onLeave);
  }, []);

  function handleMove(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x relative to svg
    // find nearest index
    const idx = Math.round((x / width) * (len - 1));
    const clamped = Math.max(0, Math.min(len - 1, idx));
    const p = coords[clamped];
    if (p) {
      setHover({
        index: clamped,
        x: p.x,
        y: p.y,
        date: p.date,
        value: p.value,
        isPartial: p.isPartial,
        clientX: e.clientX,
        clientY: e.clientY,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseMove={handleMove}
      onMouseEnter={(e) => handleMove(e)}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto text-foreground"
      >
        <path d={areaD} fill="rgba(99,102,241,0.06)" />
        <polyline
          points={polyPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hover && (
          <>
            <line
              x1={hover.x}
              x2={hover.x}
              y1={0}
              y2={height}
              stroke="rgba(107,114,128,0.12)"
              strokeWidth={1}
            />
            <circle
              cx={hover.x}
              cy={hover.y}
              r={3.5}
              fill="white"
              stroke="currentColor"
              strokeWidth={1.25}
            />
          </>
        )}
      </svg>

      {hover && (
        <div
          className="absolute z-10 pointer-events-none bg-popover text-popover-foreground rounded-md shadow px-2 py-1 text-xs"
          style={{
            left: Math.min(Math.max(hover.x - 40, 8), (width || 320) - 96),
          }}
        >
          <div className="font-medium">{hover.value}</div>
          <div className="text-muted-foreground">
            {hover.date}
            {hover.isPartial ? " • partial" : ""}
          </div>
        </div>
      )}
    </div>
  );
}

const Page = () => {
  const [filters, setFilters] = useState({
    keyword: "AI",
    predefinedTimeframe: "today 12-m",
    geo: "IN",
    fetchRegionalData: false,
    enableTrendingSearches: false,
    trendingSearchesCountry: "IN",
    trendingSearchesTimeframe: "24",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(value)
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      setData(result || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
fetchData();
  },[])
  return (
    <div className="space-y-6">
{/* 🔹 Compact Top Filter Bar */}
<div className="w-full mb-4">
  <Card className="shadow-sm border border-gray-200">
    {/* Header */}
   
    {/* Content */}
    <CardContent className="pt-3 px-4 pb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
        {/* Keyword */}
        <div>
          <label className="block text-[11px] font-medium mb-1">
            Keyword
          </label>
          <Input
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="e.g. bitcoin, AI"
            disabled={filters.enableTrendingSearches}
            className="h-8 text-sm"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-[11px] font-medium mb-1">
            Country
          </label>
          <select
            name="geo"
            value={filters.geo}
            onChange={handleChange}
            disabled={filters.enableTrendingSearches}
            className="w-full h-8 rounded-md border px-2 text-sm"
          >
            <option value="">Select</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
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

        {/* Timeframe */}
        <div>
          <label className="block text-[11px] font-medium mb-1">
            Timeframe
          </label>
          <select
            name="predefinedTimeframe"
            value={filters.predefinedTimeframe}
            onChange={handleChange}
            className="w-full h-8 rounded-md border px-2 text-sm"
            disabled={filters.enableTrendingSearches}
          >
            <option value="now 1-h">Past hour</option>
            <option value="now 4-h">Past 4 hours</option>
            <option value="now 1-d">Past day</option>
            <option value="now 7-d">Past 7 days</option>
            <option value="today 1-m">Past 30 days</option>
            <option value="today 12-m">Past 12 months</option>
            <option value="today 5-y">Past 5 years</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Regional Data */}
        {/* <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            name="fetchRegionalData"
            checked={filters.fetchRegionalData}
            onChange={handleChange}
            disabled={filters.enableTrendingSearches}
            className="w-4 h-4"
          />
          <label className="text-[12px]">Regional Data</label>
        </div> */}
   <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() =>
            setFilters({
              keyword: "",
              predefinedTimeframe: "today 12-m",
              geo: "",
              fetchRegionalData: false,
              enableTrendingSearches: false,
              trendingSearchesCountry: "US",
              trendingSearchesTimeframe: "24",
            })
          }
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Fetching…" : "Apply"}
        </Button>
      </div>
        {/* Trending Country */}
        {filters.enableTrendingSearches && (
          <>
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Trending Country
              </label>
              <Input
                name="trendingSearchesCountry"
                value={filters.trendingSearchesCountry}
                onChange={handleChange}
                placeholder="e.g. US"
                className="h-8 text-sm"
              />
            </div>

            {/* Trending Timeframe */}
            <div>
              <label className="block text-[11px] font-medium mb-1">
                Trending Timeframe
              </label>
              <select
                name="trendingSearchesTimeframe"
                value={filters.trendingSearchesTimeframe}
                onChange={handleChange}
                className="w-full h-8 rounded-md border px-2 text-sm"
              >
                <option value="4">Last 4 hours</option>
                <option value="24">Last 24 hours</option>
                <option value="48">Last 48 hours</option>
                <option value="168">Last 7 days</option>
              </select>
            </div>
          </>
        )}
      </div>
    </CardContent>
  </Card>
</div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
   {/* 🔹 Horizontal Filter Bar */}


        {/* Results */}
        <main className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Google Trends Results</h3>
              <p className="text-sm text-muted-foreground">
                View current trending or keyword-based analysis data.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {!loading && `${data.length} results`}
            </div>
          </div>

          <section>
            {loading && (
              <div className="text-sm text-muted-foreground">Loading data…</div>
            )}

            {!loading && data.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((item, i) => (
                  <article
                    key={i}
                    className="w-[100vh] border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition bg-card p-4"
                  >
                    {item.trending_searches ? (
                      <>
                        <h4 className="font-semibold mb-2">
                          Trending in {item.geo}
                        </h4>
                        {item.trending_searches.map((t, idx) => (
                          <div key={idx} className="mb-3 border-b pb-2">
                            <div className="font-medium">
                              {t.rank}. {t.term}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Volume: {t.trend_volume}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.related_terms?.map((r, j) => (
                                <Badge key={j} variant="secondary">
                                  {r}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold mb-2">{item.keyword}</h4>
                        <p className="text-sm text-muted-foreground">
                          Timeframe: {item.timeframe} · Granularity:{" "}
                          {item.data_granularity}
                        </p>
                      

                        {item.language && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Language: {item.language}
                          </div>
                        )}

                        {Array.isArray(item.region_data) &&
                          item.region_data.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Regional data: {item.region_data.length} entries
                            </div>
                          )}

                        {/* Full Timeline Chart (Recharts) */}
                        <div className="mt-4">
                          {(() => {
                            const seriesKey = Object.keys(item.timeline_data || {}).find(
                              (k) => k !== "isPartial"
                            );
                            const series = item.timeline_data?.[seriesKey] || {};
                            const chartData = Object.entries(series)
                              .map(([date, value]) => ({ date, value: Number(value) }))
                              .sort((a, b) => a.date.localeCompare(b.date));

                            return (
                              <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 20 }}>
                                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                                  <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(d) => {
                                      // show MM-DD for long ISO dates
                                      try {
                                        return d?.slice(5);
                                      } catch (e) {
                                        return d;
                                      }
                                    }}
                                    interval={Math.max(0, Math.floor(chartData.length / 6))}
                                  />
                                  <YAxis tick={{ fontSize: 11,color:"red" }} domain={["auto", "auto"]} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "1px solid black",
                                      borderRadius: 8,
                                      fontSize: 12,
                                    }}
                                    labelFormatter={(label) => `Date: ${label}`}
                                    formatter={(value) => [value, "Value"]}
                                  />
                                  <Line type="monotone" dataKey="value" stroke="black" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            );
                          })()}
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}

            {!loading && data.length === 0 && (
              <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                No data found. Click <span className="font-medium">Apply</span>{" "}
                to fetch results.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Page;
