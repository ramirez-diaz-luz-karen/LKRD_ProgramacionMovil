let input = "";
let resultado = "";

function presionar(valor) {
  input += valor;
  document.getElementById("pantalla").textContent = input || "0";
}

function calcular() {
  try {
    resultado = eval(input);
    document.getElementById("resultado").textContent = "= " + resultado;
  } catch {
    document.getElementById("resultado").textContent = "Error";
  }
}

function limpiar() {
  input = "";
  resultado = "";
  document.getElementById("pantalla").textContent = "0";
  document.getElementById("resultado").textContent = "";
}