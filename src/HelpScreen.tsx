// src/HelpScreen.tsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

export default function HelpScreen() {
  const emailSupport = () =>
    Linking.openURL(
      "mailto:support@feikenbearing.com?subject=Feiken%20Authenticate%20Support"
    );

  const openWhatsApp = () => {
    const phone = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || "6012XXXXXXX";
    const msg = "Hi, I need help verifying my Feiken product.";
    Linking.openURL(
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}> Help / FAQs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero / What is this app */}
        <View style={styles.card}>
          <Text style={styles.title}>🔎 What is Feiken Authenticate?</Text>
          <Text style={styles.p}>
            Feiken Authenticate is a verification tool. Scan the{" "}
            <Text style={styles.bold}>QR code on Feiken product packaging</Text>{" "}
            to check authenticity and view product details (model, batch,
            origin).
          </Text>

          {/* Optional image row — replace sources with your local assets if you have them */}
          <View style={styles.imagesRow}>
            {/* Example placeholders; swap with your own images if available */}
            <Image
              source={require("../assets/feiken-box-1.jpeg")}
              style={styles.img}
            />
          </View>
        </View>

        {/* How to use */}
        <View style={styles.card}>
          <Text style={styles.title}>🛠 How to Use</Text>

          <Step
            icon="qrcode"
            text="Find the Feiken security QR code label printed on the product packaging (usually on the side or top of the box)."
          />
          <Step
            icon="cellphone"
            text="Open the Feiken Authenticate app on your smartphone."
          />
          <Step
            icon="camera"
            text='Tap "📷 Start Scanning" on the Home screen and point your camera at the QR code.'
          />
          <Step
            icon="check-decagram"
            text="Check the result: ✅ Authentic, ⚠️ Inconclusive, or ❌ Fake. You’ll also see product details like ID and batch number."
          />
        </View>

        {/* Resources / CTA */}
        <View style={styles.card}>
          <Text style={styles.title}>📄 Resources & Support</Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.cta, styles.ctaLight]}
              onPress={emailSupport}
            >
              <MaterialCommunityIcons name="email" size={18} color="#FF6F00" />
              <Text style={styles.ctaTextLight}>Email Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cta, styles.ctaLight]}
              onPress={openWhatsApp}
            >
              <FontAwesome name="whatsapp" size={18} color="#25D366" />
              <Text style={styles.ctaTextLight}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy note (helps App Review) */}
        <View style={styles.card}>
          <Text style={styles.title}>🔐 Privacy</Text>
          <Text style={styles.p}>
            Camera access is used <Text style={styles.bold}>only</Text> to read
            QR codes for verification. No photos or videos are stored by the
            app.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.step}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#FF6F00"
        style={{ marginTop: 2 }}
      />
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF3E0",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    elevation: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6F00",
    marginBottom: 8,
  },
  p: {
    marginTop: 6,
    fontSize: 15,
    color: "#6D4C41",
    lineHeight: 20,
  },
  bold: { fontWeight: "700", color: "#3E2723" },

  // Steps
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#3E2723",
    lineHeight: 20,
  },

  // Bullets
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 8,
  },
  bulletDot: {
    color: "#D84315",
    fontSize: 18,
    lineHeight: 20,
    marginTop: -2,
  },
  bulletText: {
    flex: 1,
    color: "#3E2723",
    fontSize: 15,
    lineHeight: 20,
  },

  // CTAs
  ctaRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  ctaLight: {
    flex: 1,
    backgroundColor: "#FFE0B2",
    justifyContent: "center",
  },
  ctaTextLight: {
    color: "#6D4C41",
    fontWeight: "600",
    fontSize: 14,
  },

  // Optional image strip (if you wire in assets)
  imagesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    justifyContent: "center",
  },
  img: {
    flex: 1,
    height: 160,
    resizeMode: "cover",
    borderRadius: 12,
  },
});
