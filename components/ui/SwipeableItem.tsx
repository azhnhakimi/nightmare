import { useTheme } from "@/theme/useTheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { ReactNode, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SwipeableItemLib, {
  OpenDirection,
  SwipeableItemImperativeRef,
} from "react-native-swipeable-item";

const ICON_SIZE = 18;
const BUTTON_WIDTH = 70;
const NUM_BUTTONS = 3;

type Props<T extends { is_complete: boolean }> = {
  item: T;
  children: ReactNode;
  onChange?: (openDirection: OpenDirection) => void;
  onDelete?: () => void;
  onComplete?: () => void;
};

export default function SwipeableItem<T extends { is_complete: boolean }>({
  item,
  children,
  onChange,
  onDelete,
  onComplete,
}: Props<T>) {
  const { theme } = useTheme();
  const itemRef = useRef<SwipeableItemImperativeRef>(null);

  return (
    <SwipeableItemLib
      ref={itemRef}
      item={item}
      swipeDamping={40}
      snapPointsLeft={[BUTTON_WIDTH * NUM_BUTTONS]}
      snapPointsRight={[75]}
      renderUnderlayLeft={() => (
        <View
          style={[
            styles.underlay,
            styles.left,
            { backgroundColor: theme.background },
          ]}
        >
          <Pressable
            style={[
              styles.button,
              { width: BUTTON_WIDTH, backgroundColor: "#FFBF00" },
            ]}
          >
            <AntDesign name="star" size={ICON_SIZE} color="black" />
            <Text style={[styles.buttonText, { color: "black" }]}>Star</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { width: BUTTON_WIDTH, backgroundColor: "#969696" },
            ]}
          >
            <AntDesign name="calendar" size={ICON_SIZE} color="white" />
            <Text style={styles.buttonText}>Date</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              {
                width: BUTTON_WIDTH,
                backgroundColor: "#FF5C5C",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            ]}
          >
            <FontAwesome5 name="trash" size={ICON_SIZE} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      )}
      renderUnderlayRight={() => (
        <View
          style={[
            styles.underlay,
            styles.right,
            {
              backgroundColor: item.is_complete ? "#969696" : "#4CAF50",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            },
          ]}
        >
          {item.is_complete ? (
            <AntDesign name="close-circle" size={ICON_SIZE + 6} color="white" />
          ) : (
            <AntDesign name="check-circle" size={ICON_SIZE + 6} color="white" />
          )}
        </View>
      )}
      onChange={({ openDirection }) => {
        onChange?.(openDirection);
        if (openDirection === OpenDirection.RIGHT) {
          onComplete?.();
          itemRef.current?.close();
        }
      }}
    >
      {children}
    </SwipeableItemLib>
  );
}

const styles = StyleSheet.create({
  underlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    marginVertical: 3,
    flexDirection: "row",
  },
  left: {
    justifyContent: "flex-end",
  },
  right: {
    justifyContent: "flex-start",
    paddingLeft: 24,
  },
  button: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 3,
  },
  buttonText: {
    fontSize: 8,
    color: "white",
  },
});
