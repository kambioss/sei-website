import { env } from "cloudflare:workers";
import { readAdminSession } from "@/lib/admin-auth";

type R2BucketLike = {
  put(
    key: string,
    value: ArrayBuffer,
    options: { httpMetadata: { contentType: string } },
  ): Promise<unknown>;
};

type KVNamespaceLike = {
  getWithMetadata: unknown;
  put(
    key: string,
    value: ArrayBuffer,
    options: { metadata: { contentType: string } },
  ): Promise<void>;
};

function isKVNamespace(storage: KVNamespaceLike | R2BucketLike): storage is KVNamespaceLike {
  return "getWithMetadata" in storage;
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  if (!(await readAdminSession())) {
    return Response.json({ error: "Connexion requise." }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get("image");
    if (!(file instanceof File)) {
      return Response.json({ error: "Aucune image reçue." }, { status: 400 });
    }
    const extension = extensions[file.type];
    if (!extension) {
      return Response.json({ error: "Format accepté : JPEG, PNG, WebP, GIF ou AVIF." }, { status: 400 });
    }
    if (file.size > 12 * 1024 * 1024) {
      return Response.json({ error: "L’image ne doit pas dépasser 12 Mo." }, { status: 400 });
    }

    const storage = env.MEDIA as KVNamespaceLike | R2BucketLike | undefined;
    if (!storage) {
      return Response.json({ error: "Le stockage MEDIA n’est pas configuré." }, { status: 503 });
    }
    const key = "news/" + crypto.randomUUID() + "." + extension;
    const value = await file.arrayBuffer();
    if (isKVNamespace(storage)) {
      await storage.put(key, value, { metadata: { contentType: file.type } });
    } else {
      await storage.put(key, value, { httpMetadata: { contentType: file.type } });
    }
    return Response.json({ url: "/api/media/" + key }, { status: 201 });
  } catch (error) {
    console.error("Échec de l’envoi d’une image d’actualité.", error);
    return Response.json({ error: "L’image n’a pas pu être enregistrée. Réessayez." }, { status: 500 });
  }
}
