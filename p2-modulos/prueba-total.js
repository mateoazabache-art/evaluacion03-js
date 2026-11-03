// Se ejecuta con: node prueba-total.js
// Demuestra que el resultado refactorizado es correcto con el mismo arreglo.
import Pedido, { calcularTotal, resumen, marcarEntregado } from "./pedidos.js";

const datos = [
  { id: 1, producto: "Café", precio: 6, cantidad: 2, cliente: { nombre: "Ana" } },
  { id: 2, producto: "Croissant", precio: 4.5, cantidad: 0 },
  { id: 3, producto: "Jugo", precio: 8 }
];
const pedidos = datos.map((d) => new Pedido(d));

console.log("Total correcto con IGV:", calcularTotal(pedidos).toFixed(2), "(esperado 23.60)");
pedidos.forEach((p) => console.log(resumen(p)));

// Prueba de que NO se muta el arreglo original
const nuevos = marcarEntregado(pedidos, 1);
console.log("Original:", pedidos[0].estado, "| Nuevo:", nuevos[0].estado);
