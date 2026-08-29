import { SideDrawer } from "@/components/navigation/SideDrawer";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        swipeEnabled: true,
        headerShown: false,
        swipeEdgeWidth: 30,
      }}
      drawerContent={(props) => <SideDrawer {...props} />}
    >
      <Drawer.Screen name="calendar/index" />
      <Drawer.Screen name="tasks/index" />
      <Drawer.Screen name="theme/index" />
    </Drawer>
  );
}
