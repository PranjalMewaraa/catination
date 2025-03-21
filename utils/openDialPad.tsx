import { Linking, Platform } from "react-native";
import Toast from "react-native-toast-message";

/**
 * Opens the phone dialer with the provided phone number
 * @param phoneNumber The phone number to dial
 * @returns Promise<void>
 */
export const openDialPad = async (phoneNumber: string): Promise<void> => {
  try {
    // Remove any non-numeric characters except '+' for international numbers
    const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, "");

    // Construct the URL based on platform
    const phoneUrl = Platform.select({
      ios: `telprompt:${cleanedNumber}`,
      android: `tel:${cleanedNumber}`,
      default: `tel:${cleanedNumber}`,
    });

    // Check if the device can open the URL
    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (!canOpen) {
      Toast.show({
        type: "error",
        text1: "Dialer not supported on this device",
      });
      return;
    }

    // Open the dialer
    await Linking.openURL(phoneUrl);
  } catch (error) {
    console.error("Failed to open dialer:", error);
  }
};
