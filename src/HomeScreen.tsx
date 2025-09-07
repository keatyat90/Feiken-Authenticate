// src/HomeScreen.tsx
import React from "react";
import {
  Linking,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";

type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  ContactForm: undefined;
  Help: undefined;
  "Scan History": undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const startScanner = () => navigation.navigate("Scan");

  const openWhatsApp = () => {
    const phone = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || "6012XXXXXXX";
    const message = "Hi, I need help verifying my product.";
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("WhatsApp is not installed");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          source={require("../assets/feiken-logo.png")}
          style={styles.image}
        />
        <Text style={styles.title}>FEIKEN Authenticate</Text>
        <Text style={styles.subtitle}>
          Scan QR codes on Feiken products to verify authenticity and track
          details.
        </Text>

        <TouchableOpacity style={styles.button} onPress={startScanner}>
          <Text style={styles.buttonText}>📷 Start Scanning</Text>
        </TouchableOpacity>
      </View>

      {/* Footer version info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📱 Version: {Constants.expoConfig?.version}
        </Text>
        <Text style={styles.footerText}>
          Build: iOS {Constants.expoConfig?.ios?.buildNumber} | Android{" "}
          {Constants.expoConfig?.android?.versionCode}
        </Text>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Feiken. All rights reserved.
        </Text>
      </View>

      {/* Floating WhatsApp button */}
      <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
        <FontAwesome name="whatsapp" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
    padding: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 140, height: 140, resizeMode: "contain", marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F00",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6D4C41",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FF6F00",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
    elevation: 4,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  footer: {
    alignItems: "center",
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    color: "#6D4C41",
  },
  whatsappButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 10,
  },
});
