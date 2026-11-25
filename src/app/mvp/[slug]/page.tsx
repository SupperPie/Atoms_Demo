import { notFound } from "next/navigation";

import { EXAMPLES, getExample } from "@/lib/examples";
import { MvpStudio } from "@/components/mvp/mvp-studio";

export function generateStaticParams() {
  return EXAMPLES.map((example) => ({ slug: example.slug }));
}

export default async function MvpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const example = getExample(slug);
  if (!example) notFound();
  return <MvpStudio example={example} />;
}
