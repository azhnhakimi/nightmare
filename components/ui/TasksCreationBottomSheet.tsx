import { useTheme } from "@/theme/useTheme";
import Entypo from "@expo/vector-icons/Entypo";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarPickerModal from "./CalendarPickerModal";
import CalendarPickerTrigger from "./CalendarPickerTrigger";
import CategoriesPopupMenu from "./CategoriesPopupMenu";

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

  const wantsCalendarOpenRef = useRef(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const openCalendarPicker = useCallback(() => {
    wantsCalendarOpenRef.current = true;
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetDismiss = useCallback(() => {
    if (wantsCalendarOpenRef.current) {
      setCalendarModalVisible(true);
    }
  }, []);

  const closeCalendarPicker = useCallback(() => {
    setCalendarModalVisible(false);
  }, []);

  const handleCalendarModalHide = useCallback(() => {
    wantsCalendarOpenRef.current = false;
    bottomSheetModalRef.current?.present();
  }, []);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("All");

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
        onDismiss={handleSheetDismiss}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Type something..."
            style={[
              styles.textInputField,
              { backgroundColor: theme.surface, color: theme.primaryText },
            ]}
            placeholderTextColor={theme.primaryText}
          />

          <View
            style={{
              flexDirection: "row",
              marginVertical: 22,
              justifyContent: "flex-start",
              width: "100%",
              gap: 14,
              alignItems: "center",
            }}
          >
            <CategoriesPopupMenu
              activeCategory={category}
              setActiveCategory={setCategory}
            />
            <CalendarPickerTrigger onOpen={openCalendarPicker} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <CalendarPickerModal
        isModalVisible={calendarModalVisible}
        onClose={closeCalendarPicker}
        onModalHide={handleCalendarModalHide}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 18,
    paddingTop: 8,
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
  textInputField: {
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 60,
  },
});
