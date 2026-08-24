import { redirect } from "next/navigation";

export default async function ValuesRedirect({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  redirect(query.lang ? `/notre-histoire?lang=${query.lang}#nos-valeurs` : "/notre-histoire#nos-valeurs");
}
