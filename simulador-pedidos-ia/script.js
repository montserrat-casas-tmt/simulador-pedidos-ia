
let productosSugeridos = [];

function sugerirProductos() {
  const input = document.getElementById('input').value.toLowerCase();
  productosSugeridos = [];

  if (input.includes('oficina')) {
    productosSugeridos = [
      { id: 'CAB-3X2.5', cantidad: 100 },
      { id: 'TUB-20', cantidad: 100 },
      { id: 'AUT-10A', cantidad: 6 },
      { id: 'DIF-40A30', cantidad: 1 },
      { id: 'LAM-LED18', cantidad: 6 },
      { id: 'CJA-ELEC', cantidad: 6 },
      { id: 'CUD-DOM', cantidad: 1 },
      { id: 'REG-12M', cantidad: 1 }
    ];
  }

  mostrarProductos();
}

function mostrarProductos() {
  const div = document.getElementById('productos');
  div.innerHTML = '';

  productosSugeridos = productosSugeridos.map(item => {
    const prod = CATALOGO.find(p => p.id === item.id);
    return { ...prod, cantidad: item.cantidad };
  });

  productosSugeridos.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'producto';
    el.innerHTML = `
      <strong>${p.descripcion}</strong><br/>
      Cantidad: <input type="number" value="${p.cantidad}" onchange="actualizarCantidad(${i}, this.value)" />
      ${p.unidad}<br/>
      Precio unitario: ${p.precio.toFixed(2)} €<br/>
      Total: <span id="total-${i}">${(p.precio * p.cantidad).toFixed(2)}</span> €
    `;
    div.appendChild(el);
  });
}

function actualizarCantidad(index, valor) {
  productosSugeridos[index].cantidad = parseInt(valor) || 0;
  document.getElementById(`total-${index}`).innerText = (productosSugeridos[index].cantidad * productosSugeridos[index].precio).toFixed(2);
}

function generarJSON() {
  const total = productosSugeridos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const pedido = {
    cliente: {
      id: 'CFICT',
      nombre: 'Cliente ficticio'
    },
    fecha: new Date().toISOString().slice(0, 10),
    total_estimado: parseFloat(total.toFixed(2)),
    lineas: productosSugeridos.map(p => ({
      producto_id: p.id,
      descripcion: p.descripcion,
      cantidad: p.cantidad,
      unidad: p.unidad,
      precio_unitario: p.precio,
      importe_linea: parseFloat((p.precio * p.cantidad).toFixed(2))
    }))
  };
  document.getElementById('resultado').textContent = JSON.stringify(pedido, null, 2);
}
