import { useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { stateToParams, paramsToState, type AvatarState, type ColorPart } from "../lib/avatarUrl";

export function useAvatarState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPart, setSelectedPart] = useState<ColorPart | null>(null);

  const urlState = paramsToState(searchParams);
  const state: AvatarState = { ...urlState, selectedPart };

  const updateParams = useCallback(
    (updater: (prev: AvatarState) => AvatarState) => {
      setSearchParams((params) => stateToParams(updater(paramsToState(params))), { replace: true });
    },
    [setSearchParams],
  );

  const setBase = useCallback(
    (base: string) => updateParams((s) => ({ ...s, base, patterns: [], items: [] })),
    [updateParams],
  );

  const togglePattern = useCallback(
    (id: string) =>
      updateParams((s) => ({
        ...s,
        patterns: s.patterns.includes(id)
          ? s.patterns.filter((p) => p !== id)
          : [...s.patterns, id],
      })),
    [updateParams],
  );

  const toggleItem = useCallback(
    (id: string) =>
      updateParams((s) => ({
        ...s,
        items: s.items.includes(id) ? s.items.filter((i) => i !== id) : [...s.items, id],
      })),
    [updateParams],
  );

  const setColor = useCallback(
    (part: ColorPart, color: string) =>
      updateParams((s) => ({ ...s, colors: { ...s.colors, [part]: color } })),
    [updateParams],
  );

  const handleSetSelectedPart = useCallback((part: ColorPart | null) => setSelectedPart(part), []);

  const shareUrl = useCallback(() => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  return {
    state,
    setBase,
    togglePattern,
    toggleItem,
    setColor,
    setSelectedPart: handleSetSelectedPart,
    shareUrl,
  };
}
