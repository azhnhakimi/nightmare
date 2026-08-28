import { useTheme } from "@/theme/useTheme";
import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarIndex() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView
      className="flex-1 p-2"
      style={styles.container}
      edges={["bottom", "top"]}
    >
      <Text>Calendar</Text>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 4,
      backgroundColor: theme.background,
      paddingBottom: 16,
    },
  });
