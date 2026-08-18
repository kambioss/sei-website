import { env } from "cloudflare:workers";

type R2ObjectLike = {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
};

type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const bucket = env.MEDIA as R2BucketLike | undefined;
  if (!bucket) return new Response("Stockage média indisponible.", { status: 503 });
  const object = await bucket.get(key.join("/"));
  if (!object) return new Response("Image introuvable.", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      etag: object.httpEtag,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
