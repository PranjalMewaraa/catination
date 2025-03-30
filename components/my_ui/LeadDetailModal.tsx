import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const LeadDetailsModal = ({ visible, onClose, lead }) => {
  if (!lead) return null;

  const {
    name,
    phone,
    property,
    Budget,
    source,
    location,
    status,
    visitDate,
    visitTime,
    interested,
    reason,
  } = lead;

  const getStatusText = () => {
    if (!status) return "New lead, currently unattended";
    if (status === "in-progress") return "Lead is in progress";
    if (status === "bought" || status === "not bought")
      return `Status: ${status} (Complete)`;
    return `Status: ${status}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ThemedText type="title" style={styles.title}>
            Lead Details
          </ThemedText>

          <ThemedText>Name: {name}</ThemedText>
          <ThemedText>Phone: {phone}</ThemedText>
          <ThemedText>Property: {property}</ThemedText>
          <ThemedText>Budget: {Budget}</ThemedText>
          <ThemedText>Source: {source}</ThemedText>
          <ThemedText>Location: {location}</ThemedText>
          <ThemedText>Status: {getStatusText()}</ThemedText>

          {status === "in-progress" && visitDate && visitTime && (
            <>
              <ThemedText>Visit Date: {visitDate}</ThemedText>
              <ThemedText>Visit Time: {visitTime}</ThemedText>
            </>
          )}
          {status === "not interested" && (
            <>
              <ThemedText>Reason: {reason}</ThemedText>
            </>
          )}

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LeadDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
