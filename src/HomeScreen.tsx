// src/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Linking,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import api from "./api";

type RootStackParamList = {
  Home: undefined;
  ScanScreen: undefined;
  ContactForm: undefined;
  Help: undefined;
  About: undefined;
  "Scan History": undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ScanLog = {
  qr_code_id: string;
  device_id: string;
  scanned_at: string;
  scan_count: number;
  batch_number: number;
  product_id: string;
};

const DEMO_QR =
  process.env.EXPO_PUBLIC_DEMO_QR_DATA ||
  process.env.EXPO_PUBLIC_DEMO_QR_DATA ||
  "FEIKEN_DEMO_QR_123456";

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [deviceId, setDeviceId] = useState<string>("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [recent, setRecent] = useState<ScanLog[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    (async () => {
      let storedId = await SecureStore.getItemAsync("device_id");
      if (!storedId) {
        storedId =
          Device.osInternalBuildId ||
          `device-${Math.random().toString(36).substr(2, 9)}`;
        await SecureStore.setItemAsync("device_id", storedId);
      }
      setDeviceId(storedId);
    })();
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    (async () => {
      try {
        setLoadingRecent(true);
        const resp = await api.get(`/api/products/scan-history/${deviceId}`);
        const logs = resp.data?.logs || [];
        setRecent(logs.slice(0, 5));
      } catch (e) {
        setRecent([]);
      } finally {
        setLoadingRecent(false);
      }
    })();
  }, [deviceId]);

  const openSampleQR = () => {
    const link =
      process.env.EXPO_PUBLIC_EXPO_PUBLIC_SAMPLE_QR_LINK ||
      process.env.EXPO_PUBLIC_SAMPLE_QR_LINK;
    if (link) {
      Linking.openURL(link);
    } else {
      Alert.alert("Info", "No sample QR link configured.");
    }
  };

  const startScanner = () => navigation.navigate("ScanScreen");

  const tryDemo = async () => {
    if (!deviceId) {
      Alert.alert("Please wait", "Initialising device…");
      return;
    }
    try {
      setLoadingDemo(true);
      // Reuse your verify API like the scanner does
      const response = await api.put(`/api/products/verify/${DEMO_QR}`, {
        device_id: deviceId,
      });

      const { success, product, qrCode, message } = response.data;
      const statusMap: Record<number, string> = {
        1: "✅ Authentic",
        2: "⚠️ Inconclusive",
        3: "❌ Fake",
      };

      if (success) {
        Alert.alert(
          statusMap[qrCode?.verification_status] || "Verification",
          [
            `Product ID: ${product?.product_id ?? "-"}`,
            `Batch: ${product?.batch_number ?? "-"}`,
            `QR: ${qrCode?.qr_code_id ?? DEMO_QR}`,
          ].join("\n"),
          [
            {
              text: "See History",
              onPress: () => navigation.navigate("Scan History"),
            },
            { text: "OK" },
          ]
        );
      } else {
        Alert.alert("Verification", message || "Verification failed");
      }

      // Refresh history preview to reflect the demo scan
      const resp2 = await api.get(`/api/products/scan-history/${deviceId}`);
      setRecent((resp2.data?.logs || []).slice(0, 5));
    } catch (err: any) {
      Alert.alert(
        "Demo Error",
        err?.response?.data?.message || "Unable to verify demo QR."
      );
    } finally {
      setLoadingDemo(false);
    }
  };

  const openWhatsApp = () => {
    const phone =
      process.env.EXPO_PUBLIC_EXPO_PUBLIC_WHATSAPP_NUMBER ||
      process.env.EXPO_PUBLIC_WHATSAPP_NUMBER;
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

      <TouchableOpacity
        style={[styles.button, styles.outlined]}
        onPress={tryDemo}
        disabled={loadingDemo}
      >
        <Text style={[styles.buttonText, styles.outlinedText]}>
          {loadingDemo ? "… Running Demo" : "🧪 Try Demo (No QR Needed)"}
        </Text>
      </TouchableOpacity>

      <View style={styles.inlineButtons}>
        <TouchableOpacity
          style={[styles.smallButton, styles.infoButton]}
          onPress={() => navigation.navigate("Help")}
        >
          <Text style={styles.smallButtonText}>Help / FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, styles.infoButton]}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={styles.smallButtonText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, styles.infoButton]}
          onPress={() => navigation.navigate("Scan History")}
        >
          <Text style={styles.smallButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={openSampleQR}
      >
        <Text style={styles.buttonText}>📄 View Sample QR Image</Text>
      </TouchableOpacity>

      {/* Recent Scans Preview */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Scan History")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loadingRecent ? (
          <ActivityIndicator />
        ) : recent.length === 0 ? (
          <Text style={styles.noHistory}>No scans yet. Try the demo!</Text>
        ) : (
          <FlatList
            data={recent}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={({ item }) => (
              <View style={styles.historyRow}>
                <Text style={styles.historyName}>
                  {item.product_id || "Unknown"}
                </Text>
                <Text style={styles.historyMeta}>
                  {new Date(item.scanned_at).toLocaleString()} · Scans:{" "}
                  {item.scan_count}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
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
  outlined: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#FF6F00" },
  outlinedText: { color: "#FF6F00" },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  inlineButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
  },
  infoButton: { backgroundColor: "#FFE0B2" },
  smallButtonText: { fontWeight: "bold", color: "#6D4C41" },
  historyCard: {
    width: "100%",
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  historyTitle: { fontSize: 16, fontWeight: "bold", color: "#3E2723" },
  seeAll: { color: "#007AFF", fontWeight: "600" },
  noHistory: { color: "#6D4C41" },
  historyRow: {
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  historyName: { fontWeight: "600", color: "#3E2723" },
  historyMeta: { color: "#6D4C41", marginTop: 2 },
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
