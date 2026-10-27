import { StaticPage, staticMeta } from "@/components/static-page";

export const metadata = staticMeta("cookie-policy");

export default function Page() {
  return <StaticPage slug="cookie-policy" />;
}
