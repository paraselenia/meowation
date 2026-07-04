/**
 * Normalize Illustrator-exported SVG assets to the project's canonical structure.
 *
 * Usage:
 *   node --experimental-strip-types scripts/normalize-svg.ts <file.svg>...
 *   pnpm normalize-svg <file.svg>...
 *
 * Illustrator export format (input):
 *   <svg id="[category]">
 *     <defs><style>.cls-1 { ... }</style></defs>
 *     <g id="[artboard-name]" class="cls-N"> ... </g>
 *   </svg>
 *
 * Canonical format (output):
 *   <svg xmlns="...">
 *     <g id="[category]" [attrs resolved from inner group's classes]>
 *       [children with inline attrs, no class]
 *     </g>
 *   </svg>
 *
 * The category id is taken from the <svg> element's id attribute.
 * CSS classes are resolved to SVG presentation attributes and removed.
 * Non-id attributes on the inner wrapper group (e.g. opacity) are inherited
 * by the output group.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";

const domParser = new DOMParser();
const xmlSerializer = new XMLSerializer();

const SVG_PRESENTATION_ATTRS = new Set([
  "fill",
  "fill-opacity",
  "fill-rule",
  "clip-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
]);

function parseStyles(cssText: string): Map<string, Record<string, string>> {
  const map = new Map<string, Record<string, string>>();
  for (const m of cssText.matchAll(/\.([\w-]+)\s*\{([^}]+)\}/g)) {
    const props: Record<string, string> = {};
    for (const decl of m[2]!.split(";")) {
      const sep = decl.indexOf(":");
      if (sep === -1) continue;
      const prop = decl.slice(0, sep).trim();
      const val = decl.slice(sep + 1).trim();
      if (prop && val) props[prop] = val;
    }
    map.set(m[1]!, props);
  }
  return map;
}

function walkElements(el: Element, fn: (el: Element) => void): void {
  fn(el);
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes.item(i);
    if (child && child.nodeType === 1) walkElements(child as Element, fn);
  }
}

function resolveClasses(root: Element, classMap: Map<string, Record<string, string>>): void {
  walkElements(root, (el) => {
    const cls = el.getAttribute?.("class");
    if (!cls) return;
    for (const name of cls.trim().split(/\s+/)) {
      const props = classMap.get(name) ?? {};
      for (const [prop, val] of Object.entries(props)) {
        if (SVG_PRESENTATION_ATTRS.has(prop) && !el.hasAttribute(prop)) {
          // Strip "px" unit — SVG presentation attributes are unitless
          el.setAttribute(prop, val.replace(/px$/, ""));
        }
      }
    }
    el.removeAttribute("class");
  });
}

function getStyleText(doc: Document): string {
  return doc.getElementsByTagName("style").item(0)?.textContent ?? "";
}

function elementChildren(el: Element): Element[] {
  const result: Element[] = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes.item(i);
    if (child && child.nodeType === 1) result.push(child as Element);
  }
  return result;
}

function ser(el: Element): string {
  return xmlSerializer
    .serializeToString(el)
    .replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, "");
}

function normalize(filePath: string): string {
  const doc = domParser.parseFromString(
    readFileSync(filePath, "utf-8"),
    "image/svg+xml",
  ) as unknown as Document;
  const classMap = parseStyles(getStyleText(doc));

  const svgEl = doc.documentElement as unknown as Element;
  const categoryId = svgEl.getAttribute("id");
  if (!categoryId) throw new Error(`<svg> has no id attribute`);

  const topChildren = elementChildren(svgEl).filter((el) => el.tagName !== "defs");
  if (topChildren.length !== 1 || topChildren[0]!.tagName !== "g") {
    throw new Error(
      `Expected a single <g> wrapper inside <svg>, found: ${
        topChildren.map((el) => el.tagName).join(", ") || "(none)"
      }`,
    );
  }

  const innerGroup = topChildren[0]!;

  // Resolve CSS classes on the inner group and all its descendants
  resolveClasses(innerGroup, classMap);

  // Inherit non-id presentation attrs from the inner group to the output wrapper
  const inheritedAttrs = Array.from({ length: innerGroup.attributes.length })
    .map((_, i) => innerGroup.attributes.item(i)!)
    .filter((a) => a.name !== "id")
    .map((a) => ` ${a.name}="${a.value}"`)
    .join("");

  const children = elementChildren(innerGroup)
    .map((el) => `    ${ser(el)}`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 719.25 982.13">
  <g id="${categoryId}"${inheritedAttrs}>
${children}
  </g>
</svg>
`;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node --experimental-strip-types scripts/normalize-svg.ts <file.svg>...");
  process.exit(1);
}

let allOk = true;
for (const filePath of files) {
  try {
    const result = normalize(filePath);
    writeFileSync(filePath, result);
    console.log(`✓ ${filePath}`);
  } catch (err) {
    console.error(`✗ ${filePath}: ${err instanceof Error ? err.message : err}`);
    allOk = false;
  }
}
process.exit(allOk ? 0 : 1);
