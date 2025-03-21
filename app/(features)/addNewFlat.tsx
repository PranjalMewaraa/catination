import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    ownerName: "",
    address: "",
    availableForRent: "",
    email: "",
    isRentedOut: "",
    propertyName: "",
    societyName: "",
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

    const res = await api.post(
      `/propertyDetails/createProperty?adminId=${adminIdx}`,
      {
        ...propertyData,
      }
    );
    Toast.show({ type: "success", text1: "Unit Added Succesfully" });

    router.push("/(tabs)/inventory");
  };

  return (
    <InnerScreens>
      <ScrollView>
        <View style={{ paddingHorizontal: 20 }}>
          <ThemedText style={{ fontSize: 44 }} type="title">
            Add Sold
          </ThemedText>
          <ThemedText style={{ fontSize: 44 }} type="title">
            Property
          </ThemedText>
        </View>
        <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 16 }}>
          <View>
            <View>
              <ThemedText type="default">Owner Name</ThemedText>
              <InputBox
                id="OwnerName"
                inputMode="text"
                placeholder="Enter Owner Name"
                value={propertyData.ownerName}
                onChangeText={(text) => handleInputChange("ownerName", text)}
              />
            </View>

            <View>
              <ThemedText type="default">Owner Email</ThemedText>
              <InputBox
                id="OwnerEmail"
                inputMode="text"
                placeholder="Enter Owner Email"
                value={propertyData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <ThemedText type="default">Property Name</ThemedText>
                <InputBox
                  id="PropertyName"
                  inputMode="text"
                  placeholder="Enter Property Name"
                  value={propertyData.propertyName}
                  onChangeText={(text) =>
                    handleInputChange("propertyName", text)
                  }
                />
              </View>
              <View style={{ width: "48%" }}>
                <ThemedText type="default">Society Name</ThemedText>
                <InputBox
                  id="SocietyName"
                  inputMode="text"
                  placeholder="Enter Society Name"
                  value={propertyData.societyName}
                  onChangeText={(text) =>
                    handleInputChange("societyName", text)
                  }
                />
              </View>
            </View>

            <View>
              <ThemedText type="default">Property Address</ThemedText>
              <InputBox
                id="Address"
                inputMode="text"
                placeholder="Enter Address"
                value={propertyData.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
                gap: 4,
              }}
            >
              <Switch
                value={propertyData.availableForRent}
                onValueChange={(value) =>
                  handleInputChange("availableForRent", value)
                }
              />
              <ThemedText type="default">Available for Rent</ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
                gap: 4,
              }}
            >
              <Switch
                value={propertyData.isRentedOut}
                onValueChange={(value) =>
                  handleInputChange("isRentedOut", value)
                }
              />
              <ThemedText type="default">Is Rented Out</ThemedText>
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
      </ScrollView>
    </InnerScreens>
  );
};

export default addEmployees;

const styles = StyleSheet.create({});
