import React from "react";
import {
  Linking,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";

// Define types for navigation props
type RootStackParamList = {
  Home: undefined;
  ScanScreen: undefined;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openSampleQR = () => {
    Linking.openURL(process.env.SAMPLE_QR_LINK);
  };

  const startScanner = () => {
    navigation.navigate('ScanScreen'); // Replace with your actual scanner screen name
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={[styles.button, styles.outlined]} onPress={openSampleQR}>
        <Text style={styles.buttonText}>📄 View Sample QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={() => {
          const phone = process.env.WHATSAPP_NUMBER;
          const message = "Hi, I need help verifying my product.";
          const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
            message
          )}`;
          Linking.openURL(url).catch(() => {
            alert("WhatsApp is not installed");
          });
        }}
      >
        <FontAwesome name="whatsapp" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 20,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 20,
  },
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  outlined: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
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
