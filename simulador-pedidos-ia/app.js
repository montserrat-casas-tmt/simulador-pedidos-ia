const { useState } = React;

function App() {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notas, setNotas] = useState('');

  const handleSugerirProductos = () => {
    // Implementar lógica de sugerencia
    console.log('Sugerir productos');
  };

  const handleLimpiarPedido = () => {
    setInput('');
    setNotas('');
  };

  const handleFiltrarProductos = () => {
    // Implementar lógica de filtrado
    console.log('Filtrar productos');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Simulador de Pedidos Automatizado con IA
        </h1>

        {/* Sección de entrada */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <textarea
            className="input h-32 mb-4"
            placeholder="Describe tu necesidad..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSugerirProductos}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Sugerir productos
            </button>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={handleLimpiarPedido}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Limpiar pedido
            </button>
          </div>
        </div>

        {/* Sección de búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="input w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="cable">Cables</option>
              <option value="tubo">Tubos</option>
              <option value="caja">Cajas</option>
              <option value="proteccion">Protección</option>
              <option value="iluminacion">Iluminación</option>
            </select>
          </div>
        </div>

        {/* Sección de notas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <textarea
            className="input h-24"
            placeholder="Añade notas al pedido..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>

        {/* Sección de acciones */}
        <div className="flex gap-4">
          <button className="btn btn-primary">Generar Pedido (JSON)</button>
          <button className="btn btn-secondary">Guardar Pedido</button>
          <button className="btn btn-secondary">Copiar JSON</button>
          <button className="btn btn-secondary">Guardar como .json</button>
        </div>
      </div>
    </div>
  );
}

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(<App />); 