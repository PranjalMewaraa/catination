import { Image, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/my_ui/Container";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useEffect } from "react";
import { isAuthenticated } from "@/utils/isAuth";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  type RootStackParamList = {
    login: undefined;
    "(tabs)": undefined;
  };

  type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProps>();
  const router = useRouter();

  // Check authentication status and redirect if logged in
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthenticated();
      if (isLoggedIn) {
        router.replace("(tabs)"); // Redirect to tabs if authenticated
      }
    };
    checkAuth();
  }, [router]);

  const handleGetStarted = () => {
    navigation.navigate("login"); // Navigate to login when button is pressed
  };

  return (
    <Container>
      <Image
        style={styles.onboardingImage}
        source={require("../assets/images/onboarding/workspace.png")}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.pointer}>Catination CRM</ThemedText>
          <ThemedText style={styles.mainText}>
            Everything you need for your sales, in your pocket
          </ThemedText>
        </View>
        <View>
          <Pressable style={styles.buttonOnboarding} onPress={handleGetStarted}>
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </Pressable>
          <ThemedText style={styles.acknowledgement}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </ThemedText>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  acknowledgement: {
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
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
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    height: "auto",
    padding: 4,
  },
  pointer: {
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 8,
    color: Colors.greenish.text,
  },
  onboardingImage: {
    width: "100%",
    objectFit: "contain",
    padding: 4,
    height: "50%",
  },
  mainText: {
    paddingTop: 12,
    width: 280,
    lineHeight: 40,
    fontFamily: "LufgaMedium",
    fontSize: 40,
  },
});
