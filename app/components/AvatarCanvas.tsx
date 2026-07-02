import type { RefObject } from "react";

type Props = {
  svgContent: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
};

export function AvatarCanvas({ svgContent, containerRef }: Props) {
  if (svgContent) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-white py-6"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-white py-6"
    >
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );
}
