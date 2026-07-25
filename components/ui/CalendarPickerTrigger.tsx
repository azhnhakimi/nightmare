import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";

const ICON_SIZE = 20;

export default function CalendarPickerTrigger({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <Pressable
      style={styles.button}
      android_ripple={{ color: "rgba(0,0,0,0.2)", foreground: true }}
      onPress={onOpen}
    >
      <Ionicons name="calendar-number" size={ICON_SIZE} color={"#696969"} />
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
});
