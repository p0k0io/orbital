"use client";

export default function StatsPanel() {
  return (
    <div className="w-full h-96 bg-black/40 border-t border-white/10 p-4 shadow-xl backdrop-blur-md">
      
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl max-w-3xl mx-auto">

        <h3 className="text-white text-lg font-semibold mb-3">
          Estadísticas
        </h3>

        <div className="space-y-3">
          {[
            "Peticiones recientes",
            "Promedio de respuesta",
            "Tamaño enviado",
            "Errores detectados",
          ].map((titulo, idx) => (
            <details
              key={idx}
              className="
                bg-black/20 border border-white/10 rounded-lg p-3 
                text-white/80 cursor-pointer transition-all
              "
            >
              <summary className="font-semibold text-white cursor-pointer">
                {titulo}
              </summary>

              <div className="mt-2 text-sm text-white/70">
                <p>Contenido de ejemplo para "{titulo}".</p>
              </div>
            </details>
          ))}
        </div>

      </div>
    </div>
  );
}
