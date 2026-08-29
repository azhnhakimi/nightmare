import { importIcsEvents } from "@/lib/events";
import { fetchAndParseIcsFeed, ParsedIcsEvent } from "@/lib/ics";
import { useTheme } from "@/theme/useTheme";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatRange = (startAt: string, endAt: string) => {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  return `${start.toLocaleDateString(undefined, dateOptions)} · ${start.toLocaleTimeString(undefined, timeOptions)} - ${end.toLocaleTimeString(undefined, timeOptions)}`;
};

export default function ImportIcsScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [feedUrl, setFeedUrl] = useState("");
  const [events, setEvents] = useState<ParsedIcsEvent[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!feedUrl.trim()) return;

    setIsFetching(true);
    setError(null);

    try {
      const parsed = await fetchAndParseIcsFeed(feedUrl.trim());
      setEvents(parsed);
    } catch (err) {
      setError(
        "Couldn't fetch or parse that feed. Check the URL and try again.",
      );
      setEvents(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleConfirm = async () => {
    if (!events || events.length === 0) return;

    setIsImporting(true);
    setError(null);

    try {
      await importIcsEvents(events);
      setEvents(null);
      setFeedUrl("");
    } catch (err) {
      setError("Import failed. Try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <TextInput
        value={feedUrl}
        onChangeText={setFeedUrl}
        placeholder="Paste your calendar feed URL"
        placeholderTextColor={theme.mutedText}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable
        onPress={handleFetch}
        disabled={isFetching || !feedUrl.trim()}
        style={[styles.button, { backgroundColor: theme.accent }]}
      >
        <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
          {isFetching ? "Fetching..." : "Fetch events"}
        </Text>
      </Pressable>

      {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}

      {events && (
        <>
          <Text style={[styles.previewHeader, { color: theme.primaryText }]}>
            {events.length} event{events.length === 1 ? "" : "s"} found
          </Text>

          <FlatList
            data={events}
            keyExtractor={(item) => item.uid}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.eventRow,
                  { borderColor: theme.mutedText + "33" },
                ]}
              >
                <Text style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {item.title}
                </Text>
                <Text style={{ color: theme.mutedText, marginTop: 2 }}>
                  {formatRange(item.startAt, item.endAt)}
                </Text>
                {item.location && (
                  <Text style={{ color: theme.mutedText, marginTop: 2 }}>
                    {item.location}
                  </Text>
                )}
              </View>
            )}
          />

          <Pressable
            onPress={handleConfirm}
            disabled={isImporting}
            style={[styles.button, { backgroundColor: theme.accent }]}
          >
            <Text style={{ color: theme.onAccent, fontWeight: "600" }}>
              {isImporting
                ? "Importing..."
                : `Import ${events.length} event${events.length === 1 ? "" : "s"}`}
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
      gap: 12,
    },
    input: {
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 48,
      backgroundColor: theme.surface,
      color: theme.primaryText,
    },
    button: {
      borderRadius: 8,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    previewHeader: {
      fontWeight: "600",
      marginTop: 8,
    },
    eventRow: {
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
