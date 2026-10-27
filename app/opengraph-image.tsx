import { ImageResponse } from "next/og";

export const alt = "HumPage Listen: honest audiobook app and audiobook reviews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F1F1F1", padding: 48 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#FFFFFF",
            borderRadius: 40,
            padding: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "#14E25B" }} />
            <div style={{ display: "flex", fontSize: 40, letterSpacing: -1.5, color: "#141414" }}>
              <span style={{ fontWeight: 600 }}>humpage</span>
              <span style={{ color: "#5C5C5C" }}>listen</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -3, color: "#141414", maxWidth: 900 }}>
              Find the audiobook app that fits how you actually listen
            </div>
            <div style={{ marginTop: 24, fontSize: 30, color: "#5C5C5C" }}>Honest reviews of Audible, Audiobooks.com, Spotify, Libro.fm and more</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
