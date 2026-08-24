import { redirect } from "next/navigation";

export default async function QuiSommesNousRedirect({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  redirect(query.lang ? `/?lang=${query.lang}` : "/");
}
