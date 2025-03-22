import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

// Assuming you have a logout utility function
import { isAuthenticated, logout as performLogout } from "@/utils/isAuth"; // Adjust this import based on your auth logic
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Colors } from "@/constants/Colors";
import CardContainer from "@/components/my_ui/CardContainer";
import MenuContainer from "@/components/my_ui/MenuContainer";
import Container from "@/components/my_ui/Container";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store/store";

function TabLayout() {
  type RootStackParamList = {
    signup: undefined;
    login: undefined;
    "(onboard)": undefined;
  };
  const navigation = useNavigation<NavigationProps>();

  // Define Navigation Type
  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "signup"
  >;

  // Logout function
  const handleLogout = async () => {
    try {
      await performLogout(); // Your logout logic (e.g., clear tokens, Redux state, etc.)
      navigation.navigate("login"); // Redirect to login screen after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message to the user
    }
  };
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const options_navigation_drawer = [
    { name: "Dashboard", route: "index", icon: "home-outline" },
    {
      name: "Our Services",
      route: "services",
      icon: "code-working-outline",
    },
    { name: "Employees", route: "employees", icon: "person-outline" },
    { name: "Leads", route: "leads", icon: "people-outline" },
    {
      name: "Inventory",
      route: "inventory",
      icon: "apps-outline",
    },

    {
      name: "Log Out",
      route: "logout",
      icon: "log-out-outline",
      action: handleLogout,
    }, // Added action for logout
  ];
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Default state to check if logged in
  const [isAuthChecked, setIsAuthChecked] = useState(false); // To check if auth state is checked

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: any = await isAuthenticated();

      setIsLoggedIn(status);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    router.push("/login"); // Navigate to login when button is pressed
  };

  return isLoggedIn ? (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: "black",
          drawerType: "slide",
          swipeEnabled: false,
          header: () => <CustomHeaderForDrawer />,
        }}
        drawerContent={(props) => (
          <ScrollView style={{ backgroundColor: "#fff" }}>
            <InsideHeader user={user} />
            <View style={styles.drawerItems}>
              {options_navigation_drawer.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.drawerItem}
                  onPress={
                    item.action
                      ? item.action
                      : () => props.navigation.navigate(item.route)
                  }
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
                  <Ionicons name="chevron-forward-outline" />
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText style={styles.BottomText}>v1.1.1</ThemedText>
          </ScrollView>
        )}
      >
        {options_navigation_drawer.map((item, index) => (
          <Drawer.Screen
            key={index}
            name={item.route}
            options={{
              drawerLabel: item.name,
              title: item.name,
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
  ) : (
    <Container>
      <Image
        style={styles.onboardingImage}
        source={require("../../assets/images/onboarding/workspace.png")}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.pointer}>Catination CRM</ThemedText>
          <ThemedText style={styles.mainText}>
            Everything you need for your sales, in your pocket
          </ThemedText>
        </View>
        <View>
          <Pressable style={styles.buttonOnboarding} onPress={handleGetStarted}>
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </Pressable>
          <ThemedText style={styles.acknowledgement}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </ThemedText>
        </View>
      </View>
    </Container>
  );
}

// Custom Header
const CustomHeaderForDrawer = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.headerParent}></View>
      <View style={styles.header}>
        <MenuContainer style={styles.bgMenu}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        </MenuContainer>
        <View style={styles.headerSide}>
          {/* <MenuContainer style={styles.bgMenu}>
            <TouchableOpacity onPress={() => alert("Chat Clicked!")}>
              <Ionicons name="chatbox-outline" size={24} color="black" />
            </TouchableOpacity>
          </MenuContainer>
          <MenuContainer style={styles.bgMenu}>
            <TouchableOpacity onPress={() => alert("Notifications Clicked!")}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </MenuContainer> */}
          <MenuContainer style={styles.bgMenu}>
            <TouchableOpacity
              onPress={() => router.push("/(features)/adminProfile")}
            >
              <Ionicons name="person-circle" size={24} color="black" />
            </TouchableOpacity>
          </MenuContainer>
        </View>
      </View>
    </View>
  );
};

// User Profile in Drawer
const InsideHeader = (user) => {
  return (
    <SafeAreaView>
      <View style={styles.headerX}>
        <Ionicons name="person-circle" size={100} color={"black"} />
        <ThemedText type="subtitle">Welcome , {user?.user?.name}</ThemedText>
        <ThemedText type="smalltitle">Your Role: {user?.user?.role}</ThemedText>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  acknowledgement: {
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  buttonOnboarding: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    borderRadius: 46,
    backgroundColor: "#9989F1",
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 20,
    width: "100%",
    color: "white",
    textAlign: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    height: "auto",
    padding: 4,
  },
  pointer: {
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 8,
    color: Colors.greenish.text,
  },
  onboardingImage: {
    width: "100%",
    objectFit: "contain",
    padding: 4,
    height: "50%",
  },
  mainText: {
    paddingTop: 12,
    width: 280,
    lineHeight: 40,
    fontFamily: "LufgaMedium",
    fontSize: 40,
  },
  bgMenu: {
    padding: 16,
    borderRadius: 45,
    backgroundColor: Colors.cardBg,
  },
  headerParent: {
    width: "100%",
    height: 44,
    backgroundColor: "#EDF0EA",
  },
  headerX: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 32,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "column",
    gap: 4,
    marginTop: 44,
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
    marginTop: "auto",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 20,

    backgroundColor: "#EDF0EA",
  },
  headerSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: -16,
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
