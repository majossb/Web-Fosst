/**
 * MOTOR DE FLUJO Y ANÁLISIS DEL DIAGNÓSTICO EMPRESARIAL FOSST
 * Cumplimiento estricto de las reglas BR-01 a BR-17 y principios metodológicos del Banco Maestro v0.2.
 * NO inventa puntuaciones numéricas, porcentajes de cumplimiento artificiales ni semáforos engañosos.
 */
import { BANCO_PREGUNTAS } from './banco.js';

/**
 * Obtiene la lista de preguntas actualmente aplicables según las respuestas registradas
 * @param {Object} respuestas - Diccionario de respuestas actuales { idPregunta: valor }
 * @returns {Array} Lista filtrada de preguntas aplicables
 */
export function getPreguntasAplicables(respuestas = {}) {
  return BANCO_PREGUNTAS.filter((p) => {
    try {
      return p.reglaAplicabilidad(respuestas);
    } catch {
      return false;
    }
  });
}

/**
 * Limpia de forma controlada las respuestas que se volvieron incompatibles al cambiar una respuesta previa
 * @param {Object} respuestasActuales - Diccionario de respuestas
 * @returns {Object} Diccionario limpio sin respuestas huérfanas
 */
export function limpiarRespuestasIncompatibles(respuestasActuales = {}) {
  const limpias = { ...respuestasActuales };
  const aplicables = getPreguntasAplicables(limpias);
  const idsAplicables = new Set(aplicables.map((p) => p.id));

  for (const id in limpias) {
    if (!idsAplicables.has(id)) {
      delete limpias[id];
    }
  }

  return limpias;
}

/**
 * Calcula el progreso real del cuestionario basado en preguntas aplicables
 * @param {Object} respuestas
 * @returns {Object} { total, respondidas, porcentaje, estaCompleto }
 */
export function calcularProgreso(respuestas = {}) {
  const aplicables = getPreguntasAplicables(respuestas);
  const total = aplicables.length;
  if (total === 0) return { total: 0, respondidas: 0, porcentaje: 0, estaCompleto: false };

  let respondidas = 0;
  for (const p of aplicables) {
    const val = respuestas[p.id];
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        if (val.length > 0) respondidas++;
      } else {
        respondidas++;
      }
    }
  }

  const porcentaje = Math.round((respondidas / total) * 100);
  const estaCompleto = respondidas >= total;

  return { total, respondidas, porcentaje, estaCompleto };
}

/**
 * Genera el reporte técnico descriptivo prudente conforme a las interpretaciones permitidas
 * @param {Object} respuestas
 * @returns {Object} Reporte con dimensiones, señales de atención y aspectos por verificar
 */
export function generarReporteDiagnostico(respuestas = {}) {
  const aplicables = getPreguntasAplicables(respuestas);
  const senalesAtencion = [];
  const pendientesVerificar = [];
  const practicasDefinidas = [];

  for (const p of aplicables) {
    const r = respuestas[p.id];
    if (!r) continue;

    const valorStr = Array.isArray(r) ? r.join(', ') : String(r);

    // Detección de incertidumbre (Reglas BR-09, BR-10)
    if (valorStr.includes('necesito_verificar') || valorStr.includes('no_evaluado') || valorStr.includes('no_se_conoce')) {
      pendientesVerificar.push({
        id: p.id,
        dimension: p.dimension,
        asunto: p.pregunta,
        nota: 'El informante manifestó requerir validación documental o consultar con el área responsable.'
      });
    }

    // Identificación de señales de atención prioritarias fundamentadas
    if (p.id === 'AC6' && r === 'si_evento_grave') {
      senalesAtencion.push({
        nivel: 'critico',
        dimension: 'Accidentes e incidentes',
        mensaje: 'Se declaró la ocurrencia de un accidente grave o incapacitante en los últimos 12 meses. Requiere verificación inmediata de reportes ante ARL/Ministerio y custodia del expediente de investigación.'
      });
    }

    if (p.id === 'SG4' && (r === 'sin_identificacion_peligros' || r === 'matriz_antigua_sin_revision')) {
      senalesAtencion.push({
        nivel: 'prioritario',
        dimension: 'Seguridad y salud en el trabajo',
        mensaje: 'La matriz de identificación de peligros no se encuentra actualizada o no está formalizada, lo que impide priorizar controles efectivos en los puestos.'
      });
    }

    if (p.id === 'CT1' && (r === 'minoria_o_informal' || r === 'mayoria_firmado')) {
      senalesAtencion.push({
        nivel: 'prioritario',
        dimension: 'Contratación y seguridad social',
        mensaje: 'Se identificó personal sin formalización contractual por escrito o con procesos pendientes de firma, generando exposición a controversias laborales.'
      });
    }

    if (p.id === 'CT2' && r === 'subordinacion_o_dudas') {
      senalesAtencion.push({
        nivel: 'prioritario',
        dimension: 'Contratación y relaciones de trabajo',
        mensaje: 'Se reportan condiciones cotidianas de subordinación o cumplimiento de horario estricto en contratos de prestación de servicios (riesgo de contrato realidad).'
      });
    }

    if (p.id === 'CF2' && (r === 'sin_control_de_autorizacion' || r === 'solo_experiencia_verbal')) {
      senalesAtencion.push({
        nivel: 'prioritario',
        dimension: 'Competencias y formación',
        mensaje: 'Se ejecutan tareas críticas (alturas, químicos o maquinaria) sin verificación documental de certificados de aptitud ni permisos de trabajo firmados.'
      });
    }

    if (p.id === 'VI1' && (r === 'no_se_ha_evaluado_pesv' || r === 'se_sabe_que_aplica_sin_documentar')) {
      senalesAtencion.push({
        nivel: 'medio',
        dimension: 'Seguridad vial laboral',
        mensaje: 'Se utilizan medios de transporte en la operación pero no se ha determinado el nivel de PESV aplicable conforme a la Resolución 40595 de 2022.'
      });
    }

    if (p.id === 'AM1' && (r === 'dudas_sobre_permisos' || r === 'no_se_ha_evaluado_ambiental')) {
      senalesAtencion.push({
        nivel: 'medio',
        dimension: 'Gestión ambiental',
        mensaje: 'Se generan aspectos ambientales (vertimientos, residuos o emisiones) sin un diagnóstico de permisos o autorizaciones ante la autoridad competente.'
      });
    }

    // Prácticas definidas y estructuradas
    if (
      r === 'formal_escrito' ||
      r === 'todas_firmado' ||
      r === 'mensual_persona_a_persona' ||
      r === 'plan_anual_firmado_al_dia' ||
      r === 'matriz_peligros_actualizada' ||
      r === 'profesiograma_y_examenes_al_dia' ||
      r === 'plan_emergencias_brigada_dotacion'
    ) {
      practicasDefinidas.push({
        dimension: p.dimension,
        asunto: p.pregunta
      });
    }
  }

  return {
    fechaGeneracion: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    resumenDeclarado: {
      rol: respuestas.P1 || 'No especificado',
      actividad: respuestas.P2 || 'No especificada',
      tamanoEmpresa: respuestas.P4 || 'No especificado',
      totalPreguntasEvaluadas: aplicables.length
    },
    senalesAtencion,
    pendientesVerificar,
    practicasDefinidas,
    notaMetodologica: 'Este reporte es una autoevaluación orientativa basada exclusivamente en hechos declarados por el informante. No constituye auditoría formal, concepto jurídico definitivo ni certificación de cumplimiento legal.'
  };
}
