import { useRef } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/share";

import { AvatarCanvas } from "../components/AvatarCanvas";
import { useAssets } from "../hooks/useAssets";
import { useAvatarState } from "../hooks/useAvatarState";
import { useSvgComposer } from "../hooks/useSvgComposer";

export function meta({ location }: Route.MetaArgs) {
  return [
    { title: "meowation" },
    { property: "og:image", content: `/og${location.search}` },
    { property: "og:type", content: "website" },
  ];
}

export default function Share() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const { state } = useAvatarState();
  const { baseUrls, patternUrls, itemUrls } = useAssets();
  const svgContent = useSvgComposer(state, baseUrls, patternUrls, itemUrls);

  return (
    <div className="flex flex-col w-screen h-svh px-6">
      <div className="flex-1 min-h-0">
        <AvatarCanvas svgContent={svgContent} containerRef={containerRef} />
      </div>
      <div className="flex justify-center py-6 shrink-0">
        <Link
          to={`/?${searchParams.toString()}`}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          Back to Edit
        </Link>
      </div>
    </div>
  );
}
