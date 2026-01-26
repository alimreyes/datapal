import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../styles";
import { ReactNode } from "react";

interface TransitionProps {
  children: ReactNode;
  startFrame: number;
  endFrame: number;
}

export const FadeIn: React.FC<TransitionProps> = ({
  children,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return <div style={{ opacity }}>{children}</div>;
};

export const FadeOut: React.FC<TransitionProps> = ({
  children,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return <div style={{ opacity }}>{children}</div>;
};

export const SlideUp: React.FC<TransitionProps> = ({
  children,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  const translateY = interpolate(
    frame,
    [startFrame, endFrame],
    [100, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div style={{ transform: `translateY(${translateY}px)`, opacity }}>
      {children}
    </div>
  );
};

export const WipeTransition: React.FC<{
  frame: number;
  startFrame: number;
  duration?: number;
  toBlack?: boolean;
}> = ({ frame, startFrame, duration = 15, toBlack = true }) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 100],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${progress}%`,
        backgroundColor: toBlack ? colors.black : colors.white,
        zIndex: 100,
      }}
    />
  );
};
