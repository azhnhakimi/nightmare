import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  isModalVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  onModalHide: () => void;
};

const ICON_SIZE = 20;

export default function CalenderPicker({
  isModalVisible,
  onOpen,
  onClose,
  onModalHide,
}: Props) {
  return (
    <>
      <Pressable
        style={styles.button}
        android_ripple={{ color: "rgba(0,0,0,0.2)", foreground: true }}
        onPress={onOpen}
      >
        <Ionicons name="calendar-number" size={ICON_SIZE} color={"#696969"} />
      </Pressable>

      <Modal isVisible={isModalVisible} onModalHide={onModalHide}>
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>
          <Button title="Hide modal" onPress={onClose} />
        </View>
      </Modal>
    </>
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
