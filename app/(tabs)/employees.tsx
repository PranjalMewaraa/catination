import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AuthContainer from "@/components/my_ui/AuthContainer";
import { ScrollView } from "react-native-gesture-handler";
import employees from "../../dummy/employee.json";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CardContainer from "@/components/my_ui/CardContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DynamicModal from "@/components/BestModal";
import { router } from "expo-router";

export default function EmployeeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [active, setActive] = useState(true);
  const activeEmployee = useSelector(
    (state: RootState) => state.employee.activeEmployee
  );
  const [visible, setVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalData, setModalData] = useState("");
  const handleModalForInfo = (action = "PHONE", data) => {
    setVisible(true);
    setModalData(data);
    setModalAction(action);
  };
  const pastEmployee = useSelector(
    (state: RootState) => state.employee.pastEmployee
  );
  const loading = useSelector((state: RootState) => state.employee.loading);
  const error = useSelector((state: RootState) => state.employee.error);

  const EmployeeCard = ({ name, _id, email, contactNumber }) => {
    const handleCardClick = () => {
      router.push(`(features)/${_id}`);
    };
    return (
      <CardContainer style={styles.cardWidget} onPress={handleCardClick}>
        <View style={styles.empHead}>
          <Ionicons name="person-outline" style={styles.empImg} size={26} />
          <View>
            <ThemedText
              type="default"
              style={{
                textOverflow: "wrap",
                maxWidth: 80,
              }}
            >
              {name}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText
            type="default"
            style={{ maxWidth: 300, textOverflow: "wrap" }}
          >
            {email}
          </ThemedText>
        </View>
        <View style={styles.tailEmp}>
          <Ionicons
            name="mail-outline"
            size={20}
            style={styles.bgMenu}
            onPress={() => handleModalForInfo("MAIL", email)}
          ></Ionicons>
          <Ionicons
            name="call-outline"
            size={20}
            style={styles.bgMenu}
            onPress={() => handleModalForInfo("PHONE NUMBER", contactNumber)}
          ></Ionicons>
          <Ionicons
            name="arrow-up-sharp"
            size={20}
            style={styles.bgMenuR}
          ></Ionicons>
        </View>
      </CardContainer>
    );
  };
  const [employeeData, setEmployeeData] = useState(activeEmployee);
  return (
    <AuthContainer
      style={{
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <View style={{ width: "80%" }}>
          <ThemedText type="subtitle">Your,</ThemedText>
          <ThemedText style={{ fontSize: 36 }} type="title">
            Employees
          </ThemedText>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            width: 64,
            height: 64,
            borderRadius: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push("/(features)/addEmployees")}
        >
          <ThemedText>
            <Ionicons name="add" size={32} color="#fff" />
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.serviceContainer}>
        <TouchableOpacity
          style={[
            styles.bgMenu3,
            { backgroundColor: active ? "#000" : "#f3f4ee" },
            { zIndex: active ? 50 : 0 },
          ]}
          onPress={() => setActive(!active)}
        >
          <ThemedText
            style={{ color: active ? "#fff" : "gray" }}
            type="default"
          >
            Current
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bgMenu4,
            { backgroundColor: !active ? "#000" : "#f3f4ee" },
          ]}
          onPress={() => setActive(!active)}
        >
          <ThemedText
            style={{ color: !active ? "#fff" : "gray" }}
            type="default"
          >
            Past
          </ThemedText>
          <Ionicons
            name="hourglass-outline"
            size={24}
            color={active ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>

      {employeeData.length > 0 ? (
        <FlatList
          data={active ? employeeData : pastEmployee}
          style={{ marginTop: 16 }}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }} // ✅ Ensures proper spacing
          contentContainerStyle={styles.widgetContainer}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => <EmployeeCard {...item} />}
        />
      ) : (
        <ThemedText style={{ paddingHorizontal: 16 }}>No Items</ThemedText>
      )}

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
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
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
    transform: [{ rotate: "45deg" }],
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
  bgMenu3: {
    padding: 16,
    paddingRight: 24,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: "#d3d3d3",
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
    borderWidth: 1,
    borderColor: "#d3d3d3",
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
    paddingHorizontal: 8,
    height: "auto",
  },
  cardWidget: {
    width: "50%", // ✅ Ensures two items per row with spacing
    // ✅ Adds space between rows
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    alignItems: "flex-start",
    justifyContent: "center",
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
  body: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    color: "#D3d3d3",
  },
});
