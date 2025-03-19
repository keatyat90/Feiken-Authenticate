import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import api from "./api";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; 

// Define types for navigation props
type RootStackParamList = {
  Home: undefined;
  ContactForm: undefined;
};
type ContactFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ContactForm() {
  const navigation = useNavigation<ContactFormNavigationProp>();

  // State for form data
  const [images, setImages] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [sender, setSender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("Checking my bearing authenticity...");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to pick images inside ContactForm
// ✅ Import Firebase config

const uploadImage = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("❌ Firebase Upload Error:", error);
          reject(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    return null;
  }
};

const pickImages = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "Please enable media access in your settings.");
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,// ✅ Use new API
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled && result.assets) {
    const uploadedImages = await Promise.all(
      result.assets.map(async (image) => {
        const compressedUri = await ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 800 } }], // ✅ Resize to 800px width
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        return await uploadImage(compressedUri.uri); // ✅ Upload to Firebase
      })
    );

    const validUrls = (uploadedImages as string[]).map((url) => url).filter((url) => url !== null && url !== undefined);
    setImages((prevImages) => [...prevImages, ...validUrls]); // ✅ Store URLs
  }
};


  // Function to send email
  const sendEmail = async () => {
    if (!agreed) {
      Alert.alert("Error", "You must agree to the privacy policy before submitting.");
      return;
    }
  
    setLoading(true);
  
    if (images.length === 0) {
      setLoading(false);
      Alert.alert("Error", "Please add at least one image.");
      return;
    }
  
    let emailBody = `
    Hello,
  
    A customer has submitted a product authenticity verification request.
  
    Company Name: ${companyName}
    Sender: ${sender}
    Email: ${email}
    Phone: ${phone}
    Country: ${country}
  
    Message:
    ${message}
  
    Images:
    ${images.map((url) => `🔗 ${url}`).join("\n")}
  
    Best regards,  
    Feiken Authenticate Team
    `;
  
    try {
      console.log("📧 Sending email with image URLs:", images);
  
      const response = await api.post("/api/send-email", {
        email: "keatyat_010706@hotmail.com",
        subject: "Product Authenticity Verification",
        body: emailBody,
        imageUrls: images, // ✅ Send URLs instead of Base64
      });
  
      console.log("✅ API response:", response.data);
  
      if (response.data.success) {
        Alert.alert("Success", "Your request has been sent successfully!", [
          { text: "OK", onPress: () => navigation.popToTop() },
        ]);
      } else {
        Alert.alert("Error", "Failed to send email.");
      }
    } catch (error) {
      console.error("❌ Email sending error:", error);
      Alert.alert("Error", "An error occurred while sending the email.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Contact Information</Text>
      </View>

      {/* FlatList replaces ScrollView to prevent nesting issues */}
      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        nestedScrollEnabled={true} // ✅ Fix scrolling inside lists
        ListHeaderComponent={
          // ✅ Move form inputs to header
          <View style={styles.contentWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Sender"
              value={sender}
              onChangeText={setSender}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={country}
              onChangeText={setCountry}
            />
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            {/* Upload Images Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
              <Text style={styles.uploadButtonText}>ADD PHOTOS</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.thumbnail} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setImages(images.filter((img) => img !== item))}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          // ✅ Move Send Button to Footer
          <View style={styles.contentWrapper}>
            <TouchableOpacity
              onPress={() => setAgreed(!agreed)}
              style={styles.checkboxContainer}
            >
              <View style={[styles.checkbox, agreed && styles.checked]} />
              <Text style={styles.checkboxText}>
                I have read the privacy policy and agree to it
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.disabledButton]}
              onPress={() => !loading && sendEmail()} // Prevent multiple presses
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.sendButtonText}>SEND</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ✅ Fully Styled Contact Form
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    elevation: 4,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  contentWrapper: {
    borderRadius: 10,
    elevation: 2,
    margin: 20,
  },
  imageWrapper: {
    borderRadius: 10,
    elevation: 2,
    marginLeft: 20,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 80,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#FF6F00",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF6F00",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD", // Gray color when disabled
  },
  checked: {
    backgroundColor: "#FF6F00",
    borderColor: "#FF6F00",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#D84315",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
