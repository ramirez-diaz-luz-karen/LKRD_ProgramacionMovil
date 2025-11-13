import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const validarLogin = () => {
    const validUser = 'admin';
    const validPass = '1234';
    if (user === validUser && pass === validPass) {
      Alert.alert('Correcto', 'Inicio de sesión exitoso');
      setLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const cambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a las imágenes');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const compartir = async () => {
    try {
      if (imageUri) {
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(imageUri);
        } else {
          await Share.share({
            message: `Mira mi foto de perfil (${user})`,
            url: imageUri,
          });
        }
      } else {
        await Share.share({
          message: `Hola, soy ${user}. ¡He iniciado sesión en la app!`,
        });
      }
    } catch (error) {
      Alert.alert('Error al compartir', error.message || String(error));
    }
  };

  const cerrarSesion = () => {
    setUser('');
    setPass('');
    setImageUri(null);
    setLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loggedIn ? (
        <View style={styles.box}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            placeholder="Usuario"
            style={styles.input}
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={validarLogin}>
            <Text style={styles.btnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.title}>Bienvenido {user}</Text>
          <TouchableOpacity onPress={cambiarImagen} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Image
                  source={{
                    uri: 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg',
                  }}
                  style={styles.defaultImage}
                />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.smallButton]} onPress={compartir}>
              <Text style={styles.btnText}>Compartir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.smallButton, styles.logoutButton]}
              onPress={cerrarSesion}
            >
              <Text style={styles.btnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  box: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  smallButton: {
    width: '48%',
    paddingVertical: 8,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginTop: 10,
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
  },
});
