import { useState } from "react";
import type { AvatarColors, ColorPart } from "../lib/avatarUrl";

const PART_LABELS: Record<ColorPart, string> = {
  body: "Body",
  eye_left: "Left Eye",
  eye_right: "Right Eye",
  nose: "Nose",
  mouth: "Mouth",
};

// 毛色: 白・クリーム・カリコクリーム・オレンジ・ダークジンジャー・タン・ブラウン・ライトグレー・ブルーグレー・ダークグレー・ブラック
// 目の色: アンバー・グリーン・ロシアンブルー（エメラルドグリーン）・ブルー
// 鼻・口: ピンク・ダスティローズ
const PRESET_COLORS = [
  "#ffffff",
  "#f5e6c8",
  "#f0d5a0",
  "#e8841a",
  "#c4621d",
  "#d4a56a",
  "#7b4b2a",
  "#c8c8c8",
  "#9babb8",
  "#808080",
  "#1a1a1a",
  "#d4a017",
  "#4a8c3f",
  "#5dba6a",
  "#4a90c4",
  "#f4a0a0",
  "#d4829a",
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
