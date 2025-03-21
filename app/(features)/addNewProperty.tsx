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

  const [propertyData, setPropertyData] = useState({
    societyName: "",
    vacantFlats: "",
    location: "",
  });

  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddInventory = async () => {
    const adminIdx = await AsyncStorage.getItem("id");

    const res = await api.post("/newProperties/createProperty", {
      adminId: adminIdx,
      ...propertyData,
    });
    Toast.show({ type: "success", text1: "Unit Added Succesfully" });

    router.push("/(tabs)/inventory");
  };

  return (
    <InnerScreens>
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Add to
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Inventory
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "column" }}>
          <View>
            <ThemedText>Enter Name</ThemedText>
            <InputBox
              id="name"
              placeholder="Enter Society name"
              inputMode="text"
              value={propertyData.societyName}
              onChangeText={(text) => handleInputChange("societyName", text)}
            />
          </View>
          <View>
            <ThemedText>Enter Vacant Flats</ThemedText>
            <InputBox
              id="email"
              placeholder="Enter No Vacant Flats"
              inputMode="numeric"
              value={propertyData.vacantFlats}
              onChangeText={(text) => handleInputChange("vacantFlats", text)}
            />
          </View>
          <View>
            <ThemedText>Enter Location / City</ThemedText>
            <InputBox
              id="location"
              placeholder="Enter Location"
              inputMode="text"
              value={propertyData.location}
              onChangeText={(text) => handleInputChange("location", text)}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{ padding: 16, backgroundColor: "#000", borderRadius: 8 }}
          onPress={handleAddInventory}
        >
          <ThemedText
            style={{ color: "white", textAlign: "center", position: "fixed" }}
          >
            Create Inventory
          </ThemedText>
        </TouchableOpacity>
      </View>
    </InnerScreens>
  );
};

export default addEmployees;

const styles = StyleSheet.create({});
