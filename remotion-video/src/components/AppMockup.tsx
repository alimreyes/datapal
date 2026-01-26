import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../styles";

interface AppMockupProps {
  delay?: number;
  inverted?: boolean;
  variant?: "dashboard" | "chart" | "insights";
}

// Mockup of the DataPal dashboard
export const AppMockup: React.FC<AppMockupProps> = ({
  delay = 0,
  inverted = false,
  variant = "dashboard",
}) => {
  const frame = useCurrentFrame();
  const bg = inverted ? colors.white : "#1a1a1a";
  const fg = inverted ? colors.black : colors.white;
  const accent = "#9333ea"; // Purple
  const accent2 = "#ec4899"; // Pink
  const accent3 = "#3b82f6"; // Blue
  const accent4 = "#10b981"; // Green

  const containerOpacity = interpolate(
    frame,
    [delay, delay + 15],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const scale = interpolate(
    frame,
    [delay, delay + 20],
    [0.9, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  if (variant === "dashboard") {
    return (
      <div
        style={{
          opacity: containerOpacity,
          transform: `scale(${scale})`,
          width: 380,
          height: 700,
          backgroundColor: bg,
          borderRadius: 24,
          padding: 20,
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          border: `2px solid ${inverted ? "#e5e5e5" : "#333"}`,
        }}
      >
        {/* Header */}
        <DashboardHeader delay={delay + 10} fg={fg} accent={accent} accent2={accent2} />

        {/* Stats Cards */}
        <StatsGrid delay={delay + 20} accent={accent} accent2={accent2} accent3={accent3} accent4={accent4} />

        {/* Report Cards */}
        <ReportCardsMockup delay={delay + 35} fg={fg} accent={accent} accent2={accent2} />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        style={{
          opacity: containerOpacity,
          transform: `scale(${scale})`,
          width: 380,
          height: 700,
          backgroundColor: bg,
          borderRadius: 24,
          padding: 20,
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          border: `2px solid ${inverted ? "#e5e5e5" : "#333"}`,
        }}
      >
        {/* Mini header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
            borderRadius: 8
          }} />
          <div style={{ color: fg, fontSize: 18, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>
            Reporte Mensual
          </div>
        </div>

        {/* Chart */}
        <AnimatedLineChart delay={delay + 15} accent={accent} accent2={accent2} accent3={accent3} accent4={accent4} />

        {/* Metric Cards Row */}
        <MetricCardsRow delay={delay + 30} accent={accent} accent2={accent2} accent3={accent3} accent4={accent4} />
      </div>
    );
  }

  if (variant === "insights") {
    return (
      <div
        style={{
          opacity: containerOpacity,
          transform: `scale(${scale})`,
          width: 380,
          height: 700,
          backgroundColor: bg,
          borderRadius: 24,
          padding: 20,
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          border: `2px solid ${inverted ? "#e5e5e5" : "#333"}`,
        }}
      >
        {/* AI Insights Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: `linear-gradient(135deg, ${accent}20, ${accent2}20)`,
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 20 }}>🤖</div>
          <div style={{ color: fg, fontSize: 16, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>
            AI Insights
          </div>
        </div>

        {/* Insight Cards */}
        <InsightCards delay={delay + 15} />
      </div>
    );
  }

  return null;
};

// Sub-components
const DashboardHeader: React.FC<{ delay: number; fg: string; accent: string; accent2: string }> = ({
  delay, fg, accent, accent2
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ opacity, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: `linear-gradient(135deg, ${accent}, ${accent2})`,
          borderRadius: 10
        }} />
        <div>
          <div style={{ color: fg, fontSize: 18, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>
            DataPal
          </div>
          <div style={{ color: fg, fontSize: 11, opacity: 0.5, fontFamily: "'Roboto Mono', monospace" }}>
            Mis Reportes
          </div>
        </div>
      </div>
      <div style={{
        padding: "8px 14px",
        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
        borderRadius: 8,
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Roboto Mono', monospace",
      }}>
        + Crear
      </div>
    </div>
  );
};

const StatsGrid: React.FC<{ delay: number; accent: string; accent2: string; accent3: string; accent4: string }> = ({
  delay, accent, accent2, accent3, accent4
}) => {
  const frame = useCurrentFrame();
  const stats = [
    { label: "Seguidores", value: "12.4K", color: accent3, delta: "+8%" },
    { label: "Alcance", value: "45.2K", color: accent, delta: "+12%" },
    { label: "Interacciones", value: "3.8K", color: accent2, delta: "+5%" },
    { label: "Engagement", value: "4.2%", color: accent4, delta: "+0.3%" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {stats.map((stat, i) => {
        const cardDelay = delay + i * 5;
        const opacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const translateY = interpolate(frame, [cardDelay, cardDelay + 10], [10, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              padding: 14,
              backgroundColor: `${stat.color}15`,
              borderRadius: 12,
              borderLeft: `3px solid ${stat.color}`,
            }}
          >
            <div style={{ color: "#888", fontSize: 10, fontFamily: "'Roboto Mono', monospace", marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>
              {stat.value}
            </div>
            <div style={{ color: accent4, fontSize: 10, fontFamily: "'Roboto Mono', monospace" }}>
              {stat.delta}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ReportCardsMockup: React.FC<{ delay: number; fg: string; accent: string; accent2: string }> = ({
  delay, fg, accent, accent2
}) => {
  const frame = useCurrentFrame();
  const reports = [
    { title: "Instagram Q4", platform: "IG", color: accent2 },
    { title: "Facebook Ads", platform: "FB", color: "#3b82f6" },
    { title: "Campaña Navidad", platform: "IG", color: accent },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      <div style={{ color: fg, fontSize: 13, fontWeight: 600, fontFamily: "'Roboto Mono', monospace", opacity: 0.7 }}>
        Reportes Recientes
      </div>
      {reports.map((report, i) => {
        const cardDelay = delay + i * 8;
        const opacity = interpolate(frame, [cardDelay, cardDelay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const translateX = interpolate(frame, [cardDelay, cardDelay + 12], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              padding: 14,
              backgroundColor: "#2a2a2a",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              backgroundColor: `${report.color}30`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: report.color,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Roboto Mono', monospace",
            }}>
              {report.platform}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>
                {report.title}
              </div>
              <div style={{ color: "#666", fontSize: 10, fontFamily: "'Roboto Mono', monospace" }}>
                Hace 2 días
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AnimatedLineChart: React.FC<{ delay: number; accent: string; accent2: string; accent3: string; accent4: string }> = ({
  delay, accent, accent2, accent3, accent4
}) => {
  const frame = useCurrentFrame();

  const chartOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Animate line drawing
  const lineProgress = interpolate(frame, [delay + 5, delay + 40], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const points1 = "20,140 70,120 120,90 170,100 220,60 270,80 320,40";
  const points2 = "20,160 70,150 120,130 170,140 220,110 270,120 320,90";

  return (
    <div style={{
      opacity: chartOpacity,
      backgroundColor: "#2a2a2a",
      borderRadius: 16,
      padding: 16,
      flex: 1,
    }}>
      <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Roboto Mono', monospace", marginBottom: 12 }}>
        Evolución de Métricas
      </div>
      <svg width="100%" height="180" viewBox="0 0 340 180">
        {/* Grid lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="20" y1={40 + i * 40} x2="320" y2={40 + i * 40} stroke="#444" strokeWidth="1" />
        ))}

        {/* Lines with clip animation */}
        <defs>
          <clipPath id="lineClip">
            <rect x="0" y="0" width={`${lineProgress}%`} height="200" />
          </clipPath>
        </defs>

        <polyline
          points={points1}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          clipPath="url(#lineClip)"
        />
        <polyline
          points={points2}
          fill="none"
          stroke={accent2}
          strokeWidth="3"
          clipPath="url(#lineClip)"
        />

        {/* Data points */}
        {lineProgress > 90 && (
          <>
            <circle cx="320" cy="40" r="6" fill={accent} />
            <circle cx="320" cy="90" r="6" fill={accent2} />
          </>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: accent }} />
          <span style={{ color: "#888", fontSize: 10, fontFamily: "'Roboto Mono', monospace" }}>Alcance</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: accent2 }} />
          <span style={{ color: "#888", fontSize: 10, fontFamily: "'Roboto Mono', monospace" }}>Interacciones</span>
        </div>
      </div>
    </div>
  );
};

const MetricCardsRow: React.FC<{ delay: number; accent: string; accent2: string; accent3: string; accent4: string }> = ({
  delay, accent, accent2, accent3, accent4
}) => {
  const frame = useCurrentFrame();
  const metrics = [
    { value: "45.2K", label: "Alcance", color: accent },
    { value: "3.8K", label: "Interacc.", color: accent2 },
    { value: "4.2%", label: "Engage", color: accent4 },
  ];

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {metrics.map((m, i) => {
        const cardDelay = delay + i * 6;
        const opacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const scale = interpolate(frame, [cardDelay, cardDelay + 10], [0.8, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `scale(${scale})`,
              flex: 1,
              padding: 12,
              backgroundColor: `${m.color}15`,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div style={{ color: m.color, fontSize: 18, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>
              {m.value}
            </div>
            <div style={{ color: "#888", fontSize: 9, fontFamily: "'Roboto Mono', monospace" }}>
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InsightCards: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const insights = [
    { type: "positive", icon: "📈", text: "El engagement aumentó 12% este mes", color: "#10b981" },
    { type: "suggestion", icon: "💡", text: "Publica más contenido en horario pico", color: "#9333ea" },
    { type: "warning", icon: "⚠️", text: "El alcance bajó los fines de semana", color: "#f59e0b" },
    { type: "info", icon: "📊", text: "Reels tienen 3x más interacciones", color: "#3b82f6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
      {insights.map((insight, i) => {
        const cardDelay = delay + i * 10;
        const opacity = interpolate(frame, [cardDelay, cardDelay + 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const translateX = interpolate(frame, [cardDelay, cardDelay + 15], [-30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              padding: 14,
              backgroundColor: `${insight.color}15`,
              borderRadius: 12,
              borderLeft: `3px solid ${insight.color}`,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>{insight.icon}</span>
            <div style={{
              color: "#fff",
              fontSize: 13,
              fontFamily: "'Roboto Mono', monospace",
              lineHeight: 1.4,
            }}>
              {insight.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Phone frame wrapper
export const PhoneFrame: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const scale = interpolate(frame, [delay, delay + 15], [0.95, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      position: "relative",
    }}>
      {children}
      {/* Notch */}
      <div style={{
        position: "absolute",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        width: 80,
        height: 24,
        backgroundColor: "#000",
        borderRadius: 12,
      }} />
    </div>
  );
};
