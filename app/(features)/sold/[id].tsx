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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import MenuContainer from "@/components/my_ui/MenuContainer";
import api from "@/utils/api";
import CardContainer from "@/components/my_ui/CardContainer";
import { Colors } from "@/constants/Colors";
import { openDialPad } from "@/utils/openDialPad";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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
  const { id } = useLocalSearchParams<{ emp: string }>();

  const [inventoriesSold, setInventorySold] = useState([]);

  const fetchInventorySold = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get("/propertyDetails/getAllProperties", {
      adminId: adminId,
    });

    setInventorySold(res.data);
  };

  useEffect(() => {
    fetchInventorySold();
  }, []);
  const flat = useMemo(
    () =>
      inventoriesSold.find((it) => it?._id === id) || {
        name: "Unknown",
        email: "",
      },
    [id, inventoriesSold]
  );

  const [data, setData] = useState<LeadData>({});
  const [dataNew, setDataNew] = useState<Lead[]>([]);
  const [dataActive, setDataActive] = useState<Lead[]>([]);
  const [dataPrev, setDataPrev] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAssignedLeads = async () => {
    // if (!id) return;
    // setIsLoading(true);
    // setError(null);
    // try {
    //   const res = await api.post("/leads/findCustomers", {
    //     employeeId: emp,
    //   });
    //   console.log(res);
    //   setData(res || {});
    // } catch (err) {
    //   console.error("Failed to fetch leads:", err);
    //   setError("Failed to load leads. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    getAssignedLeads();
  }, [id]);

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
      id: selectedDelete,
      adminId: adminId,
    });

    Toast.show({
      text1: "Status Changed to Inactive",
      text2: "Employee has been successfully deleted",
      type: "success",
    });
    setDeleteModal(false);
    router.push("/(tabs)/employees");
  };
  const OpenDeleteModal = (id) => {
    setSelectedDelete(id);
    setDeleteModal(true);
  };
  const EmployeeCard = ({ items }: { items: Lead }) => {
    return (
      <CardContainer style={styles.cardWidget}>
        <View style={styles.empHead}>
          <Ionicons name="business-outline" style={styles.empImg} size={34} />
          <View>
            <ThemedText type="smalltitle">{`Tenant Name `}</ThemedText>
            <ThemedText
              type="subtitle"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {items?.name || "N/A"}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText type="subtitle">{items.email}</ThemedText>

          <ThemedText type="smalltitle">
            <Ionicons name="call-outline" size={20} />
            {` ${items?.phone || "N/A"}`}
          </ThemedText>
        </View>
        {/* <View style={styles.tailEmp}>
          <Ionicons name="arrow-up-sharp" size={24} style={styles.bgMenuR} />
        </View> */}
      </CardContainer>
    );
  };
  const [tenant, setTenant] = useState([]);
  const getTenants = async () => {
    const tenantList = await api.post(
      `/tenant/getTenantByPropertyId?propertyId=${id}`
    );

    setTenant(tenantList.tenants);
  };

  useEffect(() => {
    getTenants();
  }, [id]);

  return (
    <InnerScreens name={"Sold Flat Information"} icon={"star-outline"}>
      <ScrollView>
        <View style={styles.employeeCard}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={() =>
                router.push(`/(features)/updateEmployee/${flat._id}`)
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
            <View style={styles.employeeDetails}>
              <ThemedText type="title">{flat.propertyName}</ThemedText>
              <ThemedText type="subtitle">{flat.societyName}</ThemedText>
              <ThemedText type="smalltitle" style={styles.emailText}>
                Owner: {flat.ownerName}
              </ThemedText>
              <ThemedText type="default" style={styles.emailText}>
                Address: {flat.address}
              </ThemedText>
            </View>
            <View style={styles.actionButtons}>
              <MenuContainer style={styles.actionButton}>
                <Ionicons
                  name="mail-outline"
                  size={28}
                  onPress={() => handleModalForInfo("MAIL", flat.email)}
                />
              </MenuContainer>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => OpenDeleteModal(flat._id)}
              >
                <Ionicons name="trash-outline" color={"red"} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.leadsContainer}>
          <View style={styles.leadsHeader}>
            <ThemedText style={{ paddingHorizontal: 16 }} type="title">
              Tenants Info
            </ThemedText>
            <MenuContainer style={styles.addButton}>
              <Ionicons
                name="add-outline"
                size={28}
                onPress={() => router.push(`/(features)/addTenant/${flat._id}`)}
              />
            </MenuContainer>
          </View>

          {isLoading && <ActivityIndicator size="large" color="#000" />}
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          {!isLoading && !error && (
            <FlatList
              data={tenant}
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
                Are you sure you want to delete this employee
              </ThemedText>
              <TouchableOpacity
                style={{ width: "100%", padding: 16, backgroundColor: "#000" }}
                onPress={() => handleDelete()}
              >
                <ThemedText
                  type="smalltitle"
                  style={{ color: "#fff", textAlign: "center" }}
                >
                  DELETE
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
    maxWidth: 350,
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
