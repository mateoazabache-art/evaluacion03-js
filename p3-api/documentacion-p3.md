# Pregunta 3 - Documentación

> Compara esta tabla con la documentación oficial en https://open-meteo.com/en/docs/geocoding-api y https://open-meteo.com/en/docs antes de entregar (el documento pide leer la fuente oficial, no una IA).

## 1. Tabla de endpoints

| Endpoint | Parámetros que usa | Campos de la respuesta que necesita |
|---|---|---|
| `https://geocoding-api.open-meteo.com/v1/search` | `name` (ciudad), `count=1` (solo el mejor resultado), `language=es` | `results[0].name`, `results[0].admin1` (región), `results[0].latitude`, `results[0].longitude`. Si la ciudad no existe, **no viene** `results` |
| `https://api.open-meteo.com/v1/forecast` | `latitude`, `longitude`, `current=temperature_2m,wind_speed_10m` | `current.temperature_2m`, `current.wind_speed_10m`, y las unidades en `current_units.temperature_2m` (°C) y `current_units.wind_speed_10m` (km/h) |

## 2. ¿Por qué `fetch` no lanza error con un 404 o 500?

`fetch` solo **rechaza la promesa** cuando no puede completar la petición (sin internet, DNS caído). Si el servidor responde, aunque sea con 404 o 500, para `fetch` la petición **sí funcionó** y la promesa se cumple. Por eso se revisa `response.ok` (true solo si el código es 200-299) y se lanza el error a mano con `throw new Error(...)`.

## 3. Manejo de errores (try / catch / finally)

| Caso | Cómo se maneja | Mensaje |
|---|---|---|
| Ciudad inexistente ("Xyzabc") | La API responde 200 sin `results` -> `throw new Error` | No se encontró la ciudad "Xyzabc". |
| Error HTTP (404/500) | `if (!respuesta.ok) throw ...` | El servicio ... respondió con error NNN |
| Sin conexión (DevTools -> Network -> Offline) | `fetch` lanza `TypeError`; se detecta con `instanceof TypeError` | Sin conexión: revisa tu internet... |
| Siempre | `finally` vuelve a habilitar el botón | - |

## 4. Tiempos: secuencial vs. Promise.all (COMPLETA CON TUS MEDICIONES)

Pasos: abre `p3-api/index.html` con Live Server, DevTools -> Network -> marca **Disable cache**, y pulsa "Medir secuencial vs Promise.all". Copia aquí los valores que salgan en pantalla/consola.

| Medición | Secuencial (ms) | Promise.all (ms) |
|---|---|---|
| 1 | 2018| 444 |
| 2 | 468 | 218 |
| 3 | 548 | 233 |


**Conclusión (redáctala con tus números):** Con tres `await` en secuencia cada ciudad espera a que termine la anterior, así que el tiempo es aproximadamente la suma de las tres. Con `Promise.all` las tres consultas arrancan a la vez y el tiempo es aproximadamente el de la más lenta. Conviene `Promise.all` porque las consultas son independientes. Menciona cuántas veces más rápido fue en tus pruebas.

## 5. Promise.all vs. Promise.allSettled

Con el botón "Probar con una ciudad inválida" (Lima, **Xyzabc**, Arequipa):

- `Promise.all` **falla completo** en cuanto una promesa se rechaza: se pierde el clima de Lima y Arequipa aunque sí se obtuvieron.
- `Promise.allSettled` espera a todas y devuelve para cada una `fulfilled` (con `value`) o `rejected` (con `reason`).

**Decisión:** `Promise.allSettled` para el widget de varias ciudades, porque una ciudad mal escrita no debe tapar el resultado de las demás. `Promise.all` solo conviene cuando se necesitan *todos* los datos o ninguno.

## 6. Verificación del código de la IA contra la documentación (COMPLETA)

Para cada parámetro/campo que use el código de la IA, revisa en open-meteo.com si existe y está bien escrito. Registra aquí lo que no existía, estaba mal escrito u obsoleto (por ejemplo `windspeed_10m` en vez de `wind_speed_10m`, o `current_weather=true` en lugar de `current=...`) y cómo lo corregiste.

| Parámetro / campo | ¿Existe en la documentación? | Corrección |
|---|---|---|
| _____ | _____ | _____ |
