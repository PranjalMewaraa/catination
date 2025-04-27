import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Button,
  Modal,
  ActivityIndicator,
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
import DynamicModal from "@/components/BestModal";
import InputBox from "@/components/my_ui/InputBox";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useFiles } from "../../hooks/useFiles";

export default function MyFiles() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leadData, setLeadData] = useState();
  const [employeeData, setEmployeeData] = useState(employeefiles);
  const [active, setActive] = useState("leads");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { files, loading, error, loadFiles } = useFiles();
  const activeEmployee = useSelector(
    (state: RootState) => state.employee.activeEmployee
  );
  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    setLeadData(files);
  }, [files]);

  const Refresh = () => {
    loadFiles();
    handleManualLead();
  };

  function transformArray(data: []) {
    return data.map((item) => ({
      label: item.fileName,
      value: item.fileName,
    }));
  }
  function transformArrayEmp(data: []) {
    return data.map((item) => ({
      label: `${item.name} | ${item.email}`,
      value: item._id,
    }));
  }
  const dropdownArray = transformArray(files);
  const empsel = transformArrayEmp(activeEmployee);
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
              type="default"
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

  const [lead, setLead] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    assignedTo: "",
    property: "",
    location: "",
  });

  const handleInputChange = (field, value) => {
    setLead((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectionChange = (selectedItems) => {
    setLead((prev) => ({
      ...prev,
      assignedTo: selectedItems.length > 0 ? selectedItems[0] : "",
    }));
  };

  const handleDistributedLeads = async () => {
    const adminId = await AsyncStorage.getItem("id");

    const res = await api.post("/leads/distribute", {
      adminId: adminId,
      fileName: selectedFiles,
      employeeIds: [...employeeData],
    });

    router.push("/(tabs)/services");
    Toast.show({
      type: "success",
      text1: "Operation successfull",
    });
  };

  // Handler for saving the lead
  const handleSaveLead = async () => {
    const id = await AsyncStorage.getItem("id");
    const data = {
      adminId: id,
      ...lead,
    };
    const res = await api.post("/leads/addLeads", data);
    handleManualLead();
    setModalVisible(false);
  };

  const [manualLeads, setmanualLeads] = useState([]);
  const handleManualLead = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.post(`/data/getAllData`, {
      id: adminId,
    });
    console.log("ss", res);
    setmanualLeads(res);
  };

  useEffect(() => {
    handleManualLead();
    callMetaLeads();
  }, []);
  const [bulk, setbulk] = useState(true);

  const [visible, setVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalData, setModalData] = useState("");
  const handleModalForInfo = (action = "PHONE", data) => {
    setVisible(true);
    setModalData(data);
    setModalAction(action);
  };

  const callMetaLeads = async () => {
    const res = await api.post("/metaleads/metaLeads");
    console.log(res);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContainer
      style={{
        flex: 1,
        paddingHorizontal: 0,
      }}
      onRefresh={Refresh}
    >
      <View
        style={{
          padding: 20,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "75%" }}>
          <ThemedText style={{ fontSize: 36 }} type="title">
            Files
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() =>
            !bulk
              ? router.push("/(features)/uploadData")
              : router.push("/(features)/uploadLeadFiles")
          }
        >
          <Ionicons style={styles.fab} name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {active === "leads" && (
        <View style={styles.serviceContainer2}>
          <TouchableOpacity
            style={[
              styles.bgMenu3,
              { backgroundColor: bulk ? "#000" : Colors.cardBg },
              { zIndex: bulk ? 50 : 0 },
            ]}
            onPress={() => setbulk(true)}
          >
            <ThemedText
              style={{ color: bulk ? "#fff" : "#000" }}
              type="default"
            >
              Lead Files
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bgMenu4,
              {
                backgroundColor: !bulk ? "#000" : Colors.cardBg,
              },
            ]}
            onPress={() => setbulk(false)}
          >
            <ThemedText
              style={{ color: !bulk ? "#fff" : "#000" }}
              type="default"
            >
              Marketing Files
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {active === "leads" && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={bulk ? leadData : manualLeads}
            keyExtractor={(item) => (bulk ? item.fileName : item._id)}
            numColumns={1} // ✅ Ensures a two-column grid
            contentContainerStyle={styles.widgetContainer}
            renderItem={({ item }) =>
              bulk ? <FileCard {...item} /> : <FileCard {...item} />
            }
          />
        </View>
      )}

      <DynamicModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ScrollView nestedScrollEnabled style={{ flex: 1, width: "100%" }}>
          <View style={styles.modal}>
            <ThemedText style={styles.pageTitle}>Add a Lead!</ThemedText>
            <View style={styles.modal}>
              <InputBox
                id="name"
                placeholder="enter name"
                inputMode="text"
                value={lead.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
              <InputBox
                id="phone"
                placeholder="enter phone"
                inputMode="tel" // Changed to "tel" for phone numbers
                value={lead.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
              <InputBox
                id="email"
                placeholder="enter email"
                inputMode="email"
                value={lead.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
              <InputBox
                id="source"
                placeholder="enter source (call /email /msg etc)"
                inputMode="text"
                value={lead.source}
                onChangeText={(text) => handleInputChange("source", text)}
              />
              <InputBox
                id="source"
                placeholder="enter city / location"
                inputMode="text"
                value={lead.location}
                onChangeText={(text) => handleInputChange("location", text)}
              />
              <InputBox
                id="assignedTo"
                placeholder="enter query (desc)"
                inputMode="text"
                value={lead.property} // Using "property" for query since no "query" field exists in state
                onChangeText={(text) => handleInputChange("property", text)}
              />
              <MultiSelectDropdown
                data={empsel}
                title="Assign lead to employee"
                onSelectionChange={handleSelectionChange}
                selectedItems={lead.assignedTo ? [lead.assignedTo] : []} // Assuming it accepts an array
              />
              <TouchableOpacity
                style={{
                  padding: 16,
                  backgroundColor: "#000",
                  borderRadius: 8,
                  width: "100%",
                  marginTop: 16,
                }}
                onPress={handleSaveLead}
              >
                <ThemedText style={{ color: "#fff", textAlign: "center" }}>
                  Save Lead Info
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </DynamicModal>
    </AuthContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  pageTitle: {
    fontSize: 36,
    lineHeight: 36,
  },
  fab: {
    padding: 16,
    backgroundColor: "black",
    color: "white",
    borderRadius: 8,
  },
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
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 10,
    backgroundColor: Colors.cardBg,
    transform: [{ translateX: -16 }],
  },
  bgMenu5: {
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    backgroundColor: Colors.cardBg,
    transform: [{ translateX: -24 }],
  },
  serviceContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  serviceContainer2: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 10,
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
  modalContent: {
    flex: 1,
  },
  titleBox: {
    marginTop: 32,
    flexDirection: "column",
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
    flexDirection: "row",
    gap: 4,
  },
  tailEmp: {
    width: "100%",
    flexDirection: "row",
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
    height: "auto",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    color: "#D3d3d3",
  },
});
