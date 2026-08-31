import { useEventDetails } from "@/hooks/useEventDetails";
import { useTheme } from "@/theme/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const { event, isLoading, error } = useEventDetails(id);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.primaryText }}>
          {error ?? "Event not found."}
        </Text>
      </View>
    );
  }

  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);

  const dateLabel = startDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeLabel = `${startDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })} - ${endDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  const handleEditPress = () => {};

  const handleDeletePress = () => {
    console.log("delete");
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16 },
      ]}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={22} color={theme.primaryText} />
      </Pressable>

      <Text style={[styles.title, { color: theme.primaryText }]}>
        {event.title}
      </Text>

      <View style={styles.metaRow}>
        <View style={[styles.badge, { backgroundColor: theme.surface }]}>
          <Feather name="calendar" size={12} color={theme.mutedText} />
          <Text style={{ color: theme.mutedText }}>{dateLabel}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.surface }]}>
          <Feather name="clock" size={12} color={theme.mutedText} />
          <Text style={{ color: theme.mutedText }}>{timeLabel}</Text>
        </View>
        {event.location && (
          <View style={[styles.badge, { backgroundColor: theme.surface }]}>
            <Feather name="map-pin" size={12} color={theme.mutedText} />
            <Text style={{ color: theme.mutedText }}>{event.location}</Text>
          </View>
        )}
      </View>

      {event.description && (
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionLabel, { color: theme.mutedText }]}>
            Description
          </Text>
          <Text style={{ color: theme.primaryText, fontSize: 15 }}>
            {event.description.trim()}
          </Text>
        </View>
      )}

      <View style={{ marginTop: "auto", gap: 6, marginBottom: 12 }}>
        <Pressable style={styles.ctaButtons} onPress={handleEditPress}>
          <Feather name="edit-2" size={14} color={theme.onAccent} />
          <Text style={{ color: theme.onAccent }}>Edit</Text>
        </Pressable>

        <Pressable
          style={[styles.ctaButtons, { backgroundColor: "#B00020" }]}
          onPress={handleDeletePress}
        >
          <Feather name="trash" size={14} color={"white"} />
          <Text style={{ color: "white" }}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      flex: 1,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    backButton: {
      marginBottom: 16,
      alignSelf: "flex-start",
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    descriptionSection: {
      gap: 4,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    ctaButtons: {
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 8,
      borderRadius: 6,
      flexDirection: "row",
      gap: 6,
    },
  });
