import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AuthContainer from "@/components/my_ui/AuthContainer";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveEmployee,
  setError,
  setLoading,
  setPrevEmployee,
} from "@/store/slices/employeeSlice";
import api from "@/utils/api";
import { RootState } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import CardContainer from "@/components/my_ui/CardContainer";
import { isAuthenticated } from "@/utils/isAuth";
import { setUser } from "@/store/slices/userSlice";
import { adjust } from "@/utils/adjustSize";
import EmpAuthContainer from "@/components/my_ui/EmpAuthContainer";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import ModalFlowEmployee from "@/components/my_ui/EmployeeModalContent";
import InputBox from "@/components/my_ui/InputBox";
import DateTimePicker from "@react-native-community/datetimepicker";
import DynamicModal from "@/components/BestModal";
import EmpInnerScreens from "@/components/my_ui/EmpInnerContainer";

export default function EmplopyeeDashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [emp, setEmp] = useState("");
  const [data, setData] = useState([]);
  const [messageEmpty, setmessageEmpty] = useState("No items found");
  const [filtersApplied, setFiltersApplied] = useState(false); // Track if filters are applied
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState(null); // ✅ holds filtered data
  const [showDatePicker, setShowDatePicker] = useState(false);

  useState(() => {
    const getEmpId = async () => {
      const id = await AsyncStorage.getItem("e_id");
      console.log(id);
      setEmp(id);
    };
    getEmpId();
  }, []);

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

  const EmployeeCard = ({ items }: { items: Lead }) => {
    return (
      <CardContainer
        style={styles2.cardWidget}
        onPress={() => handleLead(items._id)}
      >
        <View style={styles2.empHead}>
          <Ionicons name="business-outline" style={styles2.empImg} size={34} />
          <View>
            <ThemedText type="smalltitle">{`Owner: ${
              items?.name || "N/A"
            }`}</ThemedText>
            <ThemedText
              type="default"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="mail" size={16} />
              {` ${items?.email || "N/A"}`}
            </ThemedText>
          </View>
        </View>
        <View style={styles2.body}>
          <ThemedText type="subtitle">{items.property}</ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <ThemedText type="default">
              <Ionicons name="call-outline" size={20} />
              {` ${items?.phone || "N/A"}`}
            </ThemedText>

            <ThemedText type="default">
              <Ionicons name="location" size={16} />{" "}
              {` ${items?.location || "N/A"}`}
            </ThemedText>
          </View>
          <ThemedText type="default">
            {`Date Added: ${formatDate(items?.createdAt) || "N/A"}`}
          </ThemedText>
          {section === "Active" && (
            <ThemedText type="default">
              <Ionicons name="calendar-number-outline" size={16} />{" "}
              {`Visit Date: ${items?.visitDate || "N/A"}`}
            </ThemedText>
          )}
          {section === "Active" && (
            <ThemedText type="default">
              <Ionicons name="time-outline" size={16} />{" "}
              {`Visit Time ${items?.visitTime || "N/A"}`}
            </ThemedText>
          )}
        </View>
        <View style={styles2.tailEmp}>
          <Ionicons name="arrow-up-sharp" size={24} style={styles2.bgMenuR} />

          <ThemedText type="smalltitle" style={styles2.bgMenu}>
            {section === "New"
              ? "Unattended Right Now"
              : section === "Active"
              ? items.interested
                ? "Interested"
                : "Not Interested"
              : section === "Old"
              ? items.status
              : "Not Interested"}
          </ThemedText>
        </View>
      </CardContainer>
    );
  };

  const getAssignedLeads = async () => {
    if (!emp) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/leads/findCustomers", {
        employeeId: emp,
      });
      console.log("ss", res);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to load leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate); // Update the selected date state
      // Close modal after date selection
    }
  };

  const filterByDate = (data, dateKey) => {
    return data?.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate.toDateString() === selectedDate.toDateString(); // Compare dates
    });
  };

  const handleFilter = () => {
    const dataToFilter =
      section === "New"
        ? data.New
        : section === "Active"
        ? data.Active
        : data.Previous;

    const filtered = filterByDate(dataToFilter, "createdAt");

    const newFilteredData = {
      ...data,
      [section]: filtered,
    };

    setFilteredData(newFilteredData); // ✅ Don't touch original
    setFiltersApplied(true);
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    getAssignedLeads(); // reloads full data
    setFilteredData(null);
    setFiltersApplied(false);
    setFilterModalVisible(false);
    setSelectedDate(new Date());
  };

  useEffect(() => {
    getAssignedLeads();
  }, [emp]);

  const Refresh = () => {
    getAssignedLeads();
  };

  const [section, setSection] = useState("New");

  const [isLoggedIn, setIsLoggedIn] = useState(null); // Default state to check if logged in
  const [isAuthChecked, setIsAuthChecked] = useState(false); // To check if auth state is checked

  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: any = await isAuthenticated();

      setIsLoggedIn(status);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("role");
    AsyncStorage.removeItem("user");
    router.dismissAll();
    router.replace("/login");
  };

  const [selectedLead, setSelectedLead] = useState();
  const handleLead = (id) => {
    setModalVisible(true);
    setSelectedLead(id);
  };

  const [searchAv, setSearchAv] = useState(null);

  let debounceTimeout: string | number | NodeJS.Timeout | undefined;
  const changeAvSearch = (text) => {
    setSearchAv(text); // Update state immediately
    clearTimeout(debounceTimeout);

    // Set new timeout
    debounceTimeout = setTimeout(() => {
      // Your API call
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
  const handleFilterIconClick = () => {
    setFilterModalVisible(true); // Show filter modal
  };
  const sortLeads = (sortKey = "createdAt") => {
    if (filtersApplied && filteredData) {
      setFilteredData((prev) => ({
        ...prev,
        [section]: [...(prev?.[section] || [])].sort(
          (a, b) => new Date(b[sortKey]) - new Date(a[sortKey])
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [section]: [...(prev?.[section] || [])].sort(
          (a, b) => new Date(b[sortKey]) - new Date(a[sortKey])
        ),
      }));
    }

    setFilterModalVisible(false);
  };

  return (
    <EmpInnerScreens
      style={{ flex: 1, backgroundColor: "#EDF0EA", paddingHorizontal: 0 }}
      onRefresh={Refresh}
      icon={"log-out-outline"}
      handleIconAction={handleLogout}
    >
      <View style={{ padding: 20 }}>
        <ThemedText type="subtitle">Welcome to,</ThemedText>
        <ThemedText
          style={{ fontSize: adjust(36), textOverflow: "wrap" }}
          type="title"
        >
          Manage Leads
        </ThemedText>
      </View>

      <ScrollView horizontal style={styles.serviceContainer}>
        <View
          style={[
            styles.bgMenu2,
            section === "New"
              ? { backgroundColor: "#000" }
              : { backgroundColor: Colors.cardBg }, // ✅ This is the override
          ]}
        >
          <TouchableOpacity
            onPress={() => setSection("New")}
            style={{ padding: 16 }}
          >
            <ThemedText style={{ color: section === "New" ? "#fff" : "#000" }}>
              New Leads
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.bgMenu3,

            section === "Active"
              ? { backgroundColor: "#000" }
              : { backgroundColor: Colors.cardBg }, // ✅ This is the override
          ]}
        >
          <TouchableOpacity
            style={{ padding: 16 }}
            onPress={() => setSection("Active")}
          >
            <ThemedText
              style={{
                color: section === "Active" ? "#fff" : "#000",
              }}
            >
              Active Leads
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.bgMenu4,
            section === "Previous"
              ? { backgroundColor: "#000" }
              : { backgroundColor: Colors.cardBg }, // ✅ This is the override
          ]}
        >
          <TouchableOpacity
            style={{ padding: 16, flexDirection: "row" }}
            onPress={() => setSection("Previous")}
          >
            <ThemedText
              style={{ color: section === "Previous" ? "#fff" : "#000" }}
            >
              Past Leads
            </ThemedText>
            <Ionicons name="trending-up-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, height: "auto", marginBottom: 8 }}>
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
              color={filtersApplied ? "blue" : "black"} // Change icon color based on filters
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={
          filtersApplied
            ? filterBySearchTerm(filteredData?.[section], searchAv)
            : filterBySearchTerm(data?.[section], searchAv)
        }
        style={{ flex: 1, marginTop: 16 }}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.widgetContainer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <EmployeeCard items={item} />}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <ThemedText style={{ fontSize: 16, color: "#888" }}>
              No employees found.
            </ThemedText>
          </View>
        }
      />
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

          {/* Sorting Options */}
          <TouchableOpacity
            style={{
              marginBottom: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: "#f1f1f1",
              alignItems: "center",
            }}
            onPress={() => sortLeads("createdAt")}
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
            onPress={() => sortLeads("updatedAt")}
          >
            <ThemedText type="default" style={{ fontSize: 16 }}>
              Recently Updated
            </ThemedText>
          </TouchableOpacity>

          {/* Date Picker */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <ThemedText type="default" style={{ fontWeight: "600" }}>
              Lead by Date
            </ThemedText>
            <View
              style={{
                backgroundColor: "#d3d3d3",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 8,
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

          {/* Apply Filter Button */}
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
            <ThemedText
              type="default"
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Apply Filter
            </ThemedText>
          </TouchableOpacity>

          {/* Reset Filters Button */}
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
            <ThemedText
              type="default"
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Reset Filters
            </ThemedText>
          </TouchableOpacity>
        </View>
      </DynamicModal>
      <ModalFlowEmployee
        visible={modalVisible}
        setVisible={setModalVisible}
        leadId={selectedLead}
        onRefresh={Refresh}
      />
    </EmpInnerScreens>
  );
}

// Styles
const styles = StyleSheet.create({
  bgMenu: {
    padding: 16,
    borderRadius: 45,
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: "#fff",
    width: 60,
    alignItems: "center",
    justifyContent: "center",
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
  bgMenu2: {
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    transform: [{ translateX: -8 }],
    alignItems: "center",
    justifyContent: "center",
  },
  bgMenu3: {
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",

    transform: [{ translateX: -16 }],
    alignItems: "center",
    justifyContent: "center",
  },
  bgMenu4: {
    paddingHorizontal: 20,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    gap: 8,

    transform: [{ translateX: -24 }],
  },
  serviceContainer: {
    flexDirection: "row",
    padding: 20,
  },
  widgetContainer: {
    paddingBottom: 20,
    paddingTop: 8,
    height: "auto",
    paddingHorizontal: 16,
  },
  cardWidget: {
    width: "100%", // ✅ Ensures two items per row with spacing
    // ✅ Adds space between rows
    padding: 16,
    borderRadius: 40,
    // borderWidth: 2,
    // borderColor: "#fff",
    backgroundColor: Colors.cardBg,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    padding: 8,
    borderRadius: 20,
  },
  cardWidgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",

    gap: 8,
  },
});

const styles2 = StyleSheet.create({
  infoModal: {
    width: "100%",
    flex: 1,
    padding: 32,
    flexDirection: "column",
    justifyContent: "center",
  },
  employeeCard: {
    minHeight: 300,
    width: "100%",
    backgroundColor: "#D6D6CB",
    borderRadius: 36,
    padding: 8,
  },
  editIcon: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  employeeInfo: {
    flexDirection: "column",
    width: "100%",
    gap: 4,
  },
  profileIcon: {
    padding: 16,
    borderRadius: 64,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 16,
  },
  employeeDetails: {
    alignItems: "center",
    marginTop: 16,
  },
  emailText: {
    color: "gray",
    fontWeight: "300",
    maxWidth: 250,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 32,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 32,
    backgroundColor: "red",
  },
  leadsContainer: {
    minHeight: 100,
    width: "100%",
    backgroundColor: "#F5F6EC",
    borderRadius: 36,
    padding: 8,
  },
  leadsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: 16,
    borderRadius: 32,
  },
  sectionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  sectionButton: {
    backgroundColor: "#fff",
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  activeSectionButton: {
    backgroundColor: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
  widgetContainer: {
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  cardWidget: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    alignItems: "flex-start",
    justifyContent: "center",
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
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    flexDirection: "column",
    gap: 4,
  },
  tailEmp: {
    width: "100%",
    flexDirection: "row",
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
    transform: [{ rotate: "45deg" }],
  },
});
