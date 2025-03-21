import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Children } from "react";
import { LinearGradient } from "expo-linear-gradient";

const CardContainer = ({ children, style, onPress = null }) => {
  return (
    <LinearGradient
      colors={["#FAF9F6", "#F1F4ED"]}
      // Light to darker gray
      start={{ x: 0, y: 0 }} // Top-left
      end={{ x: 1, y: 1 }} // Bottom-right
      style={[style]}
    >
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
      ) : (
        children
      )}
    </LinearGradient>
  );
};

export default CardContainer;

const styles = StyleSheet.create({});
