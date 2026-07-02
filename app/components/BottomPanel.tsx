import { useState } from "react";
import { ColorEditor } from "./ColorEditor";
import type { AvatarColors, ColorPart } from "../lib/avatarUrl";

type Tab = "base" | "pattern" | "item" | "color";

const TAB_LABELS: Record<Tab, string> = {
  base: "Base",
  pattern: "Pattern",
  item: "Item",
  color: "Color",
};

type Props = {
  bases: string[];
  selectedBase: string;
  onSelectBase: (id: string) => void;
  baseUrls: Record<string, string>;
  patterns: string[];
  selectedPatterns: string[];
  onTogglePattern: (id: string) => void;
  patternUrls: Record<string, string>;
  items: string[];
  selectedItems: string[];
  onToggleItem: (id: string) => void;
  itemUrls: Record<string, string>;
  colors: AvatarColors;
  selectedPart: ColorPart | null;
  onSelectPart: (part: ColorPart | null) => void;
  onSetColor: (part: ColorPart, color: string) => void;
};

function ThumbnailGrid({
  ids,
  urls,
  selectedIds,
  onToggle,
  single,
}: {
  ids: string[];
  urls: Record<string, string>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  single?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 p-3">
      {ids.map((id) => {
        const selected = single ? selectedIds[0] === id : selectedIds.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              selected ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={urls[id]} alt={id} className="w-full h-full object-contain" />
          </button>
        );
      })}
    </div>
  );
}

export function BottomPanel({
  bases,
  selectedBase,
  onSelectBase,
  baseUrls,
  patterns,
  selectedPatterns,
  onTogglePattern,
  patternUrls,
  items,
  selectedItems,
  onToggleItem,
  itemUrls,
  colors,
  selectedPart,
  onSelectPart,
  onSetColor,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("base");

  return (
    <div className="flex flex-col bg-white border-t border-gray-200">
      <div className="flex border-b border-gray-100">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-black font-semibold" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto" style={{ height: "40vh" }}>
        {activeTab === "base" && (
          <ThumbnailGrid
            ids={bases}
            urls={baseUrls}
            selectedIds={[selectedBase]}
            onToggle={onSelectBase}
            single
          />
        )}
        {activeTab === "pattern" && (
          <ThumbnailGrid
            ids={patterns}
            urls={patternUrls}
            selectedIds={selectedPatterns}
            onToggle={onTogglePattern}
          />
        )}
        {activeTab === "item" && (
          <ThumbnailGrid
            ids={items}
            urls={itemUrls}
            selectedIds={selectedItems}
            onToggle={onToggleItem}
          />
        )}
        {activeTab === "color" && (
          <ColorEditor
            colors={colors}
            selectedPart={selectedPart}
            onSelectPart={onSelectPart}
            onSetColor={onSetColor}
          />
        )}
      </div>
    </div>
  );
}
