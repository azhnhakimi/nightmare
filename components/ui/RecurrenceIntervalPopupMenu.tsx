import { useTheme } from "@/theme/useTheme";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export const dailyIntervals = Array.from({ length: 6 }, (_, i) => i + 1);
export const weeklyIntervals = Array.from({ length: 3 }, (_, i) => i + 1);
export const monthlyIntervals = Array.from({ length: 12 }, (_, i) => i + 1);

type Props = {
  activeInterval: number;
  setActiveInterval: (interval: number) => void;
  activeFrequency: string;
};

export default function RecurrenceIntervalPopupMenu({
  activeInterval,
  setActiveInterval,
  activeFrequency,
}: Props) {
  const { theme } = useTheme();

  const intervals =
    {
      Daily: dailyIntervals,
      Weekly: weeklyIntervals,
      Monthly: monthlyIntervals,
    }[activeFrequency] ?? [];

  useEffect(() => {
    if (!intervals.includes(activeInterval)) {
      setActiveInterval(intervals[0]);
    }
  }, [activeFrequency]);

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
          {activeInterval}
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
        {intervals.map((interval) => (
          <MenuOption
            key={interval}
            onSelect={() => setActiveInterval(interval)}
            style={[
              styles.menuOption,
              {
                backgroundColor:
                  activeInterval === interval ? theme.accent : "transparent",
              },
            ]}
            customStyles={{
              OptionTouchableComponent: TouchableHighlight,
              optionTouchable: {
                underlayColor: "#00000011",
              },
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color:
                  activeInterval === interval
                    ? theme.onAccent
                    : theme.primaryText,
              }}
            >
              {interval}
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
  menuOption: {
    marginVertical: 4,
    paddingHorizontal: 14,
  },
});
