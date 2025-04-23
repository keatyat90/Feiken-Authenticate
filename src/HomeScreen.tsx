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
  ContactForm: undefined;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Navigate to ContactForm without passing images
  const handleNext = () => {
    navigation.navigate("ContactForm");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/feiken-logo.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Verify with FeikenQR</Text>
      <Text style={styles.subtitle}>
        Ensure your product is authentic. Scan, or whatsapp to verify.
      </Text>

      {/* <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>UPLOAD PHOTOS</Text>
      </TouchableOpacity> */}
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
  whatsappButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 10,
  },
  
});
