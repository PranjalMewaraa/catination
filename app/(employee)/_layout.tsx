import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function EmployeeLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#EDF0EA" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EDF0EA", // Match your dashboard background
  },
});
