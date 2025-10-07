import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CalculadoraDistribuida() {
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
      <Text style={styles.titulo}>Calculadora Distribuida</Text>
      <Text style={styles.pantalla}>{input || "0"}</Text>
      <Text style={styles.resultado}>{resultado ? `= ${resultado}` : ""}</Text>

      <View style={styles.teclado}>
        <View style={styles.numeros}>
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "C"].map((item) => (
            <TouchableOpacity
              key={item}
              style={item === "C" ? styles.botonLimpiar : styles.boton}
              onPress={() => item === "C" ? limpiar() : presionar(item)}
            >
              <Text style={styles.textoBoton}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.operaciones}>
          {["+", "−", "×", "÷", "="].map((op) => (
            <TouchableOpacity
              key={op}
              style={op === "=" ? styles.botonIgual : styles.botonOperacion}
              onPress={() => op === "=" ? calcular() : presionar(op === "×" ? "*" : op === "÷" ? "/" : op)}
            >
              <Text style={styles.textoBoton}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  pantalla: {
    fontSize: 36,
    color: "#00ffcc",
    marginBottom: 10,
    fontWeight: "bold",
  },
  resultado: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 20,
  },
  teclado: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  numeros: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 240,
    justifyContent: "center",
  },
  operaciones: {
    marginLeft: 10,
    justifyContent: "space-between",
  },
  boton: {
    backgroundColor: "#3f51b5",
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botonOperacion: {
    backgroundColor: "#ff9800",
    width: 70,
    height: 70,
    marginVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botonIgual: {
    backgroundColor: "#4caf50",
    width: 70,
    height: 70,
    marginVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  botonLimpiar: {
    backgroundColor: "#f44336",
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
  },
});