import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import type { Route } from "./+types/og";
import { paramsToState } from "../lib/avatarUrl";
import { composeSvgServer } from "../lib/svgComposerServer";

const baseModules = import.meta.glob<string>("../assets/base/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});
const patternModules = import.meta.glob<string>("../assets/pattern/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});
const itemModules = import.meta.glob<string>("../assets/item/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

function toRawMap(modules: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, text]) => [path.replace(/^.*\/(.+)\.svg$/, "$1"), text]),
  );
}

const baseRaws = toRawMap(baseModules);
const patternRaws = toRawMap(patternModules);
const itemRaws = toRawMap(itemModules);

let wasmInitialized = false;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const state = paramsToState(url.searchParams);

  const baseSvgText = baseRaws[state.base];
  if (!baseSvgText) {
    return new Response("Not Found", { status: 404 });
  }

  const patternSvgTexts = state.patterns.flatMap((id) =>
    patternRaws[id] ? [patternRaws[id]] : [],
  );
  const itemSvgTexts = state.items.flatMap((id) => (itemRaws[id] ? [itemRaws[id]] : []));

  const svg = composeSvgServer(baseSvgText, patternSvgTexts, itemSvgTexts, state.colors);

  if (!wasmInitialized) {
    await initWasm(resvgWasm);
    wasmInitialized = true;
  }

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
