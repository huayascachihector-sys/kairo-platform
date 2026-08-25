import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "sm_darkmode";

function readInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function useDarkMode(): [boolean, () => void, (v: boolean) => void] {
  const [dark, setDark] = useState<boolean>(readInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "1" : "0");
    } catch {}
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  const setDarkMode = useCallback((v: boolean) => setDark(v), []);

  return [dark, toggle, setDarkMode];
}