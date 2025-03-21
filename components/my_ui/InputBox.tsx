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
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        editable={editable}
        nativeID={id}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={styles.input}
        multiline={multiline}
        autoCapitalize="none"
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#666"
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
    marginVertical: 16,
  },
  input: {
    flex: 1,
    color: "black",
    padding: 16,
    paddingVertical: 20,
  },
  iconContainer: {
    padding: 10,
  },
});
