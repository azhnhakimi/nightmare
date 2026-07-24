import DraggableFlatlist from "@/components/ui/DraggableFlatlist";
import { useTheme } from "@/theme/useTheme";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksIndex() {

  const {theme} = useTheme()
  
  return (
    <SafeAreaView className="flex-1 p-2" style={{backgroundColor: theme.background}}>
      <DraggableFlatlist/>
    </SafeAreaView>
  );
}
