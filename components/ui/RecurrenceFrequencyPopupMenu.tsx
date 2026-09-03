import { useTheme } from "@/theme/useTheme";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export const frequencies = ["Daily", "Weekly", "Monthly"];

type Props = {
  activeFrequency: string;
  setActiveFrequency: (frequency: string) => void;
};

export default function RecurrenceFrequencyPopupMenu({
  activeFrequency,
  setActiveFrequency,
}: Props) {
  const { theme } = useTheme();

  const menuOptionCustomStyles = useMemo(
    () => ({
      OptionTouchableComponent: TouchableHighlight,
      optionTouchable: {
        underlayColor: "#00000011",
      },
    }),
    [theme],
  );

  return (
    <Menu>
      <MenuTrigger
        style={[styles.button, { backgroundColor: theme.background }]}
      >
        <Text
          style={[styles.text, { color: theme.primaryText }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {activeFrequency}
        </Text>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            paddingVertical: 14,
            backgroundColor: theme.surface,
            borderRadius: 8,
            gap: 12,
            paddingHorizontal: 0,
          },
        }}
      >
        {frequencies.map((frequency, index) => (
          <MenuOption
            key={index}
            onSelect={() => setActiveFrequency(frequency)}
            style={[
              menuOptionStyles,
              {
                backgroundColor:
                  activeFrequency === frequency ? theme.accent : "",
              },
            ]}
            customStyles={menuOptionCustomStyles}
          >
            <Text
              numberOfLines={1}
              style={{
                color:
                  activeFrequency === frequency
                    ? theme.onAccent
                    : theme.primaryText,
              }}
            >
              {frequency}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 18,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    width: "100%",
    textAlign: "center",
  },
});

const menuOptionStyles = {
  marginVertical: 4,
  paddingHorizontal: 14,
};
