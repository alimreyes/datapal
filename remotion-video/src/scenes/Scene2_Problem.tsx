import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { whiteBackground, typography } from "../styles";
import { DataGrid } from "../components/DataVisualization";
import { TypewriterText, AnimatedText } from "../components/AnimatedText";

// Scene 2: The problem - CSV chaos (extended for better reading)
export const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 10, 140, 150],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ ...whiteBackground, opacity }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* CSV representation - faster animation */}
        <DataGrid delay={5} inverted={false} />

        {/* Problem text - more time to read */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          <TypewriterText
            text="Datos complejos."
            delay={15}
            duration={20}
            style={{
              fontFamily: typography.fontFamily,
              fontSize: typography.heading.fontSize,
              fontWeight: typography.heading.fontWeight,
              letterSpacing: typography.heading.letterSpacing,
              marginBottom: 30,
            }}
          />
          <TypewriterText
            text="Reportes que toman horas."
            delay={45}
            duration={25}
            style={{
              fontFamily: typography.fontFamily,
              fontSize: typography.subheading.fontSize,
              fontWeight: typography.subheading.fontWeight,
              opacity: 0.7,
              marginBottom: 20,
            }}
          />
          <AnimatedText
            text="¿Te suena familiar?"
            delay={85}
            duration={15}
            style={{
              fontFamily: typography.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: typography.body.fontWeight,
              opacity: 0.5,
              fontStyle: "italic",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
