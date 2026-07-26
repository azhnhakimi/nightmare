import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function AddSubtaskBtn({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      android_ripple={{ color: "rgba(0,0,0,0.2)", foreground: true }}
    >
      <AntDesign name="branches" size={20} color={"#696969"} />
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
