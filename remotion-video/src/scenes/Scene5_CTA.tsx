import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { blackBackground, typography } from "../styles";
import { LogoWithText } from "../components/Logo";
import { AnimatedText } from "../components/AnimatedText";

// Scene 5: Call to action / Outro - with CTA link
export const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Subtle pulsing effect for the logo
  const logoScale = interpolate(
    (frame % 45),
    [0, 22, 45],
    [1, 1.03, 1],
    { extrapolateRight: "clamp" }
  );

  // CTA button animation
  const ctaOpacity = interpolate(
    frame,
    [50, 65],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const ctaScale = interpolate(
    frame,
    [50, 70],
    [0.9, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Pulsing glow for CTA
  const ctaGlow = interpolate(
    (frame - 70) % 40,
    [0, 20, 40],
    [0, 15, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ ...blackBackground, opacity }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Logo */}
        <div style={{ transform: `scale(${logoScale})` }}>
          <LogoWithText delay={5} size={140} showText={true} />
        </div>

        {/* Tagline */}
        <AnimatedText
          text="Tu data, simplificada."
          delay={30}
          duration={12}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: 40,
            fontWeight: typography.subheading.fontWeight,
            opacity: 0.9,
            marginTop: 20,
          }}
        />

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            marginTop: 40,
          }}
        >
          <div
            style={{
              padding: "20px 50px",
              background: "linear-gradient(135deg, #9333ea, #ec4899)",
              borderRadius: 16,
              boxShadow: `0 0 ${ctaGlow}px rgba(147, 51, 234, 0.6)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: typography.fontFamily,
                fontSize: 22,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              Pruébalo hoy
            </div>
            <div
              style={{
                fontFamily: typography.fontFamily,
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 0,
              }}
            >
              datapal.vercel.app
            </div>
          </div>
        </div>

        {/* Subtle footer */}
        <AnimatedText
          text="Gratis para empezar"
          delay={75}
          duration={10}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: 18,
            letterSpacing: 2,
            opacity: 0.4,
            marginTop: 20,
            textTransform: "uppercase",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
