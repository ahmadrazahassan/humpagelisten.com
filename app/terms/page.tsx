import { StaticPage, staticMeta } from "@/components/static-page";

export const metadata = staticMeta("terms");

export default function Page() {
  return <StaticPage slug="terms" />;
}
