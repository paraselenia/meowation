import { useState, useEffect } from "react";
import { composeSvg } from "../lib/svgComposer";
import type { AvatarState } from "../lib/avatarUrl";

export function useSvgComposer(
  state: AvatarState,
  baseUrls: Record<string, string>,
  patternUrls: Record<string, string>,
  itemUrls: Record<string, string>,
): string | null {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const { base, patterns, items, colors } = state;

  useEffect(() => {
    const baseUrl = baseUrls[base];
    if (!baseUrl) return;

    const patternUrlList = patterns.map((id) => patternUrls[id]).filter(Boolean) as string[];
    const itemUrlList = items.map((id) => itemUrls[id]).filter(Boolean) as string[];

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const [baseSvgText, ...rest] = await Promise.all([
          fetch(baseUrl, { signal }).then((r) => r.text()),
          ...patternUrlList.map((url) => fetch(url, { signal }).then((r) => r.text())),
          ...itemUrlList.map((url) => fetch(url, { signal }).then((r) => r.text())),
        ]);

        const patternTexts = rest.slice(0, patternUrlList.length);
        const itemTexts = rest.slice(patternUrlList.length);

        if (!signal.aborted) {
          setSvgContent(composeSvg(baseSvgText, patternTexts, itemTexts, colors));
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") throw e;
      }
    })();

    return () => controller.abort();
  }, [
    base,
    patterns.join(","),
    items.join(","),
    colors.body,
    colors.eye_left,
    colors.eye_right,
    colors.nose,
    colors.mouth,
    baseUrls,
    patternUrls,
    itemUrls,
  ]);

  return svgContent;
}
