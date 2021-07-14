import React from "react";

export function rgb2hex(rgb: string): string {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

  const RGB = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x: string): string {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(RGB[1]) + hex(RGB[2]) + hex(RGB[3]);
}

export const useIsUserLoggedIn = (first: string) =>
  React.useMemo(() => {
    return first === "dashboard";
  }, [first]);
