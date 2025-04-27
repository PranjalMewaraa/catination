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
import LeadDetailsModal from "@/components/my_ui/LeadDetailModal";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function LeadsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leadData, setLeadData] = useState();
  const [employeeData, setEmployeeData] = useState([]);
  const [active, setActive] = useState("leads");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { files, loading, error, loadFiles } = useFiles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [messageEmpty, setMessageEmpty] = useState("No leads available");
  const [showDatePicker, setShowDatePicker] = useState(false);

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
            <Ionicons name="trash-outline" size={28} color={"red"} />
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
    Budget: "",
    tags: "manual",
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
    const res = await api.get(`/leads/leadDetails?adminId=${adminId}`);
    console.log("ss", res.leads);
    setmanualLeads(res.leads);
  };

  useEffect(() => {
    handleManualLead();
    callMetaLeads();
  }, []);

  const [visible, setVisible] = useState(false);
  const [leadModal, setLeadModal] = useState(false);
  const [selectModalLead, setSelectLeadModal] = useState({});
  const handleLeadModalClose = () => setLeadModal(false);
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
  const [searchAv, setSearchAv] = useState(null);
  let debounceTimeout: string | number | NodeJS.Timeout | undefined;
  const changeAvSearch = (text) => {
    setSearchAv(text); // Update state immediately
    clearTimeout(debounceTimeout);

    // Set new timeout
    debounceTimeout = setTimeout(() => {
      // Your API call

      const filterData = filterBySearchTerm(manualLeads, text);
    }, 300);
  };

  function filterBySearchTerm(data, searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return data;
    }

    // Convert search term to lowercase for case-insensitive search
    const lowerSearchTerm = searchTerm.toLowerCase();

    return data.filter((item) => {
      // Convert object to string and check if it includes the search term
      return Object.values(item)
        .map((value) => String(value).toLowerCase()) // Convert each value to string and lowercase
        .some((value) => value.includes(lowerSearchTerm)); // Check if any value includes search term
    });
  }
  const EmployeeCard = ({
    _id,
    name,
    phone,
    email,
    property,
    Budget,
    source,
    location,
    status, // could also be: "in-progress", "bought", "not bought"
    visitDate, // required if status === "in-progress"
    visitTime, // required if status === "in-progress"
    interested,
    reason,
    tags,
    createdAt,
    updatedAt,
    adminId,
    assignedTo,
    employeeDetail,
  }) => {
    const handleCardClick = () => {
      const lead = {
        _id: _id,
        name: name,
        phone: phone,
        email: email,
        property: property,
        Budget: Budget,
        source: source,
        location: location,
        status: status, // could also be: "in-progress", "bought", "not bought"
        visitDate: visitDate, // required if status === "in-progress"
        visitTime: visitTime, // required if status === "in-progress"
        interested: interested,
        reason: reason,
        createdAt: createdAt,
        updatedAt: updatedAt,
        adminId: adminId,
        assignedTo: assignedTo,
        employeeDetail: employeeDetail,
        tags: tags,
      };
      setSelectLeadModal(lead);
      setLeadModal(true);
    };

    function formatDate(dateString) {
      const date = new Date(dateString);
      const currentYear = new Date().getFullYear();

      const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for the day
      const month = date.toLocaleString("default", { month: "short" }); // Get short month name
      const year =
        date.getFullYear() !== currentYear
          ? `, ${date.getFullYear()}`
          : `, ${date.getFullYear()}`; // Only include year if it's not the current year

      return `${day}, ${month}${year}`;
    }
    const getStatusText = () => {
      if (!status) return "New lead";
      if (status === "in-progress") return interested;
      if (status === "bought" || status === "not interested")
        return ` ${status}`;
      return `Status: ${status}`;
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
              Assigned to : {employeeDetail?.name}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText type="smalltitle" style={{ textOverflow: "wrap" }}>
            Looking for : {property}
          </ThemedText>
          <ThemedText type="default" style={{ textOverflow: "wrap" }}>
            Location : {location}
          </ThemedText>
          <ThemedText type="default" style={{ textOverflow: "wrap" }}>
            Approched by : {source || "UNKNOWN"}
          </ThemedText>
          <ThemedText type="default" style={{ textOverflow: "wrap" }}>
            Posted On : {formatDate(createdAt) || "UNKNOWN"}
          </ThemedText>
          {status === "in-progress" && (
            <ThemedText type="default" style={{ textOverflow: "wrap" }}>
              Visit : {`${visitDate} ${visitTime}` || "UNKNOWN"}
            </ThemedText>
          )}
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
              Status: {getStatusText()}
            </ThemedText>
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
        <LeadDetailsModal
          visible={leadModal}
          onClose={handleLeadModalClose}
          lead={selectModalLead}
        />
      </CardContainer>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const filterByDate = (data, dateKey) => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate.toDateString() === selectedDate.toDateString();
    });
  };

  const handleFilter = () => {
    const filteredData = filterByDate(manualLeads, "createdAt");
    setmanualLeads(filteredData);
    setFiltersApplied(true);
    setFilterModalVisible(false);
    setMessageEmpty("No leads created on the selected date");
  };

  const handleResetFilters = async () => {
    await handleManualLead(); // refetch leads
    setFiltersApplied(false);
    setFilterModalVisible(false);
    setSelectedDate(new Date());
    setMessageEmpty("No leads available");
  };

  const handleFilterIconClick = () => {
    setFilterModalVisible(true);
  };

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
            Leads
          </ThemedText>
        </View>
        {active === "leads" && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons style={styles.fab} name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
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

        {/* <TouchableOpacity
          style={[
            styles.bgMenu4,
            {
              backgroundColor: active === "MetaLeads" ? "#000" : Colors.cardBg,
            },
          ]}
          onPress={() => setActive("MetaLeads")}
        >
          <ThemedText
            style={{ color: active === "MetaLeads" ? "#fff" : "#000" }}
            type="smalltitle"
          >
            Meta Leads
          </ThemedText>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.bgMenu4,
            {
              backgroundColor: active === "distribute" ? "#000" : Colors.cardBg,
              zIndex: active === "distribute" ? 20 : 9,
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

      {active === "leads" && (
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "#E0E0E0",
                borderRadius: 16,
              }}
            >
              <Ionicons name="search" size={20} />
              <View style={{ width: "65%" }}>
                <InputBox
                  id="searchAv"
                  placeholder="What are you looking for ..."
                  value={searchAv}
                  marginVertical={0}
                  onChangeText={(text) => changeAvSearch(text)}
                />
              </View>
              <TouchableOpacity
                onPress={handleFilterIconClick}
                style={{
                  borderWidth: filtersApplied ? 2 : 1,
                  padding: 12,
                  borderRadius: 8,
                  borderColor: filtersApplied ? "blue" : "black",
                }}
              >
                <Ionicons
                  name="filter"
                  size={20}
                  color={filtersApplied ? "blue" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={filterBySearchTerm(manualLeads, searchAv)}
            keyExtractor={(item) => item._id}
            numColumns={1}
            contentContainerStyle={styles.widgetContainer}
            renderItem={({ item }) => <EmployeeCard {...item} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>{messageEmpty}</ThemedText>
              </View>
            )}
          />
        </View>
      )}
      {active === "distribute" && (
        <View style={{ flex: 1, padding: 24 }}>
          <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
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
              <MultiSelectDropdown
                data={empsel}
                title="Assign lead to employee"
                onSelectionChange={handleSelectionChange}
                selectedItems={lead.assignedTo ? [lead.assignedTo] : []} // Assuming it accepts an array
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
                id="budget"
                placeholder="enter budgets"
                inputMode="text"
                value={lead.Budget}
                onChangeText={(text) => handleInputChange("Budget", text)}
              />

              <InputBox
                id="assignedTo"
                placeholder="enter query (desc)"
                inputMode="text"
                value={lead.property} // Using "property" for query since no "query" field exists in state
                onChangeText={(text) => handleInputChange("property", text)}
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
      <DynamicModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      >
        <View
          style={{
            padding: 16,
            borderRadius: 10,
            backgroundColor: "white",
            width: "90%",
            alignSelf: "center",
          }}
        >
          <ThemedText type="title" style={{ marginBottom: 16, fontSize: 22 }}>
            Sort & Filter
          </ThemedText>

          <TouchableOpacity
            style={{
              marginBottom: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: "#f1f1f1",
              alignItems: "center",
            }}
            onPress={() => {
              const sorted = [...manualLeads].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              setmanualLeads(sorted);
              setFiltersApplied(true);
              setFilterModalVisible(false);
            }}
          >
            <ThemedText type="default" style={{ fontSize: 16 }}>
              Newest First
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginBottom: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: "#f1f1f1",
              alignItems: "center",
            }}
            onPress={() => {
              const sorted = [...manualLeads].sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
              );
              setmanualLeads(sorted);
              setFiltersApplied(true);
              setFilterModalVisible(false);
            }}
          >
            <ThemedText type="default" style={{ fontSize: 16 }}>
              Recently Updated
            </ThemedText>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <ThemedText
              type="default"
              style={{ fontWeight: "600", marginBottom: 4 }}
            >
              Filter by Date
            </ThemedText>
            <View
              style={{
                backgroundColor: "#d3d3d3",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 8,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#d3d3d3",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  style={{ marginRight: 8 }}
                />
                <ThemedText>{selectedDate.toDateString()}</ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false); // Hide picker once a date is selected or dismissed
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleFilter}
            style={{
              marginTop: 24,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: "black",
              alignItems: "center",
            }}
          >
            <ThemedText type="default" style={{ color: "white", fontSize: 16 }}>
              Apply Filter
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResetFilters}
            style={{
              marginTop: 12,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: "gray",
              alignItems: "center",
            }}
          >
            <ThemedText type="default" style={{ color: "white", fontSize: 16 }}>
              Reset Filters
            </ThemedText>
          </TouchableOpacity>
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
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
