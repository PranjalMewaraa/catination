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

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const widgetData = [
    {
      id: "1",

      title: "Email Sent",
      content: "5000",
      coloricon: "skyblue",
    },
    {
      id: "2",

      title: "Calls Made",
      content: "200",
      coloricon: "green",
    },
    {
      id: "3",

      title: "Sales Closed",
      content: "150",
      coloricon: "purple",
    },
    {
      id: "4",

      title: "Leads Generated",
      content: "800",
      coloricon: "orange",
    },
    {
      id: "5",

      title: "Sales Closed",
      content: "150",
      coloricon: "purple",
    },
    {
      id: "6",
      title: "Leads Generated",
      content: "800",
      coloricon: "orange",
    },
  ];
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    const obj = JSON.parse(user);
    console.log(obj);
    dispatch(setUser(obj));
  };
  useEffect(() => {
    getUser();
  }, []);
  const FetchEmployee = async () => {
    const admin_id = (await AsyncStorage.getItem("id")) || user._id;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
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
  useEffect(() => {
    FetchEmployee();
    FetchPastEmployee();
  }, []);

  const Refresh = () => {
    FetchEmployee();
    FetchPastEmployee();
  };

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
  const [role_user, setRole] = useState("");
  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: any = await isAuthenticated();
      const role = await AsyncStorage.getItem("role");
      setIsLoggedIn(status);
      setRole(role);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <AuthContainer
      style={{ flex: 1, backgroundColor: "#EDF0EA", paddingHorizontal: 0 }}
      onRefresh={Refresh}
    >
      <View style={{ padding: 20 }}>
        <ThemedText type="subtitle">Welcome to,</ThemedText>
        <ThemedText style={{ fontSize: adjust(36) }} type="title">
          Dashboard
        </ThemedText>
      </View>

      {/* Service Buttons */}
      <View style={styles.serviceContainer}>
        <CardContainer style={styles.bgMenu2}>
          <TouchableOpacity onPress={() => router.push("/(features)/bulkMail")}>
            <Ionicons name="mail-outline" size={24} color="black" />
          </TouchableOpacity>
        </CardContainer>
        <CardContainer style={styles.bgMenu3}>
          <TouchableOpacity onPress={() => router.push("/(features)/Whatsapp")}>
            <Ionicons name="logo-whatsapp" size={24} color="black" />
          </TouchableOpacity>
        </CardContainer>
        <CardContainer style={styles.bgMenu4}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => router.push("/(tabs)/services")}
          >
            <ThemedText type="smalltitle">Services</ThemedText>
            <Ionicons name="trending-up-outline" size={24} color="black" />
          </TouchableOpacity>
        </CardContainer>
      </View>

      <FlatList
        data={widgetData}
        style={{ flex: 1, marginTop: 16 }}
        keyExtractor={(item) => item.id}
        numColumns={2} // ✅ Ensures a two-column grid
        columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }} // ✅ Ensures proper spacing
        contentContainerStyle={styles.widgetContainer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <WidgetCard {...item} />}
      />
    </AuthContainer>
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
    display: "flex",
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
    paddingHorizontal: 16,
  },
  cardWidget: {
    width: "50%", // ✅ Ensures two items per row with spacing
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
