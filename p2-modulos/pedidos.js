// pedidos.js: la clase Pedido y los cálculos (no toca el DOM)

export const IGV = 0.18;

// export default: este archivo tiene UNA cosa principal, la clase
export default class Pedido {
  constructor({ id, producto, precio, cantidad, estado = "pendiente", cliente }) {
    this.id = id;
    this.producto = producto;
    this.precio = precio;
    this.cantidad = cantidad; // puede ser undefined (sin cantidad)
    this.estado = estado;
    this.cliente = cliente;
  }

  // ?? solo usa 1 cuando cantidad es null o undefined. El 0 se respeta.
  subtotal() {
    return this.precio * (this.cantidad ?? 1);
  }
}

// Funciones de cálculo: export NOMBRADO (son varias en el mismo archivo)
export const calcularTotal = (pedidos) => {
  const subtotal = pedidos.reduce((suma, p) => suma + p.subtotal(), 0);
  return subtotal + subtotal * IGV;
};

export const resumen = ({ producto, cantidad = 1, cliente }) => {
  const nombre = cliente?.nombre ?? "Anónimo"; // ?. evita error si no hay cliente
  return `Pedido de ${nombre}: ${producto} x${cantidad}`;
};

// Actualizar SIN mutar el arreglo original: map + spread
export const marcarEntregado = (pedidos, id) =>
  pedidos.map((p) => (p.id === id ? new Pedido({ ...p, estado: "entregado" }) : p));

export const eliminarPedido = (pedidos, id) => pedidos.filter((p) => p.id !== id);
