import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { post } from "axios";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputBox from "@/components/my_ui/InputBox";

export default function EmployeeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const [active, setActive] = useState(true);

  const [inventories, setInventory] = useState([]);
  const [inventoriesSold, setInventorySold] = useState([]);

  const fetchInventory = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get("/newProperties/getAllProperties", {
      adminId: adminId,
    });

    setInventory(res.data);
  };
  const fetchInventorySold = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get("/propertyDetails/getAllProperties", {
      adminId: adminId,
    });

    setInventorySold(res.data);
  };

  useEffect(() => {
    fetchInventory();
    fetchInventorySold();
  }, []);

  const [selected, setSelected] = useState(null);
  const [selectedAction, setSelectedAction] = useState("EDIT");
  const handleClose = () => {
    setModalVisible(false);
  };

  const openModal = (id, action) => {
    setSelected(id);
    setSelectedAction(action);
    setModalVisible(true);
  };

  const EmployeeCard = ({ items }) => {
    const { societyName, _id, vacantFlats, location } = items;
    const handleCardClick = () => {
      router.push(`(features)/${_id}`);
    };
    return (
      <CardContainer style={styles.cardWidget2}>
        <View style={styles.empHead}>
          <Ionicons name="business-outline" style={styles.empImg} size={34} />
          <View>
            <ThemedText type="default">{"Available"}</ThemedText>
            <ThemedText type="smalltitle">{vacantFlats}</ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText
            type="smalltitle"
            style={{ textOverflow: "wrap", height: "auto" }}
          >
            {societyName}
          </ThemedText>
          <ThemedText
            type="default"
            style={{ textOverflow: "wrap", height: "auto" }}
          >
            <Ionicons name="location"></Ionicons> {location}
          </ThemedText>
        </View>
        <View style={styles.tailEmp}>
          <Ionicons
            name="arrow-up-sharp"
            size={24}
            style={styles.bgMenuR}
          ></Ionicons>

          <Ionicons
            name="pencil-outline"
            size={24}
            style={styles.bgMenu}
            onPress={() => openModal(items, "EDIT")}
          ></Ionicons>
          <Ionicons
            name="trash-outline"
            size={24}
            style={styles.bgMenu}
            onPress={() => openModal(items, "DELETE")}
          ></Ionicons>
        </View>
      </CardContainer>
    );
  };
  const EmployeeCardSold = ({ items }) => {
    const { societyName, _id, email, address, ownerName, propertyName } = items;
    return (
      <CardContainer
        style={styles.cardWidget}
        onPress={() => router.push(`/(features)/sold/${_id}`)}
      >
        <View style={styles.empHead}>
          <Ionicons name="business-outline" style={styles.empImg} size={34} />
          <View>
            <ThemedText type="smalltitle">{`Owner: ${ownerName}`}</ThemedText>
            <ThemedText type="default">{`mail: ${email}`}</ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <ThemedText
            type="subtitle"
            style={{
              textOverflow: "wrap",
              height: "auto",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            Society: {societyName}
          </ThemedText>
          <ThemedText
            type="smalltitle"
            style={{
              textOverflow: "wrap",
              height: "auto",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Ionicons name="home-outline" size={20} />
            {` ${propertyName}`}
          </ThemedText>
          <ThemedText
            type="default"
            style={{
              textOverflow: "wrap",
              height: "auto",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Ionicons name="location" size={20} /> {address}
          </ThemedText>
        </View>
        <View style={styles.tailEmp}>
          <Ionicons
            name="arrow-up-sharp"
            size={24}
            style={styles.bgMenuR}
          ></Ionicons>
          <Ionicons
            name="mail-outline"
            size={24}
            style={styles.bgMenu}
          ></Ionicons>
          <Ionicons
            name="pencil-outline"
            size={24}
            onPress={() => openModal(items, "EDIT")}
            style={styles.bgMenu}
          ></Ionicons>
          <Ionicons
            name="trash-outline"
            size={24}
            onPress={() => openModal(items, "DELETE")}
            style={styles.bgMenu}
          ></Ionicons>
        </View>
      </CardContainer>
    );
  };

  const [searchAv, setSearchAv] = useState(null);
  const [dataInventoryAv, setInvAvData] = useState(inventories);

  let debounceTimeout: string | number | NodeJS.Timeout | undefined;
  const changeAvSearch = (text) => {
    setSearchAv(text); // Update state immediately
    clearTimeout(debounceTimeout);

    // Set new timeout
    debounceTimeout = setTimeout(() => {
      // Your API call

      const filterData = filterBySearchTerm(inventories, text);
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
  return (
    <AuthContainer
      style={{
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <View style={{ paddingHorizontal: 20 }}>
        <ThemedText type="subtitle">manage</ThemedText>
        <ThemedText style={{ fontSize: 44 }} type="title">
          Inventory
        </ThemedText>
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
            type="smalltitle"
          >
            Available
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
            type="smalltitle"
          >
            Sold Property
          </ThemedText>
          <Ionicons
            name="hourglass-outline"
            size={24}
            color={active ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>

      {active && inventories.length > 0 ? (
        <>
          <View
            style={{ paddingHorizontal: 16, height: "auto", marginBottom: 8 }}
          >
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
              <View style={{ width: "80%" }}>
                <InputBox
                  id="searchAv"
                  placeholder="What are you looking for ..."
                  value={searchAv}
                  onChangeText={(text) => changeAvSearch(text)}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={filterBySearchTerm(inventories, searchAv)}
            style={{ marginTop: 16 }}
            keyExtractor={(item) => item._id}
            numColumns={2}
            key={active ? "active-2-cols" : "sold-2-cols"} // ✅ Add this line
            columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }}
            contentContainerStyle={styles.widgetContainer}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => <EmployeeCard items={item} />}
          />
        </>
      ) : !active && inventoriesSold.length > 0 ? (
        <>
          <View
            style={{ paddingHorizontal: 16, height: "auto", marginBottom: 8 }}
          >
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
              <View style={{ width: "80%" }}>
                <InputBox
                  id="searchAv"
                  placeholder="What are you looking for ..."
                  value={searchAv}
                  onChangeText={(text) => changeAvSearch(text)}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={filterBySearchTerm(inventoriesSold, searchAv)}
            style={{ marginTop: 16 }}
            keyExtractor={(item) => item._id}
            numColumns={1}
            key={active ? "active-2-cols" : "sold-2-cols"} // ✅ Add this line
            contentContainerStyle={styles.widgetContainer}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => <EmployeeCardSold items={item} />}
          />
        </>
      ) : (
        <ThemedText style={{ paddingHorizontal: 16 }}>No Items</ThemedText>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          width: 64,
          height: 64,
          borderRadius: 16,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 32,
          right: 32,
        }}
        onPress={() =>
          active
            ? router.push("/(features)/addNewProperty")
            : router.push("/(features)/addNewFlat")
        }
      >
        <ThemedText>
          <Ionicons name="add" size={32} color="#fff" />
        </ThemedText>
      </TouchableOpacity>

      <DynamicModal isVisible={modalVisible} onClose={handleClose}>
        <ModalContent
          active={active}
          action={selectedAction}
          id={selected}
          setInventory={setInventory}
          setInventorySold={setInventorySold}
          setModalVisible={setModalVisible}
        />
      </DynamicModal>
    </AuthContainer>
  );
}

const ModalContent = ({
  id,
  action,
  active,
  setInventory,
  setInventorySold,
  setModalVisible,
}) => {
  const [vac, setVac] = useState(0);
  const [emailsee, setVEmail] = useState(0);
  const fetchInventory = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get("/newProperties/getAllProperties", {
      adminId: adminId,
    });

    setInventory(res.data);
  };
  const fetchInventorySold = async () => {
    const adminId = await AsyncStorage.getItem("id");
    const res = await api.get("/propertyDetails/getAllProperties", {
      adminId: adminId,
    });

    setInventorySold(res.data);
  };
  const [formData, setFormData] = useState({ ...id });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const HANDLE_ACTION = async (id, action) => {
    const adminId = await AsyncStorage.getItem("id");
    const endpoint1 = active ? "newProperties" : "propertyDetails";
    const endpoint2 =
      action === "EDIT" && active
        ? `updateProperty?adminId=${adminId}&id=${id}`
        : action === "EDIT" && !active
        ? `updateProperty?adminId=${adminId}&id=${id}`
        : `deleteProperty?adminId=${adminId}&id=${id}`;

    const payload =
      active && action === "EDIT"
        ? { vacantFlats: vac }
        : !active && action === "EDIT"
        ? { ...formData }
        : {};

    if (action === "EDIT") {
      const res = await api.put(`/${endpoint1}/${endpoint2}`, payload);

      fetchInventory();
      fetchInventorySold();
      setModalVisible(false);
    } else {
      const res = await api.delete(`/${endpoint1}/${endpoint2}`);
      fetchInventory();
      fetchInventorySold();
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.modalContent2}>
      {action === "DELETE" && (
        <View>
          <ThemedText type="smalltitle" style={{ marginBottom: 32 }}>
            Are you sure you want to delete this unit
          </ThemedText>

          <TouchableOpacity onPress={() => HANDLE_ACTION(id._id, "DELETE")}>
            <ThemedText
              type="smalltitle"
              style={{
                padding: 8,
                borderRadius: 8,
                textAlign: "center",
                color: "white",
                backgroundColor: "red",
              }}
            >
              Delete
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {active && action === "EDIT" && (
        <View>
          <ThemedText type="smalltitle">
            Update the no of Available flats
          </ThemedText>
          <ThemedText type="default" style={{ marginBottom: 32 }}>
            current : {id?.vacantFlats}
          </ThemedText>

          <InputBox
            id="vacantFlat"
            inputMode="numeric"
            placeholder="32"
            value={vac}
            onChangeText={(text) => setVac(text)}
          />

          <TouchableOpacity onPress={() => HANDLE_ACTION(id._id, "EDIT")}>
            <ThemedText
              type="smalltitle"
              style={{
                padding: 8,
                borderRadius: 8,
                textAlign: "center",
                color: "white",
                backgroundColor: "black",
              }}
            >
              Update
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {!active && action === "EDIT" && (
        <View>
          <ThemedText type="smalltitle">Update the Flat Information</ThemedText>
          <ThemedText type="default" style={{ marginBottom: 32 }}>
            current : {id?.email}
          </ThemedText>
          <View>
            <View>
              <ThemedText type="default">Owner Name</ThemedText>
              <InputBox
                id="OwnerName"
                inputMode="text"
                placeholder="Enter Owner Name"
                value={formData.ownerName}
                onChangeText={(text) => handleInputChange("ownerName", text)}
              />
            </View>

            <View>
              <ThemedText type="default">Owner Email</ThemedText>
              <InputBox
                id="OwnerEmail"
                inputMode="text"
                placeholder="Enter Owner Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <ThemedText type="default">Property Name</ThemedText>
                <InputBox
                  id="PropertyName"
                  inputMode="text"
                  placeholder="Enter Property Name"
                  value={formData.propertyName}
                  onChangeText={(text) =>
                    handleInputChange("propertyName", text)
                  }
                />
              </View>
              <View style={{ width: "48%" }}>
                <ThemedText type="default">Society Name</ThemedText>
                <InputBox
                  id="SocietyName"
                  inputMode="text"
                  placeholder="Enter Society Name"
                  value={formData.societyName}
                  onChangeText={(text) =>
                    handleInputChange("societyName", text)
                  }
                />
              </View>
            </View>

            <View>
              <ThemedText type="default">Property Address</ThemedText>
              <InputBox
                id="Address"
                inputMode="text"
                placeholder="Enter Address"
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
                gap: 4,
              }}
            >
              <Switch
                value={formData.availableForRent}
                onValueChange={(value) =>
                  handleInputChange("availableForRent", value)
                }
              />
              <ThemedText type="default">Available for Rent</ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
                gap: 4,
              }}
            >
              <Switch
                value={formData.isRentedOut}
                onValueChange={(value) =>
                  handleInputChange("isRentedOut", value)
                }
              />
              <ThemedText type="default">Is Rented Out</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={{ marginVertical: 16 }}
            onPress={() => HANDLE_ACTION(id._id, "EDIT")}
          >
            <ThemedText
              type="smalltitle"
              style={{
                padding: 8,
                borderRadius: 8,
                textAlign: "center",
                color: "white",
                backgroundColor: "black",
              }}
            >
              Update
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    padding: 32,
  },
  modalContent2: {
    width: "100%",
    padding: 16,
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
    justifyContent: "space-between",
  },
  empHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
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
    width: "100%", // ✅ Ensures two items per row with spacing
    // ✅ Adds space between rows
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  cardWidget2: {
    width: "50%", // ✅ Ensures two items per row with spacing
    // ✅ Adds space between rows
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    height: "auto",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    textAlign: "center",
    color: "#D3d3d3",
    flexDirection: "column",
    gap: 8,
  },
});
function useCallback(arg0: (...args: any[]) => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
