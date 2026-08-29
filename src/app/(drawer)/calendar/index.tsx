import { CalendarItem, fetchCalendarItems } from "@/lib/calendarItems";
import { useTheme } from "@/theme/useTheme";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CalendarIndex() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const today = new Date();
  const todayDateString = formatDateString(today);

  const [items, setItems] = useState<CalendarItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDateString);

  useFocusEffect(
    useCallback(() => {
      fetchCalendarItems().then(setItems);
    }, []),
  );

  const itemsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const item of items) {
      const key = formatDateString(new Date(item.date));
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return map;
  }, [items]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {
      [todayDateString]: { marked: true, dotColor: theme.primaryText },
    };

    for (const dateKey of Object.keys(itemsByDate)) {
      marks[dateKey] = {
        ...marks[dateKey],
        marked: true,
        dotColor: theme.accent,
      };
    }

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: theme.accent,
      selectedTextColor: theme.onAccent,
    };

    return marks;
  }, [itemsByDate, selectedDate, theme]);

  return (
    <SafeAreaView
      className="flex-1 p-2"
      style={styles.container}
      edges={["bottom", "top"]}
    >
      <Link
        href={"/(drawer)/calendar/import"}
        style={{
          alignSelf: "flex-end",
          backgroundColor: theme.accent,
          color: theme.onAccent,
          paddingHorizontal: 16,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        Import
      </Link>

      <View style={{ flex: 1 }}>
        <Calendar
          key={theme.background + theme.primaryText}
          current={todayDateString}
          markingType="dot"
          onDayPress={(day) => setSelectedDate(day.dateString)}
          showSixWeeks
          style={{
            height: "100%",
            backgroundColor: theme.background,
          }}
          theme={{
            arrowColor: theme.accent,
            calendarBackground: theme.background,
            backgroundColor: theme.background,
            monthTextColor: theme.primaryText,
            dayTextColor: theme.primaryText,
            textDisabledColor: theme.mutedText,
            todayTextColor: theme.primaryText,
            selectedDayBackgroundColor: theme.accent,
            selectedDayTextColor: theme.onAccent,
            todayDotColor: theme.primaryText,
          }}
          markedDates={markedDates}
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 8, marginTop: 6 }}>
        {(itemsByDate[selectedDate] ?? []).map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={{ color: theme.primaryText, fontWeight: "500" }}>
              {item.title}
            </Text>

            {item.type === "event" && (
              <>
                {item.description && (
                  <Text
                    style={{
                      color: theme.mutedText,
                      fontSize: 12,
                    }}
                  >
                    {item.description?.trim()}
                  </Text>
                )}
                {item.location && (
                  <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                    {item.location}
                  </Text>
                )}
                <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                  {new Date(item.startAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(item.endAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </>
            )}

            {item.type === "task" && (
              <>
                {item.category && (
                  <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                    {item.category}
                  </Text>
                )}
                <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                  Due {new Date(item.dueDate).toLocaleDateString()}
                </Text>
                <Text style={{ color: theme.mutedText, fontSize: 12 }}>
                  Completion status: {String(item.is_complete).toUpperCase()}
                </Text>
              </>
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 4,
      backgroundColor: theme.background,
      paddingBottom: 16,
    },
    itemRow: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
  });
