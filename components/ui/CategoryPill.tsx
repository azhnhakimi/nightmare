import { useTheme } from "@/theme/useTheme";
import { Pressable, Text } from "react-native";

type Props = {
  category: string;
  onPress: () => void;
  isActive: boolean
};

export default function CategoryPill({ category, isActive, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: isActive ? theme.accent : theme.surface,
        borderRadius: 28,
        paddingVertical: 8,
        paddingHorizontal: 18,
      }}
      onPress={onPress}
    >
      <Text style={{ color: isActive ? theme.onAccent : theme.primaryText }}>{category}</Text>
    </Pressable>
  );
}
