import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100;

    if (!peso || isNaN(pesoNum) || pesoNum <= 0) {
      Alert.alert('Ingresa un peso válido');
      return;
    }
    if (!altura || isNaN(alturaNum) || alturaNum <= 0) {
      Alert.alert('Ingresa una altura válida');
      return;
    }

    const imc = pesoNum / (alturaNum * alturaNum);
    let mensaje = '';

    if (imc < 18.5) mensaje = 'Bajo peso';
    else if (imc < 25) mensaje = 'Normal';
    else if (imc < 30) mensaje = 'Sobrepeso';
    else mensaje = 'Obesidad';

    setResultado(`IMC: ${imc.toFixed(1)} (${mensaje})`);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.titulo}>Calculadora de IMC</Text>

        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          maxLength={3}
        />

        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          maxLength={3}
        />

        <TouchableOpacity style={styles.boton} onPress={calcularIMC}>
          <Text style={styles.botonTexto}>Calcular</Text>
        </TouchableOpacity>

        {resultado && (
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultado}>{resultado}</Text>
            <Image
              source={require('./assets/img/IMC.jpeg')}
              style={styles.imagen}
              resizeMode="contain"
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf4fc',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 30,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 16,
    borderColor: '#bdc3c7',
    borderWidth: 1,
  },
  boton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  botonTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultadoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultado: {
    fontSize: 24,
    color: '#34495e',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imagen: {
    width: '100%',
    height: 250,
  },
});