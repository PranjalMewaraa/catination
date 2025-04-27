import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import AuthContainer from "@/components/my_ui/AuthContainer";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import CardContainer from "@/components/my_ui/CardContainer";
import EmpAuthContainer from "@/components/my_ui/EmpAuthContainer";

export default function EmployeeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const widgetData = [
    {
      id: "4",
      icon: "cellular-outline",
      title: "Leads",
      content: "Manage and distribute your leads",
      coloricon: "orange",
      route: "(employee)/leads",
    },
    {
      id: "3",
      icon: "clipboard-outline",
      title: "Inventory",
      content: "Manage your real-estate inventory easily",
      coloricon: "purple",
      route: "(employee)/inventory",
    },
  ];

  const WidgetCard = ({ title, content, icon, coloricon, route }) => {
    return (
      <CardContainer style={styles.cardWidget}>
        <Pressable
          style={styles.innerCardWidget}
          onPress={() => router.push(route)}
        >
          <View style={styles.cardWidgetHeader}>
            <Ionicons
              name={icon}
              size={24}
              color={"white"}
              style={[styles.icon, { backgroundColor: coloricon }]}
            />
            <ThemedText style={{ flexWrap: "wrap", width: 100 }}></ThemedText>
          </View>

          <ThemedText
            style={{ width: "100%", textAlign: "left", marginTop: 16 }}
            type="smalltitle"
          >
            {title}
          </ThemedText>
          <ThemedText
            style={{
              width: "100%",
              textAlign: "left",
              color: "gray",
              marginTop: 4,
              fontSize: 14,
            }}
          >
            {content}
          </ThemedText>
        </Pressable>
      </CardContainer>
    );
  };

  return (
    <EmpAuthContainer style={styles.containerFull}>
      <View style={{ paddingTop: 40, marginTop: 40, paddingHorizontal: 20 }}>
        <ThemedText type="subtitle">Employee</ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Dashboard
        </ThemedText>
      </View>

      {/* Widget Cards Grid */}
      <FlatList
        data={widgetData}
        style={{ marginTop: 16 }}
        keyExtractor={(item) => item.id}
        numColumns={2} // ✅ Ensures a two-column grid
        columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }} // ✅ Ensures proper spacing
        contentContainerStyle={styles.widgetContainer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <WidgetCard {...item} />}
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
  bgMenu2: {
    padding: 16,
    borderRadius: 45,
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: "#fff",
    width: 60,
    transform: [{ translateX: -8 }],
    alignItems: "center",
    justifyContent: "center",
  },
  innerCardWidget: {
    padding: 24,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bgMenu3: {
    padding: 16,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: Colors.cardBg,
    width: 60,
    transform: [{ translateX: -16 }],
    alignItems: "center",
    justifyContent: "center",
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
  },
  cardWidget: {
    width: "50%",

    borderRadius: 40,

    backgroundColor: Colors.cardBg,
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
  constainerFull: {
    flex: 1,
    padding: 20,
  },
});
