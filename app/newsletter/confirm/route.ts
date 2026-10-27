import { addContact, verifyConfirmation } from "@/lib/mail";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = verifyConfirmation(url.searchParams.get("e") ?? "", url.searchParams.get("x") ?? "", url.searchParams.get("t") ?? "");
  if (!email) return Response.redirect(new URL("/newsletter/expired", url), 303);
  try {
    await addContact(email);
  } catch (e) {
    console.error("[newsletter confirm]", e);
    return Response.redirect(new URL("/newsletter/expired", url), 303);
  }
  return Response.redirect(new URL("/newsletter/confirmed", url), 303);
}
