

const form = document.getElementById("form-pedido");
const inputProducto = document.getElementById("producto");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");
const mensaje = document.getElementById("mensaje");
const filtro = document.getElementById("filtro");
const lista = document.getElementById("lista-pedidos");
const total = document.getElementById("total");
const modoInseguro = document.getElementById("modo-inseguro");


const pedidos = [];
let siguienteId = 1;


function crearPedido(producto, precio, cantidad) {
  return {
    id: siguienteId++,
    producto: producto,
    precio: precio,
    cantidad: cantidad,
    estado: "pendiente",
    subtotal() {
      return this.precio * this.cantidad;
    },
    marcarEntregado() {
      this.estado = "entregado";
    }
  };
}


function render() {
  const filtroActual = filtro.value;
  lista.innerHTML = ""; // vaciar la lista (aquí no hay datos del usuario)
  let suma = 0;

  for (const pedido of pedidos) {
    
    if (filtroActual !== "todos" && pedido.estado !== filtroActual) {
      continue;
    }

    const li = document.createElement("li");
    li.className = pedido.estado;

    const detalle = pedido.producto + " - S/ " + pedido.precio.toFixed(2) +
      " x " + pedido.cantidad + " = S/ " + pedido.subtotal().toFixed(2) +
      " (" + pedido.estado + ") ";

    if (modoInseguro.checked) {
      
      li.innerHTML = detalle;
    } else {
      
      const texto = document.createElement("span");
      texto.textContent = detalle;
      li.appendChild(texto);
    }

    
    if (pedido.estado === "pendiente") {
      const btnEntregar = document.createElement("button");
      btnEntregar.textContent = "Entregar";
      btnEntregar.dataset.id = pedido.id;
      btnEntregar.dataset.accion = "entregar";
      li.appendChild(btnEntregar);
    }
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.dataset.id = pedido.id;
    btnEliminar.dataset.accion = "eliminar";
    li.appendChild(btnEliminar);

    lista.appendChild(li);
    suma += pedido.subtotal();
  }

  total.textContent = "Total a cobrar (pedidos mostrados): S/ " + suma.toFixed(2);
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const producto = inputProducto.value.trim();
  const precio = Number(inputPrecio.value);
  // si la cantidad está vacía, se toma como 1
  const cantidad = inputCantidad.value === "" ? 1 : Number(inputCantidad.value);

  // Validaciones (los errores van a #mensaje, sin alert)
  if (producto === "") {
    mensaje.textContent = "Error: el producto no puede estar vacío.";
    return;
  }
  if (inputPrecio.value === "" || isNaN(precio) || precio <= 0) {
    mensaje.textContent = "Error: el precio debe ser mayor a 0.";
    return;
  }
  if (isNaN(cantidad) || cantidad < 0) {
    mensaje.textContent = "Error: la cantidad no puede ser negativa.";
    return;
  }

  pedidos.push(crearPedido(producto, precio, cantidad));
  mensaje.textContent = "";
  form.reset();
  render();
});

filtro.addEventListener("change", render);
modoInseguro.addEventListener("change", render);

lista.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-id]");
  if (boton === null) return; // el clic no fue en un botón

  const id = Number(boton.dataset.id);

  if (boton.dataset.accion === "entregar") {
    const pedido = pedidos.find(p => p.id === id);
    pedido.marcarEntregado();
  } else if (boton.dataset.accion === "eliminar") {
    const posicion = pedidos.findIndex(p => p.id === id);
    pedidos.splice(posicion, 1);
  }
  render();
});

render(); // primer dibujo (lista vacía y total en 0)
