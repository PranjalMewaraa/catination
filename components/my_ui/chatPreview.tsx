import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

// Assuming these are your props or state

const ChatPreview = ({ selected }) => {
  const [templateData, setTemplateData] = useState(selected);

  useEffect(() => {
    setTemplateData(selected);
  }, [selected]);

  function injectTemplate(template: string, values: any[]) {
    return template?.replace(
      /{{(\d+)}}/g,
      (_, index) => values[index - 1] || ""
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://www.transparenttextures.com/patterns/cubes.png",
        }}
        style={styles.outerBackground}
      >
        <ImageBackground
          source={{
            uri: "https://imgs.search.brave.com/4KEjv1efVKZvRc_Mj1oml5MI-ABpEt069aqSv2gOqAo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTIuZGV2LnRvL2R5/bmFtaWMvaW1hZ2Uv/d2lkdGg9ODAwLGhl/aWdodD0sZml0PXNj/YWxlLWRvd24sZ3Jh/dml0eT1hdXRvLGZv/cm1hdD1hdXRvL2h0/dHBzOi8vZGV2LXRv/LXVwbG9hZHMuczMu/YW1hem9uYXdzLmNv/bS91cGxvYWRzL2Fy/dGljbGVzL2I5cWsz/dzQxc3FmMWwwY2N1/amZoLnBuZw",
          }}
          style={styles.innerBackground}
        >
          {/* Chat Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Preview</Text>
          </View>

          {/* Chat Message Section */}
          <View style={styles.messageContainer}>
            <View style={styles.messageWrapper}>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>
                  {injectTemplate(
                    templateData?.components[0]?.text,
                    templateData?.components[0]?.example?.body_text[0]
                  ) || "Select the template"}
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  {templateData?.components[1]?.buttons?.map(
                    (button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => {
                          /* Add button handler */
                        }}
                      >
                        <Text style={styles.buttonText}>{button.text}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    marginBottom: 32,
  },
  outerBackground: {
    flex: 1,
    backgroundColor: "#d1fae5", // green-100 equivalent
  },
  innerBackground: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
  },
  messageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  messageWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageBubble: {
    backgroundColor: "#f3f4f6", // gray-100 equivalent
    padding: 12,
    borderRadius: 8,
    maxWidth: 250,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#3b82f6", // blue-400 equivalent
    fontSize: 14,
  },
});

export default ChatPreview;
