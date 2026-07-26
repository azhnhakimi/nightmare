import { useTheme } from "@/theme/useTheme";
import Entypo from "@expo/vector-icons/Entypo";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComponentRef, forwardRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onRemove: () => void;
};

const SubtasksInput = forwardRef<
  ComponentRef<typeof BottomSheetTextInput>,
  Props
>(({ value, onChangeText, onRemove }, ref) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        marginTop: 8,
        alignItems: "center",
        paddingHorizontal: 10,
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            aspectRatio: 1,
            width: 16,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: theme.border,
          }}
        />
        <BottomSheetTextInput
          ref={ref}
          placeholder="Input sub-task..."
          placeholderTextColor={theme.mutedText}
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.textInputField,
            { backgroundColor: theme.background, color: theme.primaryText },
          ]}
        />
      </View>
      <Pressable onPress={onRemove}>
        <Entypo name="cross" size={20} color={theme.primaryText} />
      </Pressable>
    </View>
  );
});

export default SubtasksInput;

const styles = StyleSheet.create({
  textInputField: {
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
});
