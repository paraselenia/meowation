// app/routes/_index.tsx
import { useRef, useState, useCallback } from "react";
import type { MetaFunction } from "react-router";
import { AvatarCanvas } from "../components/AvatarCanvas";
import { BottomPanel } from "../components/BottomPanel";
import { ExportButton } from "../components/ExportButton";
import { useAssets } from "../hooks/useAssets";
import { useAvatarState } from "../hooks/useAvatarState";
import { useSvgComposer } from "../hooks/useSvgComposer";

export const meta: MetaFunction = () => [{ title: "meowation" }];

export default function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { state, setBase, togglePattern, toggleItem, setColor, setSelectedPart, shareUrl } =
    useAvatarState();

  const handleShare = useCallback(async () => {
    await shareUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);
  const { bases, patterns, items, baseUrls, patternUrls, itemUrls } = useAssets();
  const svgContent = useSvgComposer(state, baseUrls, patternUrls, itemUrls);

  return (
    <div className="flex flex-col h-svh md:flex-row">
      {/* Header (mobile only) */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:hidden">
        <span className="font-bold text-lg">meowation</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <ExportButton containerRef={containerRef} />
        </div>
      </header>

      {/* Desktop: left panel */}
      <div className="hidden md:flex md:flex-col md:w-80 md:border-r md:border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="font-bold text-lg">meowation</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? "Copied!" : "Share"}
            </button>
            <ExportButton containerRef={containerRef} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BottomPanel
            bases={bases}
            selectedBase={state.base}
            onSelectBase={setBase}
            baseUrls={baseUrls}
            patterns={patterns}
            selectedPatterns={state.patterns}
            onTogglePattern={togglePattern}
            patternUrls={patternUrls}
            items={items}
            selectedItems={state.items}
            onToggleItem={toggleItem}
            itemUrls={itemUrls}
            colors={state.colors}
            selectedPart={state.selectedPart}
            onSelectPart={setSelectedPart}
            onSetColor={setColor}
          />
        </div>
      </div>

      {/* Avatar preview */}
      <div className="flex-1 min-h-0">
        <AvatarCanvas svgContent={svgContent} containerRef={containerRef} />
      </div>

      {/* Mobile: bottom panel */}
      <div className="md:hidden">
        <BottomPanel
          bases={bases}
          selectedBase={state.base}
          onSelectBase={setBase}
          baseUrls={baseUrls}
          patterns={patterns}
          selectedPatterns={state.patterns}
          onTogglePattern={togglePattern}
          patternUrls={patternUrls}
          items={items}
          selectedItems={state.items}
          onToggleItem={toggleItem}
          itemUrls={itemUrls}
          colors={state.colors}
          selectedPart={state.selectedPart}
          onSelectPart={setSelectedPart}
          onSetColor={setColor}
        />
      </div>
    </div>
  );
}
