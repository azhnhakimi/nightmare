import { useTheme } from "@/theme/useTheme";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
    transform: [{ scale: 0.92 + progress.value * 0.08 }],
  }));

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
            <View style={{ backgroundColor: "lightpink", flex: 1 }} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 14,
                alignItems: "center",
              }}
            >
              <Pressable onPress={onClose}>
                <Text style={{ color: theme.primaryText, fontWeight: 500 }}>
                  CANCEL
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                style={{
                  backgroundColor: theme.accent,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: theme.onAccent, fontWeight: "bold" }}>
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
    maxHeight: screenHeight * 0.6,
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
});
