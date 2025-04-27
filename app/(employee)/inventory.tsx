import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import EmpAuthContainer from "../../components/my_ui/EmpAuthContainer";
import { ScrollView } from "react-native-gesture-handler";
import employees from "../../dummy/employee.json";
import { Colors } from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CardContainer from "../../components/my_ui/CardContainer";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import DynamicModal from "../../components/BestModal";
import { router } from "expo-router";
import { post } from "axios";
import api from "../../utils/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputBox from "../../components/my_ui/InputBox";
import MultiSelectDropdown from "../../components/my_ui/MultiSelectDropdown";
import Toast from "react-native-toast-message";
import EmpInnerScreens from "@/components/my_ui/EmpInnerContainer";

export default function EmployeeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [active, setActive] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [inventories, setInventory] = useState([]);
  const [inventoriesSold, setInventorySold] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false); // Track if filters are applied
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchInventory = async () => {
    const User = await AsyncStorage.getItem("user");
    const obj = JSON.parse(User);

    try {
      const res = await api.post("/employee/getAllProperties", {
        employeeId: obj.id,
        adminId: obj.adminId,
      });

      setInventory(res.properties);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate); // Update the selected date state
      // Close modal after date selection
    }
  };

  const filterByDate = (data, dateKey) => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate.toDateString() === selectedDate.toDateString(); // Compare dates
    });
  };

  const handleFilter = () => {
    const filteredData = filterByDate(inventories, "createdAt");
    setmessageEmpty("No units created on the selected date");
    setInventory(filteredData); // Apply filtered data
    setFiltersApplied(true); // Set filters applied flag to true
    setFilterModalVisible(false); // Close filter modal after filtering
  };

  const handleResetFilters = () => {
    fetchInventory(); // Fetch all inventories again
    setFiltersApplied(false); // Reset filters applied flag
    setFilterModalVisible(false); // Close filter modal
    setSelectedDate(new Date()); // Reset selected date
    setmessageEmpty("No Items Found");
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const Refresh = () => {
    fetchInventory();
  };

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

  const [messageEmpty, setmessageEmpty] = useState("No items found");

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
  const EmployeeCard = ({ items }) => {
    const {
      societyName,
      _id,
      vacantFlats,
      location,
      visibleTo,
      createdAt,
      updatedAt,
    } = items;
    const handleCardClick = () => {
      router.push(`/(features)/${_id}`);
    };
    const activeEmployee = useSelector(
      (state: RootState) => state.employee.activeEmployee
    );

    function transformArrayEmp(data: []) {
      return data.map((item) => ({
        label: `${item.name} | ${item.email}`,
        value: item._id,
      }));
    }
    const dropdownArray = transformArrayEmp(activeEmployee);
    const filteredDropdownArray = dropdownArray.filter((item) =>
      visibleTo.includes(item.value)
    );

    return (
      <CardContainer style={styles.cardWidget2}>
        <View style={styles.empHead}>
          <Ionicons name="business-outline" style={styles.empImg} size={20} />
          <View>
            <ThemedText type="default"> {societyName}</ThemedText>
            <ThemedText
              type="default"
              style={{ textOverflow: "wrap", height: "auto" }}
            >
              <Ionicons name="location"></Ionicons> {location}
            </ThemedText>
          </View>
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <ThemedText
              type="default"
              style={{ textOverflow: "wrap", height: "auto" }}
            >
              Available : {vacantFlats} Units
            </ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              (last updated: {updatedAt})
            </ThemedText>
          </View>
        </View>
        <View style={styles.tailEmp}>
          <View style={styles.bgMenu}>
            <Ionicons
              name="pencil-outline"
              size={18}
              onPress={() => openModal(items, "EDIT")}
            ></Ionicons>
            <ThemedText>Edit</ThemedText>
          </View>

          <View style={styles.bgMenu}>
            <ThemedText style={{ fontSize: 14 }}>
              Created: {createdAt}
            </ThemedText>
          </View>
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
            size={18}
            style={styles.bgMenuR}
          ></Ionicons>
          <Ionicons
            name="mail-outline"
            size={18}
            style={styles.bgMenu}
          ></Ionicons>
          <Ionicons
            name="pencil-outline"
            size={18}
            onPress={() => openModal(items, "EDIT")}
            style={styles.bgMenu}
          ></Ionicons>
          <Ionicons
            name="trash-outline"
            size={20}
            onPress={() => openModal(items, "DELETE")}
            style={styles.bgMenu}
            color={"red"}
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
  const handleFilterIconClick = () => {
    setFilterModalVisible(true); // Show filter modal
  };

  return (
    <EmpInnerScreens
      style={{
        flex: 1,
        paddingHorizontal: 0,
      }}
      onRefresh={Refresh}
    >
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <ThemedText type="subtitle">manage</ThemedText>
          <ThemedText style={{ fontSize: 36 }} type="title">
            Inventory
          </ThemedText>
        </View>
      </View>

      {active && (
        <>
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
              <ThemedText
                type="title"
                style={{ marginBottom: 16, fontSize: 22 }}
              >
                Sort & Filter
              </ThemedText>

              {/* Sorting Options */}
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
                  setFiltersApplied(true);
                  setInventory(
                    inventories.sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                  );
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
                  setFiltersApplied(true);
                  setInventory(
                    inventories.sort(
                      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    )
                  );
                  setFilterModalVisible(false);
                }}
              >
                <ThemedText type="default" style={{ fontSize: 16 }}>
                  Recently Updated
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
                  setFiltersApplied(true);
                  setInventory(
                    inventories.sort((a, b) => a.vacantFlats - b.vacantFlats)
                  );
                  setFilterModalVisible(false);
                }}
              >
                <ThemedText type="default" style={{ fontSize: 16 }}>
                  Less Units Left
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
                  setFiltersApplied(true);
                  setInventory(
                    inventories.sort((a, b) => b.vacantFlats - a.vacantFlats)
                  );
                  setFilterModalVisible(false);
                }}
              >
                <ThemedText type="default" style={{ fontSize: 16 }}>
                  More Units Left
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
                <ThemedText
                  type="default"
                  style={{ fontWeight: "600", marginBottom: 4 }}
                >
                  Lead by Date
                </ThemedText>
                <View
                  style={{
                    backgroundColor: "#d3d3d3",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
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
        </>
      )}
      {active && inventories?.length > 0 ? (
        <>
          <FlatList
            data={filterBySearchTerm(inventories, searchAv)}
            style={{ marginTop: 16 }}
            keyExtractor={(item) => item._id}
            key={active ? "active-2-cols" : "sold-2-cols"} // ✅ Add this line
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
                  marginVertical={0}
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
        <ThemedText style={{ paddingHorizontal: 16 }}>
          {active ? messageEmpty : "No sold items found "}
        </ThemedText>
      )}

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
    </EmpInnerScreens>
  );
}

const ModalContent = ({
  id,
  action,
  active = true,
  setInventory,
  setInventorySold,
  setModalVisible,
}) => {
  const [vac, setVac] = useState(id?.vacantFlat);
  const [emailsee, setVEmail] = useState(0);
  const fetchInventory = async () => {
    const User = await AsyncStorage.getItem("user");
    const obj = JSON.parse(User);

    try {
      const res = await api.post("/employee/getAllProperties", {
        employeeId: obj.id,
        adminId: obj.adminId,
      });

      setInventory(res.properties);
    } catch (e) {
      console.log(e);
    }
  };
  const [formData, setFormData] = useState({ ...id });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const activeEmployee = useSelector(
    (state: RootState) => state.employee.activeEmployee
  );

  function transformArrayEmp(data: []) {
    return data.map((item) => ({
      label: `${item.name} | ${item.email}`,
      value: item._id,
    }));
  }
  const dropdownArray = transformArrayEmp(activeEmployee);
  const filteredDropdownArray = dropdownArray.filter((item) =>
    id?.visibleTo?.includes(item.value)
  );
  const [employeeData, setEmployeeData] = useState(id?.visibleTo);
  const HANDLE_ACTION = async (id, action, obj = {}) => {
    const User = await AsyncStorage.getItem("user");
    const Obj = JSON.parse(User);
    const endpoint1 = "newProperties";
    const endpoint2 =
      action === "EDIT" && active
        ? `updateProperty?adminId=${Obj.adminId}&id=${id}&employeeId=${Obj.id}`
        : action === "EDIT" && !active
        ? `updateProperty?adminId=${adminId}&id=${id}`
        : `deleteProperty?adminId=${adminId}&id=${id}`;

    const payload =
      active && action === "EDIT"
        ? { vacantFlats: vac }
        : !active && action === "EDIT"
        ? { ...formData }
        : {};
    console.log("ms");
    console.log(payload, endpoint1, endpoint2);
    if (action === "EDIT") {
      const res = await api.put(`/${endpoint1}/${endpoint2}`, payload);
      Toast.show({
        type: "success",
        text1: "Updated Successfully",
      });
      fetchInventory();

      setModalVisible(false);
    } else {
      const res = await api.delete(`/${endpoint1}/${endpoint2}`);
      fetchInventory();

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
          <ThemedText type="title" style={{ marginBottom: 16 }}>
            Update Inventory
          </ThemedText>
          <ThemedText type="default" style={{ marginBottom: 0 }}>
            current : {id?.vacantFlats}
          </ThemedText>

          <ThemedText type="smalltitle" style={{ marginBottom: 0 }}>
            Set No of Vacant Flats
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
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
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
    justifyContent: "flex-start",
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
    width: "100%", // ✅ Ensures two items per row with spacing
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

    textAlign: "center",
    color: "#D3d3d3",
    flexDirection: "column",
    gap: 8,
  },
});
