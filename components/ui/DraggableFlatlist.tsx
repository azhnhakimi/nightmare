import SwipeableItem from "@/components/ui/SwipeableItem";
import { useTheme } from "@/theme/useTheme";
import Feather from "@expo/vector-icons/Feather";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import DraggableFlatList from "react-native-draggable-flatlist";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSwipeableItemParams } from "react-native-swipeable-item";

const NUM_ITEMS = 20;

type Item = {
  id: number;
  key: string;
  label: string;
  completed: boolean;
};

const keyExtractor = (item: Item, index: number) => `${item.id}_${index}`;

const initialData: Item[] = [...Array(NUM_ITEMS)].map((_, index) => ({
  id: index,
  key: `item-${index}`,
  label: `item-${index}`,
  completed: false,
}));

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RowContent({
  item,
  drag,
  isActive,
}: {
  item: Item;
  drag: () => void;
  isActive: boolean;
}) {
  const { theme } = useTheme();
  const { percentOpenLeft, percentOpenRight } = useSwipeableItemParams<Item>();

  const animatedStyle = useAnimatedStyle(() => {
    const isOpening = percentOpenLeft.value > 0 || percentOpenRight.value > 0;
    return {
      borderRadius: withTiming(isOpening ? 0 : 8, { duration: 100 }),
    };
  });

  return (
    <AnimatedPressable
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
      {item.completed ? (
        <Feather name="check-circle" size={16} color="#4BB543" />
      ) : (
        <Feather name="circle" size={16} color={theme.accent} />
      )}
      <Text
        style={[
          styles.text,
          { color: theme.primaryText },
          item.completed && styles.completedText,
        ]}
      >
        {item.label}
      </Text>
    </AnimatedPressable>
  );
}

export default function DraggableFlatlist() {
  const [data, setData] = useState(initialData);

  const toggleComplete = useCallback((id: number) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, completed: !row.completed } : row,
      ),
    );
    // TODO: hook up DB call here, e.g. updateTaskCompletion(id)
  }, []);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
    <SwipeableItem
      item={item}
      onDelete={() => console.log("delete")}
      onComplete={() => toggleComplete(item.id)}
    >
      <RowContent item={item} drag={drag} isActive={isActive} />
    </SwipeableItem>
  );

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      containerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 16,
        height: "100%",
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
});
