// utils/isAuth.js

import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for storing the authentication token in AsyncStorage
const AUTH_TOKEN_KEY = "auth_token";

// Function to check if the user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token !== null; // If a token exists, the user is authenticated
  } catch (error) {
    console.error("Error checking authentication status", error);
    return false; // In case of error, assume not authenticated
  }
};

// Function to log the user in (e.g., store the authentication token)
export const login = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token); // Store the token
    console.log("User logged in");
  } catch (error) {
    console.error("Error during login", error);
  }
};

// Function to log the user out (e.g., remove the authentication token)
export const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY); // Remove the token
    console.log("User logged out");
  } catch (error) {
    console.error("Error during logout", error);
  }
};

// Function to get the authentication token (e.g., for API requests)
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error getting auth token", error);
    return null;
  }
};
