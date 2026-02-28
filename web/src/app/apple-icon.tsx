import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
        }}
      >
        {/* Vertical bar */}
        <div
          style={{
            position: "absolute",
            left: 52,
            top: 30,
            width: 16,
            height: 120,
            background: "linear-gradient(180deg, #6c5ce7, #00cec9)",
            borderRadius: 8,
          }}
        />
        {/* Top diagonal */}
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 28,
            width: 16,
            height: 76,
            background: "linear-gradient(135deg, #6c5ce7, #00cec9)",
            borderRadius: 8,
            transform: "rotate(38deg)",
            transformOrigin: "0% 100%",
          }}
        />
        {/* Bottom diagonal */}
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 76,
            width: 16,
            height: 76,
            background: "linear-gradient(135deg, #6c5ce7, #00cec9)",
            borderRadius: 8,
            transform: "rotate(-38deg)",
            transformOrigin: "0% 0%",
          }}
        />
      </div>
    ),
    { width: 180, height: 180 }
  );
}
