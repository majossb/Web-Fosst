/**
 * chapters.js — Declarative chapter table for the scroll world
 * 
 * Each chapter defines its u range, camera target, lighting mood,
 * fog settings, and DOM overlay text.
 * The World reads these to interpolate all visual properties.
 */

export const CHAPTERS = [
  {
    id: 0,
    slug: 'hero',
    uStart: 0.00,
    uEnd: 0.20,
    label: 'Inicio',
    title: '',
    subtitle: '',
    // Camera: high and far, slow advance toward the plant
    cameraStart: { x: 0, y: 18, z: 30 },
    cameraEnd: { x: 0, y: 10, z: 18 },
    lookAtStart: { x: 0, y: 2, z: 0 },
    lookAtEnd: { x: 0, y: 2, z: -5 },
    // Lighting mood
    ambientColor: 0x1a1520,
    ambientIntensity: 0.15,
    keyLightColor: 0xFFC800,
    keyLightIntensity: 1.2,
    // Fog
    fogColor: 0x0b0f1f,
    fogDensity: 0.045,
  },
  {
    id: 1,
    slug: 'diagnostico',
    uStart: 0.20,
    uEnd: 0.40,
    label: 'Diagnóstico',
    number: '01',
    title: 'Diagnóstico',
    tagline: 'Primero, ver el riesgo tal como es.',
    body: 'Recorremos tu empresa, medimos tu nivel de riesgo y encontramos lo que hoy te falta para cumplir.',
    cameraStart: { x: 0, y: 10, z: 18 },
    cameraEnd: { x: -4, y: 6, z: 8 },
    lookAtStart: { x: 0, y: 2, z: -5 },
    lookAtEnd: { x: 0, y: 1, z: -8 },
    ambientColor: 0x1a1520,
    ambientIntensity: 0.18,
    keyLightColor: 0xFFD040,
    keyLightIntensity: 1.0,
    fogColor: 0x0d1225,
    fogDensity: 0.038,
  },
  {
    id: 2,
    slug: 'plan',
    uStart: 0.40,
    uEnd: 0.60,
    label: 'Plan',
    number: '02',
    title: 'Plan',
    tagline: 'Después, trazar el orden.',
    body: 'Priorizamos acciones según urgencia, presupuesto y normatividad.',
    cameraStart: { x: -4, y: 6, z: 8 },
    cameraEnd: { x: 4, y: 5, z: 0 },
    lookAtStart: { x: 0, y: 1, z: -8 },
    lookAtEnd: { x: 2, y: 1, z: -10 },
    ambientColor: 0x101830,
    ambientIntensity: 0.22,
    keyLightColor: 0xE8D8B0,
    keyLightIntensity: 0.9,
    fogColor: 0x0f1830,
    fogDensity: 0.030,
  },
  {
    id: 3,
    slug: 'implementacion',
    uStart: 0.60,
    uEnd: 0.80,
    label: 'Implementación',
    number: '03',
    title: 'Implementación',
    tagline: 'El orden se construye contigo.',
    body: 'Documentos, formación y controles en cada puesto de trabajo.',
    cameraStart: { x: 4, y: 5, z: 0 },
    cameraEnd: { x: 2, y: 4, z: -8 },
    lookAtStart: { x: 2, y: 1, z: -10 },
    lookAtEnd: { x: 0, y: 2, z: -16 },
    ambientColor: 0x0d1a3a,
    ambientIntensity: 0.28,
    keyLightColor: 0xC8D8F0,
    keyLightIntensity: 0.8,
    fogColor: 0x101e40,
    fogDensity: 0.022,
  },
  {
    id: 4,
    slug: 'seguimiento',
    uStart: 0.80,
    uEnd: 1.00,
    label: 'Seguimiento',
    number: '04',
    title: 'Seguimiento',
    tagline: 'Y se sostiene en el tiempo.',
    body: 'Medimos, auditamos y ajustamos para que tu empresa esté siempre en regla.',
    cameraStart: { x: 2, y: 4, z: -8 },
    cameraEnd: { x: 0, y: 3.5, z: -14 },
    lookAtStart: { x: 0, y: 2, z: -16 },
    lookAtEnd: { x: 0, y: 2.5, z: -18 },
    ambientColor: 0x001A4D,
    ambientIntensity: 0.35,
    keyLightColor: 0xE0E8FF,
    keyLightIntensity: 0.7,
    fogColor: 0x001A4D,
    fogDensity: 0.015,
  }
];

/**
 * Get the current chapter index based on u
 * @param {number} u
 * @returns {number}
 */
export function getCurrentChapter(u) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (u >= CHAPTERS[i].uStart) return i;
  }
  return 0;
}

/**
 * Get local progress within a chapter [0, 1]
 * @param {number} chapterIndex
 * @param {number} u
 * @returns {number}
 */
export function getChapterProgress(chapterIndex, u) {
  const ch = CHAPTERS[chapterIndex];
  if (!ch) return 0;
  const range = ch.uEnd - ch.uStart;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (u - ch.uStart) / range));
}
