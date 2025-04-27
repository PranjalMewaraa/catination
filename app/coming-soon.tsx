import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, Stack } from "expo-router";
import { StyleSheet, Image } from "react-native";

export default function ComingSoonScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Coming Soon!" }} />
      <ThemedView style={styles.container}>
        <Image
          source={require("../assets/images/coming-soon.png")} // Replace with your actual image path
          style={styles.image}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          🚧 We’re building something awesome!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          This feature or page is coming soon. Stay tuned!
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">← Back to Home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
