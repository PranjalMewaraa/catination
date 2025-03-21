import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthContainer from "@/components/my_ui/AuthContainer";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { ThemedText } from "@/components/ThemedText";
import api from "@/utils/api";
import WebView from "react-native-webview";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchFiles } from "@/store/slices/filesSlice";
import MultiSelectDropdown from "@/components/my_ui/MultiSelectDropdown";
import { Ionicons } from "@expo/vector-icons";
import ChatPreview from "@/components/my_ui/chatPreview";
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Whatsapp = () => {
  const dispatch = useAppDispatch();
  const [section, setSection] = useState("selectSheet");

  const [whatsappTemplates, setWhatsappTemplates] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTemp, setSelectedTemp] = useState([]);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const getWhatsappTemplates = async () => {
      const res = await api.get("/whatsappTemplate/getTemplates");
      const data = res.data.data;
      const jsonData = data;
      setWhatsappTemplates(JSON.parse(JSON.stringify(jsonData, null, 2)));
    };
    const getExcelFiles = async () => {
      const adminId = await AsyncStorage.getItem("id");
      const res = await api.post("/data/getAllData", {
        id: adminId,
      });

      setFiles(res);
    };
    getWhatsappTemplates();
    getExcelFiles();
  }, []);

  function transformArray(data: []) {
    return data.map((item) => ({
      label: item.name,
      value: item.name,
      selected: item,
    }));
  }
  function transformExcel(data: []) {
    return data.map((item) => ({
      label: item.fileName,
      value: item.fileName,
      url: item.url,
    }));
  }
  let my_templates = transformArray(whatsappTemplates);
  let excel_files: { label: any; value: any }[] = transformExcel(files);

  const handleSectionOne = () => {
    if (selectedFiles.length > 0) {
      setSection("selectTemplate");
    }
  };

  return (
    <InnerScreens icon={"help-sharp"} style={{ flex: 1, paddingHorizontal: 0 }}>
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Whatsapp
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Campaigns
        </ThemedText>
      </View>
      {section === "selectSheet" && (
        <>
          <View style={styles.viewBox}>
            {selectedFiles.length > 0 ? (
              <WebView
                style={styles.webView}
                source={{ uri: selectedFiles[0]?.url }}
                scrollEnabled
              ></WebView>
            ) : (
              <View style={styles.webViewPreview}>
                <ThemedText>Select a file to view</ThemedText>
              </View>
            )}
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <MultiSelectDropdown
              data={excel_files}
              title="Choose File"
              onSelectionChange={setSelectedFiles}
              needUri={true}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 8,
            }}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.push("/(features)/uploadData")}
            >
              <ThemedText type="smalltitle" style={{ textAlign: "center" }}>
                Upload New
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnP} onPress={handleSectionOne}>
              <ThemedText
                type="smalltitle"
                style={{
                  textAlign: "center",
                  color: "white",
                }}
              >
                Next Step
              </ThemedText>
              <Ionicons
                name="arrow-forward-sharp"
                color={"white"}
                size={24}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </>
      )}
      {section === "selectTemplate" && (
        <>
          <View style={styles.viewBox}>
            {selectedTemp.length > 0 ? (
              <ChatPreview selected={selectedTemp[0]?.selected} />
            ) : (
              <View style={styles.webViewPreview}>
                <ThemedText>Select a file to view</ThemedText>
              </View>
            )}
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <MultiSelectDropdown
              data={my_templates}
              title="Choose Template"
              onSelectionChange={setSelectedTemp}
              isWpTemplate={true}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 8,
            }}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                router.push(
                  "/(features)/Helpers/WhatsappTemplate/CreateTemplate"
                )
              }
            >
              <ThemedText type="smalltitle" style={{ textAlign: "center" }}>
                Create New
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnP}>
              <ThemedText
                type="smalltitle"
                style={{
                  textAlign: "center",
                  color: "white",
                }}
              >
                Next Step
              </ThemedText>
              <Ionicons
                name="arrow-forward-sharp"
                color={"white"}
                size={24}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </>
      )}
    </InnerScreens>
  );
};

export default Whatsapp;

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    marginBottom: 64,
  },
  outerBackground: {
    flex: 1,
    backgroundColor: "#d1fae5", // green-100 equivalent
  },
  innerBackground: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
  },
  messageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  messageWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageBubble: {
    backgroundColor: "#f3f4f6", // gray-100 equivalent
    padding: 12,
    borderRadius: 8,
    maxWidth: 250,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#3b82f6", // blue-400 equivalent
    fontSize: 14,
  },
  viewBox: {
    width: "100%",
    height: 300,
    padding: 16,
    marginBottom: 16,
  },
  btn: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 96,
    width: "49%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  btnP: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 96,
    width: "49%",
    color: "white",
    backgroundColor: "#000",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  webView: {
    width: "100%",
    height: "100%",
  },
  webViewPreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4ee",
    padding: 16,
  },
});
