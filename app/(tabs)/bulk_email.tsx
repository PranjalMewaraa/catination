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

export default function LeadsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leadData, setLeadData] = useState(leadfile);
  const [employeeData, setEmployeeData] = useState(employeefiles);
  const [active, setActive] = useState("leads");
  const [selectedFiles, setSelectedFiles] = useState([]);
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
  const dropdownArray = transformArray(leadData);
  const empsel = transformArrayEmp(employeeData);
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
          onSelectionChange={setSelectedFiles}
          isMulti={true}
        />
        <Pressable
          style={{
            marginVertical: 16,
            padding: 16,
            backgroundColor: "black",
            borderRadius: 50,
          }}
        >
          <ThemedText
            type="smalltitle"
            style={{ color: "#fff", textAlign: "center" }}
          >
            Distribute Leads
          </ThemedText>
        </Pressable>
      </View>
    </AuthContainer>
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
