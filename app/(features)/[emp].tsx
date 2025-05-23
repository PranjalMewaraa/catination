import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import InnerScreens from "@/components/my_ui/InnerScreens";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MenuContainer from "@/components/my_ui/MenuContainer";
import api from "@/utils/api";
import CardContainer from "@/components/my_ui/CardContainer";
import { Colors } from "@/constants/Colors";
import { openDialPad } from "@/utils/openDialPad";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  setActiveEmployee,
  setError,
  setLoading,
  setPrevEmployee,
} from "@/store/slices/employeeSlice";

// Type definitions
interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface LeadData {
  New?: Lead[];
  Active?: Lead[];
  Previous?: Lead[];
}

const Employees = () => {
  const { emp } = useLocalSearchParams<{ emp: string }>();
  const activeEmployee = useSelector(
    (state: RootState) => state.employee.activeEmployee
  );
  const pastEmployee = useSelector(
    (state: RootState) => state.employee.pastEmployee
  );
  const finalArray = [...activeEmployee, ...pastEmployee];

  const employee = useMemo(
    () =>
      finalArray.find((it) => it?._id === emp) || {
        name: "Unknown",
        email: "",
      },
    [emp, finalArray]
  );

  const [data, setData] = useState<LeadData>({});
  const [dataNew, setDataNew] = useState<Lead[]>([]);
  const [dataActive, setDataActive] = useState<Lead[]>([]);
  const [dataPrev, setDataPrev] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const getAssignedLeads = async () => {
    if (!emp) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/leads/findCustomers", {
        employeeId: emp,
      });

      setData(res || {});
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

  useEffect(() => {
    setDataNew(data?.New || []);
    setDataPrev(data?.Previous || []);
    setDataActive(data?.Active || []);
  }, [data]);
  const [visible, setVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalData, setModalData] = useState("");
  const handleModalForInfo = (action = "PHONE", data) => {
    setVisible(true);
    setModalData(data);
    setModalAction(action);
  };
  const [deletemidal, setDeleteModal] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState("");
  const handleDelete = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.put("/employee/deleteEmployee", {
      id: selectedDelete._id,
      adminId: adminId,
    });

    Toast.show({
      text1: "Status Changed to Inactive",
      text2: "Employee has been successfully deleted",
      type: "success",
    });
    setDeleteModal(false);
    Refresh();
    router.replace("/(tabs)/employees");
  };
  const OpenDeleteModal = (id) => {
    setSelectedDelete(id);
    setDeleteModal(true);
  };
  const dispatch = useDispatch();
  const FetchEmployee = async () => {
    const admin_id = (await AsyncStorage.getItem("id")) || user._id;

    try {
      dispatch(setLoading(true));

      const response: any = await api.post("/employee/getAllActiveEmployee", {
        id: admin_id,
      });
      dispatch(setActiveEmployee(response));
    } catch (error) {
      dispatch(setError("Employee Fetch Error . Please try again.")); // Store error in Redux
      console.error("Employee Fetch Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const FetchPastEmployee = async () => {
    const admin_id = (await AsyncStorage.getItem("id")) || user._id;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response: any = await api.post("/employee/getAllInactiveEmployee", {
        id: admin_id,
      });
      dispatch(setPrevEmployee(response));
    } catch (error) {
      dispatch(setError("Employee Fetch Error . Please try again.")); // Store error in Redux
      console.error("Employee Fetch Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const EmployeeCard = ({ items }: { items: Lead }) => {
    return (
      <CardContainer style={styles.cardWidget}>
        <View style={styles.empHead}>
          <Ionicons name="business-outline" style={styles.empImg} size={34} />
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
        <View style={styles.body}>
          <ThemedText type="subtitle">{items.property}</ThemedText>

          <ThemedText type="smalltitle">
            <Ionicons name="call-outline" size={20} />
            {` ${items?.phone || "N/A"}`}
          </ThemedText>

          <ThemedText type="default">
            <Ionicons name="location" size={16} />{" "}
            {` ${items?.location || "N/A"}`}
          </ThemedText>
        </View>
        <View style={styles.tailEmp}>
          <Ionicons name="arrow-up-sharp" size={24} style={styles.bgMenuR} />

          <ThemedText type="smalltitle" style={styles.bgMenu}>
            {section === "NEW"
              ? "Unattended Right Now"
              : items.interested
              ? "Interested"
              : "Not Interested"}
          </ThemedText>
        </View>
      </CardContainer>
    );
  };
  const Refresh = () => {
    FetchEmployee();
    FetchPastEmployee();
  };

  const retrieveEmployee = async () => {
    const res = await api.put("/employee/recoverEmployee", {
      id: selectedDelete._id,
    });
    console.log(res);
    Toast.show({
      type: "success",
      text1: "Employee recovered successfully",
    });
    setDeleteModal(false);
    Refresh();
    router.replace("/(tabs)/employees");
  };

  const [section, setSection] = useState<"NEW" | "ACTIVE" | "PAST">("NEW");

  return (
    <InnerScreens name={"Employee Information"}>
      <ScrollView>
        <View style={styles.employeeCard}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={() =>
                router.push(`/(features)/updateEmployee/${employee._id}`)
              }
            >
              <Ionicons
                name="pencil-outline"
                size={28}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.employeeInfo}>
            <Ionicons name="person" size={64} style={styles.profileIcon} />
            <View style={styles.employeeDetails}>
              <ThemedText type="title">{employee.name}</ThemedText>
              <ThemedText type="smalltitle" style={styles.emailText}>
                {employee.email}
              </ThemedText>
            </View>
            <View style={styles.actionButtons}>
              <MenuContainer style={styles.actionButton}>
                <Ionicons
                  name="mail-outline"
                  size={28}
                  onPress={() => handleModalForInfo("MAIL", employee.email)}
                />
              </MenuContainer>
              <MenuContainer style={styles.actionButton}>
                <Ionicons
                  name="call-outline"
                  size={28}
                  onPress={() =>
                    handleModalForInfo("PHONE NUMBER", employee.contactNumber)
                  }
                />
              </MenuContainer>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => OpenDeleteModal(employee)}
              >
                <Ionicons name="trash-outline" color={"white"} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.leadsContainer}>
          <View style={styles.leadsHeader}>
            <ThemedText style={{ paddingHorizontal: 16 }} type="title">
              Assigned Leads
            </ThemedText>
            <MenuContainer style={styles.addButton}>
              <Ionicons name="add-outline" size={28} />
            </MenuContainer>
          </View>

          <View style={styles.sectionButtons}>
            {["NEW", "ACTIVE", "PAST"].map((sec) => (
              <TouchableOpacity
                key={sec}
                style={[
                  styles.sectionButton,
                  section === sec && styles.activeSectionButton,
                ]}
                onPress={() => setSection(sec as "NEW" | "ACTIVE" | "PAST")}
              >
                <ThemedText
                  style={{
                    color: section === sec ? "#fff" : "#000",
                  }}
                >
                  {sec.charAt(0) + sec.slice(1).toLowerCase()}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading && <ActivityIndicator size="large" color="#000" />}
          {errors && <ThemedText style={styles.errorText}>{errors}</ThemedText>}

          {!isLoading && !errors && (
            <FlatList
              data={
                section === "NEW"
                  ? dataNew
                  : section === "ACTIVE"
                  ? dataActive
                  : dataPrev
              }
              style={{ marginTop: 16 }}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.widgetContainer}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => <EmployeeCard items={item} />}
              nestedScrollEnabled={true}
              ListEmptyComponent={
                <ThemedText>No leads found for this section</ThemedText>
              }
            />
          )}
        </View>
      </ScrollView>
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
                shadowColor: "#000",
                shadowOffset: { width: 8, height: 8 },
                shadowOpacity: 0.17,
                shadowRadius: 93.05,
              }}
            >
              <ThemedText type="smalltitle">
                {modalAction}: {modalData}
              </ThemedText>
              <TouchableOpacity
                style={{ width: "100%", padding: 16, backgroundColor: "#000" }}
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
      <Modal visible={deletemidal} transparent={true} style={styles.infoModal}>
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
                height: 300,
                backgroundColor: "#fff",
                padding: 16,
                flexDirection: "column",
                borderRadius: 8,

                shadowColor: "#000",
                shadowOffset: { width: 8, height: 8 },
                shadowOpacity: 0.17,
                shadowRadius: 93.05,
                elevation: 17,
                justifyContent: "center",
                gap: 24,
                paddingVertical: 32,
              }}
            >
              <ThemedText type="smalltitle">
                {selectedDelete.employmentStatus === "inactive"
                  ? "Are you sure , you want to recover this employee?"
                  : "Are you sure you want to delete this employee"}
              </ThemedText>
              <TouchableOpacity
                style={{ width: "100%", padding: 16, backgroundColor: "#000" }}
                onPress={() =>
                  selectedDelete.employmentStatus === "inactive"
                    ? retrieveEmployee()
                    : handleDelete()
                }
              >
                <ThemedText
                  type="smalltitle"
                  style={{ color: "#fff", textAlign: "center" }}
                >
                  YES
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "100%",
                  padding: 16,
                  backgroundColor: "#000",
                }}
                onPress={() => setDeleteModal(false)}
              >
                <ThemedText
                  type="smalltitle"
                  style={{ color: "#fff", textAlign: "center" }}
                >
                  Close
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </InnerScreens>
  );
};

export default Employees;

const styles = StyleSheet.create({
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
