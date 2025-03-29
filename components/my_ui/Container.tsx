import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { isAuthenticated } from "@/utils/isAuth";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
interface MyComponentProps {
  children: React.ReactNode; // Explicitly typing the children prop
}
const Container: React.FC<MyComponentProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Default state to check if logged in
  const [isAuthChecked, setIsAuthChecked] = useState(false); // To check if auth state is checked
  type RootStackParamList = {
    signup: undefined;
    login: undefined;
    "(tabs)": undefined;
  };

  const navigation = useNavigation<NavigationProps>();
  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "signup"
  >;
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const status: any = await isAuthenticated();
  //     if (status) {
  //       navigation.navigate("(tabs)");
  //     }
  //     setIsLoggedIn(status);
  //     setIsAuthChecked(true);
  //   };

  //   checkAuthStatus();
  // }, []);

  // if (!isAuthChecked) {
  //   return null; // Optionally, display a loading screen while checking auth status
  // }

  return <View style={styles.containerParent}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EDF0EA",
  },
});
