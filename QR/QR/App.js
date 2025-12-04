// App.js
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Linking,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  
  const [imageUri, setImageUri] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("back"); 


  const [qrMode, setQrMode] = useState("advanced"); 
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrRaw, setQrRaw] = useState(null);
  const [qrAnalysis, setQrAnalysis] = useState(null);


  useEffect(() => {
 
    (async () => {
      if (Platform.OS !== "web") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    })();
  }, []);

  const validarLogin = () => {
    if (user === "admin" && pass === "1234") {
      Alert.alert("Correcto", "Inicio de sesión exitoso");
      setLoggedIn(true);
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  const cambiarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita acceso a las imágenes");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo acceder a la galería.");
    }
  };

  const abrirCamara = async () => {
    const { status } = await requestPermission();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita acceso a la cámara");
      return;
    }
    setShowCamera(true);
  };

  const capturarFoto = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        setImageUri(photo.uri);
      }
      setShowCamera(false);
      setScanned(false);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  };

  const toggleFacing = () =>
    setCameraFacing((p) => (p === "back" ? "front" : "back"));


  const compartir = async () => {
    try {
      if (!imageUri) {
        Alert.alert("Sin foto", "Primero elige o toma una foto.");
        return;
      }
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(imageUri);
      } else {
        Alert.alert("Compartir no disponible", "No es posible compartir desde este dispositivo.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error al compartir", e.message || String(e));
    }
  };


  const iniciarEscaneoQR = async () => {
    const { status } = await requestPermission();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita acceso a la cámara");
      return;
    }
    setQrRaw(null);
    setQrAnalysis(null);
    setScanned(false);
    setShowScanner(true);
  };

 
  const analyzeQrData = (raw) => {
    const result = {
      raw,
      isUrl: false,
      verdict: "unknown", 
      domain: null,
      description: "",
    };

    if (!raw) {
      result.description = "No se encontró contenido en el código QR.";
      return result;
    }

    const trimmed = raw.trim();
    const urlPattern = /^https?:\/\/\S+/i;

    if (!urlPattern.test(trimmed)) {
      result.description =
        "El código QR contiene texto u otro tipo de dato, no un enlace web.";
      return result;
    }

    try {
      const url = new URL(trimmed);
      const hostname = url.hostname.toLowerCase();
      const protocol = url.protocol;

      result.isUrl = true;
      result.domain = hostname;

      if (protocol === "https:") {
        result.verdict = "safe";
        result.description =
          "El enlace usa HTTPS (conexión cifrada). Aun así, verifica que el dominio sea de confianza antes de abrirlo.";
      } else {
        result.verdict = "warning";
        result.description =
          "El enlace no usa HTTPS. La conexión puede no ser segura; revisa bien el dominio antes de continuar.";
      }
    } catch (e) {
      result.description = "No se pudo analizar el enlace. Formato inválido.";
    }

    return result;
  };

  const handleQrScanned = async ({ data }) => {
    if (scanned) return; 
    setScanned(true);

    if (qrMode === "simple") {
      if (data.startsWith("http://") || data.startsWith("https://")) {
        try {
          const supported = await Linking.canOpenURL(data);
          if (supported) {
            setShowScanner(false);
            Linking.openURL(data);
            return;
          } else {
            Alert.alert("Enlace inválido", "No se puede abrir este enlace.");
          }
        } catch {
          Alert.alert("Error", "No se pudo abrir el enlace.");
        }
      } else {
        Alert.alert("Código detectado", `Contenido: ${data}`);
      }
      setShowScanner(false);
    } else {
      setQrRaw(data);
      setQrAnalysis(analyzeQrData(data));
    }
  };

  const handleOpenQrLink = async () => {
    if (!qrAnalysis || !qrAnalysis.isUrl || !qrRaw) {
      Alert.alert("No es un enlace", "El código QR no contiene un enlace web.");
      return;
    }
    const url = qrAnalysis.raw.trim();
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("No se puede abrir", "El enlace parece no ser válido.");
        return;
      }
      Alert.alert("Abrir enlace", url, [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir", onPress: () => Linking.openURL(url) },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo abrir el enlace.");
    }
  };

  const resetQrState = () => {
    setScanned(false);
    setQrRaw(null);
    setQrAnalysis(null);
  };

  const cerrarSesion = () => {
    setUser("");
    setPass("");
    setImageUri(null);
    setLoggedIn(false);
  };

 
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "#1f2937" }}>Cargando permisos de cámara...</Text>
      </SafeAreaView>
    );
  }

 
  return (
    <SafeAreaView style={styles.container}>
      {}
      <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={cameraFacing}
          />

          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraBtn} onPress={() => setShowCamera(false)}>
              <Text style={styles.cameraBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cameraBtn, styles.cameraCaptureBtn]} onPress={capturarFoto}>
              <Text style={styles.cameraBtnText}>Capturar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraBtn} onPress={toggleFacing}>
              <Text style={styles.cameraBtnText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {}
      <Modal visible={showScanner} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.scannerContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.scannerCamera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleQrScanned}
          />

          {/* Top controls */}
          <View style={styles.scannerTop}>
            <TouchableOpacity
              style={styles.scannerTopBtn}
              onPress={() => {
                setShowScanner(false);
                resetQrState();
              }}
            >
              <Text style={styles.scannerTopText}>Cerrar</Text>
            </TouchableOpacity>

            <View style={styles.modeToggleRow}>
              <Text style={styles.modeLabel}>Modo QR:</Text>
              <TouchableOpacity
                style={[
                  styles.modeToggle,
                  qrMode === "simple" ? styles.modeToggleActive : null,
                ]}
                onPress={() => setQrMode("simple")}
              >
                <Text style={styles.modeToggleText}>Simple</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeToggle,
                  qrMode === "advanced" ? styles.modeToggleActive : null,
                ]}
                onPress={() => setQrMode("advanced")}
              >
                <Text style={styles.modeToggleText}>Avanzado</Text>
              </TouchableOpacity>
            </View>
          </View>

          {}
          {qrMode === "advanced" && (
            <ScrollView style={styles.qrPanel} contentContainerStyle={styles.qrPanelContent}>
              {qrRaw && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultTitle}>Contenido detectado:</Text>
                  <Text style={styles.resultText}>{qrRaw}</Text>
                </View>
              )}

              {qrAnalysis && (
                <View
                  style={[
                    styles.analysisBox,
                    qrAnalysis.verdict === "safe"
                      ? styles.analysisSafe
                      : qrAnalysis.verdict === "warning"
                      ? styles.analysisWarning
                      : styles.analysisNeutral,
                  ]}
                >
                  <Text style={styles.analysisTitle}>
                    {qrAnalysis.verdict === "safe"
                      ? "Enlace seguro"
                      : qrAnalysis.verdict === "warning"
                      ? "Posible enlace sospechoso"
                      : "Contenido no reconocido como enlace"}
                  </Text>

                  <Text style={styles.analysisText}>{qrAnalysis.description}</Text>

                  {qrAnalysis.domain && (
                    <Text style={styles.analysisDomain}>Dominio: {qrAnalysis.domain}</Text>
                  )}

                  <Text style={styles.analysisHint}>
                    El enlace no se abrirá automáticamente. Revisa antes de decidir.
                  </Text>

                  {qrAnalysis.isUrl && (
                    <TouchableOpacity style={[styles.openBtn]} onPress={handleOpenQrLink}>
                      <Text style={styles.openBtnText}>Abrir enlace</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {scanned && (
                <TouchableOpacity
                  style={[styles.openBtn, { backgroundColor: "#6b7280" }]}
                  onPress={() => {
                    setScanned(false);
                    setQrRaw(null);
                    setQrAnalysis(null);
                  }}
                >
                  <Text style={styles.openBtnText}>Volver a escanear</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {}
      {!loggedIn ? (
        <View style={styles.card}>
          <Text style={styles.header}>Iniciar sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#6b7280"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={pass}
            onChangeText={setPass}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={validarLogin}>
            <Text style={styles.primaryBtnText}>Entrar</Text>
          </TouchableOpacity>

          <View style={{ height: 8 }} />

        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.mainContent}>
          <View style={styles.cardLight}>
            <Text style={styles.welcome}>Bienvenido, {user}</Text>

            <TouchableOpacity onPress={cambiarImagen} style={styles.imageWrapper}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Sube tu foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.outlinedBtn} onPress={abrirCamara}>
                <Text style={styles.outlinedBtnText}>Tomar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.outlinedBtn} onPress={iniciarEscaneoQR}>
                <Text style={styles.outlinedBtnText}>Escanear QR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={compartir}>
                <Text style={styles.secondaryBtnText}>Compartir foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: "#ef4444" }]} onPress={cerrarSesion}>
                <Text style={[styles.secondaryBtnText, { color: "#fff" }]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={{height:16}} />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Modo QR:</Text>
              <TouchableOpacity
                style={[styles.modeSmall, qrMode === "simple" ? styles.modeSmallActive : null]}
                onPress={() => setQrMode("simple")}
              >
                <Text style={styles.modeSmallText}>Simple</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeSmall, qrMode === "advanced" ? styles.modeSmallActive : null]}
                onPress={() => setQrMode("advanced")}
              >
                <Text style={styles.modeSmallText}>Avanzado</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },

  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },

  input: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    color: "#0f172a",
  },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  hint: {
    marginTop: 12,
    color: "#475569",
    fontSize: 12,
    textAlign: "center",
  },

  mainContent: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 24,
  },

  cardLight: {
    width: "92%",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    alignItems: "center",
  },

  welcome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14,
  },

  imageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 70,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e6eefc",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
  },

  placeholder: {
    flex: 1,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#2563eb",
    fontWeight: "700",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  outlinedBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
    paddingVertical: 10,
    width: "48%",
    alignItems: "center",
  },

  outlinedBtnText: {
    color: "#2563eb",
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#e6f0ff",
    borderRadius: 10,
    paddingVertical: 10,
    width: "48%",
    alignItems: "center",
  },

  secondaryBtnText: {
    color: "#2563eb",
    fontWeight: "700",
  },

  switchRow: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },

  switchLabel: {
    color: "#334155",
    marginRight: 8,
    fontWeight: "600",
  },

  modeSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 8,
    backgroundColor: "#ffffff",
  },

  modeSmallActive: {
    backgroundColor: "#eef2ff",
    borderColor: "#c7ddff",
  },

  modeSmallText: {
    color: "#0f172a",
    fontWeight: "600",
  },

  // Camera modal
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },

  camera: {
    width: "100%",
    height: "75%",
  },

  cameraControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },

  cameraBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  cameraCaptureBtn: {
    backgroundColor: "#fff",
  },

  cameraBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  scannerCamera: {
    width: "100%",
    height: "65%",
  },

  scannerTop: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scannerTopBtn: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  scannerTopText: {
    color: "#fff",
    fontWeight: "700",
  },

  modeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modeLabel: {
    color: "#fff",
    marginRight: 8,
    fontWeight: "700",
  },

  modeToggle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  modeToggleActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  qrPanel: {
    maxHeight: "35%",
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -8,
  },

  qrPanelContent: {
    padding: 16,
  },

  resultBox: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
  },

  resultTitle: {
    color: "#0f172a",
    fontWeight: "800",
    marginBottom: 6,
  },

  resultText: {
    color: "#0f172a",
  },

  analysisBox: {
    padding: 12,
    borderRadius: 12,
  },

  analysisSafe: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },

  analysisWarning: {
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  analysisNeutral: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e6eefc",
  },

  analysisTitle: {
    fontWeight: "800",
    marginBottom: 6,
    color: "#0f172a",
  },

  analysisText: {
    color: "#0f172a",
    marginBottom: 6,
  },

  analysisDomain: {
    fontStyle: "italic",
    color: "#0f172a",
  },

  analysisHint: {
    marginTop: 8,
    color: "#475569",
    fontSize: 12,
  },

  openBtn: {
    marginTop: 10,
    backgroundColor: "#10b981",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  openBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
