import { themes } from "@/constants/theme";
import { useTheme } from "@/theme/useTheme";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ThemeIndex() {
  const { theme, themeName, setTheme } = useTheme();

  const themeEntries = Object.entries(themes) as [
    keyof typeof themes,
    (typeof themes)[keyof typeof themes],
  ][];

  return (
    <SafeAreaView
      className=" flex-1 p-2"
      style={{ backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        <Text style={[{ color: theme.primaryText }]}>Theme</Text>
        <Text style={[{ color: theme.mutedText }]}>
          Select your preferred theme here.
        </Text>

        <View style={{ gap: 12 }}>
          {themeEntries.map(([name, themeObj]) => (
            <Pressable
              key={name}
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor:
                  themeName === name ? themeObj.accent : themeObj.border,
                backgroundColor: themeObj.background,
              }}
              onPress={() => setTheme(name)}
            >
              <Text
                style={{
                  color: themeObj.primaryText,
                }}
                className="capitalize w-full font-semibold"
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
