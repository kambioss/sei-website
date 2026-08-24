import { redirect } from "next/navigation";

export default async function VisionRedirect({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  redirect(query.lang ? `/notre-histoire?lang=${query.lang}#notre-vision` : "/notre-histoire#notre-vision");
}
