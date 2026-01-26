import { interpolate, useCurrentFrame } from "remotion";
import { CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  style?: CSSProperties;
  duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  style = {},
  duration = 20,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    frame,
    [delay, delay + duration],
    [30, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const TypewriterText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  style = {},
  duration = 30,
}) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.floor(
    interpolate(
      frame,
      [delay, delay + duration],
      [0, text.length],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    )
  );

  const showCursor = frame > delay && frame < delay + duration + 15;
  const cursorBlink = Math.floor((frame - delay) / 8) % 2 === 0;

  return (
    <div style={{ ...style, display: "flex" }}>
      <span>{text.slice(0, charsToShow)}</span>
      {showCursor && cursorBlink && (
        <span style={{ marginLeft: 2 }}>|</span>
      )}
    </div>
  );
};
