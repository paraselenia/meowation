import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import type { AvatarColors } from "./avatarUrl";
import { buildComposedSvg } from "./svgComposerCore";

const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();

export function composeSvgServer(
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
    (text) => domParser.parseFromString(text, "image/svg+xml") as unknown as Document,
    (el) => xmlSerializer.serializeToString(el),
    'width="1080" height="1473"',
  );
}
