// import { fetchAllNekos } from "@/lib/neko-fetch";
import { type NextRequest } from "next/server";
import { fetchNFTContent, fetchOrdinalContent } from "@/lib/preps";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const params = await ctx.params;
  const gen = (
    req.nextUrl.searchParams.get("gen") || "ethscriptions"
  ).toLowerCase();

  const contentFetcher = {
    og: fetchNFTContent,
    ordinals: fetchOrdinalContent,
  };

  const fetcher = contentFetcher[gen];

  if (!fetcher) {
    return new Response("Invalid content fetcher", { status: 400 });
  }

  try {
    const clientETag = req.headers.get("if-none-match");

    // Fetch merged data
    const { data, etag } = await fetcher(params.id);

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

    let html = data as string;

    if (gen === "ordinals") {
      const uri = data?.token?.uri || data?.content || "";
      if (!uri) {
        return new Response("Failure found", { status: 400 });
      }

      const idx = uri.indexOf(",");
      const base64Data = uri.slice(idx + 1);
      html = new TextDecoder().decode(
        Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)),
      );
    }

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        ETag: etag,
        "Cache-Control": "public, immutable, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/content/:id", { id: params.id, error });
    return new Response("Failed to fetch Neko content", { status: 500 });
  }
}
