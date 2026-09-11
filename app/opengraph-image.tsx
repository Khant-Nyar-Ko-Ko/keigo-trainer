import { ImageResponse } from "next/og";

export const alt = "Keigo Companion — judgment-first keigo practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#faf8f4";
const PAPER_RAISED = "#ffffff";
const LINE = "#e5e0d5";
const LINE_STRONG = "#cfc7b4";
const INK = "#211f1a";
const INK_SOFT = "#5a5347";
const ACCENT = "#dc2626";
const SONKEIGO = "#2f6e52";
const SONKEIGO_SOFT = "#e9f1ec";
const KENJOUGO = "#4f4a8f";
const KENJOUGO_SOFT = "#ecebf5";

function Dot({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: color,
      }}
    />
  );
}

function Pill({ children, border = LINE }: { children: string; border?: string }) {
  return (
    <div
      style={{
        display: "flex",
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: "8px 16px",
        fontSize: 20,
        color: INK_SOFT,
      }}
    >
      {children}
    </div>
  );
}

function RegisterChip({ label, color, soft }: { label: string; color: string; soft: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        backgroundColor: soft,
        borderRadius: 4,
        padding: "8px 16px",
        fontSize: 20,
        color,
        fontWeight: 600,
      }}
    >
      <Dot color={color} />
      {label}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PAPER,
        }}
      >
        <div
          style={{
            width: 1120,
            height: 550,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: PAPER_RAISED,
            border: `1px solid ${LINE_STRONG}`,
            padding: "56px 64px",
          }}
        >
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Dot color={SONKEIGO} />
              <div style={{ width: 2, height: 14, backgroundColor: LINE_STRONG }} />
              <Dot color={KENJOUGO} />
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>
              <span style={{ color: ACCENT }}>Keigo</span>
              <span style={{ color: INK, marginLeft: 10 }}>Companion</span>
            </div>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  border: `1px solid ${LINE_STRONG}`,
                  borderRadius: 4,
                  padding: "6px 14px",
                  fontSize: 18,
                  letterSpacing: 2,
                  color: INK_SOFT,
                  textTransform: "uppercase",
                }}
              >
                Judgment-First Keigo
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
              <div style={{ display: "flex" }}>Judgment first.</div>
              <div style={{ display: "flex" }}>Conjugation second.</div>
            </div>
            <div style={{ display: "flex", fontSize: 25, color: INK_SOFT, lineHeight: 1.45, maxWidth: 880 }}>
              Practice Japanese honorific speech by reasoning who speaks to whom — not just
              conjugation drills.
            </div>
          </div>

          {/* Footer row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Pill>100% Free</Pill>
            <Pill>No Account Needed</Pill>
            <RegisterChip label="Sonkeigo" color={SONKEIGO} soft={SONKEIGO_SOFT} />
            <RegisterChip label="Kenjougo" color={KENJOUGO} soft={KENJOUGO_SOFT} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
