import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import moment from "moment";
import * as Device from "expo-device";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import api from "./api";

interface ScanLog {
  qr_code_id: string;
  device_id: string;
  scanned_at: string;
  scan_count: number;
}// Backend URL

const ScanHistoryScreen = () => {
  const [scanHistory, setScanHistory] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");

  const fetchDeviceId = async () => {
    let storedId = await SecureStore.getItemAsync("device_id");

    if (!storedId) {
      storedId =
        Device.osInternalBuildId || `device-${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync("device_id", storedId);
    }

    setDeviceId(storedId);
    fetchScanHistory(storedId);
  };

  useEffect(() => {
    (async () => {
      fetchDeviceId();
    })();
  }, []);

  const fetchScanHistory = async (deviceID: string) => {
    console.log("Fetching scan history for device:::", deviceID);
    setLoading(true);
    try {
      const response = await api.get(`api/products/scan-history/${deviceID}`);
      setScanHistory(response.data.logs || []);
    } catch (error) {
      console.error("❌ Error fetching scan history:", error);
      setScanHistory([]); // Ensure list is empty if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScanHistory(deviceId);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: ScanLog }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardContent}>
        <Text style={styles.qrCode}>🔍 QR Code: {item.qr_code_id}</Text>
        <Text style={styles.date}>
          📅 {moment(item.scanned_at).format("YYYY-MM-DD HH:mm")}
        </Text>
        <Text style={styles.scanCount}>🔄 Scan Count: {item.scan_count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Scan History</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : scanHistory.length > 0 ? (
        <FlatList
          data={scanHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.emptyText}>
          No scan history found for this device.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default ScanHistoryScreen;

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
  refreshButton: {
    position: "absolute",
    right: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loader: {
    marginTop: 20,
  },
  historyCard: {
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    paddingVertical: 4,
  },
  qrCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  scanCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff9800",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});
