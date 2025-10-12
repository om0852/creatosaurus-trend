import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "2"; // Default: USA
  const duration = searchParams.get("duration") || "live"; // Default: Live

  try {
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Base input
    const input = {
      country,
      live: false,
      hour1: false,
      hour3: false,
      hour6: false,
      hour12: false,
      hour24: false,
      day2: false,
      day3: false,
      proxyOptions: { useApifyProxy: true },
    };

    // Enable correct duration flag
    if (duration === "live") input.live = true;
    else if (duration === "1h") input.hour1 = true;
    else if (duration === "3h") input.hour3 = true;
    else if (duration === "6h") input.hour6 = true;
    else if (duration === "12h") input.hour12 = true;
    else if (duration === "24h") input.hour24 = true;
    else if (duration === "2d") input.day2 = true;
    else if (duration === "3d") input.day3 = true;

    // Run the actor
    const run = await client.actor("oCAEibQtPGKXcF5MM").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log("items",items)
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends", details: error.message },
      { status: 500 }
    );
  }
}
