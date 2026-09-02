import CalendarPickerModal from "@/components/ui/CalendarPickerModal";
import { createEvent, updateEvent } from "@/lib/events";
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
import {
  ComponentRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type EventPrefill = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string;
};

export type EventSheetHandle = {
  present: (prefill?: EventPrefill) => void;
};

type Props = {
  onSaved?: () => void;
};

const EventCreationBottomSheet = forwardRef<EventSheetHandle, Props>(
  ({ onSaved }, ref) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const insets = useSafeAreaInsets();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const titleInputRef =
      useRef<ComponentRef<typeof BottomSheetTextInput>>(null);
    const descriptionInputRef =
      useRef<ComponentRef<typeof BottomSheetTextInput>>(null);
    const locationInputRef =
      useRef<ComponentRef<typeof BottomSheetTextInput>>(null);

    // const handlePresentModalPress = useCallback(() => {
    //   bottomSheetModalRef.current?.present();
    // }, []);

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

    const handleEndTimeChange = (
      event: DateTimePickerEvent,
      selected?: Date,
    ) => {
      setShowEndPicker(false);
      if (event.type === "set" && selected) setEndTime(selected);
    };

    const formatDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(formatDateString(new Date()));
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const combineDateAndTime = (dateStr: string, time: Date) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day, time.getHours(), time.getMinutes());
    };

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      present: (prefill) => {
        if (prefill) {
          setEditingId(prefill.id);
          setTitle(prefill.title);
          setDescription(prefill.description ?? "");
          setLocation(prefill.location ?? "");
          const start = new Date(prefill.start_at);
          const end = new Date(prefill.end_at);
          setDate(formatDateString(start));
          setStartTime(start);
          setEndTime(end);
        } else {
          setEditingId(null);
        }
        bottomSheetModalRef.current?.present();
      },
    }));

    const resetForm = useCallback(() => {
      setTitle("");
      setDescription("");
      setLocation("");
      setDate(formatDateString(new Date()));
      setStartTime(new Date());
      setEndTime(new Date());
      setEditingId(null);
    }, []);

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

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      };

      try {
        if (editingId) {
          await updateEvent(editingId, payload);
        } else {
          await createEvent({ uid: Crypto.randomUUID(), ...payload });
        }

        onSaved?.();
        bottomSheetModalRef.current?.dismiss();
      } catch (err) {
        setError("Couldn't save the event. Try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <>
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
          onDismiss={resetForm}
        >
          <BottomSheetView style={styles.sheetContainer}>
            {error && (
              <Text
                style={{ color: "red", textAlign: "left", marginBottom: 8 }}
              >
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
                  {
                    backgroundColor: theme.background,
                    color: theme.primaryText,
                  },
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
                  {
                    backgroundColor: theme.background,
                    color: theme.primaryText,
                  },
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
                {isSubmitting ? "Saving..." : editingId ? "Save" : "Create"}
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
      </>
    );
  },
);

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

export default EventCreationBottomSheet;
