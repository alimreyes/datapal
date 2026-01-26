import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { blackBackground, typography } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import { Logo } from "../components/Logo";
import { AppMockup, PhoneFrame } from "../components/AppMockup";

// Scene 3: The solution - DataPal transforms (with app mockups)
export const Scene3_Solution: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 10, 165, 180],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Show different mockups at different times
  const showDashboard = frame >= 50 && frame < 100;
  const showChart = frame >= 85 && frame < 140;
  const showInsights = frame >= 125;

  const mockupScale = 0.55;

  return (
    <AbsoluteFill style={{ ...blackBackground, opacity }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          height: "100%",
          justifyContent: "flex-start",
          paddingTop: 80,
        }}
      >
        {/* Small logo */}
        <Logo delay={5} size={80} />

        {/* Main message - faster */}
        <div style={{ textAlign: "center", maxWidth: 800 }}>
          <AnimatedText
            text="DataPal transforma"
            delay={10}
            duration={12}
            style={{
              fontFamily: typography.fontFamily,
              fontSize: 36,
              fontWeight: typography.subheading.fontWeight,
              marginBottom: 8,
              opacity: 0.7,
            }}
          />
          <AnimatedText
            text="datos en insights"
            delay={20}
            duration={12}
            style={{
              fontFamily: typography.fontFamily,
              fontSize: 56,
              fontWeight: typography.heading.fontWeight,
              letterSpacing: -2,
            }}
          />
        </div>

        {/* App mockups carousel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 450,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* Dashboard mockup - slides in from left */}
          {showDashboard && (
            <div
              style={{
                position: "absolute",
                transform: `scale(${mockupScale}) translateX(${interpolate(
                  frame,
                  [50, 65, 90, 100],
                  [-100, 0, 0, -150],
                  { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                )}px)`,
                opacity: interpolate(
                  frame,
                  [50, 60, 90, 100],
                  [0, 1, 1, 0],
                  { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                ),
              }}
            >
              <PhoneFrame delay={50}>
                <AppMockup delay={50} variant="dashboard" />
              </PhoneFrame>
            </div>
          )}

          {/* Chart mockup - fades in center */}
          {showChart && (
            <div
              style={{
                position: "absolute",
                transform: `scale(${mockupScale})`,
                opacity: interpolate(
                  frame,
                  [85, 95, 130, 140],
                  [0, 1, 1, 0],
                  { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                ),
              }}
            >
              <PhoneFrame delay={85}>
                <AppMockup delay={85} variant="chart" />
              </PhoneFrame>
            </div>
          )}

          {/* AI Insights mockup - slides in from right */}
          {showInsights && (
            <div
              style={{
                position: "absolute",
                transform: `scale(${mockupScale}) translateX(${interpolate(
                  frame,
                  [125, 140],
                  [100, 0],
                  { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                )}px)`,
                opacity: interpolate(
                  frame,
                  [125, 135],
                  [0, 1],
                  { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                ),
              }}
            >
              <PhoneFrame delay={125}>
                <AppMockup delay={125} variant="insights" />
              </PhoneFrame>
            </div>
          )}
        </div>

        {/* AI mention - faster */}
        <AnimatedText
          text="Potenciado por IA"
          delay={35}
          duration={10}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
