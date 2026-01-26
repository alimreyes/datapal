import { interpolate, useCurrentFrame, staticFile, Img } from "remotion";
import { CSSProperties } from "react";

interface LogoProps {
  delay?: number;
  size?: number;
  style?: CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({
  delay = 0,
  size = 200,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [delay, delay + 15],
    [0.5, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const opacity = interpolate(
    frame,
    [delay, delay + 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <Img
        src={staticFile("Logo_DataPal.png")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export const LogoWithText: React.FC<LogoProps & { showText?: boolean }> = ({
  delay = 0,
  size = 150,
  style = {},
  showText = true,
}) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(
    frame,
    [delay + 20, delay + 35],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        ...style,
      }}
    >
      <Logo delay={delay} size={size} />
      {showText && (
        <div
          style={{
            opacity: textOpacity,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          DataPal
        </div>
      )}
    </div>
  );
};
