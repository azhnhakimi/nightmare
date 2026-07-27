import { useTheme } from "@/theme/useTheme";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  isModalVisible: boolean;
  onClose: () => void;
  onModalHide: () => void;
};

const ANIMATION_DURATION = 250;

export default function CalendarPickerModal({
  isModalVisible,
  onClose,
  onModalHide,
}: Props) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const progress = useSharedValue(0);

  const finishClosing = useCallback(() => {
    setIsMounted(false);
    onModalHide();
  }, [onModalHide]);

  useEffect(() => {
    if (isModalVisible) {
      setIsMounted(true);
      progress.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else if (isMounted) {
      progress.value = withTiming(
        0,
        {
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(finishClosing)();
          }
        },
      );
    }
  }, [isModalVisible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const dialogAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * screenHeight }],
  }));

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayDateString = formatDateString(today);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateString = formatDateString(tomorrow);

  const [selectedDate, setSelectedDate] = useState("");

  const markedDates = {
    [todayDateString]: {
      marked: true,
      dotColor: theme.primaryText,
    },
    ...(selectedDate && {
      [selectedDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: theme.accent,
        selectedTextColor: theme.onAccent,
        marked: false,
      },
    }),
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "#000000AA" },
          backdropAnimatedStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        <View style={styles.centerWrapper} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.dialog,
              { backgroundColor: theme.surface },
              dialogAnimatedStyle,
            ]}
          >
            <View style={{}}>
              <Calendar
                current={todayDateString}
                style={{
                  backgroundColor: theme.surface,
                  padding: 10,
                }}
                markingType="dot"
                theme={{
                  arrowColor: theme.accent,
                  calendarBackground: theme.surface,
                  backgroundColor: theme.surface,
                  monthTextColor: theme.primaryText,
                  dayTextColor: theme.primaryText,
                  textDisabledColor: theme.mutedText,
                  todayTextColor: theme.primaryText,
                  selectedDayBackgroundColor: theme.accent,
                  selectedDayTextColor: theme.onAccent,
                  todayDotColor: theme.primaryText,
                }}
                showSixWeeks={true}
                onDayPress={(day) => {
                  console.log("selected day", day);
                  setSelectedDate(day.dateString);
                }}
                markedDates={markedDates}
              />

              <View
                style={{
                  height: 35,
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedDate(todayDateString)}
                  style={[
                    styles.templateBtn,
                    {
                      backgroundColor:
                        selectedDate === todayDateString
                          ? theme.accent
                          : theme.accent + "44",
                    },
                  ]}
                >
                  <Text style={{ color: theme.onAccent }}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedDate(tomorrowDateString)}
                  style={[
                    styles.templateBtn,
                    {
                      backgroundColor:
                        selectedDate === tomorrowDateString
                          ? theme.accent
                          : theme.accent + "44",
                    },
                  ]}
                >
                  <Text style={{ color: theme.onAccent }}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedDate("")}
                  style={[
                    styles.templateBtn,
                    {
                      backgroundColor:
                        selectedDate === ""
                          ? theme.accent
                          : theme.accent + "44",
                    },
                  ]}
                >
                  <Text style={{ color: theme.onAccent }}>No Date</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 14,
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <Pressable onPress={onClose}>
                <Text
                  style={{ color: theme.primaryText + "88", fontWeight: "500" }}
                >
                  CANCEL
                </Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text style={{ color: theme.primaryText, fontWeight: "600" }}>
                  DONE
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: screenWidth * 0.85,
    maxHeight: screenHeight,
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  templateBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
