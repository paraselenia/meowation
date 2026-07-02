export type ColorPart = "body" | "eye_left" | "eye_right" | "nose" | "mouth";

export type AvatarColors = Record<ColorPart, string>;

export type AvatarState = {
  base: string;
  patterns: string[];
  items: string[];
  colors: AvatarColors;
  selectedPart: ColorPart | null;
};

const DEFAULT_COLORS: AvatarColors = {
  body: "#ffffff",
  eye_left: "#000000",
  eye_right: "#000000",
  nose: "#000000",
  mouth: "#000000",
};

export const DEFAULT_STATE: AvatarState = {
  base: "cat_default",
  patterns: [],
  items: [],
  colors: DEFAULT_COLORS,
  selectedPart: null,
};

const COLOR_PARTS: ColorPart[] = ["body", "eye_left", "eye_right", "nose", "mouth"];

export function stateToParams(state: AvatarState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("base", state.base);
  if (state.patterns.length > 0) params.set("patterns", state.patterns.join(","));
  if (state.items.length > 0) params.set("items", state.items.join(","));
  for (const part of COLOR_PARTS) {
    if (state.colors[part] !== DEFAULT_COLORS[part]) {
      params.set(part, state.colors[part]);
    }
  }
  return params;
}

export function paramsToState(params: URLSearchParams): AvatarState {
  return {
    base: params.get("base") ?? DEFAULT_STATE.base,
    patterns: params.get("patterns")?.split(",").filter(Boolean) ?? [],
    items: params.get("items")?.split(",").filter(Boolean) ?? [],
    colors: {
      body: params.get("body") ?? DEFAULT_COLORS.body,
      eye_left: params.get("eye_left") ?? DEFAULT_COLORS.eye_left,
      eye_right: params.get("eye_right") ?? DEFAULT_COLORS.eye_right,
      nose: params.get("nose") ?? DEFAULT_COLORS.nose,
      mouth: params.get("mouth") ?? DEFAULT_COLORS.mouth,
    },
    selectedPart: null,
  };
}
