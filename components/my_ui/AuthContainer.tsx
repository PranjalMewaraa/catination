import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAuthenticated } from "@/utils/isAuth";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface MyComponentProps {
  children: React.ReactNode;
  style?: object; // Define style prop properly
}

type RootStackParamList = {
  signup: undefined;
  login: undefined;
  "(onboard)": undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "signup">;

const AuthContainer: React.FC<MyComponentProps> = ({ children, style }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: boolean = await isAuthenticated();
      if (!status) {
        navigation.navigate("login");
      }
      setIsLoggedIn(status);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

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
