import { ThemeProvider } from "@/theme/ThemeProvider";
import { useTheme } from "@/theme/useTheme";
import { getStatusBarStyle } from "@/utils/statusbar";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const statusBarStyle = getStatusBarStyle(theme.background);

  return (
    <>
      <Slot />
      <StatusBar style={statusBarStyle} />
    </>
  );
}
