import CategoryPill from "@/components/ui/CategoryPill";
import DraggableFlatlist from "@/components/ui/DraggableFlatlist";
import TasksCreationBottomSheet from "@/components/ui/TasksCreationBottomSheet";
import { categories } from "@/constants/categories";
import { useTheme } from "@/theme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableHighlight, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksIndex() {
  const { theme } = useTheme();

  const [activeCategory, setActiveCategory] = useState("All");

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
    <SafeAreaView
      className="flex-1 p-2"
      style={{
        backgroundColor: theme.background,
        flex: 1,
        paddingBottom: 16,
      }}
      edges={["bottom", "top"]}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginTop: 4,
          alignItems: "center",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16,
            alignItems: "center",
            paddingTop: 2,
          }}
        >
          {categories.map((category, index) => (
            <CategoryPill
              category={category}
              key={index}
              onPress={() => setActiveCategory(category)}
              isActive={category == activeCategory}
            />
          ))}
        </ScrollView>

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
              onSelect={() => alert(`Manage Categories`)}
              style={menuOptionStyles}
              customStyles={menuOptionCustomStyles}
            >
              <Text style={{ color: theme.primaryText }}>
                Manage Categories
              </Text>
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
      </View>

      <DraggableFlatlist />
      <TasksCreationBottomSheet />
    </SafeAreaView>
  );
}

const menuOptionStyles = {
  marginVertical: 4,
  paddingHorizontal: 14,
};
