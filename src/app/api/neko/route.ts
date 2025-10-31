import { getAllNekos } from "@/lib/preps";

export async function GET(request: Request) {
  try {
    const clientETag = request.headers.get("if-none-match");
    const baseURL = new URL(request.url).origin;

    // Fetch merged data
    const { data, etag } = await getAllNekos(baseURL);

    // ETag validation - if client has matching ETag, return 304
    if (clientETag === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, immutable, max-age=31536000",
        },
      });
    }

    // Return full dataset with immutable cache headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ETag: etag,
        "Cache-Control": "public, immutable, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/neko:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Neko data",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
