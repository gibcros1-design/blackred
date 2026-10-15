import { redirect } from "next/navigation";

interface BeliPageProps {
  searchParams: Promise<{ robux?: string; package?: string }>;
}

export default async function BeliPage({ searchParams }: BeliPageProps) {
  const params = await searchParams;
  const pkg = params.package || (params.robux ? `rbx-${params.robux}` : "");
  const query = pkg ? `?package=${pkg}` : "";
  redirect(`/topup/roblox${query}`);
}
