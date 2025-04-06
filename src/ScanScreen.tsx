import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import api from "./api";

interface ProductData {
  product_id: string;
  qr_code_id: string;
  batch_number: string;
  verification_status: number;
}

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [status, setStatus] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "warning" | "error">(
    "success"
  );
  const [deviceId, setDeviceId] = useState<string>("");
  const [scanCount, setScanCount] = useState<number | null>(null);
  const scanningRef = useRef(false);
  const statusMap = {
    1: { text: "✅ Authentic", type: "success" },
    2: { text: "⚠️ Scan Inconclusive", type: "warning" },
    3: { text: "❌ Fake", type: "danger" },
  };

  const fetchDeviceId = async () => {
    let storedId = await SecureStore.getItemAsync("device_id");

    if (!storedId) {
      storedId =
        Device.osInternalBuildId ||
        `device-${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync("device_id", storedId);
    }

    setDeviceId(storedId);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      fetchDeviceId();
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanningRef.current || scanned || loading) return;

    scanningRef.current = true;
    setScanned(true);
    setLoading(true);
    setStatus("");
    setProductData(null);

    try {
      if (!deviceId) {
        console.warn("📱 Device ID not set. Fetching...");
        await fetchDeviceId();
      }

      const response = await api.put(`/api/products/verify/${data}`, {
        device_id: deviceId,
      });

      const { success, product, qrCode } = response.data;
      const statusInfo = statusMap[qrCode.verification_status as 1 | 2 | 3] || {
        text: "Unknown",
        type: "info",
      };

      if (success) {
        setStatus(statusInfo.text);
        setModalType(statusInfo.type as "success" | "warning" | "error");
        setProductData({...product, verification_status: qrCode.verification_status});
        setScanCount(scanCount);
      } else {
        setStatus(response.data.message || "⚠️ Verification failed");
        setModalType("warning");
      }
    } catch (error: any) {
      console.error("❌ Scan error:", error);
      setStatus("❌ Network Error: Cannot reach server");
      setModalType("error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        scanningRef.current = false;
        setScanned(false);
      }, 3000);
      setModalVisible(true);
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.permissionText}>Requesting camera permission...</Text>
    );
  }

  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && !loading ? (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Ensures the camera resets
        />
      ) : loading ? (
        <ActivityIndicator size="large" color="#ff9800" />
      ) : null}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[styles.modalContainer, styles[modalType]]}>
          <Text style={styles.modalTitle}>{status}</Text>
          {productData && (
            <View>
              <Text style={styles.modalText}>
                📌 Product ID: {productData.product_id}
              </Text>
              <Text style={styles.modalText}>
                📦 Batch: {productData.batch_number}
              </Text>
              {scanCount !== null && (
                <Text style={styles.scanCount}>🔄 Scan Count: {scanCount}</Text>
              )}
            </View>
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => {
                setScanned(false);
                setModalVisible(false);
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>SCAN MORE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setScanned(false);
                setModalVisible(false);
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  camera: {
    width: "90%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    padding: 30,
    borderRadius: 10,
    elevation: 5,
  },
  success: { backgroundColor: "#e0ffe0" },
  warning: { backgroundColor: "#fff8e1" },
  error: { backgroundColor: "#ffe0e0" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#FF6F00",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  scanCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff9800",
    marginBottom: 10,
  },
});
