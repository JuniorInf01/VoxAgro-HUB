const entradaNota = document.querySelector("#notaCampo");
const botonGenerar = document.querySelector("#generarReporte");
const formularioEspera = document.querySelector("#formularioEspera");
const mensajeFormulario = document.querySelector("#mensajeFormulario");

const camposReporte = {
  lote: document.querySelector("#reporteLote"),
  actividad: document.querySelector("#reporteActividad"),
  produccion: document.querySelector("#reporteProduccion"),
  manoObra: document.querySelector("#reporteManoObra"),
  alerta: document.querySelector("#reporteAlerta"),
  recomendacion: document.querySelector("#reporteRecomendacion"),
  fecha: document.querySelector("#fechaReporte")
};

function encontrarPrimero(patrones, texto, respaldo) {
  for (const patron of patrones) {
    const coincidencia = texto.match(patron);
    if (coincidencia) {
      return coincidencia[1] ? coincidencia[1].trim() : coincidencia[0].trim();
    }
  }

  return respaldo;
}

function construirReporte() {
  const texto = entradaNota.value.trim();
  const textoMinuscula = texto.toLowerCase();

  const lote = encontrarPrimero([/(lote\s*\d+)/i, /(fundo\s+[a-záéíóúñ\s]+)/i], texto, "Lote por confirmar");
  const cultivo = encontrarPrimero([/(palta|arándano|uva|mango|espárrago|café|cacao)/i], texto, "Cultivo por confirmar");
  const cajas = encontrarPrimero([/(\d+\s*cajas?)/i, /(\d+\s*kg)/i, /(\d+\s*toneladas?)/i], texto, "Producción no especificada");
  const manoObra = encontrarPrimero([/(\d+\s*jornales?)/i, /(\d+\s*personas?)/i, /(\d+\s*trabajadores?)/i], texto, "Mano de obra no especificada");
  const alerta = encontrarPrimero([/(plaga[^.]*)/i, /(roya[^.]*)/i, /(estrés hídrico[^.]*)/i], texto, "Sin alerta crítica registrada");
  const recomendacion = encontrarPrimero([/(recomiendo[^.]*)/i, /(aplicar[^.]*)/i, /(programar[^.]*)/i], texto, "Seguimiento en próxima visita");

  let actividad = "Visita técnica registrada";
  if (textoMinuscula.includes("cosech")) actividad = "Cosecha registrada";
  if (textoMinuscula.includes("riego")) actividad = "Riego supervisado";
  if (textoMinuscula.includes("fertiliz")) actividad = "Fertilización revisada";
  if (textoMinuscula.includes("aplic")) actividad = "Aplicación fitosanitaria";

  camposReporte.lote.textContent = `${cultivo} · ${lote}`;
  camposReporte.actividad.textContent = actividad;
  camposReporte.produccion.textContent = cajas;
  camposReporte.manoObra.textContent = manoObra;
  camposReporte.alerta.textContent = alerta;
  camposReporte.recomendacion.textContent = recomendacion.replace(/^recomiendo\s*/i, "");
}

function colocarFecha() {
  const hoy = new Date();
  camposReporte.fecha.textContent = hoy.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

botonGenerar.addEventListener("click", construirReporte);

formularioEspera.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datosFormulario = new FormData(formularioEspera);
  const nombre = datosFormulario.get("nombre").trim();

  mensajeFormulario.textContent = `Gracias, ${nombre}. Tu solicitud de piloto quedó registrada en esta demostración.`;
  formularioEspera.reset();
});

colocarFecha();
