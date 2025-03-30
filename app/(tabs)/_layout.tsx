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
import { isAuthenticated, logout as performLogout } from "@/utils/isAuth";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Colors } from "@/constants/Colors";
import MenuContainer from "@/components/my_ui/MenuContainer";
import Container from "@/components/my_ui/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TabLayout() {
  type RootStackParamList = {
    signup: undefined;
    login: undefined;
    "(onboard)": undefined;
  };
  const navigation = useNavigation<NavigationProps>();

  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "signup"
  >;

  const handleLogout = async () => {
    try {
      await performLogout();
      navigation.navigate("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const { user } = useSelector((state: RootState) => state.user);

  const options_navigation_drawer = [
    { name: "Dashboard", route: "index", icon: "home-outline" },
    { name: "Our Services", route: "services", icon: "code-working-outline" },
    { name: "Leads", route: "leads", icon: "people-outline" },
    { name: "My Files", route: "myFiles", icon: "document-outline" },
    { name: "Employees", route: "employees", icon: "person-outline" },
    { name: "Inventory", route: "inventory", icon: "apps-outline" },
    {
      name: "Log Out",
      route: "logout",
      icon: "log-out-outline",
      action: handleLogout,
    },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [ROLE_USER, setRoleUser] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status = await isAuthenticated();
      const savedRole = await AsyncStorage.getItem("role");
      setIsLoggedIn(status);
      setRoleUser(savedRole);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  const handleGetStartedEmployee = () => {
    router.push("/employeeLogin");
  };

  console.log("check", ROLE_USER);

  if (!isAuthChecked) return null; // Loading/splash

  if (!isLoggedIn) {
    return (
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
            <Pressable
              style={styles.buttonOnboarding}
              onPress={handleGetStarted}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </Pressable>
            <Pressable
              style={styles.buttonOnboarding2}
              onPress={handleGetStartedEmployee}
            >
              <ThemedText style={styles.buttonText}>Employee Panel</ThemedText>
            </Pressable>
            <ThemedText style={styles.acknowledgement}>
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </ThemedText>
          </View>
        </View>
      </Container>
    );
  }

  return (
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

// Drawer User Header
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
    fontSize: 14,
  },
  buttonOnboarding: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    borderRadius: 46,
    backgroundColor: "#9989F1",
  },
  buttonOnboarding2: {
    width: "100%",
    padding: 16,
    marginBottom: 8,
    borderRadius: 46,
    backgroundColor: "#000000",
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
