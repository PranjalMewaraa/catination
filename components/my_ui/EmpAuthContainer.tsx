import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAuthenticated } from "@/utils/isAuth";
import { router, useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import MenuContainer from "./MenuContainer";

interface MyComponentProps {
  children: React.ReactNode;
  style?: object;
  name: String;
  icon: String;
  onRefresh?: () => Promise<void> | void;
  handleIconAction?: () => Promise<void> | void; // Added onRefresh prop
}

type RootStackParamList = {
  signup: undefined;
  login: undefined;
  "(onboard)": undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "signup">;

const EmpAuthContainer: React.FC<MyComponentProps> = ({
  children,
  style,
  onRefresh,
  name,
  icon,
  handleIconAction,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [role_user, setRole] = useState("");
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: boolean = await isAuthenticated();
      if (!status) {
        navigation.navigate("login");
      }
      const role = await AsyncStorage.getItem("role");

      if (role === "admin") {
        router.replace("/(tabs)");
      }
      setRole(role);
      setIsLoggedIn(status);
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
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <MenuContainer style={styles.bgMenu2}>
            <Image
              source={require("../../assets/images/catination.png")}
              width={16}
              resizeMode="contain"
              style={styles.Img}
            ></Image>
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
            {handleIconAction ? (
              <TouchableOpacity onPress={handleIconAction}>
                <Ionicons name={icon} size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Ionicons name={icon} size={24} color="black" />
              </TouchableOpacity>
            )}
          </MenuContainer>
        )}
      </View>
      {children}
      <Toast />
    </KeyboardAwareScrollView>
  );
};

export default EmpAuthContainer;

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
    marginTop: 28,
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
  bgMenu2: {},
  Img: {
    width: 56,
    height: 56,
  },
});
