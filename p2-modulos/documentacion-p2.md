# Pregunta 2 - Documentación

## 1. Cálculo manual vs. código antiguo

Arreglo de prueba:

| Producto | Precio | Cantidad | Subtotal correcto |
|----------|--------|----------|-------------------|
| Café | 6.00 | 2 | 12.00 |
| Croissant | 4.50 | 0 (cancelado) | **0.00** |
| Jugo | 8.00 | sin dato (vale 1) | 8.00 |

- Subtotal = 12 + 0 + 8 = **20.00**
- IGV 18% = 20 x 0.18 = 3.60
- **Total correcto = 23.60**

| | Resultado |
|---|---|
| Cálculo a mano | S/ 23.60 |
| Código antiguo (`node antiguo/codigo-antiguo.js`) | S/ 28.91 |
| Diferencia | S/ 5.31 |

### Causa del error
El código antiguo usa `pedidos[i].cantidad || 1`. El operador `||` reemplaza **cualquier valor "falsy"** (`0`, `""`, `null`, `undefined`, `NaN`) por 1. Como el croissant tiene `cantidad: 0` (cancelado), `0 || 1` da `1` y se cobra un croissant que fue cancelado (4.50 + 18% IGV = 5.31 de más).

### Solución
Usar `??` (nullish coalescing): solo reemplaza `null` o `undefined`, así que el `0` se respeta y el Jugo (sin cantidad) sigue valiendo 1.

Segundo detalle: `resumen()` mostraba `Jugo xundefined`. Se corrigió con un valor por defecto en la desestructuración (`cantidad = 1`).

## 2. Tabla de características ES6+

| Característica ES6+ | Dónde la usé | Por qué |
|---|---|---|
| `const` / `let` | Todo el código (`let pedidos` en `main.js`) | `const` para lo que no cambia, `let` solo para `pedidos` que se reemplaza por un arreglo nuevo. Se eliminó `var` |
| Funciones flecha | `calcularTotal`, `resumen`, listeners en `main.js` | Sintaxis más corta |
| Template literals | `resumen()`, `ui.js` | Más legible que concatenar con `+` |
| Desestructuración con valores por defecto | `resumen({ producto, cantidad = 1, cliente })`, constructor de `Pedido` | Saca las propiedades directo y da valor por defecto |
| `reduce()` | `calcularTotal` | Suma los subtotales sin un `for` con índice |
| Encadenamiento opcional `?.` | `cliente?.nombre` | Evita error si el pedido no tiene cliente |
| Operador `??` | `this.cantidad ?? 1`, `cliente?.nombre ?? "Anónimo"` | Corrige el error: respeta el `0` |
| `class` | `class Pedido` en `pedidos.js` | Reemplaza el objeto de la P1 con constructor y método `subtotal()` |
| Spread `...` | `[...pedidos, nuevo]`, `new Pedido({ ...p, estado: "entregado" })` | Actualiza sin mutar el arreglo original |
| Módulos `import`/`export` | `pedidos.js`, `ui.js`, `main.js` | Cada archivo tiene una responsabilidad |

## 3. Export nombrado vs. export default

- **`export default class Pedido`** en `pedidos.js`: el archivo tiene *una cosa principal* (la clase). Se importa sin llaves y con el nombre que quiera quien lo use.
- **Export nombrado** (`calcularTotal`, `resumen`, `marcarEntregado`, `IGV`, y todas las funciones de `ui.js`): hay *varias* cosas por archivo. Se importan con llaves y el nombre exacto, así el editor ayuda a autocompletar y un error de escritura se detecta enseguida.

## 4. Error con `file://`

Al abrir `index.html` con doble clic, la consola muestra un error parecido a:

```
Access to script at 'file:///.../main.js' from origin 'null' has been blocked by CORS policy
```

**Por qué ocurre:** los módulos ES se cargan con una petición del navegador que exige un origen válido (`http://` o `https://`). Con `file://` el origen es `null` y el navegador bloquea la carga por seguridad.

**Solución:** abrir la página con un servidor, por ejemplo la extensión **Live Server** de VS Code (clic derecho en `index.html` -> Open with Live Server), que sirve la página en `http://127.0.0.1:5500`.

Evidencia: `img/p2-error-file.png` (error) e `img/p2-live-server.png` (funcionando).

## 5. Pedido a la IA: refactorización completa

Registrar en la bitácora del README: si la IA mantuvo el error del `||` o lo corrigió, y qué otras decisiones aceptaste o cambiaste.
