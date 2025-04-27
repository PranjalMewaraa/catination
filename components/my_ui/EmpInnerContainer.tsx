import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAuthenticated } from "@/utils/isAuth";
import { router, useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MenuContainer from "./MenuContainer";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MyComponentProps {
  children: React.ReactNode;
  style?: object;
  name?: string; // Fixed String to string
  icon?: string; // Fixed String to string
  onRefresh?: () => Promise<void> | void; // Added onRefresh prop
}

type RootStackParamList = {
  signup: undefined;
  login: undefined;
  "(onboard)": undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "signup">;

const EmpInnerScreens: React.FC<MyComponentProps> = ({
  children,
  style,
  name,
  icon,
  onRefresh,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const [role_user, setRole] = useState();
  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: boolean = await isAuthenticated();
      if (!status) {
        navigation.navigate("login");
      }

      setIsLoggedIn(status);
      const role = await AsyncStorage.getItem("role");

      if (role === "admin") {
        router.replace("/(tabs)");
      }
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // Optionally re-check auth status on refresh
      const status = await isAuthenticated();
      setIsLoggedIn(status);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  if (!isAuthChecked) {
    return null; // Optionally, display a loading spinner or placeholder
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{
        justifyContent: "center",
        paddingTop: 42,
      }}
      enableOnAndroid={true}
      style={[styles.containerParent, style]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#9Bd35A", "#689F38"]} // Optional: customize refresh indicator colors
          tintColor="#689F38" // Optional: iOS
        />
      }
    >
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <MenuContainer style={styles.bgMenu}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          </MenuContainer>
          <View style={styles.headerTitle}>
            <ThemedText
              type="title"
              style={{ textOverflow: "wrap", lineHeight: 38 }}
            >
              {name}
            </ThemedText>
          </View>
        </View>
        {icon && (
          <MenuContainer style={styles.bgMenu}>
            <TouchableOpacity>
              <Ionicons name={icon} size={24} color="black" />
            </TouchableOpacity>
          </MenuContainer>
        )}
      </View>
      <Toast />
      {children}
    </KeyboardAwareScrollView>
  );
};

export default EmpInnerScreens;

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#EDF0EA",
  },
  headerTitle: {
    width: 200,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 16,
    padding: 16,
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    gap: 4,
  },
  bgMenu: {
    padding: 16,
    borderRadius: 100,
  },
});
