// src/About.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Feiken Authenticate</Text>
      <Text style={styles.p}>
        Feiken Authenticate helps customers verify product authenticity by
        scanning secure QR codes.
      </Text>
      <Text style={styles.p}>Version: 1.0.0</Text>
      <Text style={styles.p}>
        © {new Date().getFullYear()} Feiken. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  p: { marginTop: 6, lineHeight: 20 },
});
