// app/api/youtube-trending/route.js
import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Read query params from frontend
    const type = searchParams.get("type") || "n";
    const gl = (searchParams.get("gl") || "us").toUpperCase();
    const hl = (searchParams.get("hl") || "en").toLowerCase();
    const maxItems = parseInt(searchParams.get("maxItems") || "50");

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      type,
      gl: (searchParams.get("gl") || "us").toLowerCase(),
      hl: (searchParams.get("hl") || "en").toLowerCase(),
      maxItems,
    };
    // Replace with correct actor name/id for this YouTube trending scraper
    const actorId = "apidojo/youtube-trending-scraper";

    const run = await client.actor(actorId).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items)
    // Map/normalize output for your frontend
    const formatted = items.map((v) => ({
      id: v.id,
      title: v.title,
      url: v.url,
      description: v.description,
      duration: v.duration,
      views: v.views,
      likes: v.likes,
      status: v.status,
      channel: v.channel,
      keywords: v.keywords,
      isLive: v.isLive,
      thumbnails: v.thumbnails,
      // etc.
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching YouTube trending:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
