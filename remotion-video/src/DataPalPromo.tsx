import { AbsoluteFill, Sequence } from "remotion";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_Problem } from "./scenes/Scene2_Problem";
import { Scene3_Solution } from "./scenes/Scene3_Solution";
import { Scene4_ForMarketers } from "./scenes/Scene4_ForMarketers";
import { Scene5_CTA } from "./scenes/Scene5_CTA";

/*
 * DataPal Promo Video - 20 seconds (600 frames @ 30fps)
 * Format: 9:16 (1080x1920) - Social Media / Reels
 * Style: Anthropic + Palantir (minimalist, B&W, professional)
 *
 * Updated Timeline (more dynamic, 50% faster transitions):
 * - Scene 1 (0-60): Intro - Logo + DataPal name (~2s)
 * - Scene 2 (60-210): Problem - Data complexity - EXTENDED for reading (~5s)
 * - Scene 3 (210-390): Solution - DataPal transforms + App mockups (~6s)
 * - Scene 4 (390-570): For Marketers - Benefits + 2s extended (~6s)
 * - Scene 5 (480-600): CTA - Pruébalo hoy: datapal.vercel.app (~4s, overlaps)
 */

export const DataPalPromo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* Load Roboto Mono font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
        `}
      </style>

      {/* Scene 1: Intro (0-60 frames, ~2 seconds) - FASTER */}
      <Sequence from={0} durationInFrames={60}>
        <Scene1_Intro />
      </Sequence>

      {/* Scene 2: Problem (60-210 frames, ~5 seconds) - EXTENDED for reading */}
      <Sequence from={60} durationInFrames={150}>
        <Scene2_Problem />
      </Sequence>

      {/* Scene 3: Solution (210-390 frames, ~6 seconds) - WITH APP MOCKUPS */}
      <Sequence from={210} durationInFrames={180}>
        <Scene3_Solution />
      </Sequence>

      {/* Scene 4: For Marketers (390-570 frames, ~6 seconds) - EXTENDED +2s */}
      <Sequence from={390} durationInFrames={180}>
        <Scene4_ForMarketers />
      </Sequence>

      {/* Scene 5: CTA/Outro (480-600 frames, ~4 seconds) */}
      <Sequence from={480} durationInFrames={120}>
        <Scene5_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
