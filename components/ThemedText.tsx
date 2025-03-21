import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "smalltitle";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "smalltitle" ? styles.subtitle2 : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    // lineHeight: 24,
    fontFamily: "LugfaRegular",
  },
  defaultSemiBold: {
    fontSize: 16,
    // lineHeight: 24,
    fontWeight: "600",
    fontFamily: "LugfaRegular",
  },
  title: {
    fontSize: 28,
    fontWeight: "semibold",
    // lineHeight: 32,
    fontFamily: "LugfaRegular",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "semibold",
    fontFamily: "LugfaRegular",
  },
  subtitle2: {
    fontSize: 20,
    fontWeight: "semibold",
    fontFamily: "LugfaRegular",
  },
  link: {
    // lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "LugfaRegular",
  },
});
