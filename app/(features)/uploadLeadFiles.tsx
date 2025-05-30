import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import * as DocumentPicker from "expo-document-picker";
import { useFiles } from "@/hooks/useFiles";

const LeadFiles = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [url, setUrl] = useState(null);

  const { files, loading, error, loadFiles } = useFiles();
  const handleInputChange = (value) => {
    setFileName(value);
  };

  const chooseFile = async () => {
    if (!fileName) {
      setErrorMsg("Please Enter File name to continue");
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
        ],
      });

      setFile(result);
      await generateUrl();
    } catch (error) {
      setErrorMsg("Error selecting file: " + error.message);
    }
  };

  const generateUrl = async () => {
    if (fileName) {
      try {
        const u_id = await AsyncStorage.getItem("id");
        const response = await api.post("/leads/generateURL", {
          id: await AsyncStorage.getItem("id"),
          name: fileName,
        });

        setUrl(response.uploadUrl);
      } catch (error) {
        setErrorMsg("Error generating URL: " + error.message);
      }
    }
  };

  const uploadFile = async () => {
    if (!url) {
      setErrorMsg("Please choose a file first");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        setErrorMsg("Please Login to upload Data");
        return;
      }

      const response = await fetch(url, {
        method: "PUT",
        body: {
          uri: file.assets[0].uri,
          type: file.assets[0].mimeType,
          name: file.assets[0].name,
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFile(null);
        setUrl(null);
        setFileName("");
        loadFiles();
      } else {
        setErrorMsg("Unable to upload the file");
      }
    } catch (error) {
      setErrorMsg("Upload error: " + error.message);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      position: "top",
    });
  };

  useEffect(() => {
    if (errorMsg) {
      showToast("error", errorMsg);
      setTimeout(() => setErrorMsg(""), 3000);
    }
    if (isSubmitted) {
      showToast("success", "File Uploaded Successfully");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  }, [errorMsg, isSubmitted]);

  const openSampleFile = () => {
    const url =
      "https://crm-userdata.s3.ap-south-1.amazonaws.com/Sample-file/sample-lead-data.xlsx"; // Replace with your actual sample file URL
    Linking.openURL(url).catch((err) =>
      setErrorMsg("Failed to open link: " + err.message)
    );
  };

  const Refresh = () => loadFiles();
  return (
    <InnerScreens onRefresh={Refresh}>
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Upload Lead
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Files
        </ThemedText>
        <ThemedText type="default">
          Sheet should contain Name , Email , Phone
        </ThemedText>
      </View>
      <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "column" }}>
          <View>
            <ThemedText>Enter File Name</ThemedText>
            <InputBox
              placeholder="Enter file name"
              inputMode="text"
              value={fileName}
              onChangeText={handleInputChange}
            />
            {file && (
              <ThemedText style={{ marginTop: 8 }}>
                Selected: {file.assets[0].name}
              </ThemedText>
            )}
          </View>
          <View>
            <TouchableOpacity
              style={{
                padding: 16,
                marginBottom: 12,
                backgroundColor: "#000",
                borderRadius: 8,
              }}
              onPress={chooseFile}
            >
              <ThemedText style={{ color: "white", textAlign: "center" }}>
                Choose a File
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ padding: 16, backgroundColor: "#000", borderRadius: 8 }}
              onPress={uploadFile}
            >
              <ThemedText style={{ color: "white", textAlign: "center" }}>
                Upload a File
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{ marginTop: 20 }}>
          <ThemedText style={{ fontWeight: "bold" }}>Uploaded Files</ThemedText>
          {files.map((item, index) => (
            <ThemedText key={index} style={{ marginTop: 8 }}>
              {item.fileName}
            </ThemedText>
          ))}
        </View> */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <ThemedText style={{ textAlign: "center", marginBottom: 8 }}>
            Please ensure the file has the correct format as shown in the
            sample.
          </ThemedText>
          <TouchableOpacity onPress={openSampleFile}>
            <ThemedText
              style={{ color: "blue", textDecorationLine: "underline" }}
            >
              Download Sample File
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </InnerScreens>
  );
};

export default LeadFiles;

const styles = StyleSheet.create({});
