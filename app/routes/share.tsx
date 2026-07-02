import { useRef } from "react";
import type { MetaFunction } from "react-router";
import { AvatarCanvas } from "../components/AvatarCanvas";
import { useAssets } from "../hooks/useAssets";
import { useAvatarState } from "../hooks/useAvatarState";
import { useSvgComposer } from "../hooks/useSvgComposer";

export const meta: MetaFunction = () => [{ title: "meowation" }];

export default function Share() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state } = useAvatarState();
  const { baseUrls, patternUrls, itemUrls } = useAssets();
  const svgContent = useSvgComposer(state, baseUrls, patternUrls, itemUrls);

  return (
    <div className="w-screen h-svh px-6">
      <AvatarCanvas svgContent={svgContent} containerRef={containerRef} />
    </div>
  );
}
