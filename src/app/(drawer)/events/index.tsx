import EventCreationBottomSheet, {
  EventSheetHandle,
} from "@/components/ui/EventCreationBottomSheet";
import { useTheme } from "@/theme/useTheme";
import { useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventsIndex() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRouter();

  const eventSheetRef = useRef<EventSheetHandle>(null);

  return (
    <SafeAreaView
      className="flex-1 p-2"
      style={styles.container}
      edges={["bottom", "top"]}
    >
      <Pressable
        style={styles.button}
        onPress={() => route.navigate("/(drawer)/calendar/import")}
      >
        <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
          Import ICS
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => eventSheetRef.current?.present()}
      >
        <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
          Create an event
        </Text>
      </Pressable>

      <EventCreationBottomSheet ref={eventSheetRef} />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 16,
      gap: 4,
    },
    button: {
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 6,
    },
    sheetContainer: {
      flex: 1,
      height: "100%",
      paddingHorizontal: 18,
    },
    textInputHeader: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 4,
    },
    textInputField: {
      width: "100%",
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 60,
    },
    timePickerBtn: {
      gap: 4,
      flex: 1,
      backgroundColor: theme.background,
      padding: 8,
      borderRadius: 8,
    },
    submitBtn: {
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      padding: 9,
      borderRadius: 8,
      marginTop: "auto",
    },
  });
