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
import CardContainer from "@/components/my_ui/CardContainer";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const login = () => {
  type RootStackParamList = {
    signup: undefined;
    login: undefined;
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

      const response: any = await api.post(
        "/employee/login/employee",
        loginData
      ); // Pass loginData to API
      console.log("API Response:", response);

      // Assuming the API returns user data on successful login
      dispatch(setUser(response.employee));
      AsyncStorage.setItem("auth_token", response.token);
      AsyncStorage.setItem("e_id", response.employee.id);
      AsyncStorage.setItem("role", response.employee.role);
      AsyncStorage.setItem("user", JSON.stringify(response.employee));
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
      <ThemedText style={styles.pageTitle}>Welcome,</ThemedText>
      <ThemedText style={styles.pageTitle}>Employee Login</ThemedText>
      <View style={{ marginVertical: 24 }}>
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

      <Pressable style={styles.buttonOnboarding} onPress={handleSubmit}>
        <ThemedText style={styles.buttonText}>
          {isLoading ? "Logging you in .." : "Login in"}
        </ThemedText>
      </Pressable>
    </Container>
  );
};

export default login;

const styles = StyleSheet.create({
  emptyBox: {
    width: 100,
    height: 200,
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
  },
  infoModal: {
    width: "100%",
    flex: 1,
    padding: 32,
    flexDirection: "column",
    justifyContent: "center",
  },
  employeeCard: {
    minHeight: 300,
    width: "100%",
    backgroundColor: "#D6D6CB",
    borderRadius: 36,
    padding: 8,
  },
  editIcon: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  employeeInfo: {
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  profileIcon: {
    padding: 16,
    borderRadius: 64,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 16,
  },
  employeeDetails: {
    alignItems: "center",
    marginTop: 16,
  },
  emailText: {
    color: "gray",
    fontWeight: "300",
    maxWidth: 250,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 32,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "red",
  },
  leadsContainer: {
    minHeight: 100,
    width: "100%",
    backgroundColor: "#F5F6EC",
    borderRadius: 36,
    padding: 8,
  },
  leadsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: 16,
    borderRadius: 32,
  },
  sectionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  sectionButton: {
    backgroundColor: "#fff",
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  activeSectionButton: {
    backgroundColor: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
  widgetContainer: {
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  cardWidget: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  empHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  empImg: {
    padding: 20,
    borderRadius: 88,
    backgroundColor: "#fff",
  },
  body: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    flexDirection: "column",
    gap: 4,
  },
  tailEmp: {
    width: "100%",
    flexDirection: "row",
  },
  bgMenu: {
    padding: 16,
    borderRadius: 48,
    backgroundColor: Colors.cardBg,
  },
  bgMenuR: {
    padding: 16,
    borderRadius: 48,
    backgroundColor: Colors.cardBg,
    transform: [{ rotate: "45deg" }],
  },
});
