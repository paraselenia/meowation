import type { RefObject } from "react";

type Props = {
  svgContent: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function AvatarCanvas({ svgContent, containerRef }: Props) {
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gray-50"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG合成結果を描画
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    >
      {!svgContent && <div className="text-gray-400 text-sm">Loading...</div>}
    </div>
  );
}
