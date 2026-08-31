import { useTaskDetails } from "@/hooks/useTaskDetails";
import { updateSubtaskCompletion } from "@/lib/tasks";
import { useTheme } from "@/theme/useTheme";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { task, subtasks, setSubtasks, isLoading, error } = useTaskDetails(id);

  const formatDate = (due: string | null) =>
    due
      ? new Date(due).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      : "No due date";

  const toggleSubtask = useCallback(
    async (subtaskId: string) => {
      const prev = subtasks;
      const target = subtasks.find((s) => s.id === subtaskId);
      if (!target) return;

      setSubtasks((cur) =>
        cur.map((s) =>
          s.id === subtaskId ? { ...s, is_complete: !s.is_complete } : s,
        ),
      );

      try {
        await updateSubtaskCompletion(subtaskId, !target.is_complete);
      } catch (err) {
        console.error("Failed to update subtask:", err);
        setSubtasks(prev);
      }
    },
    [subtasks, setSubtasks],
  );

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.primaryText }}>
          {error ?? "Task not found."}
        </Text>
      </View>
    );
  }

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
        {task.title}
      </Text>

      <View style={styles.metaRow}>
        <View style={[styles.badge, { backgroundColor: theme.surface }]}>
          <Text style={{ color: theme.mutedText }}>{task.category}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: theme.surface }]}>
          <Feather name="calendar" size={12} color={theme.mutedText} />
          <Text style={{ color: theme.mutedText }}>
            {formatDate(task.due_date)}
          </Text>
        </View>
      </View>

      {subtasks.length > 0 && (
        <View style={styles.subtaskSection}>
          <Text style={[styles.sectionLabel, { color: theme.mutedText }]}>
            Subtasks
          </Text>
          {subtasks.map((subtask) => (
            <Pressable
              key={subtask.id}
              onPress={() => toggleSubtask(subtask.id)}
              style={[styles.subtaskRow, { backgroundColor: theme.surface }]}
            >
              <Feather
                name={subtask.is_complete ? "check-circle" : "circle"}
                size={18}
                color={subtask.is_complete ? "#4BB543" : theme.accent}
              />
              <Text
                style={[
                  styles.subtaskText,
                  { color: theme.primaryText },
                  subtask.is_complete && styles.completedText,
                ]}
              >
                {subtask.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  subtaskSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  subtaskText: {
    fontSize: 15,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});
