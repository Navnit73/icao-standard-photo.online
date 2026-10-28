import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "Passport and visa photos online that meet ICAO 9303 standards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const checks = ["Plain white background", "Correct head size", "Print-ready sheet"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          borderTop: "16px solid #65a30d",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#65a30d" />
            <g transform="translate(11 11) scale(1.75)" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 18c1-2.5 3-3.5 5-3.5s4 1 5 3.5" />
            </g>
          </svg>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#000000" }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#000000", letterSpacing: -2 }}>
            Passport & visa photos,
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#4d7c0f", letterSpacing: -2 }}>
            done right the first time
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#4b5563" }}>
            Meets ICAO 9303 standards · Ready in minutes
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {checks.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                border: "2px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 24,
                color: "#374151",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#65a30d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
