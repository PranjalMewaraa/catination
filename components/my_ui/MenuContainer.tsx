import { StyleSheet, Text, View } from "react-native";
import React, { Children } from "react";
import { LinearGradient } from "expo-linear-gradient";

const MenuContainer = ({ children, style }) => {
  return (
    <LinearGradient
      colors={["#fff", "#fff"]}
      // Light to darker gray
      start={{ x: 0, y: 0 }} // Top-left
      end={{ x: 1, y: 1 }} // Bottom-right
      style={[style]}
    >
      {children}
    </LinearGradient>
  );
};

export default MenuContainer;

const styles = StyleSheet.create({});
