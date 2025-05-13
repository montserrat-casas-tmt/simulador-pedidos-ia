
import React, { useState } from 'react';

export default function App() {
  const [necesidad, setNecesidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarEnvio = () => {
    setMensaje(`Necesidad registrada: ${necesidad}`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Simulador de Pedidos IA</h1>
      <textarea
        style={{ width: '100%', height: '100px', marginTop: '1rem' }}
        placeholder="Ejemplo: Instalación eléctrica en oficina de 50m²"
        value={necesidad}
        onChange={e => setNecesidad(e.target.value)}
      />
      <button style={{ marginTop: '1rem' }} onClick={manejarEnvio}>
        Enviar
      </button>
      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}
