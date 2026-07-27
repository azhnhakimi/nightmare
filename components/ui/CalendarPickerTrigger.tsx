import { useTheme } from "@/theme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ICON_SIZE = 20;

export default function CalendarPickerTrigger({
  onOpen,
  day,
  iconColor,
}: {
  onOpen: () => void;
  day?: string;
  iconColor?: string;
}) {
  const { theme } = useTheme();

  const getDay = (date: string): string => {
    return date.split("-")[2];
  };

  const displayDay = day ? getDay(day) : new Date().getDate();

  return (
    <Pressable
      style={styles.button}
      android_ripple={{ color: "rgba(0,0,0,0.2)", foreground: true }}
      onPress={onOpen}
    >
      <View style={styles.iconWrapper}>
        <Ionicons
          name="calendar-clear-outline"
          size={ICON_SIZE}
          color={day ? theme.accent : "#696969"}
        />
        <Text
          style={[styles.dayText, { color: day ? theme.accent : "#696969" }]}
        >
          {displayDay}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    padding: 10,
    overflow: "hidden",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    position: "absolute",
    top: ICON_SIZE * 0.35,
    fontSize: ICON_SIZE * 0.36,
    fontWeight: "700",
  },
});
