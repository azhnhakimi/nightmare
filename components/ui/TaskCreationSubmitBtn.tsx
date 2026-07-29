import { useTheme } from "@/theme/useTheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
  isSubmitting: boolean;
};

export default function TaskCreationSubmitBtn({
  onPress,
  isSubmitting,
}: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.accent,
        padding: 17,
        borderRadius: 9999,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      disabled={isSubmitting}
    >
      <FontAwesome name="send" size={18} color={theme.onAccent} />
    </TouchableOpacity>
  );
}
