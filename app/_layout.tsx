import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/store/store";
import Toast from "react-native-toast-message";
import { isAuthenticated } from "@/utils/isAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    LugfaRegular: require("../assets/fonts/LufgaRegular.ttf"),
    LugfaMedium: require("../assets/fonts/LufgaMedium.ttf"),
    LugfaSemiBold: require("../assets/fonts/LufgaSemiBold.ttf"),
    LugfaItalic: require("../assets/fonts/LufgaMediumItalic.ttf"),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Default state to check if logged in
  const [isAuthChecked, setIsAuthChecked] = useState(false); // To check if auth state is checked

  // Handle font loading and splash screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const status: any = await isAuthenticated();

      setIsLoggedIn(status);
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, []);

  // Render nothing until both fonts and auth status are resolved
  if (!loaded || !isAuthChecked) {
    return null;
  }

  // Main render once everything is ready
  return (
    <Provider store={store}>
      <Toast />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={isLoggedIn ? "(tabs)" : "firstScreen"}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="(employee)" options={{ headerShown: false }} />

          <Stack.Screen
            name="(features)/[emp]"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="(features)/updateEmployee/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`(features)/sold/[id]`}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/addEmployees"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/BulkEmail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/Whatsapp"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/addNewProperty"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/addTenant/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/addNewFlat"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/uploadData"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/uploadLeadFiles"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/Helpers/WhatsappTemplate/CreateTemplate"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(features)/adminProfile"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="employeeLogin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="coming-soon" options={{ headerShown: false }} />
          <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />

          <Stack.Screen name="firstScreen" options={{ headerShown: false }} />
        </Stack>
        <StatusBar backgroundColor="transparent" translucent={true} />
      </ThemeProvider>
    </Provider>
  );
}
