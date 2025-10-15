import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "worldwide";

  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN, // Set in .env.local
  });

  try {
    const input = { country };

    // Run the Apify actor
    const run = await client
      .actor("fastcrawler/x-twitter-trends-scraper-0-5-1k-results-pay-per-result-2025")
      .call(input);

    // Fetch dataset results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Clean up data for frontend
    const formatted = items.map((item) => ({
      rank: item.rank,
      topic: item.topic,
      tweet_volume: item.tweet_volume,
      last_updated: item.last_updated,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json({ error: "Failed to fetch Twitter trends" }, { status: 500 });
  }
}
