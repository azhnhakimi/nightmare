import { themes } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useEffect, useState } from "react";
import { ThemeContext, ThemeName } from "./ThemeContext";

const STORAGE_KEY = "APP_THEME";

export const ThemeProvider = ({
  children,
  onLoaded,
}: {
  children: ReactNode;
  onLoaded?: () => void;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTheme) setThemeName(savedTheme as ThemeName);
      } catch (e) {
        console.log("Failed to load theme", e);
      } finally {
        onLoaded?.();
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (name: ThemeName) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, name);
      setThemeName(name);
    } catch (e) {
      console.log("Failed to save theme", e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeName], themeName, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
