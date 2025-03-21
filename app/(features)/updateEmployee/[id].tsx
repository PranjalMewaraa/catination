import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { ThemedText } from "@/components/ThemedText";
import InputBox from "@/components/my_ui/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveEmployee,
  setError,
  setLoading,
} from "@/store/slices/employeeSlice";
import { fetchFiles } from "@/store/slices/filesSlice";
import { RootState } from "@/store/store";

const addEmployees = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [employeeLoginData, setEmployeeData] = useState({
    adminId: "",
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const activeEmployee = useSelector(
    (state: RootState) => state.employee.activeEmployee
  );
  const pastEmployee = useSelector(
    (state: RootState) => state.employee.pastEmployee
  );

  const totalEmployees = [...activeEmployee, ...pastEmployee];
  const current = totalEmployees.find((it) => it._id === id);

  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (current) {
      setEmployeeData(current);
    }
  }, [current]);

  const handleInputChange = (field: string, value: string) => {
    setEmployeeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const UpdateEmployee = async () => {
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

    if (!employeeLoginData.contactNumber) {
      Toast.show({
        type: "error",
        text1: "Empty Fields Found",
        text2: "contactNumber is empty",
      });
      return;
    }

    const adminId = await AsyncStorage.getItem("id");
    const res = await api.put("/employee/updateEmplyee", {
      id: id,
      email: employeeLoginData.email,
      name: employeeLoginData.name,
      contactNumber: employeeLoginData.contactNumber,
      password: employeeLoginData.password,
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
    <InnerScreens>
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Update
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Employee
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 16 }}>
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
              onChangeText={(text) => handleInputChange("contactNumber", text)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{ padding: 16, backgroundColor: "#000", borderRadius: 8 }}
          onPress={UpdateEmployee}
        >
          <ThemedText
            style={{ color: "white", textAlign: "center", position: "fixed" }}
          >
            {"Create Employees"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </InnerScreens>
  );
};

export default addEmployees;

const styles = StyleSheet.create({});
