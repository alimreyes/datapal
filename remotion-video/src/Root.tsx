import { Composition } from "remotion";
import { DataPalPromo } from "./DataPalPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DataPalPromo"
        component={DataPalPromo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
