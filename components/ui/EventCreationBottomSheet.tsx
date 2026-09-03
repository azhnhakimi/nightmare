import CalendarPickerModal from "@/components/ui/CalendarPickerModal";
import { createEvent, updateEvent } from "@/lib/events";
import { buildRRuleString } from "@/lib/recurrence";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
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
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RecurrenceFrequencyPopupMenu from "./RecurrenceFrequencyPopupMenu";
import RecurrenceIntervalPopupMenu from "./RecurrenceIntervalPopupMenu";

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
    const nTimesAmountInputRef =
      useRef<ComponentRef<typeof BottomSheetTextInput>>(null);

    // const handlePresentModalPress = useCallback(() => {
    //   bottomSheetModalRef.current?.present();
    // }, []);

    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [endDateModalVisible, setEndDateModalVisible] = useState(false);

    const openCalendarPicker = useCallback(() => {
      Keyboard.dismiss();
      setCalendarModalVisible(true);
    }, []);

    const openEndDatePicker = useCallback(() => {
      Keyboard.dismiss();
      setEndDateModalVisible(true);
    }, []);

    const closeCalendarPicker = useCallback(() => {
      setCalendarModalVisible(false);
    }, []);

    const closeEndDatePicker = useCallback(() => {
      setEndDateModalVisible(false);
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

    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState("Daily");
    const [interval, setInterval] = useState(1);
    const [endRecurrenceOption, setEndRecurrenceOption] = useState("times");
    const [nTimesAmount, setNTimesAmount] = useState("");
    const [endDate, setEndDate] = useState(formatDateString(new Date()));

    const frequencyUnit = {
      Daily: "day",
      Weekly: "week",
      Monthly: "month",
    }[frequency];

    const recurrenceText = `*This event occurs every ${interval} ${frequencyUnit}${
      interval !== 1 ? "s" : ""
    }.`;

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
      setIsRecurring(false);
      setFrequency("Daily");
      setInterval(1);
      setEndRecurrenceOption("times");
      setNTimesAmount("");
      setEndDate(formatDateString(new Date()));
      setError(null);
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
        rrule: buildRRuleString({
          isRecurring,
          frequency,
          interval,
          endRecurrenceOption,
          nTimesAmount,
          endDate,
          startAt: startAt.toISOString(),
        }),
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

    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.95], [SCREEN_HEIGHT]);

    return (
      <>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          backgroundStyle={{ backgroundColor: theme.surface }}
          handleIndicatorStyle={{ backgroundColor: theme.primaryText }}
          keyboardBlurBehavior="restore"
          keyboardBehavior="interactive"
          onDismiss={resetForm}
          android_keyboardInputMode="adjustResize"
        >
          <View style={styles.sheetContainer}>
            <BottomSheetScrollView
              contentContainerStyle={styles.formContainer}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="calendar-clear-outline"
                      size={18}
                      color={theme.primaryText}
                    />
                    <Text
                      style={{ color: theme.primaryText, fontWeight: "300" }}
                    >
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.primaryText}
                    />
                    <Text
                      style={{ color: theme.primaryText, fontWeight: "300" }}
                    >
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={theme.primaryText}
                    />
                    <Text
                      style={{ color: theme.primaryText, fontWeight: "300" }}
                    >
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

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <Text style={styles.textInputHeader}>Recurring</Text>
                <Checkbox
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  color={theme.accent}
                />
              </View>

              {isRecurring && (
                <View style={{ marginTop: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ gap: 6, flex: 1, alignItems: "center" }}>
                      <Text
                        style={{ color: theme.mutedText, fontWeight: "300" }}
                      >
                        Frequency
                      </Text>
                      <RecurrenceFrequencyPopupMenu
                        activeFrequency={frequency}
                        setActiveFrequency={setFrequency}
                      />
                    </View>

                    <View style={{ gap: 6, flex: 1, alignItems: "center" }}>
                      <Text
                        style={{ color: theme.mutedText, fontWeight: "300" }}
                      >
                        Interval
                      </Text>
                      <RecurrenceIntervalPopupMenu
                        activeInterval={interval}
                        setActiveInterval={setInterval}
                        activeFrequency={frequency}
                      />
                    </View>
                  </View>

                  <Text
                    style={{
                      color: theme.mutedText,
                      fontWeight: "300",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginTop: 10,
                    }}
                  >
                    {recurrenceText}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 22,
                      backgroundColor: theme.background,
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Pressable
                      style={[
                        styles.endRecurrenceBtnToggle,
                        {
                          backgroundColor:
                            endRecurrenceOption === "times"
                              ? theme.accent
                              : "transparent",
                        },
                      ]}
                      onPress={() => setEndRecurrenceOption("times")}
                    >
                      <Text
                        style={{
                          color:
                            endRecurrenceOption === "times"
                              ? theme.onAccent
                              : theme.primaryText,
                        }}
                      >
                        Repeat N times
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.endRecurrenceBtnToggle,
                        {
                          backgroundColor:
                            endRecurrenceOption === "until"
                              ? theme.accent
                              : "transparent",
                        },
                      ]}
                      onPress={() => setEndRecurrenceOption("until")}
                    >
                      <Text
                        style={{
                          color:
                            endRecurrenceOption === "until"
                              ? theme.onAccent
                              : theme.primaryText,
                        }}
                      >
                        Repeat until
                      </Text>
                    </Pressable>
                  </View>

                  <View style={{}}>
                    {endRecurrenceOption === "times" && (
                      <View style={{ marginTop: 8 }}>
                        <Text
                          style={{
                            color: theme.mutedText,
                            fontWeight: "300",
                            marginBottom: 2,
                          }}
                        >
                          Enter numerical amount
                        </Text>
                        <BottomSheetTextInput
                          ref={nTimesAmountInputRef}
                          value={nTimesAmount}
                          onChangeText={setNTimesAmount}
                          placeholder="Enter number of occurences..."
                          style={[
                            styles.textInputField,
                            {
                              backgroundColor: theme.background,
                              color: theme.primaryText,
                            },
                          ]}
                          placeholderTextColor={theme.mutedText}
                          keyboardType="number-pad"
                        />
                      </View>
                    )}

                    {endRecurrenceOption === "until" && (
                      <View
                        style={{
                          marginTop: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.mutedText,
                            fontWeight: "300",
                            marginBottom: 2,
                          }}
                        >
                          Select a valid end date
                        </Text>
                        <Pressable
                          onPress={openEndDatePicker}
                          style={{
                            backgroundColor: theme.background,
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Ionicons
                              name="calendar-clear-outline"
                              size={18}
                              color={theme.primaryText}
                            />
                            <Text
                              style={{
                                color: theme.primaryText,
                                fontWeight: "300",
                              }}
                            >
                              End date
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: theme.mutedText,
                              fontWeight: "500",
                            }}
                          >
                            {endDate.split("-").reverse().join("/")}
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </BottomSheetScrollView>

            <TouchableOpacity
              style={[styles.submitBtn, { marginBottom: insets.bottom + 12 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={{ color: theme.onAccent }}>
                {isSubmitting ? "Saving..." : editingId ? "Save" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>

        <CalendarPickerModal
          isModalVisible={calendarModalVisible}
          onClose={closeCalendarPicker}
          onModalHide={handleCalendarModalHide}
          dueDate={date}
          setDueDate={setDate}
        />

        <CalendarPickerModal
          isModalVisible={endDateModalVisible}
          onClose={closeEndDatePicker}
          onModalHide={handleCalendarModalHide}
          dueDate={endDate}
          setDueDate={setEndDate}
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
      paddingHorizontal: 18,
    },
    formContainer: {
      paddingBottom: 30,
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
      marginHorizontal: 18,
    },
    endRecurrenceBtnToggle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 8,
    },
  });

export default EventCreationBottomSheet;
