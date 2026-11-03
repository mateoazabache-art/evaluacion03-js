// ui.js: funciones que trabajan con el DOM (todas con export nombrado)

export const mostrarMensaje = (elemento, texto) => {
  elemento.textContent = texto;
};

export const dibujarLista = (lista, pedidos, filtro) => {
  lista.innerHTML = "";
  for (const pedido of pedidos) {
    if (filtro !== "todos" && pedido.estado !== filtro) continue;

    const li = document.createElement("li");
    li.className = pedido.estado;

    const texto = document.createElement("span");
    // textContent: seguro contra XSS
    texto.textContent = `${pedido.producto} - S/ ${pedido.precio.toFixed(2)} x ${pedido.cantidad ?? 1} = S/ ${pedido.subtotal().toFixed(2)} (${pedido.estado}) `;
    li.appendChild(texto);

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
  }
};

export const dibujarTotal = (elemento, total) => {
  elemento.textContent = `Total con IGV (18%): S/ ${total.toFixed(2)}`;
};
