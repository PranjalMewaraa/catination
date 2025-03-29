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

export default function EmplopyeeDashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [emp, setEmp] = useState("");
  const [data, setData] = useState([]);
  useState(() => {
    const getEmpId = async () => {
      const id = await AsyncStorage.getItem("e_id");
      console.log(id);
      setEmp(id);
    };
    getEmpId();
  }, []);

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

          <ThemedText type="default">
            <Ionicons name="call-outline" size={20} />
            {` ${items?.phone || "N/A"}`}
          </ThemedText>

          <ThemedText type="default">
            <Ionicons name="location" size={16} />{" "}
            {` ${items?.location || "N/A"}`}
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

  useEffect(() => {
    getAssignedLeads();
  }, [emp]);

  const Refresh = () => {
    getAssignedLeads();
  };

  const [section, setSection] = useState("New");

  const WidgetCard = ({ title, content, coloricon }) => {
    return (
      <CardContainer style={styles.cardWidget}>
        <View style={styles.cardWidgetHeader}>
          <Ionicons
            name="stop-circle-outline"
            size={24}
            color={"white"}
            style={[styles.icon, { backgroundColor: coloricon }]}
          />
          <ThemedText style={{ flexWrap: "wrap", width: 100, fontSize: 14 }}>
            {title}
          </ThemedText>
        </View>
        <View style={{ marginVertical: 16 }}>
          <ThemedText type="smalltitle">{content}</ThemedText>
        </View>
      </CardContainer>
    );
  };
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

  return (
    <EmpAuthContainer
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
          Employee Dashboard
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
            section === "Old"
              ? { backgroundColor: "#000" }
              : { backgroundColor: Colors.cardBg }, // ✅ This is the override
          ]}
        >
          <TouchableOpacity
            style={{ padding: 16, flexDirection: "row" }}
            onPress={() => setSection("Old")}
          >
            <ThemedText style={{ color: section === "Old" ? "#fff" : "#000" }}>
              Past Leads
            </ThemedText>
            <Ionicons name="trending-up-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FlatList
        data={
          section === "New"
            ? data.New
            : section === "Active"
            ? data.Active
            : data.Previous
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
      <ModalFlowEmployee
        visible={modalVisible}
        setVisible={setModalVisible}
        leadId={selectedLead}
        onRefresh={Refresh}
      />
    </EmpAuthContainer>
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
