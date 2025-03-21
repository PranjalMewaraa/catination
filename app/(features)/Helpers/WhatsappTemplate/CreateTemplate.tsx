import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import InnerScreens from "@/components/my_ui/InnerScreens";
import InputBox from "@/components/my_ui/InputBox";
import ChatPreview from "@/components/my_ui/chatPreview";
import api from "@/utils/api";

const CreateTemplate = () => {
  const [template, setTemplate] = useState({
    name: "",
    language: "en_US",
    category: "UTILITY",
    components: [],
  });
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [includeButtons, setIncludeButtons] = useState(false);
  const [buttonCount, setButtonCount] = useState(0);
  const [hasButtonsComponent, setHasButtonsComponent] = useState(false);
  const [nameError, setNameError] = useState(""); // Added for error feedback

  const addComponent = (type) => {
    setTemplate((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        type === "BODY"
          ? {
              type: "BODY",
              text: "",
              example: { body_text: [[""]] },
            }
          : {
              type: "BUTTONS",
              buttons: Array.from({ length: buttonCount }, () => ({
                type: "",
                text: "",
              })),
            },
      ],
    }));
    if (type === "BUTTONS") {
      setHasButtonsComponent(true);
    }
  };

  const resetButtons = () => {
    setTemplate((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.type !== "BUTTONS"),
    }));
    setButtonCount(0);
    setHasButtonsComponent(false);
  };

  const handleInputChange = (
    value,
    componentIndex,
    field,
    buttonIndex = null
  ) => {
    setTemplate((prev) => {
      const updatedComponents = [...prev.components];

      if (buttonIndex !== null) {
        const updatedButtons = [...updatedComponents[componentIndex].buttons];
        if (field === "type") {
          updatedButtons[buttonIndex] = {
            type: value,
            text: updatedButtons[buttonIndex].text || "",
            ...(value === "PHONE_NUMBER" ? { phone_number: "" } : {}),
            ...(value === "URL" ? { url: "" } : {}),
          };
        } else {
          updatedButtons[buttonIndex][field] = value;
        }
        updatedComponents[componentIndex].buttons = updatedButtons;
      } else if (field === "example") {
        updatedComponents[componentIndex].example.body_text = [
          value.split(",").map((v) => v.trim()),
        ];
      } else {
        updatedComponents[componentIndex][field] = value;
      }

      return { ...prev, components: updatedComponents };
    });
  };

  // New function to handle name input
  const handleNameChange = (text) => {
    // Convert to lowercase and replace spaces with underscores
    let formattedText = text.toLowerCase().replace(/\s+/g, "_");
    // Allow only lowercase letters and underscores
    formattedText = formattedText.replace(/[^a-z_]/g, "");

    setTemplate((prev) => ({ ...prev, name: formattedText }));

    // Optional: Validate and show error if needed
    if (formattedText.length === 0 && text.length > 0) {
      setNameError(
        "Template name can only contain lowercase letters and underscores."
      );
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async () => {
    console.log("Template JSON:", JSON.stringify(template, null, 2));
    const data = template;

    // Additional validation before submission
    if (!data.name || !/^[a-z_]+$/.test(data.name)) {
      setNameError(
        "Template name must contain only lowercase letters and underscores."
      );
      return;
    }

    const pushTemplates = await api.post(
      "/whatsappTemplate/createTemplate",
      template
    );
  };

  return (
    <InnerScreens name={"Create Template"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create WhatsApp Template</Text>

        <Text style={styles.label}>Template Name:</Text>
        <InputBox
          placeholder="Enter Template Name (e.g., my_template)"
          value={template.name}
          onChangeText={handleNameChange} // Updated to use custom handler
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>Language:</Text>
        <InputBox
          placeholder="Enter Template Language"
          value={template.language}
          onChangeText={(text) => setTemplate({ ...template, language: text })}
        />

        <Text style={styles.label}>Category:</Text>
        <Picker
          selectedValue={template.category}
          onValueChange={(value) =>
            setTemplate({ ...template, category: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Utility" value="UTILITY" />
          <Picker.Item label="Marketing" value="MARKETING" />
        </Picker>

        <View style={styles.switchContainer}>
          <Switch value={includeButtons} onValueChange={setIncludeButtons} />
          <Text style={styles.switchLabel}>Include Buttons</Text>
        </View>

        {template.components.map((component, componentIndex) => (
          <View key={componentIndex} style={styles.componentContainer}>
            <Text style={styles.componentTitle}>
              Component: {component.type}
            </Text>

            {component.type === "BODY" && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Body Text:</Text>
                  <Text style={styles.hint}>
                    use {"{{1}}, {{2}}, {{3}}"} etc to add variable
                  </Text>
                  <InputBox
                    value={component.text}
                    onChangeText={(text) =>
                      handleInputChange(text, componentIndex, "text")
                    }
                    placeholder="Hey {{1}}, This is My contact - {{2}}"
                    multiline
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Example Variables (comma-separated):
                  </Text>
                  <InputBox
                    value={component.example.body_text[0].join(", ")}
                    onChangeText={(text) =>
                      handleInputChange(text, componentIndex, "example")
                    }
                    placeholder="e.g., Pablo,860198-230332"
                  />
                </View>
              </>
            )}

            {component.type === "BUTTONS" && (
              <View>
                {component.buttons.map((button, buttonIndex) => (
                  <View key={buttonIndex} style={styles.buttonContainer}>
                    <Text style={styles.label}>Button Type:</Text>
                    <Picker
                      selectedValue={button.type}
                      onValueChange={(value) =>
                        handleInputChange(
                          value,
                          componentIndex,
                          "type",
                          buttonIndex
                        )
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Button Type" value="" />
                      <Picker.Item label="Phone Number" value="PHONE_NUMBER" />
                      <Picker.Item label="URL" value="URL" />
                    </Picker>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Button Text:</Text>
                      <InputBox
                        value={button.text}
                        onChangeText={(text) =>
                          handleInputChange(
                            text,
                            componentIndex,
                            "text",
                            buttonIndex
                          )
                        }
                      />
                    </View>

                    {button.type === "PHONE_NUMBER" && (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number:</Text>
                        <InputBox
                          value={button.phone_number || ""}
                          onChangeText={(text) =>
                            handleInputChange(
                              text,
                              componentIndex,
                              "phone_number",
                              buttonIndex
                            )
                          }
                        />
                      </View>
                    )}

                    {button.type === "URL" && (
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>URL:</Text>
                        <InputBox
                          value={button.url || ""}
                          onChangeText={(text) =>
                            handleInputChange(
                              text,
                              componentIndex,
                              "url",
                              buttonIndex
                            )
                          }
                        />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {includeButtons && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Buttons:</Text>
            <InputBox
              keyboardType="number-pad"
              value={String(buttonCount)}
              onChangeText={(value) => setButtonCount(Number(value))}
            />
          </View>
        )}

        {!bodyExpanded && (
          <TouchableOpacity
            onPress={() => {
              setBodyExpanded(true);
              addComponent("BODY");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add Body Component</Text>
          </TouchableOpacity>
        )}

        {includeButtons && (
          <View>
            <TouchableOpacity
              onPress={() => addComponent("BUTTONS")}
              style={[
                styles.button,
                styles.buttonGreen,
                hasButtonsComponent && styles.buttonDisabled,
              ]}
              disabled={hasButtonsComponent}
            >
              <Text style={styles.buttonText}>Add Buttons Component</Text>
            </TouchableOpacity>

            {hasButtonsComponent && (
              <TouchableOpacity
                onPress={resetButtons}
                style={[styles.button, styles.buttonRed]}
              >
                <Text style={styles.buttonText}>Reset Buttons</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <ChatPreview selected={template} />

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, styles.buttonGray]}
        >
          <Text style={styles.buttonText}>Save Template</Text>
        </TouchableOpacity>
      </ScrollView>
    </InnerScreens>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  picker: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  switchLabel: {
    marginLeft: 8,
  },
  componentContainer: {
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  componentTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginVertical: 8,
  },
  buttonContainer: {
    marginVertical: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 4,
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonGreen: {
    backgroundColor: "#28a745",
  },
  buttonGray: {
    backgroundColor: "#6c757d",
  },
  buttonRed: {
    backgroundColor: "#dc3545",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

export default CreateTemplate;
