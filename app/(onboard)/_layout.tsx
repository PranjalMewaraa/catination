import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "@/components/my_ui/Container";
import { ThemedText } from "@/components/ThemedText";
import { useSelector } from "react-redux";

const _layout = () => {
  const { user, loading, error } = useSelector((state: any) => state.user);

  return (
    <Container>
      <Image
        source={require("../../assets/images/onboarding/skyrock.png")}
        style={styles.imgHero}
      ></Image>
      <Text style={styles.titlePage}>
        Sky rocket sales with best-in-class tools
      </Text>
      <ThemedText style={styles.description}>
        Our tools includes - CRM, Email Marketing, Whatsapp Automation, and
        more.
      </ThemedText>
      <Pressable style={styles.buttonOnboarding}>
        <ThemedText style={styles.buttonText}>
          Start your free day today
        </ThemedText>
      </Pressable>
    </Container>
  );
};

export default _layout;

const styles = StyleSheet.create({
  imgHero: {
    width: "100%",
    marginTop: 36,
    height: "50%",
    objectFit: "contain",
  },
  titlePage: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: "center",
    fontFamily: "LugfaItalic",
    marginTop: 36,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 16,
  },
  buttonOnboarding: {
    width: "100%",
    padding: 16,
    marginTop: 16,
    borderRadius: 46,
    backgroundColor: "#9989F1",
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 20,
    width: "100%",
    color: "white",
    textAlign: "center",
  },
});
