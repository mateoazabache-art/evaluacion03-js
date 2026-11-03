

const form = document.getElementById("form-clima");
const inputCiudad = document.getElementById("ciudad");
const boton = document.getElementById("btn-buscar");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");

async function buscarCiudad(nombre) {
  const url = "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(nombre) + "&count=1&language=es";
  const respuesta = await fetch(url);

  
  if (!respuesta.ok) {
    throw new Error("El servicio de ciudades respondió con error " + respuesta.status);
  }

  const datos = await respuesta.json();
  // Si la ciudad no existe, la API no trae la propiedad "results"
  if (!datos.results || datos.results.length === 0) {
    throw new Error("No se encontró la ciudad \"" + nombre + "\".");
  }
  return datos.results[0]; // { name, admin1, latitude, longitude, ... }
}


async function obtenerClima(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
    "&longitude=" + lon + "&current=temperature_2m,wind_speed_10m";
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("El servicio de clima respondió con error " + respuesta.status);
  }
  return await respuesta.json(); // { current: {...}, current_units: {...} }
}

// Junta las dos llamadas para una ciudad
async function consultarCiudad(nombre) {
  const ciudad = await buscarCiudad(nombre);
  const clima = await obtenerClima(ciudad.latitude, ciudad.longitude);
  return {
    ciudad: ciudad.name,
    region: ciudad.admin1,
    temperatura: clima.current.temperature_2m,
    unidadTemp: clima.current_units.temperature_2m,
    viento: clima.current.wind_speed_10m,
    unidadViento: clima.current_units.wind_speed_10m
  };
}

function mostrarClima(datos) {
  resultado.style.display = "block";
  resultado.textContent = ""; // se llena con textContent (seguro)
  const lineas = [
    "Ciudad: " + datos.ciudad,
    "Región: " + (datos.region || "sin dato"),
    "Temperatura: " + datos.temperatura + " " + datos.unidadTemp,
    "Viento: " + datos.viento + " " + datos.unidadViento
  ];
  for (const texto of lineas) {
    const p = document.createElement("p");
    p.textContent = texto;
    resultado.appendChild(p);
  }
}

form.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const nombre = inputCiudad.value.trim();
  if (nombre === "") {
    estado.className = "error";
    estado.textContent = "Escribe el nombre de una ciudad.";
    return;
  }

  // Estado "cargando"
  estado.className = "";
  estado.textContent = "Cargando…";
  boton.disabled = true;
  resultado.style.display = "none";

  try {
    const datos = await consultarCiudad(nombre);
    estado.textContent = "Listo.";
    mostrarClima(datos);
  } catch (error) {
    estado.className = "error";
    // Sin internet, fetch lanza un TypeError
    if (error instanceof TypeError) {
      estado.textContent = "Sin conexión: revisa tu internet e intenta de nuevo.";
    } else {
      estado.textContent = error.message;
    }
  } finally {
    boton.disabled = false; // se ejecuta siempre, haya error o no
  }
});
