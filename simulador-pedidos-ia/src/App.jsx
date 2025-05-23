import { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

function App() {
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [notas, setNotas] = useState('')

  const handleSugerirProductos = () => {
    // Implementar lógica de sugerencia
    console.log('Sugerir productos')
  }

  const handleLimpiarPedido = () => {
    setInput('')
    setNotas('')
  }

  const handleFiltrarProductos = () => {
    // Implementar lógica de filtrado
    console.log('Filtrar productos')
  }

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
              <PlusIcon className="h-5 w-5" />
              Sugerir productos
            </button>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={handleLimpiarPedido}
            >
              <TrashIcon className="h-5 w-5" />
              Limpiar pedido
            </button>
          </div>
        </div>

        {/* Sección de búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
  )
}

export default App
