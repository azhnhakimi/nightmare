import { createTask } from "@/lib/tasks";
import { useTheme } from "@/theme/useTheme";
import Entypo from "@expo/vector-icons/Entypo";
import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  ComponentRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddSubtaskBtn from "./AddSubtaskBtn";
import CalendarPickerModal from "./CalendarPickerModal";
import CalendarPickerTrigger from "./CalendarPickerTrigger";
import CategoriesPopupMenu from "./CategoriesPopupMenu";
import SubtasksInput from "./SubtasksInput";
import TaskCreationSubmitBtn from "./TaskCreationSubmitBtn";

type Subtask = {
  id: string;
  title: string;
};

type SubtaskInputRef = ComponentRef<typeof BottomSheetTextInput> | null;
type SubtaskInputRefMap = Record<string, SubtaskInputRef>;

const BUTTON_SIZE = 60;
const ABSOLUTE_INSETS = 30;
const SUBTASK_ROW_HEIGHT = 56;
const MAX_VISIBLE_SUBTASKS = 4;
const SHEET_ANIMATION_DURATION = 150;
const CONTENT_PADDING_TOP = 8;
const TITLE_INPUT_HEIGHT = 60;
const BUTTON_ROW_MARGIN_VERTICAL = 22;
const BUTTON_ROW_HEIGHT_FALLBACK = 60;
const HANDLE_AREA_HEIGHT = 24;

export const BOTTOM_SHEET_BUTTON_RESERVED_SPACE =
  BUTTON_SIZE + ABSOLUTE_INSETS + 20;

export default function TasksCreationBottomSheet() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const backdropOpacity = useSharedValue(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const titleInputRef = useRef<ComponentRef<typeof BottomSheetTextInput>>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      backdropOpacity.value = withTiming(index >= 0 ? 0.6 : 0, {
        duration: 200,
      });

      if (index === 0) {
        setTimeout(() => {
          titleInputRef.current?.focus();
        });
      }
    },
    [backdropOpacity],
  );

  const handleBackdropPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      const { style } = props;

      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
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
    [handleBackdropPress, backdropOpacity],
  );

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const openCalendarPicker = useCallback(() => {
    Keyboard.dismiss();
    setCalendarModalVisible(true);
  }, []);

  const closeCalendarPicker = useCallback(() => {
    setCalendarModalVisible(false);
  }, []);

  const handleCalendarModalHide = useCallback(() => {
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
  }, []);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("All");
  const [dueDate, setDueDate] = useState("");

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const subtaskInputRefs = useRef<SubtaskInputRefMap>({});
  const previousSubtaskCountRef = useRef(0);

  const addSubtask = useCallback(() => {
    setSubtasks((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, title: "" },
    ]);
  }, []);

  const updateSubtaskTitle = useCallback((id: string, title: string) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }, []);

  useEffect(() => {
    if (subtasks.length > previousSubtaskCountRef.current) {
      const newest = subtasks[subtasks.length - 1];
      requestAnimationFrame(() => {
        subtaskInputRefs.current[newest.id]?.focus();
      });
    }
    previousSubtaskCountRef.current = subtasks.length;
  }, [subtasks]);

  const removeSubtask = useCallback((id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
    delete subtaskInputRefs.current[id];
  }, []);

  const resetForm = useCallback(() => {
    setTitle("");
    setCategory("All");
    setDueDate("");
    setSubtasks([]);
    subtaskInputRefs.current = {};
    previousSubtaskCountRef.current = 0;
  }, []);

  const [buttonRowHeight, setButtonRowHeight] = useState(
    BUTTON_ROW_HEIGHT_FALLBACK,
  );

  const handleButtonRowLayout = useCallback((e: LayoutChangeEvent) => {
    const measuredHeight = e.nativeEvent.layout.height;
    setButtonRowHeight((prev) =>
      Math.abs(prev - measuredHeight) > 0.5 ? measuredHeight : prev,
    );
  }, []);

  const visibleSubtaskCount = Math.min(subtasks.length, MAX_VISIBLE_SUBTASKS);
  const subtasksHeight = visibleSubtaskCount * SUBTASK_ROW_HEIGHT;

  const sheetHeight = useMemo(
    () =>
      HANDLE_AREA_HEIGHT +
      CONTENT_PADDING_TOP +
      TITLE_INPUT_HEIGHT +
      subtasksHeight +
      buttonRowHeight +
      BUTTON_ROW_MARGIN_VERTICAL * 2 +
      insets.bottom,
    [subtasksHeight, buttonRowHeight, insets.bottom],
  );

  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createTask({ title, category, dueDate, subtasks });
      bottomSheetModalRef.current?.dismiss();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, category, dueDate, subtasks, isSubmitting]);

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
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: theme.primaryText }}
        backgroundStyle={{
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        }}
        onDismiss={resetForm}
        keyboardBlurBehavior="restore"
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <BottomSheetTextInput
            ref={titleInputRef}
            value={title}
            onChangeText={setTitle}
            placeholder="Type something..."
            style={[
              styles.textInputField,
              { backgroundColor: theme.surface, color: theme.primaryText },
            ]}
            placeholderTextColor={theme.mutedText}
          />

          {subtasks.length > 0 && (
            <BottomSheetScrollView
              style={{
                maxHeight: subtasksHeight,
                width: "100%",
              }}
              showsVerticalScrollIndicator={false}
            >
              {subtasks.map((subtask) => (
                <SubtasksInput
                  key={subtask.id}
                  ref={(el) => {
                    subtaskInputRefs.current[subtask.id] = el;
                  }}
                  value={subtask.title}
                  onChangeText={(text) => updateSubtaskTitle(subtask.id, text)}
                  onRemove={() => removeSubtask(subtask.id)}
                />
              ))}
            </BottomSheetScrollView>
          )}

          <View
            onLayout={handleButtonRowLayout}
            style={{
              marginVertical: BUTTON_ROW_MARGIN_VERTICAL,
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 4,
                alignItems: "center",
              }}
            >
              <CategoriesPopupMenu
                activeCategory={category}
                setActiveCategory={setCategory}
              />
              <CalendarPickerTrigger
                onOpen={openCalendarPicker}
                day={dueDate}
              />
              <AddSubtaskBtn onPress={addSubtask} />
            </View>
            <TaskCreationSubmitBtn
              onPress={() => handleSubmit()}
              isSubmitting={isSubmitting}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <CalendarPickerModal
        isModalVisible={calendarModalVisible}
        onClose={closeCalendarPicker}
        onModalHide={handleCalendarModalHide}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
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
