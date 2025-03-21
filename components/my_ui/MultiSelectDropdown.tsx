import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";

interface DropdownItem {
  label: string;
  value: string;
}
interface DropdownItemURI {
  label: string;
  value: string;
  url: string;
}
interface DropdownItemWp {
  label: string;
  value: string;
  selected: object;
}

interface MultiSelectDropdownProps {
  data: DropdownItem[];
  title: string;
  onSelectionChange: (selectedValues: string[]) => void;
  isMulti?: boolean;
  needUri?: boolean;
  isWpTemplate?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  data,
  title,
  onSelectionChange,
  isMulti = false,
  needUri = false,
  isWpTemplate = false,
}) => {
  const [selectedItems, setSelectedItems] = useState<DropdownItem[]>([]);
  const [selectedUriItem, setSelectedUriItems] = useState<DropdownItemURI[]>(
    []
  );
  const [selectedWpItem, setSelectedWPItems] = useState<DropdownItemWp[]>([]);
  const handleSelection = (selectedValue: DropdownItem) => {
    let updatedSelection: DropdownItem[] = [];

    if (isMulti) {
      const isAlreadySelected = selectedItems.find(
        (item) => item.value === selectedValue.value
      );

      if (isAlreadySelected) {
        // Remove the item if already selected (toggle)
        updatedSelection = selectedItems.filter(
          (item) => item.value !== selectedValue.value
        );
      } else {
        // Add the new item
        updatedSelection = [...selectedItems, selectedValue];
      }
    } else {
      updatedSelection = [selectedValue];
    }

    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection.map((item) => item.value));
  };
  const handleSelectionURI = (selectedValue: DropdownItemURI) => {
    let updatedSelection: DropdownItemURI[] = [];

    updatedSelection = [selectedValue];
    setSelectedUriItems(updatedSelection);
    onSelectionChange(
      updatedSelection.map((item) => {
        return { value: item.value, url: item.url };
      })
    );
  };
  const removeItem = (value: string) => {
    const updatedSelection = selectedItems.filter(
      (item) => item.value !== value
    );
    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection.map((item) => item.value));
  };
  const handleWpSelection = (selectedValue: DropdownItemWp) => {
    let updatedSelection: DropdownItemWp[] = [];
    updatedSelection = [selectedValue];
    setSelectedWPItems(updatedSelection);
    onSelectionChange(
      updatedSelection.map((item) => {
        return { value: item.value, selected: item.selected };
      })
    );
  };

  return (
    <View style={{ width: "100%", padding: 10 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{title}:</Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={
          needUri
            ? selectedUriItem.map((item) => {
                return { value: item.value, url: item.url };
              })
            : isWpTemplate
            ? selectedWpItem.map((item) => {
                return { value: item.value, selected: item };
              })
            : selectedItems.map((item) => item.value)
        }
        onChange={
          needUri
            ? handleSelectionURI
            : isWpTemplate
            ? handleWpSelection
            : handleSelection
        }
        placeholder={
          !isMulti
            ? needUri
              ? selectedUriItem[0]?.value
              : isWpTemplate
              ? selectedWpItem[0]?.value || "Select Whatsapp Temp"
              : selectedItems[0]?.label || "Select option"
            : "Select Option"
        }
        multiple={isMulti}
        search
        searchPlaceholder="Search files..."
        style={{
          height: 50,
          backgroundColor: "#FAF9F6",
          borderRadius: 8,
          paddingHorizontal: 10,
        }}
        selectedStyle={{
          backgroundColor: "#FAF9F6",
          padding: 5,
          borderRadius: 5,
        }}
      />

      {selectedItems.length > 0 && isMulti && (
        <FlatList
          data={selectedItems}
          horizontal
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: Colors.primary,
                padding: 8,
                borderRadius: 8,
                marginRight: 6,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
              }}
            >
              <Text style={{ color: "black", marginRight: 5 }}>
                {item.label}
              </Text>
              <TouchableOpacity onPress={() => removeItem(item.value)}>
                <Text style={{ color: "red", fontWeight: "bold" }}>✖</Text>
              </TouchableOpacity>
            </View>
          )}
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

export default MultiSelectDropdown;
