"use client";

import { useState } from "react";

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("php");
  const codeSnippets = {
    php: `<?php
$ch = curl_init();
$postFields = ['file' => new CURLFile($filePath)];
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $apiKey"],
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch);
} else {
    echo $response;
}
curl_close($ch);`,
    js: `const sendPeticion = async () => {
    if (!selectedFile) return;
    const apiKey = "4a868774-7654-4106-b1b6-97e05d5c09be";
    const url = "https://...";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: \`Bearer \${apiKey}\` },
        body: formData
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
};`,
    python: `import requests

image_path = "file.png"
with open(image_path, "rb") as img_file:
    files = {"file": (image_path, img_file, "image/png")}
    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, files=files, headers=headers)

print(response.status_code)
print(response.text)`,
    curl: `curl -X 'POST' \\
  'https://...' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer 4a868774-7654-4106-b1b6-97e05d5c09be' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'file=@sample_cv_variant_14.pdf;type=application/pdf'`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    alert("Código copiado al portapapeles ✅");
  };
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex gap-8 p-8 text-neutral-200 font-light">

      {/* ------------------------ */}
      {/*       SIDEBAR INDEX      */}
      {/* ------------------------ */}
      <div className="w-full max-w-xs p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl sticky top-8 h-fit flex flex-col gap-5">
        <h2 className="text-xl font-medium tracking-wide text-neutral-100">Índice</h2>

        <nav className="flex flex-col gap-4 text-sm text-neutral-300">
          <button onClick={() => scrollTo("intro")} className="text-left hover:text-white transition-all">
            1. Introducción y funcionamiento
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("intro-que-es")} className="text-left hover:text-white">• ¿Qué es Orbital?</button>
            <button onClick={() => scrollTo("intro-como-funciona")} className="text-left hover:text-white">• Funcionamiento</button>
          </div>

          <button onClick={() => scrollTo("configuracion")} className="text-left hover:text-white transition-all">
            2. Configuración inicial
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("api-key")} className="text-left hover:text-white">• Creación de la API Key</button>
            <button onClick={() => scrollTo("endpoint")} className="text-left hover:text-white">• Creación del Endpoint</button>
          </div>
          <button onClick={() => scrollTo("uso-api")} className="text-left hover:text-white transition-all">
            3. Uso de la API
          </button>
          <div className="flex flex-col gap-2 pl-4 text-neutral-400">
            <button onClick={() => scrollTo("intro-imple")} className="text-left hover:text-white">• Introducción al uso de la API</button>
            <button onClick={() => scrollTo("flujo-asincrono")} className="text-left hover:text-white">• Flujo Asíncrono</button>
            <button onClick={() => scrollTo("formato-output")} className="text-left hover:text-white">• Formato de Output</button>
            <button onClick={() => scrollTo("error-management")} className="text-left hover:text-white">• Gestión de Errores</button>
            <button onClick={() => scrollTo("estados-requests")} className="text-left hover:text-white">• Estados de las Requests</button>
          </div>
        </nav>
      </div>

      {/* ------------------------ */}
      {/*      MAIN CONTENT        */}
      {/* ------------------------ */}
      <div className="w-full max-w-4xl p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-16 leading-relaxed">

        {/* --- INTRO --- */}
        <section id="intro" className="scroll-mt-28">
          <h1 className="text-3xl font-semibold text-white mb-3">1. Introducción y funcionamiento</h1>
          <p className="text-neutral-300">
            Esta guía describe el flujo de interacción entre tu frontend y la API asíncrona de Orbital. El proceso se divide en dos fases bien diferenciadas: una fase inmediata que confirma la recepción del archivo y una fase posterior en la que el backend envía el resultado a tu webhook.
          </p>
          <p className="text-neutral-400 mt-2">
            Memoriza la regla clave: <span className="text-white font-medium">202 Accepted nunca significa “éxito final”</span>, solo confirma que el procesamiento empezó. El estado definitivo llega siempre vía callback.
          </p>
        </section>

        <section id="intro-que-es" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">¿Qué es Orbital?</h3>
          <p className="text-neutral-400">
            Orbital es un servicio que permite a empresas y desarrolladores estandarizar la estructura de sus datos, incluso cuando provienen de documentos digitales o físicos que contienen la misma información pero organizada de formas diferentes o totalmente desestructurada.
          </p>
          <p className="text-neutral-400 mt-2">
            Su motor de normalización está orientado a CVs, contratos, facturas y cualquier documento donde necesites homogenizar el resultado en un JSON previamente definido.
          </p>
        </section>

        <section id="intro-como-funciona" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Funcionamiento</h3>
          <p className="text-neutral-400">
            El funcionamiento es sencillo: el cliente crea su propio endpoint dentro de Orbital y envía las peticiones adjuntando el archivo A. Nosotros procesamos el documento, extraemos y organizamos la información según la estructura definida y enviamos el resultado en formato JSON a un webhook que el cliente haya configurado. Desde allí, la empresa o el desarrollador puede aplicar cualquier proceso adicional que necesite.
          </p>
          <p className="text-neutral-300 mt-3">
            La arquitectura se apoya en <span className="text-white">colas de trabajo</span> y en una <span className="text-white">callbackURL</span> por cada endpoint, lo que garantiza escalabilidad y resiliencia ante cargas variables.
          </p>
        </section>

        {/* --- CONFIGURACIÓN --- */}
        <section id="configuracion" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-3">2. Configuración inicial</h2>
          <p className="text-neutral-300 text-lg">
            Para comenzar a usar Orbital, debes completar dos pasos fundamentales:
          </p>
          <ul className="list-disc pl-6 text-neutral-400">
            <li>Crear tu API Key</li>
            <li>Configurar tu Endpoint</li>
          </ul>
          <p className="text-neutral-300 text-lg">
            Estos dos elementos permiten autenticar tus solicitudes y definir cómo Orbital estructurará tus datos antes de enviarlos a tu webhook.
          </p>
          <p className="text-neutral-400 mt-2">
            Recomendación: documenta internamente quién generó cada key y endpoint para facilitar auditorías o rotaciones periódicas.
          </p>
        </section>

        {/* --- API KEY --- */}
        <section id="api-key" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Creación de la API Key</h3>
          <p className="text-neutral-400">
            La API Key es indispensable para interactuar con Orbital. Funciona como un identificador único que valida que las peticiones provienen de un usuario autorizado.
          </p>
          <h4 className="text-lg font-medium text-white mb-1 mt-4">Cómo generar una API Key</h4>
          <ol className="list-decimal pl-6 text-neutral-400">
            <li>Dirígete a la sección de API Keys en tu panel.</li>
            <li>Haz clic en “Generar nueva API Key”.</li>
            <li>El sistema te mostrará tu nueva API Key una sola vez.</li>
          </ol>
          <p className="text-yellow-400 mt-2">
            ⚠️ Importante: Por razones de seguridad, la API Key no volverá a mostrarse. Si la pierdes, deberás eliminarla o generar una nueva.
          </p>
          <p className="text-neutral-300 mt-3">
            Buenas prácticas:
          </p>
          <ul className="list-disc pl-6 text-neutral-400">
            <li>Guárdala en tu gestor de secretos o variables de entorno seguras.</li>
            <li>Rótala periódicamente y revoca las que ya no uses.</li>
          </ul>
        </section>

        {/* --- ENDPOINT --- */}
        <section id="endpoint" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Creación del Endpoint</h3>
          <p className="text-neutral-400">
            Con tu API Key creada, el siguiente paso es configurar un endpoint donde Orbital recibirá tus documentos y procesará la información.
          </p>
          <h4 className="text-lg font-medium text-white mb-1 mt-4">Cómo crear un Endpoint</h4>
          <ol className="list-decimal pl-6 text-neutral-400">
            <li>Accede a la sección “Endpoints” en tu panel.</li>
            <li>Haz clic en “Nuevo endpoint”.</li>
            <li>Completa los siguientes campos:
              <ul className="list-disc pl-6">
                <li>Nombre: Una etiqueta que te permita identificar fácilmente el endpoint.</li>
                <li>Estructura: Define el esquema JSON que deseas recibir como resultado.</li>
                <li>Webhook: URL donde Orbital enviará la información procesada en formato JSON.</li>
              </ul>
            </li>
            <li>Confirma la creación y el sistema generará automáticamente una URL única.</li>
          </ol>
          <p className="text-neutral-300 text-lg mt-2">
            Esta será la URL a la que deberás enviar tus peticiones POST junto con tus documentos (archivo A).
          </p>
          <p className="text-neutral-400 mt-2">
            Verifica que la URL del webhook sea accesible públicamente, soporte HTTPS y responda rápidamente (ideal &lt; 3s) para evitar reintentos.
          </p>
        </section>

        {/* --- USO DE LA API --- */}
        <section id="uso-api" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-3">3. Uso de la API</h2>
          <p className="text-neutral-300 text-lg">
            La interacción con la API es asíncrona: envías el archivo y recibes una confirmación inmediata, mientras el procesamiento se realiza en segundo plano. El resultado llega vía webhook.
          </p>
          <div className="border border-white/10 rounded-2xl p-4 mt-4 bg-white/5 text-sm text-neutral-200">
            <p className="font-semibold mb-2 text-white">Checklist previo al envío</p>
            <ul className="list-disc pl-6 text-neutral-300">
              <li>Adjuntar exactamente un archivo por petición.</li>
              <li>Incluir el header <code className="bg-black/50 px-2 py-1 rounded">Authorization: Bearer &lt;API_KEY&gt;</code>.</li>
              <li>Usar <code className="bg-black/50 px-2 py-1 rounded">multipart/form-data</code> como Content-Type.</li>
              <li>Persistir el <code className="bg-black/50 px-2 py-1 rounded">request_id</code> recibido para correlacionar el webhook.</li>
            </ul>
          </div>
        </section>

        <section id="intro-imple" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Introducción al uso de la API</h3>
          <p className="text-neutral-400">
            Envía peticiones POST al endpoint `/cv/endpoint_id` con el archivo adjunto. La API responde con 202 Accepted si se acepta, y procesa asíncronamente.
          </p>
          <p className="text-neutral-300 mt-3">
            Ejemplo de patrón recomendado en Next.js/React para iniciar el procesamiento:
          </p>
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
{`const [apiRequest, setApiRequest] = useState({
  requestId: null,
  error: null,
  status: "idle",
});

const startCvProcessing = async (file, endpointId) => {
  setApiRequest((prev) => ({ ...prev, status: "loading" }));
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(\`/api/cv/\${endpointId}\`, {
      method: "POST",
      headers: { Authorization: \`Bearer \${process.env.NEXT_PUBLIC_API_KEY}\` },
      body: formData,
    });

    const result = await response.json();

    if (response.status !== 202) {
      throw new Error(result.detail || "Error en la petición inicial.");
    }

    setApiRequest({
      requestId: result.request_id,
      error: null,
      status: "processing",
    });
  } catch (error) {
    setApiRequest({
      requestId: null,
      error: error.message,
      status: "failed",
    });
  }
};`}
          </pre>
          <p className="text-neutral-400 mt-2">
            Observa que el estado <code>processing</code> permanece activo hasta que el webhook confirme el resultado final.
          </p>
        </section>

        <section id="flujo-asincrono" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Flujo Asíncrono</h3>
          <ol className="list-decimal pl-6 text-neutral-400">
            <li>Fase 1: Envía el archivo; recibe confirmación inmediata (202 Accepted) con request_id.</li>
            <li>Fase 2: El resultado (JSON estructurado o error) se envía al webhook configurado.</li>
          </ol>
          <p className="text-neutral-300 mt-3">
            Usa el <code className="bg-black/50 px-2 py-1 rounded">request_id</code> para correlacionar logs entre el frontend y el backend, especialmente útil para depurar errores o demostrar SLA.
          </p>
        </section>

        <section id="formato-output" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Formato de Output</h3>
          <p className="text-neutral-400">
            Respuesta inicial: {'{"message": "Archivo recibido...", "request_id": "..."}'}.
          </p>
          <p className="text-neutral-400 mt-2">
            Webhook éxito: {`{"status": "completed", "data": {...}}`}. Fallo: {`{"status": "failed", "error": "...", "data": null}`}.
          </p>
          <p className="text-neutral-300 mt-3">
            Estructura mínima del payload de éxito:
          </p>
          <pre className="bg-black/60 rounded-xl p-4 text-xs text-neutral-200 overflow-x-auto">
{`{
  "status": "completed",
  "data": {
    "contact_info": { "name": "Juan Pérez", "email": "juan.perez@email.com" },
    "experience": [
      { "position": "Desarrollador Backend", "company": "Tech Solutions" }
    ]
  }
}`}
          </pre>
        </section>

        <section id="error-management" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Gestión de Errores</h3>
          <p className="text-neutral-400">
            Errores síncronos (fase 1): 401 (API Key inválida), 403 (sin permisos), 404 (endpoint no encontrado), 422 (validación fallida), 500 (error interno).
          </p>
          <p className="text-neutral-400 mt-2">
            Errores asíncronos (fase 2): Detectados en webhook con "status": "failed". Maneja timeouts si no llega el webhook.
          </p>

          <div className="mt-6">
            <h4 className="text-lg font-medium text-white mb-3">Tabla de errores síncronos</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-white/10 text-white">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Tipo de error</th>
                    <th className="px-4 py-3">Acción en Frontend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 text-white font-semibold">401</td>
                    <td className="px-4 py-3">Unauthorized</td>
                    <td className="px-4 py-3">Verifica API Key, renueva sesión o solicita nueva key.</td>
                  </tr>
                  <tr className="bg-white/5">
                    <td className="px-4 py-3 text-white font-semibold">403</td>
                    <td className="px-4 py-3">Forbidden</td>
                    <td className="px-4 py-3">Muestra “Acceso denegado” y revisa permisos del endpoint.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-semibold">404</td>
                    <td className="px-4 py-3">Not Found</td>
                    <td className="px-4 py-3">Valida que el <code>endpoint_id</code> exista antes de reenviar.</td>
                  </tr>
                  <tr className="bg-white/5">
                    <td className="px-4 py-3 text-white font-semibold">422</td>
                    <td className="px-4 py-3">Unprocessable Entity</td>
                    <td className="px-4 py-3">Comprueba que se haya adjuntado exactamente un archivo.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-semibold">500</td>
                    <td className="px-4 py-3">Internal Server Error</td>
                    <td className="px-4 py-3">Mensaje genérico y reintento manual posterior.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium text-white mb-3">Errores asíncronos (webhook)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-white/10 text-white">
                  <tr>
                    <th className="px-4 py-3">Escenario</th>
                    <th className="px-4 py-3">Detección</th>
                    <th className="px-4 py-3">Respuesta sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 text-white font-semibold">Fallo de procesamiento</td>
                    <td className="px-4 py-3"><code>status: "failed"</code> en payload</td>
                    <td className="px-4 py-3">Mostrar mensaje “No pudimos procesar tu archivo, inténtalo nuevamente”.</td>
                  </tr>
                  <tr className="bg-white/5">
                    <td className="px-4 py-3 text-white font-semibold">Timeout del webhook</td>
                    <td className="px-4 py-3">No se recibe callback tras X minutos</td>
                    <td className="px-4 py-3">Implementa cron o alerta para marcar la request como fallida.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-semibold">Rechazo del webhook</td>
                    <td className="px-4 py-3">HTTP 4xx/5xx enviados a Orbital</td>
                    <td className="px-4 py-3">Asegura que el receptor tolere reintentos y no limite la IP de Orbital.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="estados-requests" className="scroll-mt-28">
          <h3 className="text-xl font-medium text-white mb-2">Estados de las Requests</h3>
          <ul className="list-disc pl-6 text-neutral-400">
            <li>idle: Inicial.</li>
            <li>loading: Enviando petición inicial.</li>
            <li>processing: Esperando webhook.</li>
            <li>succeeded: Resultado exitoso recibido.</li>
            <li>failed: Error en cualquier fase.</li>
          </ul>
          <div className="mt-4">
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-5 bg-white/10 text-center text-xs uppercase tracking-widest">
                <div className="py-3 text-white">Idle</div>
                <div className="py-3 text-white">Loading</div>
                <div className="py-3 text-white">Processing</div>
                <div className="py-3 text-white">Succeeded</div>
                <div className="py-3 text-white">Failed</div>
              </div>
              <div className="grid grid-cols-5 text-center text-sm">
                <div className="py-3 text-neutral-300">Formulario listo.</div>
                <div className="py-3 text-neutral-300">Spinner corto.</div>
                <div className="py-3 text-neutral-300">Mensaje persistente.</div>
                <div className="py-3 text-neutral-300">Mostrar datos.</div>
                <div className="py-3 text-neutral-300">Permitir reintento.</div>
              </div>
            </div>
          </div>
        </section>

         {/* --- VISUALIZADOR DE CÓDIGO CON BOTÓN COPIAR --- */}
        <section id="visualizador-codigo" className="scroll-mt-28">
          <h2 className="text-3xl font-semibold text-white mb-4">4. Ejemplos de implementación</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex gap-2 mb-3">
              {Object.keys(codeSnippets).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeLang === lang ? "bg-blue-600 text-white" : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
              <button
                onClick={copyToClipboard}
                className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Copiar
              </button>
            </div>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              {codeSnippets[activeLang]}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}