import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAuthenticated } from "@/utils/isAuth";
import { router, useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MyComponentProps {
  children: React.ReactNode;
  style?: object;
  onRefresh?: () => Promise<void> | void; // Added onRefresh prop
}

type RootStackParamList = {
  signup: undefined;
  login: undefined;
  "(onboard)": undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "signup">;

const AuthContainer: React.FC<MyComponentProps> = ({
  children,
  style,
  onRefresh,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const [role_user, setRole] = useState("");
  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: boolean = await isAuthenticated();
      if (!status) {
        navigation.navigate("login");
      }
      setIsLoggedIn(status);
      const role = await AsyncStorage.getItem("role");

      if (role === "employee") {
        router.replace("/(employee)");
      }
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  // Handle refresh action
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
      }}
      enableOnAndroid={true}
      style={[styles.containerParent, style]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#9Bd35A", "#689F38"]}
          tintColor="#689F38"
        />
      }
    >
      {children}
      <Toast />
    </KeyboardAwareScrollView>
  );
};

export default AuthContainer;

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#EDF0EA",
  },
});
