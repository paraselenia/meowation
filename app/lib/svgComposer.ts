import type { AvatarColors, ColorPart } from "./avatarUrl";

const COLOR_ATTR_MAP: Record<ColorPart, "fill" | "stroke"> = {
  body: "fill",
  eye_left: "fill",
  eye_right: "fill",
  nose: "fill",
  mouth: "stroke",
};

export function composeSvg(
  baseSvgText: string,
  patternSvgTexts: string[],
  itemSvgTexts: string[],
  colors: AvatarColors,
): string {
  const parse = (text: string) => new DOMParser().parseFromString(text, "text/html");

  const baseDoc = parse(baseSvgText);

  // 色を適用
  (Object.entries(COLOR_ATTR_MAP) as [ColorPart, "fill" | "stroke"][]).forEach(([id, attr]) => {
    const el = baseDoc.getElementById(id);
    el?.setAttribute(attr, colors[id]);
  });

  // body要素をclipPath用に取得
  const bodyEl = baseDoc.getElementById("body");
  const bodyHtml = bodyEl ? bodyEl.outerHTML : "";

  // ベースレイヤーのコンテンツ
  const baseGroup = baseDoc.getElementById("base");
  const baseContent = baseGroup
    ? Array.from(baseGroup.children)
        .map((c) => c.outerHTML)
        .join("")
    : "";

  // パターンコンテンツ（body-clipでクリップ）
  const patternContent = patternSvgTexts
    .map((text) => {
      const doc = parse(text);
      return Array.from(doc.querySelectorAll("[id^='pattern']"))
        .map((el) => el.outerHTML)
        .join("");
    })
    .join("");

  // アイテムコンテンツ
  const itemContent = itemSvgTexts
    .map((text) => {
      const doc = parse(text);
      const itemEl = doc.getElementById("item");
      return itemEl ? itemEl.outerHTML : "";
    })
    .join("");

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 719.25 982.13">',
    "<defs>",
    `<clipPath id="body-clip">${bodyHtml}</clipPath>`,
    "</defs>",
    `<g id="layer-base">${baseContent}</g>`,
    `<g id="layer-patterns" clip-path="url(#body-clip)">${patternContent}</g>`,
    `<g id="layer-items">${itemContent}</g>`,
    "</svg>",
  ].join("");
}
