import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import Container from "@/components/my_ui/Container";
import { ThemedText } from "@/components/ThemedText";
import InputBox from "@/components/my_ui/InputBox";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useNavigation } from "expo-router";
import api from "@/utils/api";
import Toast from "react-native-toast-message";

const Signup = () => {
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const Signup = async () => {
    const res = await api.post("/users/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "admin",
    });
    Toast.show({
      type: "success",
      text1: "Signup Success",
    });
    navigation.navigate("(onboard)");
  };

  return (
    <Container>
      <ScrollView>
        <View style={styles.emptyBox}></View>
        <ThemedText style={styles.pageTitle}>Hey,</ThemedText>
        <ThemedText style={styles.pageTitle}>Create a Account !</ThemedText>
        <View style={styles.subt}>
          <ThemedText style={styles.pageSubtitle}>
            I am already a User /
          </ThemedText>
          <Pressable onPress={() => navigation.navigate("login")}>
            <ThemedText style={styles.pageSubtitle2}>Login Account</ThemedText>
          </Pressable>
        </View>
        <View>
          <InputBox
            id="name"
            placeholder="name"
            inputMode="text"
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <InputBox
            id="email"
            placeholder="email"
            inputMode="email"
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <InputBox
            id="password"
            placeholder="password"
            inputMode="text"
            secureTextEntry={true}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <InputBox
            id="cnf-password"
            placeholder="confirm password"
            inputMode="text"
            secureTextEntry={true}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
          />
        </View>
        <View style={styles.subt}>
          <ThemedText style={styles.pageSubtitle}>Forgot Password /</ThemedText>
          <ThemedText style={styles.pageSubtitle2}>Reset</ThemedText>
        </View>
        <Pressable style={styles.buttonOnboarding} onPress={Signup}>
          <ThemedText style={styles.buttonText}>Signup </ThemedText>
        </Pressable>
      </ScrollView>
    </Container>
  );
};

export default Signup;

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
    display: "flex",
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
});
