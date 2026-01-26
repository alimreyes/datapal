import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../styles";

interface DataVisualizationProps {
  delay?: number;
  inverted?: boolean;
}

export const DataGrid: React.FC<DataVisualizationProps> = ({
  delay = 0,
  inverted = false,
}) => {
  const frame = useCurrentFrame();
  const gridColor = inverted ? colors.white : colors.black;

  const rows = 6;
  const cols = 4;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
        width: 400,
        padding: 20,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const cellDelay = delay + i * 2;
        const opacity = interpolate(
          frame,
          [cellDelay, cellDelay + 10],
          [0, 1],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );

        const width = interpolate(
          frame,
          [cellDelay, cellDelay + 15],
          [0, 70 + Math.random() * 30],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              height: 16,
              backgroundColor: gridColor,
              opacity: opacity * 0.6,
              width: `${width}%`,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};

export const AnimatedChart: React.FC<DataVisualizationProps> = ({
  delay = 0,
  inverted = false,
}) => {
  const frame = useCurrentFrame();
  const barColor = inverted ? colors.white : colors.black;

  const bars = [65, 85, 45, 90, 70, 55, 80];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        height: 300,
        padding: 20,
      }}
    >
      {bars.map((height, i) => {
        const barDelay = delay + i * 5;
        const animatedHeight = interpolate(
          frame,
          [barDelay, barDelay + 20],
          [0, height],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              width: 40,
              height: `${animatedHeight}%`,
              backgroundColor: barColor,
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
};

export const PulsingDot: React.FC<{ delay?: number; inverted?: boolean }> = ({
  delay = 0,
  inverted = false,
}) => {
  const frame = useCurrentFrame();
  const dotColor = inverted ? colors.white : colors.black;

  const scale = interpolate(
    (frame - delay) % 30,
    [0, 15, 30],
    [1, 1.3, 1],
    { extrapolateRight: "clamp" }
  );

  const opacity = frame > delay ? 1 : 0;

  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: dotColor,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

export const ScanLine: React.FC<DataVisualizationProps> = ({
  delay = 0,
  inverted = false,
}) => {
  const frame = useCurrentFrame();
  const lineColor = inverted ? colors.white : colors.black;

  const progress = interpolate(
    frame,
    [delay, delay + 60],
    [0, 100],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        width: 400,
        height: 4,
        backgroundColor: inverted ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: lineColor,
        }}
      />
    </div>
  );
};
