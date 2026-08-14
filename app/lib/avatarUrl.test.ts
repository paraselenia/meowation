import { describe, it, expect } from "vite-plus/test";
import { stateToParams, paramsToState, DEFAULT_STATE, type AvatarState } from "./avatarUrl";

describe("stateToParams / paramsToState", () => {
  it("デフォルト状態を往復できる", () => {
    const restored = paramsToState(stateToParams(DEFAULT_STATE));
    expect(restored.base).toBe(DEFAULT_STATE.base);
    expect(restored.patterns).toEqual([]);
    expect(restored.items).toEqual([]);
    expect(restored.colors).toEqual(DEFAULT_STATE.colors);
    expect(restored.selectedPart).toBeNull();
  });

  it("カスタムbaseを往復できる", () => {
    const state: AvatarState = { ...DEFAULT_STATE, base: "cat_01" };
    expect(paramsToState(stateToParams(state)).base).toBe("cat_01");
  });

  it("複数patternを往復できる", () => {
    const state: AvatarState = {
      ...DEFAULT_STATE,
      patterns: ["pattern_01", "pattern_02"],
    };
    expect(paramsToState(stateToParams(state)).patterns).toEqual(["pattern_01", "pattern_02"]);
  });

  it("複数itemを往復できる", () => {
    const state: AvatarState = {
      ...DEFAULT_STATE,
      items: ["item_01", "item_02"],
    };
    expect(paramsToState(stateToParams(state)).items).toEqual(["item_01", "item_02"]);
  });

  it("カスタムカラーを往復できる", () => {
    const state: AvatarState = {
      ...DEFAULT_STATE,
      colors: {
        body: "#ff0000",
        eye_left: "#00ff00",
        eye_right: "#0000ff",
        nose: "#ffff00",
        mouth: "#ff00ff",
      },
    };
    expect(paramsToState(stateToParams(state)).colors).toEqual(state.colors);
  });

  it("空のパラメータはデフォルト値にフォールバックする", () => {
    const restored = paramsToState(new URLSearchParams());
    expect(restored.base).toBe(DEFAULT_STATE.base);
    expect(restored.patterns).toEqual([]);
    expect(restored.items).toEqual([]);
    expect(restored.colors).toEqual(DEFAULT_STATE.colors);
  });

  it("パース後のselectedPartは常にnull", () => {
    const restored = paramsToState(new URLSearchParams("base=cat_default"));
    expect(restored.selectedPart).toBeNull();
  });
});
