import { useState } from "react";
import type { AvatarColors, ColorPart } from "../lib/avatarUrl";

const PART_LABELS: Record<ColorPart, string> = {
  body: "Body",
  eye_left: "Left Eye",
  eye_right: "Right Eye",
  nose: "Nose",
  mouth: "Mouth",
};

const PRESET_COLORS = [
  "#ffffff",
  "#f5e6d3",
  "#e8c9a0",
  "#c8956c",
  "#8b5e3c",
  "#4a2c1a",
  "#000000",
  "#ff4444",
  "#ff8800",
  "#ffdd00",
  "#44bb44",
  "#2288ff",
  "#8844ff",
  "#ff44aa",
  "#aaaaaa",
  "#cccccc",
];

type Props = {
  colors: AvatarColors;
  selectedPart: ColorPart | null;
  onSelectPart: (part: ColorPart | null) => void;
  onSetColor: (part: ColorPart, color: string) => void;
};

export function ColorEditor({ colors, selectedPart, onSelectPart, onSetColor }: Props) {
  const [hexInput, setHexInput] = useState("");

  function handlePartClick(part: ColorPart) {
    if (selectedPart === part) {
      onSelectPart(null);
    } else {
      onSelectPart(part);
      setHexInput(colors[part].replace("#", ""));
    }
  }

  function handlePresetClick(color: string) {
    if (selectedPart) {
      onSetColor(selectedPart, color);
      setHexInput(color.replace("#", ""));
    }
  }

  function commitHex() {
    if (selectedPart && /^[0-9a-fA-F]{6}$/.test(hexInput)) {
      onSetColor(selectedPart, `#${hexInput}`);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PART_LABELS) as ColorPart[]).map((part) => (
          <button
            key={part}
            type="button"
            onClick={() => handlePartClick(part)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-colors ${
              selectedPart === part
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <span
              className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
              style={{ backgroundColor: colors[part] }}
            />
            {PART_LABELS[part]}
          </button>
        ))}
      </div>

      {selectedPart && (
        <>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                  colors[selectedPart] === color ? "border-blue-500 scale-110" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-mono">#</span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.replace(/[^0-9a-fA-F]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && commitHex()}
              onBlur={commitHex}
              maxLength={6}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-24 font-mono focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="ffffff"
            />
          </div>
        </>
      )}
    </div>
  );
}
