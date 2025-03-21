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
import { useFiles } from "@/hooks/useFiles";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function LeadsScreen() {
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

    setModalVisible(false);
  };

  const [manualLeads, setmanualLeads] = useState([]);
  const handleManualLead = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get(`/leads/leadDetails/${adminId}`, {
      adminId: adminId,
    });
    console.log(res.leads);
    setmanualLeads(res.leads);
  };

  useEffect(() => {
    handleManualLead();
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
  const EmployeeCard = ({
    name,
    _id,
    email,
    location,
    source,
    phone,
    property,
    assignedTo,
  }) => {
    const handleCardClick = () => {
      alert(`Lead ID: ${_id}`);
    };
    return (
      <CardContainer style={styles.cardWidget} onPress={handleCardClick}>
        <View style={styles.empHead}>
          <Ionicons name="person-outline" style={styles.empImg} size={34} />
          <View>
            <ThemedText
              type="subtitle"
              style={{ textOverflow: "wrap", maxWidth: 250 }}
            >
              {name}
            </ThemedText>
            <ThemedText
              type="default"
              style={{ textOverflow: "wrap", maxWidth: 250 }}
            >
              Lead Source : {source || "UNKNOWN"}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText type="smalltitle" style={{ textOverflow: "wrap" }}>
            Looking for : {property}
          </ThemedText>
          <ThemedText type="smalltitle" style={{ textOverflow: "wrap" }}>
            Location : {location}
          </ThemedText>
        </View>
        <View style={styles.tailEmp}>
          <Ionicons
            name="mail-outline"
            size={24}
            style={styles.bgMenu}
            onPress={() => handleModalForInfo("MAIL", email)}
          ></Ionicons>
          <Ionicons
            name="call-outline"
            size={24}
            style={styles.bgMenu}
            onPress={() => handleModalForInfo("PHONE NUMBER", phone)}
          ></Ionicons>
          <View style={styles.bgMenuR}>
            <ThemedText type="smalltitle" style={{ textOverflow: "wrap" }}>
              Assigned To
            </ThemedText>
            <Ionicons
              name="arrow-up-sharp"
              size={24}
              style={{ transform: [{ rotate: "45deg" }] }}
              onPress={() => router.push(`/(features)/${assignedTo}`)}
            ></Ionicons>
          </View>
        </View>
        <Modal visible={visible} transparent={true} style={styles.infoModal}>
          <View
            style={{
              padding: 32,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                padding: 32,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 200,
                  backgroundColor: "#fff",
                  padding: 16,
                  flexDirection: "column",
                  borderRadius: 8,
                  justifyContent: "center",
                  gap: 24,
                  paddingVertical: 32,
                }}
              >
                <ThemedText type="smalltitle">
                  {modalAction}: {modalData}
                </ThemedText>
                <TouchableOpacity
                  style={{
                    width: "100%",
                    padding: 16,
                    backgroundColor: "#000",
                  }}
                  onPress={() => setVisible(false)}
                >
                  <ThemedText type="smalltitle" style={{ color: "#fff" }}>
                    Close
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </CardContainer>
    );
  };
  if (loading) {
    return (
      <View>
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
    >
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Customers &
        </ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Leads
        </ThemedText>
      </View>
      <View style={styles.serviceContainer}>
        <TouchableOpacity
          style={[
            styles.bgMenu3,
            { backgroundColor: active === "leads" ? "#000" : Colors.cardBg },
            { zIndex: active === "leads" ? 50 : 0 },
          ]}
          onPress={() => setActive("leads")}
        >
          <ThemedText
            style={{ color: active === "leads" ? "#fff" : "#000" }}
            type="smalltitle"
          >
            Leads
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bgMenu4,
            {
              backgroundColor: active === "distribute" ? "#000" : Colors.cardBg,
            },
          ]}
          onPress={() => setActive("distribute")}
        >
          <ThemedText
            style={{ color: active === "distribute" ? "#fff" : "#000" }}
            type="smalltitle"
          >
            Distribute
          </ThemedText>
        </TouchableOpacity>
      </View>
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
            type="smalltitle"
          >
            Bulk Lead Files
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
            type="smalltitle"
          >
            Manual Leads
          </ThemedText>
        </TouchableOpacity>
      </View>
      {active === "leads" && (
        <>
          <FlatList
            data={bulk ? leadData : manualLeads}
            keyExtractor={(item) => (bulk ? item.fileName : item._id)}
            numColumns={1} // ✅ Ensures a two-column grid
            contentContainerStyle={styles.widgetContainer}
            renderItem={({ item }) =>
              bulk ? <FileCard {...item} /> : <EmployeeCard {...item} />
            }
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
      {active === "distribute" && (
        <View style={{ flex: 1, padding: 24 }}>
          <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
            {" "}
            Distribute Leads to Employee
          </ThemedText>

          <MultiSelectDropdown
            title="Select lead file"
            data={dropdownArray}
            onSelectionChange={setSelectedFiles}
          />
          <MultiSelectDropdown
            data={empsel}
            title="Choose Employees"
            onSelectionChange={setEmployeeData}
            isMulti={true}
          />
          <Pressable
            style={{
              marginVertical: 16,
              padding: 16,
              backgroundColor: "black",
              borderRadius: 50,
            }}
            onPress={handleDistributedLeads}
          >
            <ThemedText
              type="smalltitle"
              style={{ color: "#fff", textAlign: "center" }}
            >
              Distribute Leads
            </ThemedText>
          </Pressable>
        </View>
      )}
      <DynamicModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
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
    gap: 4,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  pageTitle: {
    fontSize: 36,
    lineHeight: 36,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
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
