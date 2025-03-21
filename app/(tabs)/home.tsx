import { useNavigation } from "expo-router";
import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

function TabLayout() {
  const options_navigation_drawer = [
    { name: "Home", route: "index", icon: "home-outline" },
    {
      name: "Edit Profile",
      route: "editProfile",
      icon: "person-outline",
    },
    { name: "Orders", route: "orders", icon: "receipt-outline" },
    {
      name: "Change Password",
      route: "change_password",
      icon: "lock-closed-outline",
    },
    {
      name: "Live Chat",
      route: "livechat",
      icon: "chatbubble-ellipses-outline",
    },
    {
      name: "Manage Address",
      route: "manage_address",
      icon: "location-outline",
    },
    {
      name: "Invite Friends",
      route: "invite_friends",
      icon: "person-add-outline",
    },
    {
      name: "Manage Card",
      route: "manage_card",
      icon: "card-outline",
    },
    {
      name: "Help and Support",
      route: "help_and_support",
      icon: "help-circle-outline",
    },
    {
      name: "Preferences",
      route: "preferances",
      icon: "settings-outline",
    },
    {
      name: "My Coupons",
      route: "explore",
      icon: "pricetag-outline",
    },
    { name: "My Coupons", route: "my_coupons", icon: "pricetag-outline" },
    { name: "Log Out", route: "logout", icon: "log-out-outline" },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: "black",
          drawerType: "slide",
          swipeEnabled: false,
          header: () => <CustomHeaderForDrawer />,
        }}
        drawerContent={(props) => (
          <ScrollView>
            <InsideHeader />
            <View style={styles.drawerItems}>
              {/* ✅ FIX: Using options_navigation_drawer for rendering */}
              {options_navigation_drawer.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.drawerItem}
                  onPress={() => props.navigation.navigate(item.route)}
                >
                  <View style={styles.leftHeader}>
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={14}
                      color={"#333"}
                      style={styles.drawerIcon}
                    />
                    <ThemedText style={styles.drawerText}>
                      {item.name}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText style={styles.BottomText}>v1.1.1</ThemedText>
          </ScrollView>
        )}
      >
        {/* ✅ FIX: Each screen matches an actual file in `app/` */}
        {options_navigation_drawer.map((item, index) => (
          <Drawer.Screen
            key={index}
            name={item.route}
            options={{
              drawerLabel: item.name,
              title: item.name, // Correct title
              drawerIcon: ({ color, size }) => (
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}

// ✅ Custom Header
const CustomHeaderForDrawer = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => alert("Chat Clicked!")}>
            <Ionicons name="chatbox-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Notifications Clicked!")}>
            <Ionicons name="notifications-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Profile Clicked!")}>
            <Ionicons name="person-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ✅ User Profile in Drawer
const InsideHeader = () => {
  return (
    <SafeAreaView>
      <View style={styles.headerX}>
        <Ionicons name="person-circle" size={100} color={"black"} />
      </View>
    </SafeAreaView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  headerX: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 32,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  leftHeader: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  BottomText: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingLeft: "40%",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 16,
    backgroundColor: "#fff",
  },
  headerSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  drawerItems: {
    padding: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  drawerIcon: {
    marginRight: 15,
  },
  drawerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default TabLayout;
