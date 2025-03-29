import api from "@/utils/api";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

const ModalFlowEmployee = ({ visible, setVisible, leadId, onRefresh }) => {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setStep(1);
    setChoice("");
    setReason("");
    setFeedback("");
    setVisitDate("");
    setVisitTime("");
  };

  const notify = (msg) => {
    Toast.show({
      type: "success",
      text1: msg || "Status Updated Successfully",
    });
  };

  const addInterestedPVLead = async () => {
    try {
      const res = await api.put(`/leads/updatIntrestedStatus`, {
        leadId: leadId,
        interested: "yes",
        visitDate: visitDate,
        visitTime: visitTime,
        status: "in-progress",
      });

      console.log(res);
      notify("Visit Scheduled Successfully");
      handleClose();
      onRefresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const BoughtLead = async () => {
    try {
      const res = await api.put(`/leads/updateVisitStatus`, {
        leadId: leadId,
        status: "bought",
      });

      console.log(res);
      notify("Marked as Bought");
      handleClose();
      onRefresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInterestedButNotBought = async () => {
    try {
      const res = await api.put(`/leads/updateVisitStatus`, {
        leadId: leadId,
        interested: choice,
        reason: feedback,
      });

      console.log(res);
      notify("Feedback Submitted");
      handleClose();
      onRefresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const NotInterested = async () => {
    try {
      const res = await api.put(`leads/updatIntrestedStatus`, {
        leadId: leadId,
        interested: choice,
        reason: reason,
      });

      console.log(res);
      notify("Marked Not Interested");
      handleClose();
      onRefresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={handleClose}>
      <View style={styles.modal}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Are you interested?</Text>
            <RadioButton.Group onValueChange={setChoice} value={choice}>
              <RadioButton.Item label="Interested" value="interested" />
              <RadioButton.Item label="Not Interested" value="notInterested" />
            </RadioButton.Group>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(choice === "notInterested" ? 2 : 3)}
              disabled={!choice}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Please provide a reason</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Enter reason"
              value={reason}
              onChangeText={setReason}
            />
            <TouchableOpacity style={styles.button} onPress={NotInterested}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>What are your plans?</Text>
            <RadioButton.Group onValueChange={setChoice} value={choice}>
              <RadioButton.Item
                label="Planning to Visit"
                value="planningToVisit"
              />
              <RadioButton.Item label="Visited" value="visited" />
            </RadioButton.Group>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setStep(choice === "planningToVisit" ? 4 : 5)}
              disabled={!choice}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Enter visit details</Text>

            {/* Visit Date Picker */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>{visitDate || "Select Visit Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0];
                    setVisitDate(formattedDate);
                  }
                }}
              />
            )}

            {/* Visit Time Picker */}
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.input}
            >
              <Text>{visitTime || "Select Visit Time"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const minutes = selectedTime
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    setVisitTime(`${hours}:${minutes}`);
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={[
                styles.button,
                !(visitDate && visitTime) && { backgroundColor: "#ccc" },
              ]}
              onPress={addInterestedPVLead}
              disabled={!(visitDate && visitTime)}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 5 && (
          <>
            <Text style={styles.title}>Did you buy anything?</Text>
            <RadioButton.Group onValueChange={setChoice} value={choice}>
              <RadioButton.Item label="Bought" value="bought" />
              <RadioButton.Item
                label="Not Interested"
                value="notInterestedAfterVisit"
              />
            </RadioButton.Group>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (choice === "bought") BoughtLead();
                else setStep(6);
              }}
              disabled={!choice}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 6 && (
          <>
            <Text style={styles.title}>Please provide feedback</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Enter your feedback"
              value={feedback}
              onChangeText={setFeedback}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleInterestedButNotBought}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
    minHeight: 40,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default ModalFlowEmployee;
