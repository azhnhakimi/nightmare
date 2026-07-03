import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container} className="bg-red-400">
      <Text className="text-green-400 font-bold">
        Edit src/app/index.tsx to edit this screen hello.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
