import { ImageResponse } from "next/og";

export const alt = "Loreforge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #431407 0%, #9A3412 45%, #FB923C 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 32,
            background: "rgba(255,255,255,0.16)",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700 }}>L</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
          Loreforge
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            marginTop: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Game Marketplace
        </div>
      </div>
    ),
    { ...size }
  );
}
