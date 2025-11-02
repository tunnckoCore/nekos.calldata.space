import Color from "colorjs.io";
import type { Neko } from "./neko";

export function isValidColor(color: string): boolean {
  try {
    new Color(color);
    return true;
  } catch {
    return false;
  }
}

function getColor(item: Neko, type: keyof Neko["extractedColors"]) {
  const isValid = isValidColor(item.traits[type]);
  const patchColor = new Color(item.extractedColors[type])
    .to("oklch")
    .toString();

  const traitColor = isValid
    ? new Color(item.traits[type]).to("oklch").toString()
    : patchColor;

  if (isValid) {
    return traitColor !== patchColor ? patchColor : traitColor;
  }

  return patchColor;
}
export function getProperColors(
  item: Neko,
): Record<keyof Neko["extractedColors"], string> {
  return {
    cat: getColor(item, "cat"),
    eyes: getColor(item, "eyes"),
    background: getColor(item, "background"),
  };
}
