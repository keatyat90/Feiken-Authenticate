// src/Help.tsx
import React from "react";
import { ScrollView, Text, StyleSheet, Linking } from "react-native";

export default function Help() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How to Use</Text>
      <Text style={styles.p}>
        1) Tap “Start Scanning” and point the camera at a Feiken QR label.
      </Text>
      <Text style={styles.p}>2) No label? Tap “Try Demo (No QR Needed)”.</Text>
      <Text style={styles.p}>
        3) You’ll see authenticity status and product details.
      </Text>

      <Text style={styles.title}>FAQ</Text>
      <Text style={styles.q}>Why do you need camera access?</Text>
      <Text style={styles.a}>
        We only read QR codes for verification. No photos/videos are stored.
      </Text>

      <Text style={styles.q}>How do I get a QR label?</Text>
      <Text style={styles.a}>
        From an authorized distributor. Learn more at{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://feikenbearing.com")}
        >
          feikenbearing.com
        </Text>
        .
      </Text>

      <Text style={styles.title}>Support</Text>
      <Text style={styles.p}>
        Email:{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("mailto:support@feikenbearing.com")}
        >
          support@feikenbearing.com
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  p: { marginTop: 8, lineHeight: 20 },
  q: { marginTop: 10, fontWeight: "bold" },
  a: { marginTop: 4, lineHeight: 20 },
  link: { color: "#007AFF" },
});
