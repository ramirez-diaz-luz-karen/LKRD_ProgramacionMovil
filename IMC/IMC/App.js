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
} from 'react-native';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [genero, setGenero] = useState(null);
  const [resultado, setResultado] = useState(null);

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100;
    if (!pesoNum || !alturaNum || !genero) return;

    const imc = pesoNum / (alturaNum * alturaNum);
    let mensaje = '';

    if (genero === 'mujer') {
      if (imc < 18.5) mensaje = 'Bajo peso';
      else if (imc < 23.9) mensaje = 'Normal';
      else if (imc < 28.9) mensaje = 'Sobrepeso';
      else mensaje = 'Obesidad';
    } else {
      if (imc < 18.5) mensaje = 'Bajo peso';
      else if (imc < 24.9) mensaje = 'Normal';
      else if (imc < 29.9) mensaje = 'Sobrepeso';
      else mensaje = 'Obesidad';
    }

    setResultado(`IMC: ${imc.toFixed(1)} (${mensaje})`);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.titulo}>Calculadora de IMC</Text>

        <View style={styles.generoContainer}>
          <TouchableOpacity
            style={[styles.generoBoton, genero === 'mujer' && styles.generoActivo]}
            onPress={() => setGenero('mujer')}
          >
            <Text style={styles.generoTexto}>Mujer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.generoBoton, genero === 'hombre' && styles.generoActivo]}
            onPress={() => setGenero('hombre')}
          >
            <Text style={styles.generoTexto}>Hombre</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />

        <TouchableOpacity style={styles.boton} onPress={calcularIMC}>
          <Text style={styles.botonTexto}>Calcular</Text>
        </TouchableOpacity>

        {resultado && (
          <>
            <Text style={styles.resultado}>{resultado}</Text>
            <Image
              source={require('./assets/img/IMC.jpeg')}
              style={styles.imagen}
              resizeMode="contain"
            />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  generoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  generoBoton: {
    backgroundColor: '#ddd',
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  generoActivo: {
    backgroundColor: '#4a90e2',
  },
  generoTexto: {
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  boton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  resultado: {
    marginTop: 30,
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
  },
  imagen: {
    width: '100%',
    height: 400,
    marginTop: 20,
  },
});