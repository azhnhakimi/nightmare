import CalendarPickerModal from "@/components/ui/CalendarPickerModal";
import { createEvent } from "@/lib/events";
import { useTheme } from "@/theme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { ComponentRef, useCallback, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EventsIndex() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const route = useRouter();
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const titleInputRef = useRef<ComponentRef<typeof BottomSheetTextInput>>(null);
  const descriptionInputRef =
    useRef<ComponentRef<typeof BottomSheetTextInput>>(null);
  const locationInputRef =
    useRef<ComponentRef<typeof BottomSheetTextInput>>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
      //   titleInputRef.current?.focus();
    }, 300);
  }, []);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartTimeChange = (
    event: DateTimePickerEvent,
    selected?: Date,
  ) => {
    setShowStartPicker(false);
    if (event.type === "set" && selected) setStartTime(selected);
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowEndPicker(false);
    if (event.type === "set" && selected) setEndTime(selected);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const combineDateAndTime = (dateStr: string, time: Date) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, time.getHours(), time.getMinutes());
  };

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;

    const startAt = combineDateAndTime(date, startTime);
    const endAt = combineDateAndTime(date, endTime);

    if (endAt <= startAt) {
      setError("End time must be after start time");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createEvent({
        uid: Crypto.randomUUID(),
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      });

      bottomSheetModalRef.current?.dismiss();
      setTitle("");
      setDescription("");
      setLocation("");
      setDate(new Date().toISOString().slice(0, 10));
      setStartTime(new Date());
      setEndTime(new Date());
    } catch (err) {
      setError("Couldn't save the event. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView
      className="flex-1 p-2"
      style={styles.container}
      edges={["bottom", "top"]}
    >
      <Pressable
        style={styles.button}
        onPress={() => route.navigate("/(drawer)/calendar/import")}
      >
        <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
          Import ICS
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handlePresentModalPress}>
        <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
          Create an event
        </Text>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["95%"]}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: theme.surface,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.primaryText }}
        keyboardBlurBehavior="restore"
        keyboardBehavior="extend"
      >
        <BottomSheetView style={styles.sheetContainer}>
          {error && (
            <Text style={{ color: "red", textAlign: "left", marginBottom: 8 }}>
              {error}
            </Text>
          )}

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.textInputHeader}>Title</Text>
            <BottomSheetTextInput
              ref={titleInputRef}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter your title..."
              style={[
                styles.textInputField,
                { backgroundColor: theme.background, color: theme.primaryText },
              ]}
              placeholderTextColor={theme.mutedText}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.textInputHeader}>Description</Text>
            <BottomSheetTextInput
              ref={descriptionInputRef}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter your description..."
              style={[
                styles.textInputField,
                {
                  backgroundColor: theme.background,
                  color: theme.primaryText,
                  height: 90,
                  textAlignVertical: "top",
                },
              ]}
              placeholderTextColor={theme.mutedText}
              multiline
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.textInputHeader}>Location</Text>
            <BottomSheetTextInput
              ref={locationInputRef}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter the location..."
              style={[
                styles.textInputField,
                { backgroundColor: theme.background, color: theme.primaryText },
              ]}
              placeholderTextColor={theme.mutedText}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={openCalendarPicker}
              style={styles.timePickerBtn}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color={theme.primaryText}
                />
                <Text style={{ color: theme.primaryText, fontWeight: "300" }}>
                  Date
                </Text>
              </View>
              <Text style={{ color: theme.mutedText, fontWeight: "500" }}>
                {date.split("-").reverse().join("/")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={styles.timePickerBtn}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={theme.primaryText}
                />
                <Text style={{ color: theme.primaryText, fontWeight: "300" }}>
                  Start time
                </Text>
              </View>
              <Text style={{ color: theme.mutedText, fontWeight: "500" }}>
                {startTime.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowEndPicker(true)}
              style={styles.timePickerBtn}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={theme.primaryText}
                />
                <Text style={{ color: theme.primaryText, fontWeight: "300" }}>
                  End time
                </Text>
              </View>
              <Text style={{ color: theme.mutedText, fontWeight: "500" }}>
                {endTime.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>

            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                onChange={handleStartTimeChange}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                onChange={handleEndTimeChange}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { marginBottom: insets.bottom + 12 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={{ color: theme.onAccent }}>
              {isSubmitting ? "Creating..." : "Create"}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      <CalendarPickerModal
        isModalVisible={calendarModalVisible}
        onClose={closeCalendarPicker}
        onModalHide={handleCalendarModalHide}
        dueDate={date}
        setDueDate={setDate}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 16,
      gap: 4,
    },
    button: {
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 6,
    },
    sheetContainer: {
      flex: 1,
      height: "100%",
      paddingHorizontal: 18,
    },
    textInputHeader: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 4,
    },
    textInputField: {
      width: "100%",
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 60,
    },
    timePickerBtn: {
      gap: 4,
      flex: 1,
      backgroundColor: theme.background,
      padding: 8,
      borderRadius: 8,
    },
    submitBtn: {
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      padding: 9,
      borderRadius: 8,
      marginTop: "auto",
    },
  });
