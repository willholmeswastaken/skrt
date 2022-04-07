import { useEffect, useState } from "react";

export const useDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        const colorScheme = e.matches ? "dark" : "light";
        setIsDarkMode(colorScheme === "dark");
      });
  }, []);

  return isDarkMode;
};
