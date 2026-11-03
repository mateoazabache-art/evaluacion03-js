// Mide: 3 await en secuencia vs Promise.all, y prueba all vs allSettled.
// Usa consultarCiudad() de app.js

const ciudades = ["Lima", "Cusco", "Arequipa"];
const tablaTiempos = document.getElementById("tabla-tiempos");
const salidaFallo = document.getElementById("salida-fallo");

async function secuencial(lista) {
  const resultados = [];
  for (const nombre of lista) {
    resultados.push(await consultarCiudad(nombre)); // espera una por una
  }
  return resultados;
}

async function paralelo(lista) {
  return await Promise.all(lista.map(nombre => consultarCiudad(nombre))); // todas a la vez
}

document.getElementById("btn-tiempos").addEventListener("click", async function () {
  tablaTiempos.innerHTML = "<tr><th>Medición</th><th>Secuencial (ms)</th><th>Promise.all (ms)</th></tr>";

  for (let i = 1; i <= 3; i++) {
    let inicio = performance.now();
    await secuencial(ciudades);
    const tSecuencial = performance.now() - inicio;

    inicio = performance.now();
    await paralelo(ciudades);
    const tParalelo = performance.now() - inicio;

    console.log("Medición " + i, tSecuencial.toFixed(0), tParalelo.toFixed(0));
    const fila = tablaTiempos.insertRow();
    fila.insertCell().textContent = i;
    fila.insertCell().textContent = tSecuencial.toFixed(0);
    fila.insertCell().textContent = tParalelo.toFixed(0);
  }
});

// Prueba con una ciudad inválida en medio
document.getElementById("btn-fallo").addEventListener("click", async function () {
  const lista = ["Lima", "Xyzabc", "Arequipa"];
  let texto = "";

  // Promise.all: si UNA falla, se pierde todo
  try {
    await Promise.all(lista.map(n => consultarCiudad(n)));
  } catch (error) {
    texto += "Promise.all -> FALLÓ todo: " + error.message + "\n\n";
  }

  // Promise.allSettled: devuelve el estado de cada una
  const resultados = await Promise.allSettled(lista.map(n => consultarCiudad(n)));
  resultados.forEach(function (r, i) {
    if (r.status === "fulfilled") {
      texto += "allSettled -> " + lista[i] + ": OK (" + r.value.temperatura + " " + r.value.unidadTemp + ")\n";
    } else {
      texto += "allSettled -> " + lista[i] + ": ERROR (" + r.reason.message + ")\n";
    }
  });

  salidaFallo.textContent = texto;
  console.log(texto);
});
