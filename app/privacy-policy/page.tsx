import { StaticPage, staticMeta } from "@/components/static-page";

export const metadata = staticMeta("privacy-policy");

export default function Page() {
  return <StaticPage slug="privacy-policy" />;
}
