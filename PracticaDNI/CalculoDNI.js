document.getElementById("formularioDNI").addEventListener("submit", function(event) {
  event.preventDefault();

  const secuencia = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B',
                     'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];

  const resultado = document.getElementById("resultado");
  const valorDNI = document.getElementById("dni").value.trim();
  const letra = document.getElementById("letra").value.trim().toUpperCase();

  // Validar número del DNI
  if (!/^\d{1,8}$/.test(valorDNI)) {
    resultado.textContent = "Número de DNI inválido. Debe contener solo dígitos (máximo 8).";
    resultado.style.color = "red";
    return;
  }

  // Validar letra
  if (!/^[A-Z]$/.test(letra)) {
    resultado.textContent = "La letra debe ser una sola letra de la A a la Z.";
    resultado.style.color = "red";
    return;
  }

  const DNI = parseInt(valorDNI, 10);
  const indice = DNI % 23;
  const letraCalculada = secuencia[indice];

  if (letraCalculada !== letra) {
    resultado.textContent = `La letra introducida no es correcta. La letra correcta para el número ${DNI} es ${letraCalculada}.`;
    resultado.style.color = "orange";
  } else {
    resultado.textContent = `El DNI ${DNI}${letra} es correcto.`;
    resultado.style.color = "green";
  }
});
