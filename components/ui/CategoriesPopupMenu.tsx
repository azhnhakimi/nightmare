import { categories } from "@/constants/categories";
import { useTheme } from "@/theme/useTheme";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type Props = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export default function CategoriesPopupMenu({
  activeCategory,
  setActiveCategory,
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
      <MenuTrigger style={[styles.button, { backgroundColor: theme.surface }]}>
        <Text
          style={[styles.text, { color: theme.primaryText }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {activeCategory}
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
        {categories.map((category, index) => (
          <MenuOption
            key={index}
            onSelect={() => setActiveCategory(category)}
            style={[
              menuOptionStyles,
              {
                backgroundColor:
                  activeCategory === category ? theme.accent : "",
              },
            ]}
            customStyles={menuOptionCustomStyles}
          >
            <Text
              numberOfLines={1}
              style={{
                color:
                  activeCategory === category
                    ? theme.onAccent
                    : theme.primaryText,
              }}
            >
              {category}
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
