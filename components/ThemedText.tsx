import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { adjust } from "@/utils/adjustSize";

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
      allowFontScaling={false}
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
    fontSize: adjust(14),
    // lineHeight: 24,
    fontFamily: "LugfaRegular",
  },
  defaultSemiBold: {
    fontSize: adjust(14),
    // lineHeight: 24,
    fontWeight: "600",
    fontFamily: "LugfaRegular",
  },
  title: {
    fontSize: adjust(20),
    fontWeight: "semibold",
    // lineHeight: 32,
    fontFamily: "LugfaRegular",
  },
  subtitle: {
    fontSize: adjust(18),
    fontWeight: "semibold",
    fontFamily: "LugfaRegular",
  },
  subtitle2: {
    fontSize: adjust(16),
    fontWeight: "semibold",
    fontFamily: "LugfaRegular",
  },
  link: {
    // lineHeight: 30,
    fontSize: adjust(14),
    color: "#0a7ea4",
    fontFamily: "LugfaRegular",
  },
});
