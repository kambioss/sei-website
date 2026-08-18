import { env } from "cloudflare:workers";

type R2ObjectLike = {
  body: ReadableStream;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
};

type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>;
};

type KVNamespaceLike = {
  getWithMetadata(
    key: string,
    type: "arrayBuffer",
  ): Promise<{
    value: ArrayBuffer | null;
    metadata: { contentType?: string } | null;
  }>;
};

function isKVNamespace(storage: KVNamespaceLike | R2BucketLike): storage is KVNamespaceLike {
  return "getWithMetadata" in storage;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const storage = env.MEDIA as KVNamespaceLike | R2BucketLike | undefined;
  if (!storage) return new Response("Stockage média indisponible.", { status: 503 });
  const objectKey = key.join("/");

  if (isKVNamespace(storage)) {
    const object = await storage.getWithMetadata(objectKey, "arrayBuffer");
    if (!object.value) return new Response("Image introuvable.", { status: 404 });
    return new Response(object.value, {
      headers: {
        "content-type": object.metadata?.contentType || "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  }

  const object = await storage.get(objectKey);
  if (!object) return new Response("Image introuvable.", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      etag: object.httpEtag,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
