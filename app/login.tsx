import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Container from "@/components/my_ui/Container";
import { ThemedText } from "@/components/ThemedText";
import InputBox from "@/components/my_ui/InputBox";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setError, setLoading, setUser } from "@/store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  type RootStackParamList = {
    signup: undefined;
    login: undefined;
    employeeLogin: undefined;
    "(tabs)": undefined;
  };
  const navigation = useNavigation<NavigationProps>();

  // Define Navigation Type
  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    "signup"
  >;

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  // State for login object
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [isLoading, setLoadingState] = useState(false);
  // Handle form submission
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;
    const errors: { email?: string; password?: string } = {};

    if (!loginData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(loginData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!loginData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!isValid) {
      console.log("Validation Errors:", errors);
      return;
    }
    setLoadingState(true);
    try {
      dispatch(setLoading(true)); // Set loading state
      dispatch(setError(null)); // Clear previous errors

      const response: any = await api.post("/users/login/admin", loginData); // Pass loginData to API
      console.log("API Response:", response.user);

      // Assuming the API returns user data on successful login
      dispatch(setUser(response.user));
      AsyncStorage.setItem("auth_token", response.token);
      AsyncStorage.setItem("id", response.user._id);
      AsyncStorage.setItem("role", response.user.role);
      AsyncStorage.setItem("user", JSON.stringify(response.user));
      setLoading(false);
      navigation.navigate("(tabs)");
    } catch (error) {
      dispatch(setError("Login failed. Please try again.")); // Store error in Redux
      console.error("Login Error:", error);
    } finally {
      dispatch(setLoading(false)); // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Container>
      <View style={styles.emptyBox}></View>
      <ThemedText style={styles.pageTitle}>Hey,</ThemedText>
      <ThemedText style={styles.pageTitle}>Login Now !</ThemedText>
      <View style={styles.subt}>
        <ThemedText style={styles.pageSubtitle}>I am a New User /</ThemedText>
        <Pressable onPress={() => navigation.navigate("signup")}>
          <ThemedText style={styles.pageSubtitle2}>Create Account</ThemedText>
        </Pressable>
      </View>
      <View>
        <InputBox
          id="email"
          placeholder="email"
          inputMode="email"
          value={loginData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <InputBox
          id="password"
          placeholder="password"
          inputMode="text"
          value={loginData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true} // Added for password security
        />
      </View>
      <View style={styles.subt}>
        <ThemedText style={styles.pageSubtitle}>Forgot Password /</ThemedText>
        <ThemedText style={styles.pageSubtitle2}>Reset</ThemedText>
      </View>
      <Pressable style={styles.buttonOnboarding} onPress={handleSubmit}>
        <ThemedText style={styles.buttonText}>
          {isLoading ? "Logging you in .." : "Login"}
        </ThemedText>
      </Pressable>
      <View style={styles.subt}>
        <ThemedText style={styles.pageSubtitle}>I am a Employee /</ThemedText>
        <Pressable onPress={() => navigation.navigate("employeeLogin")}>
          <ThemedText style={styles.pageSubtitle2}>Employee Login</ThemedText>
        </Pressable>
      </View>
    </Container>
  );
};

export default login;

const styles = StyleSheet.create({
  emptyBox: {
    width: 100,
    height: 150,
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
  subt: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginVertical: 24,
  },
  pageTitle: {
    fontSize: 36,
    lineHeight: 36,
  },
  pageSubtitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "gray",
  },
  pageSubtitle2: {
    fontSize: 18,
    marginLeft: 16,
    lineHeight: 24,
    fontWeight: 600,
    textDecorationLine: "underline",
  },
});
