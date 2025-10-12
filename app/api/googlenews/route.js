import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || "World News";
    const maxItems = parseInt(searchParams.get("maxItems")) || 50;

    // Optional filters
    const gl = searchParams.get("gl") || "us"; // Geo location (country)
    const hl = searchParams.get("hl") || "en"; // Language
    const lr = searchParams.get("lr") || "lang_en"; // Language restriction
    const cr = searchParams.get("cr") || ""; // Country restriction
    const time_period = searchParams.get("time_period") || "last_week"; // e.g. last_day, last_week, last_month

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // 👇 Correct input structure for Apify Google News Scraper
    const input = {
      query,
      maxItems,
      gl, // e.g. in, us, gb
      hl, // e.g. en, hi
      lr, // e.g. lang_en
      cr, // e.g. countryIN
      timePeriod: time_period, // Apify expects this key exactly like this
    };

    console.log("📡 Fetching trending data for:", input);

    const run = await client.actor("easyapi/google-news-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Format result
    const formattedData = items.map((item) => ({
      title: item.title || "Untitled",
      snippet: item.snippet || "",
      url: item.link || "",
      source: item.domain || "",
      published: item.date || "",
      publishedUTC: item.date_utc || "",
      thumbnail: item.thumbnail || null,
      position: item.position || null,
    }));

    return NextResponse.json({
      success: true,
      filters: { query, gl, hl, lr, cr, time_period },
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("❌ Error fetching Apify data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trending data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
