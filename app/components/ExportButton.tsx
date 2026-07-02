import type { RefObject } from "react";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export function ExportButton({ containerRef }: Props) {
  async function handleExport() {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;

    const svgText = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const vb = svgEl.viewBox.baseVal;
      const canvas = document.createElement("canvas");
      canvas.width = vb.width * scale;
      canvas.height = vb.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "avatar.png";
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = svgUrl;
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      Export
    </button>
  );
}
