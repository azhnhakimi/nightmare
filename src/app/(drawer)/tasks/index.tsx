import CategoriesCarousel from "@/components/ui/CategoriesCarousel";
import DraggableFlatlist from "@/components/ui/DraggableFlatlist";
import TasksCreationBottomSheet from "@/components/ui/TasksCreationBottomSheet";
import TasksListMenu from "@/components/ui/TasksListMenu";
import { useTheme } from "@/theme/useTheme";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksIndex() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <SafeAreaView
      className="flex-1 p-2"
      style={styles.container}
      edges={["bottom", "top"]}
    >
      <View style={styles.headerContainer}>
        <CategoriesCarousel
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <TasksListMenu />
      </View>

      <DraggableFlatlist />
      <TasksCreationBottomSheet />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 4,
      backgroundColor: theme.background,
      paddingBottom: 16,
    },
    headerContainer: {
      flexDirection: "row",
      width: "100%",
      marginTop: 4,
      alignItems: "center",
    },
  });
