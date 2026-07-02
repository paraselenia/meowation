const baseModules = import.meta.glob<string>("../assets/base/*.svg", {
  query: "?url",
  import: "default",
  eager: true,
});
const patternModules = import.meta.glob<string>("../assets/pattern/*.svg", {
  query: "?url",
  import: "default",
  eager: true,
});
const itemModules = import.meta.glob<string>("../assets/item/*.svg", {
  query: "?url",
  import: "default",
  eager: true,
});

function toIdMap(modules: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [path.replace(/^.*\/(.+)\.svg$/, "$1"), url]),
  );
}

const baseUrls = toIdMap(baseModules);
const patternUrls = toIdMap(patternModules);
const itemUrls = toIdMap(itemModules);

export function useAssets() {
  return {
    bases: Object.keys(baseUrls),
    patterns: Object.keys(patternUrls),
    items: Object.keys(itemUrls),
    baseUrls,
    patternUrls,
    itemUrls,
  };
}
