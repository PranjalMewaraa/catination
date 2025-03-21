import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AuthContainer from "@/components/my_ui/AuthContainer";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import leadfile from "../../dummy/leadfile.json";
import employeefiles from "../../dummy/employee.json";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CardContainer from "@/components/my_ui/CardContainer";
import SelectDropdown from "react-native-select-dropdown";
import MultiSelectDropdown from "@/components/my_ui/MultiSelectDropdown";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchFiles } from "@/store/slices/filesSlice";
import api from "@/utils/api";
import WebView from "react-native-webview";
import DynamicModal from "@/components/BestModal";

export default function LeadsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leadData, setLeadData] = useState(leadfile);
  const [employeeData, setEmployeeData] = useState(employeefiles);
  const [active, setrActive] = useState("leads");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState([]);
  const [curr, setCurr] = useState(null);
  const dispatch = useAppDispatch();
  const { files, loading, error } = useAppSelector((state) => state.files);

  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    const getTemplates = async () => {
      const data = await api.get("/template/allTemplates");
      setTemplates(data.templates);
    };
    getTemplates();
    dispatch(fetchFiles());
  }, [dispatch]);

  useEffect(() => {
    const getPreview = async () => {
      if (selectedTemplate) {
        const preview = await api.post("/template/getTemplate", {
          templateName: selectedTemplate,
        });
        setCurr(preview.template);
      }
    };
    getPreview();
  }, [selectedTemplate]);

  function transformArray(data: []) {
    return data.map((item) => ({
      label: item.fileName,
      value: item.fileName,
    }));
  }
  function transformArrayEmp(data: []) {
    return data.map((item) => ({
      label: `${item.name}`,
      value: item.name,
    }));
  }
  let dropdownArray = transformArray(files);
  const empsel = transformArrayEmp(templates);
  const FileCard = ({ fileName }) => {
    return (
      <CardContainer style={styles.cardWidget}>
        <View style={styles.cardWidgetHeader}>
          <Ionicons
            name={"document-outline"}
            size={32}
            color={"black"}
            style={[styles.icon, { borderColor: "black", borderWidth: 1 }]}
          />
          <View>
            <ThemedText
              style={{ width: "100%", textAlign: "left" }}
              type="subtitle"
            >
              {fileName}
            </ThemedText>
          </View>
        </View>
        <View style={styles.rightWidget}>
          <View
            style={{
              padding: 8,
              backgroundColor: "#FF6867",
              borderRadius: 50,
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ translateX: 10 }],
            }}
          >
            <Ionicons name="trash-outline" size={28} color={"white"} />
          </View>
        </View>
      </CardContainer>
    );
  };

  return (
    <InnerScreens
      style={{
        flex: 1,
        paddingHorizontal: 0,
      }}
      icon={"help-sharp"}
    >
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Launch Email
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Campaigns
        </ThemedText>
      </View>

      <View
        style={{
          flex: 1,
          padding: 24,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "column", gap: 16 }}>
          <MultiSelectDropdown
            data={dropdownArray}
            title="Choose File"
            onSelectionChange={setSelectedFiles}
          />

          <MultiSelectDropdown
            data={empsel}
            title="Choose Template"
            onSelectionChange={setSelectedTemplate}
            style={{ width: 100 }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              borderRadius: 10,
              borderWidth: 1,
              marginHorizontal: 8,
              borderColor: "gray",
            }}
          >
            <ThemedText
              style={{ color: "gray", padding: 16, textAlign: "center" }}
            >
              Show my Template
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              borderRadius: 10,
              borderWidth: 1,
              marginHorizontal: 8,
              backgroundColor: "#000",
            }}
          >
            <ThemedText
              style={{ color: "white", padding: 16, textAlign: "center" }}
            >
              Launch Mails
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText type="link" style={{ textAlign: "center" }}>
          Create new template
        </ThemedText>
      </View>
      <DynamicModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, marginTop: 24 }}>
          <WebView
            scalesPageToFit={true}
            bounces={false}
            style={{ height: 200, width: 350 }}
            javaScriptEnabled
            source={{ html: `${curr?.HtmlPart}` }}
          />
        </View>
      </DynamicModal>
    </InnerScreens>
  );
}

// Styles
const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    width: 350,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  bgMenu3: {
    padding: 16,
    paddingRight: 24,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    transform: [{ translateX: 0 }],
    alignItems: "center",
    justifyContent: "center",
  },
  rightWidget: {
    height: "100%",
    flexDirection: "column",
    marginRight: 16,
  },
  bgMenu4: {
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.cardBg,
    transform: [{ translateX: -16 }],
  },
  serviceContainer: {
    flexDirection: "row",
    padding: 20,
  },
  widgetContainer: {
    paddingBottom: 20,
    paddingTop: 8,
    height: "auto",
  },
  cardWidget: {
    width: "100%", // ✅ Ensures two items per row with spacing
    // ✅ Adds space between rows
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    backgroundColor: Colors.cardBg,
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    padding: 8,
    borderRadius: 20,
  },
  cardWidgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    gap: 14,
  },
});
