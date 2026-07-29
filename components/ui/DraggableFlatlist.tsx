import SwipeableItem from "@/components/ui/SwipeableItem";
import { BOTTOM_SHEET_BUTTON_RESERVED_SPACE } from "@/components/ui/TasksCreationBottomSheet";
import { useTasks } from "@/hooks/useTasks";
import { deleteTask, Task, updateTaskCompletion } from "@/lib/tasks";
import { useTheme } from "@/theme/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import DraggableFlatList from "react-native-draggable-flatlist";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSwipeableItemParams } from "react-native-swipeable-item";

const keyExtractor = (item: Task) => item.id;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RowContent({
  item,
  drag,
  isActive,
  onPress,
}: {
  item: Task;
  drag: () => void;
  isActive: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const { percentOpenLeft, percentOpenRight } = useSwipeableItemParams<Task>();

  const animatedStyle = useAnimatedStyle(() => {
    const isOpening = percentOpenLeft.value > 0 || percentOpenRight.value > 0;
    return {
      borderRadius: withTiming(isOpening ? 0 : 8, { duration: 100 }),
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={drag}
      disabled={isActive}
      style={[
        styles.rowItem,
        animatedStyle,
        {
          backgroundColor: theme.surface,
          opacity: isActive ? 0.8 : 1,
        },
      ]}
    >
      {item.is_complete ? (
        <Feather name="check-circle" size={16} color="#4BB543" />
      ) : (
        <Feather name="circle" size={16} color={theme.accent} />
      )}
      <Text
        style={[
          styles.text,
          { color: theme.primaryText },
          item.is_complete && styles.completedText,
        ]}
      >
        {item.title}
      </Text>
    </AnimatedPressable>
  );
}

export default function DraggableFlatlist() {
  const insets = useSafeAreaInsets();
  const { tasks, setTasks, isLoading, error, refetch } = useTasks();

  const toggleComplete = useCallback(
    async (id: string) => {
      const prevTasks = tasks;
      const target = tasks.find((t) => t.id === id);
      if (!target) return;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_complete: !t.is_complete } : t,
        ),
      );

      try {
        await updateTaskCompletion(id, !target.is_complete);
      } catch (err) {
        console.error("Failed to update task:", err);
        setTasks(prevTasks);
      }
    },
    [tasks, setTasks],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const prevTasks = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        await deleteTask(id);
      } catch (err) {
        console.error("Failed to delete task:", err);
        setTasks(prevTasks);
      }
    },
    [tasks, setTasks],
  );

  const handlePress = useCallback((id: string) => {
    router.push({ pathname: "/task-details", params: { id } });
  }, []);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <SwipeableItem
      item={item}
      onDelete={() => handleDelete(item.id)}
      onComplete={() => toggleComplete(item.id)}
    >
      <RowContent
        item={item}
        drag={drag}
        isActive={isActive}
        onPress={() => handlePress(item.id)}
      />
    </SwipeableItem>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <DraggableFlatList
      data={tasks}
      onDragEnd={({ data }) => setTasks(data)}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      containerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 28,
      }}
      contentContainerStyle={{
        paddingBottom: BOTTOM_SHEET_BUTTON_RESERVED_SPACE + insets.bottom,
      }}
      removeClippedSubviews={false}
      dragItemOverflow
      activationDistance={20}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 3,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
