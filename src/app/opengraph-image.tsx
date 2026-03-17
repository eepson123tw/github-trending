import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GitHub Trending Observatory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 100,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#10b981",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 200,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#f59e0b",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 120,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3b82f6",
            opacity: 0.4,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.3em",
            color: "rgba(99,102,241,0.6)",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Open Source Universe
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(90deg, #818cf8, #a78bfa, #60a5fa)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          GitHub Trending
        </div>

        {/* Chinese subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 300,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 32,
          }}
        >
          年度趨勢觀測站
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "center",
          }}
        >
          {[
            { value: "354", label: "Days" },
            { value: "4,995", label: "Repos" },
            { value: "12", label: "Categories" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(148,163,184,0.8)",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: "rgba(148,163,184,0.5)",
          }}
        >
          <span>github-trending.zeabur.app</span>
          <span style={{ margin: "0 4px" }}>·</span>
          <span>2025-03 ~ 2026-03</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
