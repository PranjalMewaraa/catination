import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { ThemedText } from "@/components/ThemedText";
import InputBox from "@/components/my_ui/InputBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import {
  setActiveEmployee,
  setError,
  setLoading,
} from "@/store/slices/employeeSlice";
import { fetchFiles } from "@/store/slices/filesSlice";

const addEmployees = () => {
  const { id } = useLocalSearchParams<{ emp: string }>();

  const [propertyData, setPropertyData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddInventory = async () => {
    const adminIdx = await AsyncStorage.getItem("id");

    const res = await api.post("/tenant/createTenant", {
      adminId: adminIdx,
      propertyId: id,
      ...propertyData,
    });
    Toast.show({ type: "success", text1: "Tenant Added Succesfully" });

    router.replace(`/(features)/sold/${id}`);
  };

  return (
    <InnerScreens>
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Add New
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Tenant
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
              value={propertyData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>
          <View>
            <ThemedText>Enter Age </ThemedText>
            <InputBox
              id="age"
              placeholder="Enter age"
              inputMode="numeric"
              value={propertyData.age}
              onChangeText={(text) => handleInputChange("age", text)}
            />
          </View>
          <View>
            <ThemedText>Enter Email</ThemedText>
            <InputBox
              id="email"
              placeholder="Enter email"
              inputMode="text"
              value={propertyData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>
          <View>
            <ThemedText>Enter Phone</ThemedText>
            <InputBox
              id="email"
              placeholder="Enter Phone"
              inputMode="numeric"
              value={propertyData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
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
            Create Tenant
          </ThemedText>
        </TouchableOpacity>
      </View>
    </InnerScreens>
  );
};

export default addEmployees;

const styles = StyleSheet.create({});
