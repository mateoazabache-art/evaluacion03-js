// main.js: punto de entrada. Une pedidos.js y ui.js con la página.
import Pedido, { calcularTotal, marcarEntregado, eliminarPedido } from "./pedidos.js";
import { mostrarMensaje, dibujarLista, dibujarTotal } from "./ui.js";

const form = document.getElementById("form-pedido");
const mensaje = document.getElementById("mensaje");
const filtro = document.getElementById("filtro");
const lista = document.getElementById("lista-pedidos");
const total = document.getElementById("total");

let pedidos = []; // let porque se reemplaza por un arreglo nuevo (sin mutar)
let siguienteId = 1;

const render = () => {
  dibujarLista(lista, pedidos, filtro.value);
  dibujarTotal(total, calcularTotal(pedidos));
};

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const producto = document.getElementById("producto").value.trim();
  const precioTexto = document.getElementById("precio").value;
  const cantidadTexto = document.getElementById("cantidad").value;
  const precio = Number(precioTexto);
  const cantidad = cantidadTexto === "" ? 1 : Number(cantidadTexto);

  if (producto === "") return mostrarMensaje(mensaje, "Error: el producto no puede estar vacío.");
  if (precioTexto === "" || precio <= 0) return mostrarMensaje(mensaje, "Error: el precio debe ser mayor a 0.");
  if (cantidad < 0) return mostrarMensaje(mensaje, "Error: la cantidad no puede ser negativa.");

  // spread: se crea un arreglo NUEVO con los pedidos anteriores + el nuevo
  pedidos = [...pedidos, new Pedido({ id: siguienteId++, producto, precio, cantidad })];
  mostrarMensaje(mensaje, "");
  form.reset();
  render();
});

filtro.addEventListener("change", render);

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-id]");
  if (!boton) return;
  const id = Number(boton.dataset.id);

  pedidos = boton.dataset.accion === "entregar"
    ? marcarEntregado(pedidos, id)
    : eliminarPedido(pedidos, id);
  render();
});

render();
