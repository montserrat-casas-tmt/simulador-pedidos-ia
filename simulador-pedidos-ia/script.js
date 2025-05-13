let productosSugeridos = [];
let pedidosGuardados = JSON.parse(localStorage.getItem('pedidosGuardados')) || [];

// Escenarios predefinidos
const ESCENARIOS = {
  oficina: {
    nombre: 'Oficina',
    productos: [
      { id: 'VIR-P S (RTD0935)', cantidad: 2 },
      { id: 'VIR-T N (RTD0929,N)', cantidad: 2 },
      { id: 'VIR-BD L (RTD0928,N)', cantidad: 1 },
      { id: 'ZLD-GL25RAL7035', cantidad: 1 }
    ]
  },
  taller: {
    nombre: 'Taller',
    productos: [
      { id: 'VIR-SBRTD0932B', cantidad: 2 },
      { id: 'VIR-TBRTD0932B', cantidad: 1 },
      { id: 'Z LD-G L25 (RAL9006,24V)', cantidad: 1 }
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
      mostrarProductos();
      actualizarResumen();
      return;
    }
  }

  // Si el usuario menciona 'climatizar', sugerir 5 productos aleatorios de climatización
  if (input.includes('climatizar')) {
    const productosClima = CATALOGO.filter(p => p.categoria && p.categoria.toLowerCase().includes('climatizacion'));
    const indices = Array.from({length: productosClima.length}, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    productosSugeridos = indices.slice(0, 5).map(i => ({ id: productosClima[i].id, cantidad: 1 }));
    mostrarProductos();
    actualizarResumen();
    return;
  }

  // Búsqueda avanzada en descripción (singular/plural)
  if (input.trim() !== "") {
    const terminos = input.split(/\s+/).map(t => t.trim()).filter(Boolean);
    productosSugeridos = CATALOGO.filter(p => {
      const desc = (p.descripcion || '').toLowerCase();
      return terminos.some(t => {
        // Coincidencia exacta, singular/plural simple
        if (desc.includes(t)) return true;
        if (t.endsWith('s') && desc.includes(t.slice(0, -1))) return true;
        if (!t.endsWith('s') && desc.includes(t + 's')) return true;
        return false;
      });
    }).map(p => ({ id: p.id, cantidad: 1 }));
  }

  // Si sigue sin haber sugerencias, sugerir 5 productos aleatorios
  if (productosSugeridos.length === 0) {
    const indices = Array.from({length: CATALOGO.length}, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    productosSugeridos = indices.slice(0, 5).map(i => ({ id: CATALOGO[i].id, cantidad: 1 }));
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

function esImagenDirecta(url) {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
}

function mostrarProductosFiltrados(productos) {
  const div = document.getElementById('productos');
  div.innerHTML = '';

  productos.forEach(p => {
    const urlImagen = esImagenDirecta(p.imagen)
      ? p.imagen
      : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    const el = document.createElement('div');
    el.className = 'producto';
    el.innerHTML = `
      <img src="${urlImagen}" alt="${p.descripcion}" class="producto-imagen">
      <div class="producto-info">
        <strong>${p.descripcion}</strong><br/>
        Cantidad: <input type="number" min="0" value="1" onchange="agregarProducto('${p.id}', this.value)" />
        ${p.unidad}<br/>
        Precio unitario: ${p.precio.toFixed(2)} €
      </div>
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
    const urlImagen = esImagenDirecta(p.imagen)
      ? p.imagen
      : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
    const el = document.createElement('div');
    el.className = 'producto';
    el.innerHTML = `
      <img src="${urlImagen}" alt="${p.descripcion}" class="producto-imagen">
      <div class="producto-info">
        <strong>${p.descripcion}</strong><br/>
        Cantidad: <input type="number" min="0" value="${p.cantidad}" onchange="actualizarCantidad(${i}, this.value)" />
        ${p.unidad}<br/>
        Precio unitario: ${p.precio.toFixed(2)} €<br/>
        Total: <span id="total-${i}">${(p.precio * p.cantidad).toFixed(2)}</span> €
      </div>
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

function ampliarCatalogo() {
  const input = document.getElementById('catalogoFile');
  if (!input.files || !input.files[0]) {
    alert('Selecciona un archivo CSV válido.');
    return;
  }
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const texto = e.target.result;
    const lineas = texto.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lineas.length < 2) {
      alert('El archivo no contiene datos.');
      return;
    }
    const cabecera = lineas[0].split(';');
    const idxRef = cabecera.findIndex(c => c.toLowerCase().includes('referencia'));
    const idxDesc = cabecera.findIndex(c => c.toLowerCase().includes('descripcion'));
    const idxImg = cabecera.findIndex(c => c.toLowerCase().includes('contenido'));
    if (idxRef === -1 || idxImg === -1) {
      alert('El archivo debe tener columnas Referencia y Contenido.');
      return;
    }
    let nuevos = 0;
    for (let i = 1; i < lineas.length; i++) {
      const cols = lineas[i].split(';');
      const id = cols[idxRef]?.trim();
      if (!id) continue;
      if (window.CATALOGO.find(p => p.id === id)) continue;
      const descripcion = (cols[idxDesc] && cols[idxDesc].trim()) || id;
      const imagen = cols[idxImg]?.trim();
      window.CATALOGO.push({
        id,
        descripcion,
        unidad: 'ud',
        precio: 50,
        categoria: 'AMPLIADO',
        imagen
      });
      nuevos++;
    }
    mostrarMensajeCarga(`Catálogo ampliado con éxito. Productos añadidos: ${nuevos}`);
  };
  reader.readAsText(file);
}

function mostrarMensajeCarga(mensaje) {
  let div = document.getElementById('mensaje-carga');
  if (!div) {
    div = document.createElement('div');
    div.id = 'mensaje-carga';
    div.style.margin = '1rem 0';
    div.style.padding = '0.5rem 1rem';
    div.style.background = '#e8f4f8';
    div.style.border = '1px solid #3498db';
    div.style.color = '#2c3e50';
    div.style.borderRadius = '4px';
    document.querySelector('.catalogo-upload-section').appendChild(div);
  }
  div.textContent = mensaje;
  setTimeout(() => { div.textContent = ''; }, 5000);
}

// Inicializar la vista
mostrarPedidosGuardados();
