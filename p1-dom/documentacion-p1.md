# Pregunta 1 - Documentación

## 1. Tabla de eventos

| Elemento | Evento | Acción |
|----------|--------|--------|
| `#form-pedido` | `submit` | Evita la recarga con `preventDefault()`, valida los datos, crea el pedido, lo guarda en el arreglo y llama a `render()` |
| `#filtro` | `change` | Llama a `render()` para mostrar todos, pendientes o entregados |
| `#lista-pedidos` | `click` (delegado) | Detecta si se pulsó **Entregar** o **Eliminar**, actualiza el arreglo y llama a `render()` |
| `#modo-inseguro` | `change` | Solo para la prueba de seguridad: cambia entre `innerHTML` y `textContent` y vuelve a dibujar |

## 2. Modelo del pedido

Cada pedido es un objeto con `id`, `producto`, `precio`, `cantidad`, `estado` y los métodos `subtotal()` (precio x cantidad) y `marcarEntregado()` (cambia el estado a "entregado"). Todos se guardan en el arreglo `pedidos`, y `render()` dibuja la lista y el total solo a partir de ese arreglo.

## 3. Justificación de la delegación de eventos

Se usa **un solo listener** en `#lista-pedidos` y con `event.target.closest("button[data-id]")` se averigua qué botón se pulsó. Es mejor que un listener por botón porque:

1. **Los botones se crean y se destruyen** cada vez que se llama a `render()`. Con un listener por botón habría que volver a agregarlos en cada dibujo; con delegación, el listener del `<ul>` nunca se pierde.
2. **Menos listeners en memoria**: 1 en vez de 2 por cada pedido.
3. **Código más corto** y con un solo lugar donde revisar la lógica de Entregar/Eliminar.
4. `closest()` funciona aunque el clic caiga dentro del botón, y `data-id` dice a qué pedido pertenece.

## 4. Prueba de seguridad (XSS)

Texto de prueba como producto:

```
<img src=x onerror="alert(1)">
```

| | Con `innerHTML` (casilla marcada) | Con `textContent` (casilla desmarcada) |
|---|---|---|
| Qué pasa | El navegador interpreta el texto como HTML, intenta cargar la imagen `x`, falla y ejecuta `onerror`: **aparece `alert(1)`** | El texto se muestra tal cual, como letras. **No se ejecuta nada** |
| Evidencia | Captura 1: `img/p1-xss-antes.png` | Captura 2: `img/p1-xss-despues.png` |

**Riesgo:** si un atacante logra que se guarde código en un campo, con `innerHTML` ese código se ejecuta en el navegador de quien vea la página (robo de datos, redirecciones, etc.). Esto se llama XSS.

**Decisión:** usar `textContent` / `createElement`, porque el texto del usuario nunca debe interpretarse como HTML. `innerHTML` solo se usa para vaciar la lista (`lista.innerHTML = ""`), donde no hay datos del usuario.

### Pasos para tomar tus capturas
1. Abre `p1-dom/index.html` (doble clic o Live Server).
2. Marca la casilla "Demostración: innerHTML", agrega el producto de prueba con precio 5 y cantidad 1 -> captura de la alerta (ANTES).
3. Desmarca la casilla -> el texto se ve literal -> captura (DESPUÉS).

## 5. Pedido a la IA: función `render()`

Ver la fila correspondiente en la bitácora del `README.md`. Qué revisar en la propuesta de la IA: (a) si usa `innerHTML` con datos del usuario, (b) si recalcula el total desde el arreglo cada vez, (c) qué aceptaste, corregiste o rechazaste y por qué.
