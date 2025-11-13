import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CalculadoraBasica() {
  const [input, setInput] = useState("");
  const [resultado, setResultado] = useState("");

  const presionar = (valor) => {
    setInput((prev) => prev + valor);
  };

  const calcular = () => {
    try {
      const evalResultado = eval(input);
      setResultado(evalResultado.toString());
    } catch {
      setResultado("Error");
    }
  };

  const limpiar = () => {
    setInput("");
    setResultado("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora Básica</Text>
      <Text style={styles.pantalla}>{input || "0"}</Text>
      <Text style={styles.resultado}>{resultado ? `= ${resultado}` : ""}</Text>

      <View style={styles.teclado}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", "=", "C"].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.boton}
            onPress={() => {
              if (item === "=") calcular();
              else if (item === "C") limpiar();
              else presionar(item);
            }}
          >
            <Text style={styles.textoBoton}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
  },
  pantalla: {
    fontSize: 32,
    color: "#00ffcc",
    marginBottom: 10,
  },
  resultado: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
  },
  teclado: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  boton: {
    backgroundColor: "#444",
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: {
    fontSize: 24,
    color: "#fff",
  },
});