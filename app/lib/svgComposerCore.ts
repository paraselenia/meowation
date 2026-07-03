import type { AvatarColors, ColorPart } from "./avatarUrl";

export const COLOR_ATTR_MAP: Record<ColorPart, "fill" | "stroke"> = {
  body: "fill",
  eye_left: "fill",
  eye_right: "fill",
  nose: "fill",
  mouth: "stroke",
};

export function buildComposedSvg(
  baseSvgText: string,
  patternSvgTexts: string[],
  itemSvgTexts: string[],
  colors: AvatarColors,
  parse: (text: string) => Document,
  serialize: (el: Element) => string,
  svgAttributes: string,
): string {
  const baseDoc = parse(baseSvgText);

  (Object.entries(COLOR_ATTR_MAP) as [ColorPart, "fill" | "stroke"][]).forEach(([id, attr]) => {
    const el = baseDoc.getElementById(id);
    el?.setAttribute(attr, colors[id]);
  });

  const bodyEl = baseDoc.getElementById("body");
  const bodyXml = bodyEl ? serialize(bodyEl).replace(/\sid="body"/, "") : "";

  const baseGroup = baseDoc.getElementById("base");
  const baseChildren = baseGroup
    ? Array.from(baseGroup.childNodes).filter((n) => n.nodeType === 1)
    : [];

  const FACE_IDS = new Set(["eye_left", "eye_right", "nose", "mouth"]);

  const baseContent = baseChildren
    .filter((n) => !FACE_IDS.has((n as Element).getAttribute("id") ?? ""))
    .map((n) => serialize(n as Element))
    .join("");

  const faceContent = baseChildren
    .filter((n) => FACE_IDS.has((n as Element).getAttribute("id") ?? ""))
    .map((n) => serialize(n as Element))
    .join("");

  const patternContent = patternSvgTexts
    .map((text) => {
      const doc = parse(text);
      const patternEl = doc.getElementById("pattern");
      return patternEl ? serialize(patternEl) : "";
    })
    .join("");

  const itemContent = itemSvgTexts
    .map((text) => {
      const doc = parse(text);
      const itemEl = doc.getElementById("item");
      return itemEl ? serialize(itemEl) : "";
    })
    .join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 719.25 982.13" ${svgAttributes}>`,
    "<defs>",
    `<clipPath id="body-clip">${bodyXml}</clipPath>`,
    "</defs>",
    `<g id="layer-base">${baseContent}</g>`,
    `<g id="layer-patterns" clip-path="url(#body-clip)">${patternContent}</g>`,
    `<g id="layer-items">${itemContent}</g>`,
    `<g id="layer-face">${faceContent}</g>`,
    "</svg>",
  ].join("");
}
