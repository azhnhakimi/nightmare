import { useTheme } from "@/theme/useTheme";
import Entypo from "@expo/vector-icons/Entypo";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUTTON_SIZE = 60;
const ABSOLUTE_INSETS = 30;

export const BOTTOM_SHEET_BUTTON_RESERVED_SPACE =
  BUTTON_SIZE + ABSOLUTE_INSETS + 20;

export default function TasksCreationBottomSheet() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const handleBackdropPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      const { animatedIndex, style } = props;

      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          animatedIndex.value,
          [-1, 0],
          [0, 0.6],
          Extrapolation.CLAMP,
        ),
      }));

      const containerStyle = useMemo(
        () => [style, { backgroundColor: "#000000" }, containerAnimatedStyle],
        [style, containerAnimatedStyle],
      );

      return (
        <Animated.View
          style={containerStyle}
          onTouchEnd={handleBackdropPress}
        />
      );
    },
    [handleBackdropPress],
  );

  return (
    <>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme.accent,
            bottom: ABSOLUTE_INSETS + insets.bottom,
          },
        ]}
        onPress={handlePresentModalPress}
      >
        <Entypo name="plus" size={28} color={theme.onAccent} />
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["80%"]}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        handleIndicatorStyle={{
          backgroundColor: theme.primaryText,
        }}
        backgroundStyle={{
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    height: "100%",
  },
  button: {
    borderRadius: 9999,
    aspectRatio: 1,
    width: BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: ABSOLUTE_INSETS,
  },
});
