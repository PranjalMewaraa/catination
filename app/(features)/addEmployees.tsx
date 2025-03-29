import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { ThemedText } from "@/components/ThemedText";
import InputBox from "@/components/my_ui/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import {
  setActiveEmployee,
  setError,
  setLoading,
} from "@/store/slices/employeeSlice";
import { fetchFiles } from "@/store/slices/filesSlice";

const addEmployees = () => {
  const dispatch = useDispatch();
  const [employeeLoginData, setEmployeeData] = useState({
    adminId: "",
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setEmployeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleAskOtp = async () => {
    console.log(employeeLoginData);
    if (!employeeLoginData.email) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Email is empty",
      });
      return;
    }
    if (!employeeLoginData.name) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Name is empty",
      });
      return;
    }
    if (!employeeLoginData.password) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Password is empty",
      });
      return;
    }
    if (!employeeLoginData.contactNumber) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "contactNumber is empty",
      });
      return;
    }
    setLoadingState(true);
    const adminId = await AsyncStorage.getItem("id");

    const res = await api.post("/users/sendOTP", {
      adminId: adminId,
      email: employeeLoginData.email,
    });
    setOtpStage(true);

    setLoadingState(false);
  };

  const [loading, setLoadingState] = useState(false);
  const handleVerifyOtp = async () => {
    if (!employeeLoginData.email) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Email is empty",
      });
      return;
    }
    if (!employeeLoginData.name) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Name is empty",
      });
      return;
    }
    if (!employeeLoginData.password) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "Password is empty",
      });
      return;
    }
    if (!employeeLoginData.contactNumber) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "contactNumber is empty",
      });
      return;
    }
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "OTP is empty",
        text2: "OTP is Needed",
      });
      return;
    }
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.post("/users/registerEmployee", {
      adminId: adminId,
      email: employeeLoginData.email,
      name: employeeLoginData.name,
      password: employeeLoginData.password,
      contactNumber: employeeLoginData.contactNumber,
      otp: otp,
    });

    Toast.show({
      type: "success",
      text1: res?.msg,
    });
    FetchEmployee();
  };

  const FetchEmployee = async () => {
    const admin_id = await AsyncStorage.getItem("id");

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response: any = await api.post("/employee/getAllActiveEmployee", {
        id: admin_id,
      });
      dispatch(setActiveEmployee(response));
      router.push("/(tabs)/employees");
    } catch (error) {
      dispatch(setError("Employee Fetch Error . Please try again.")); // Store error in Redux
      console.error("Employee Fetch Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <InnerScreens
      onRefresh={() => {
        FetchEmployee();
      }}
    >
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Add New
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Employees
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 16 }}>
        {otpStage ? (
          <View style={{ flexDirection: "column" }}>
            <View>
              <ThemedText>Enter OTP</ThemedText>
              <InputBox
                id="OTP"
                placeholder="Enter OTP"
                inputMode="numeric"
                value={otp}
                onChangeText={(text) => setOtp(text)}
              />
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "column" }}>
            <View>
              <ThemedText>Enter Name</ThemedText>
              <InputBox
                id="name"
                placeholder="Enter name"
                inputMode="text"
                value={employeeLoginData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
            <View>
              <ThemedText>Enter Email</ThemedText>
              <InputBox
                id="email"
                placeholder="Enter Email"
                inputMode="text"
                value={employeeLoginData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>
            <View>
              <ThemedText>Enter Phone</ThemedText>
              <InputBox
                id="phone"
                placeholder="Enter phone number"
                inputMode="text"
                value={employeeLoginData.contactNumber}
                onChangeText={(text) =>
                  handleInputChange("contactNumber", text)
                }
              />
            </View>
            <View>
              <ThemedText>Enter Password</ThemedText>
              <InputBox
                id="password"
                placeholder="Enter password"
                inputMode="text"
                secureTextEntry={true}
                value={employeeLoginData.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={{ padding: 16, backgroundColor: "#000", borderRadius: 8 }}
          onPress={otpStage ? handleVerifyOtp : handleAskOtp}
        >
          <ThemedText
            style={{ color: "white", textAlign: "center", position: "fixed" }}
          >
            {otpStage
              ? "Create Employees"
              : loading
              ? "Please wait"
              : "Ask for OTP"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </InnerScreens>
  );
};

export default addEmployees;

const styles = StyleSheet.create({});
