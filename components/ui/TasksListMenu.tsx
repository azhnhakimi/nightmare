import { useTheme } from "@/theme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableHighlight } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export default function TasksListMenu() {
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
      <MenuTrigger style={{ paddingHorizontal: 8 }}>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={theme.primaryText}
        />
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
        <MenuOption
          onSelect={() => alert(`Select Tasks`)}
          style={menuOptionStyles}
          customStyles={menuOptionCustomStyles}
        >
          <Text style={{ color: theme.primaryText }}>Select Tasks</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => router.push("/(screens)/manage-categories")}
          style={menuOptionStyles}
          customStyles={menuOptionCustomStyles}
        >
          <Text style={{ color: theme.primaryText }}>Manage Categories</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert(`Sort`)}
          style={menuOptionStyles}
          customStyles={menuOptionCustomStyles}
        >
          <Text style={{ color: theme.primaryText }}>Sort</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

const menuOptionStyles = {
  marginVertical: 4,
  paddingHorizontal: 14,
};
