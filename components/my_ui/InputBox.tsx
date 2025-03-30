import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type InputBoxProps = {
  editable?: boolean;
  id?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  inputMode?: TextInputProps["inputMode"];
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  marginVertical?: number; // Added type for margin
  error?: boolean; // Added error state
  disabled?: boolean; // Added disabled prop
};

const InputBox: React.FC<InputBoxProps> = ({
  editable = true,
  id,
  placeholder,
  inputMode = "text",
  value,
  secureTextEntry = false,
  multiline = false,
  onChangeText,
  marginVertical = 16, // Renamed and typed
  error = false,
  disabled = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { marginVertical },
        error && styles.errorContainer,
        disabled && styles.disabledContainer,
      ]}
    >
      <TextInput
        editable={editable && !disabled}
        nativeID={id}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          disabled && styles.disabledInput,
        ]}
        multiline={multiline}
        autoCapitalize="none"
        placeholderTextColor="#666"
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
          disabled={disabled}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={disabled ? "#999" : "#666"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    color: "black",
    padding: 16,
    paddingVertical: 20,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  iconContainer: {
    padding: 10,
  },
  errorContainer: {
    borderColor: "#ff3333",
    backgroundColor: "#ffe6e6",
  },
  disabledContainer: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  disabledInput: {
    color: "#999",
  },
});
