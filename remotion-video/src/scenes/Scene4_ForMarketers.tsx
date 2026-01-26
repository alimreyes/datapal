import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { whiteBackground, typography } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import { PulsingDot } from "../components/DataVisualization";

// Scene 4: For marketers - extended +2s with faster bullet points
export const Scene4_ForMarketers: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 10, 160, 180],
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
          justifyContent: "center",
          gap: 30,
          textAlign: "center",
        }}
      >
        {/* Target audience - faster animations */}
        <AnimatedText
          text="Para profesionales"
          delay={5}
          duration={10}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: 38,
            fontWeight: typography.subheading.fontWeight,
            opacity: 0.6,
          }}
        />
        <AnimatedText
          text="de marketing"
          delay={12}
          duration={10}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.heading.fontSize,
            fontWeight: typography.heading.fontWeight,
            letterSpacing: typography.heading.letterSpacing,
          }}
        />

        {/* Benefits list - faster appearance, staggered by 8 frames instead of 15 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 50,
            alignItems: "flex-start",
          }}
        >
          {[
            { text: "Decisiones rápidas", delay: 30 },
            { text: "Sin complicaciones técnicas", delay: 38 },
            { text: "Resultados claros", delay: 46 },
            { text: "Insights con IA", delay: 54 },
          ].map((item, i) => {
            const itemOpacity = interpolate(
              frame,
              [item.delay, item.delay + 12],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            const itemTranslate = interpolate(
              frame,
              [item.delay, item.delay + 12],
              [30, 0],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: itemOpacity,
                  transform: `translateX(${itemTranslate}px)`,
                }}
              >
                <PulsingDot delay={item.delay} inverted={false} />
                <div
                  style={{
                    fontFamily: typography.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: typography.body.fontWeight,
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional value prop */}
        <AnimatedText
          text="Todo desde un simple CSV"
          delay={75}
          duration={12}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.small.fontSize,
            letterSpacing: 2,
            opacity: 0.5,
            marginTop: 40,
            textTransform: "uppercase",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
