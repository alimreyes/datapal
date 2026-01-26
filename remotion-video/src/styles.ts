import { CSSProperties } from "react";

// Design tokens - Anthropic + Palantir style
export const colors = {
  black: "#000000",
  white: "#FFFFFF",
  gray: "#666666",
  lightGray: "#E5E5E5",
};

export const typography = {
  fontFamily: "'Roboto Mono', monospace",
  heading: {
    fontSize: 72,
    fontWeight: 700,
    letterSpacing: -2,
  },
  subheading: {
    fontSize: 42,
    fontWeight: 500,
    letterSpacing: -1,
  },
  body: {
    fontSize: 32,
    fontWeight: 400,
    letterSpacing: 0,
  },
  small: {
    fontSize: 24,
    fontWeight: 400,
    letterSpacing: 1,
  },
};

export const containerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: typography.fontFamily,
  padding: 60,
  boxSizing: "border-box",
};

export const blackBackground: CSSProperties = {
  ...containerStyle,
  backgroundColor: colors.black,
  color: colors.white,
};

export const whiteBackground: CSSProperties = {
  ...containerStyle,
  backgroundColor: colors.white,
  color: colors.black,
};
