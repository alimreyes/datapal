import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { blackBackground } from "../styles";
import { LogoWithText } from "../components/Logo";

// Scene 1: Logo + DataPal name (frames 0-60, ~2 seconds) - FASTER
export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const containerOpacity = interpolate(
    frame,
    [45, 60],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ ...blackBackground, opacity: containerOpacity }}>
      <LogoWithText delay={5} size={180} showText={true} />
    </AbsoluteFill>
  );
};
