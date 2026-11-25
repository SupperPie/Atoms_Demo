import { HomeView } from "@/components/home/home-view";
import { SiteHeader } from "@/components/site-header";
import { DemoLink } from "@/components/site-header";

export default function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader right={<DemoLink href="/mvp/cargo" label="示例 MVP" />} />
      <HomeView />
    </div>
  );
}
