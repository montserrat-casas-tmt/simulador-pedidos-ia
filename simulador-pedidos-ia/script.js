let productosSugeridos = [];
let pedidosGuardados = JSON.parse(localStorage.getItem('pedidosGuardados')) || [];

// Escenarios predefinidos
const ESCENARIOS = {
  oficina: {
    nombre: 'Oficina',
    productos: [
      { id: 'CAB-3X2.5', cantidad: 100 },
      { id: 'TUB-20', cantidad: 100 },
      { id: 'AUT-10A', cantidad: 6 },
      { id: 'DIF-40A30', cantidad: 1 },
      { id: 'LAM-LED18', cantidad: 6 },
      { id: 'CJA-ELEC', cantidad: 6 },
      { id: 'CUD-DOM', cantidad: 1 },
      { id: 'REG-12M', cantidad: 1 }
    ]
  },
  taller: {
    nombre: 'Taller',
    productos: [
      { id: 'CAB-5X6', cantidad: 50 },
      { id: 'TUB-20', cantidad: 50 },
      { id: 'AUT-20A', cantidad: 4 },
      { id: 'DIF-40A30', cantidad: 1 },
      { id: 'LAM-LED18', cantidad: 8 },
      { id: 'CJA-ELEC', cantidad: 4 },
      { id: 'CUD-DOM', cantidad: 1 }
    ]
  }
};

function sugerirProductos() {
  const input = document.getElementById('input').value.toLowerCase();
  productosSugeridos = [];

  // Buscar coincidencias en escenarios
  for (const [key, escenario] of Object.entries(ESCENARIOS)) {
    if (input.includes(key)) {
      productosSugeridos = [...escenario.productos];
      break;
    }
  }

  // Si no hay coincidencias, buscar en el catálogo
  if (productosSugeridos.length === 0) {
    const terminos = input.split(' ');
    productosSugeridos = CATALOGO
      .filter(p => terminos.some(t => p.descripcion.toLowerCase().includes(t)))
      .map(p => ({ id: p.id, cantidad: 1 }));
  }

  mostrarProductos();
  actualizarResumen();
}

function filtrarProductos() {
  const busqueda = document.getElementById('searchInput').value.toLowerCase();
  const categoria = document.getElementById('categoriaFilter').value;
  
  const productosFiltrados = CATALOGO.filter(p => {
    const coincideBusqueda = p.descripcion.toLowerCase().includes(busqueda);
    const coincideCategoria = !categoria || p.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  mostrarProductosFiltrados(productosFiltrados);
}

function mostrarProductosFiltrados(productos) {
  const div = document.getElementById('productos');
  div.innerHTML = '';

  productos.forEach(p => {
    const el = document.createElement('div');
    el.className = 'producto';
    el.innerHTML = `
      <strong>${p.descripcion}</strong><br/>
      Cantidad: <input type="number" min="0" value="1" onchange="agregarProducto('${p.id}', this.value)" />
      ${p.unidad}<br/>
      Precio unitario: ${p.precio.toFixed(2)} €
    `;
    div.appendChild(el);
  });
}

function agregarProducto(id, cantidad) {
  const cantidadNum = parseInt(cantidad) || 0;
  if (cantidadNum <= 0) return;

  const index = productosSugeridos.findIndex(p => p.id === id);
  if (index === -1) {
    productosSugeridos.push({ id, cantidad: cantidadNum });
  } else {
    productosSugeridos[index].cantidad = cantidadNum;
  }

  mostrarProductos();
  actualizarResumen();
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
      Cantidad: <input type="number" min="0" value="${p.cantidad}" onchange="actualizarCantidad(${i}, this.value)" />
      ${p.unidad}<br/>
      Precio unitario: ${p.precio.toFixed(2)} €<br/>
      Total: <span id="total-${i}">${(p.precio * p.cantidad).toFixed(2)}</span> €
    `;
    div.appendChild(el);
  });
}

function actualizarCantidad(index, valor) {
  const cantidad = parseInt(valor) || 0;
  if (cantidad < 0) return;
  
  productosSugeridos[index].cantidad = cantidad;
  document.getElementById(`total-${index}`).innerText = (productosSugeridos[index].cantidad * productosSugeridos[index].precio).toFixed(2);
  actualizarResumen();
}

function actualizarResumen() {
  const total = productosSugeridos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const numProductos = productosSugeridos.reduce((sum, p) => sum + p.cantidad, 0);
  
  document.getElementById('resumen').innerHTML = `
    <p>Total de productos: ${numProductos}</p>
    <p>Importe total: ${total.toFixed(2)} €</p>
  `;
}

function limpiarPedido() {
  productosSugeridos = [];
  document.getElementById('input').value = '';
  document.getElementById('notas').value = '';
  mostrarProductos();
  actualizarResumen();
  document.getElementById('resultado').textContent = '';
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
    notas: document.getElementById('notas').value,
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

function guardarPedido() {
  const pedido = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    productos: [...productosSugeridos],
    notas: document.getElementById('notas').value
  };
  
  pedidosGuardados.unshift(pedido);
  localStorage.setItem('pedidosGuardados', JSON.stringify(pedidosGuardados));
  mostrarPedidosGuardados();
}

function mostrarPedidosGuardados() {
  const div = document.getElementById('listaPedidos');
  div.innerHTML = '';

  pedidosGuardados.forEach(pedido => {
    const el = document.createElement('div');
    el.className = 'pedido-guardado';
    el.onclick = () => cargarPedido(pedido);
    
    const fecha = new Date(pedido.fecha).toLocaleDateString();
    const total = pedido.productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    
    el.innerHTML = `
      <strong>Pedido del ${fecha}</strong><br/>
      Productos: ${pedido.productos.length}<br/>
      Total: ${total.toFixed(2)} €
    `;
    div.appendChild(el);
  });
}

function cargarPedido(pedido) {
  productosSugeridos = [...pedido.productos];
  document.getElementById('notas').value = pedido.notas || '';
  mostrarProductos();
  actualizarResumen();
}

function copiarJSON() {
  const texto = document.getElementById('resultado').textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert('JSON copiado al portapapeles.');
  });
}

function descargarJSON() {
  const texto = document.getElementById('resultado').textContent;
  const blob = new Blob([texto], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedido_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Inicializar la vista
mostrarPedidosGuardados();
