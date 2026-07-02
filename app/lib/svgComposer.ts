import type { AvatarColors } from "./avatarUrl";
import { buildComposedSvg } from "./svgComposerCore";

export function composeSvg(
  baseSvgText: string,
  patternSvgTexts: string[],
  itemSvgTexts: string[],
  colors: AvatarColors,
): string {
  return buildComposedSvg(
    baseSvgText,
    patternSvgTexts,
    itemSvgTexts,
    colors,
    (text) => new DOMParser().parseFromString(text, "image/svg+xml"),
    (el) => el.outerHTML,
    'width="100%" height="100%"',
  );
}
