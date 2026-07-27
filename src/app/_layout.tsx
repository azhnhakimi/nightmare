import { ThemeProvider } from "@/theme/ThemeProvider";
import { useTheme } from "@/theme/useTheme";
import { getStatusBarStyle } from "@/utils/statusbar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as NavigationBar from "expo-navigation-bar";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { MenuProvider } from "react-native-popup-menu";
import "../../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider onLoaded={() => SplashScreen.hideAsync()}>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const statusBarStyle = getStatusBarStyle(theme.background);

  useEffect(() => {
    NavigationBar.setButtonStyleAsync(statusBarStyle);
  }, [statusBarStyle]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  return (
    <>
      <KeyboardProvider>
        <GestureHandlerRootView
          style={{ flex: 1, backgroundColor: theme.background }}
        >
          <MenuProvider>
            <BottomSheetModalProvider>
              <Slot />
              <StatusBar style={statusBarStyle} />
            </BottomSheetModalProvider>
          </MenuProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </>
  );
}
