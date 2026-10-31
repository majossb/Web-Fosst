/**
 * Catálogo maestro de los 9 servicios oficiales de FOSST
 * Basado en el portafolio 2026 y especificación técnica
 */
export const SERVICIOS = [
  {
    id: 1,
    slug: 'sg-sst',
    nombre: 'Diseño e implementación del SG-SST',
    descripcionCorta: 'Construcción y fortalecimiento del Sistema de Gestión de Seguridad y Salud en el Trabajo bajo la Resolución 0312 de 2019.',
    dirigidoA: 'Micro, pequeñas y medianas empresas de cualquier sector económico que requieran cumplir estándares mínimos o renovar su sistema.',
    alcance: [
      'Evaluación inicial de estándares mínimos según número de trabajadores y clase de riesgo (Resolución 0312 de 2019).',
      'Diseño y actualización de la Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC 45).',
      'Formulación de la Política de SST, objetivos y plan de trabajo anual firmado por la alta dirección.',
      'Conformación, capacitación y acompañamiento al COPASST o Vigía de Seguridad y Salud en el Trabajo.',
      'Elaboración del plan de prevención, preparación y respuesta ante emergencias y conformación de brigadas.',
      'Diseño de procedimientos para el reporte e investigación de accidentes e incidentes de trabajo.'
    ],
    beneficios: [
      'Blindaje preventivo ante requerimientos, visitas de inspección o pliegos del Ministerio del Trabajo.',
      'Reducción de la accidentalidad y de días de incapacidad laboral en la operación cotidiana.',
      'Cumplimiento de requisitos indispensables para contratar con clientes corporativos o el Estado.'
    ],
    faqs: [
      {
        q: '¿A qué empresas les aplica la Resolución 0312 de 2019?',
        a: 'Aplica a todo empleador público o privado, contratantes de personal bajo modalidad de contrato civil, comercial o administrativo, organizaciones de economía solidaria y empresas de servicios temporales.'
      },
      {
        q: '¿Cuántos estándares mínimos debe cumplir mi empresa?',
        a: 'Empresas de hasta 10 trabajadores en riesgo I, II o III cumplen 7 estándares; de 11 a 50 trabajadores en riesgo I, II o III cumplen 21 estándares; más de 50 trabajadores o empresas en riesgo IV y V cumplen los 60 estándares.'
      }
    ]
  },
  {
    id: 2,
    slug: 'riesgo-psicosocial',
    nombre: 'Gestión del riesgo psicosocial',
    descripcionCorta: 'Aplicación de la batería de instrumentos avalada por el Ministerio, diagnóstico e intervención especializada.',
    dirigidoA: 'Empresas que requieran evaluar el clima laboral, prevenir el acoso laboral o dar cumplimiento a la Resolución 2764 de 2022.',
    alcance: [
      'Aplicación de cuestionarios intralaborales, extralaborales y de estrés por psicólogos con licencia vigente en SST.',
      'Tabulación e informe estadístico de resultados por áreas, cargos y niveles de riesgo.',
      'Diseño del plan de intervención psicosocial y talleres de manejo del estrés y liderazgo.',
      'Acompañamiento en la activación de protocolos de prevención y atención del acoso laboral (Ley 1010 de 2006).'
    ],
    beneficios: [
      'Mejora del clima organizacional y disminución de la rotación involuntaria de personal.',
      'Prevención de patologías asociadas al estrés laboral crónico y ausentismo.',
      'Cumplimiento de la periodicidad legal obligatoria (anual para riesgo alto/medio, bianual para bajo).'
    ],
    faqs: [
      {
        q: '¿Quién debe aplicar la batería psicosocial?',
        a: 'Únicamente psicólogos especialistas en Seguridad y Salud en el Trabajo que cuenten con tarjeta profesional y licencia de SST vigente.'
      }
    ]
  },
  {
    id: 3,
    slug: 'talento-humano',
    nombre: 'Gestión del talento humano',
    descripcionCorta: 'Estructuración de procesos de selección, contratación, inducción y evaluación de desempeño con enfoque normativo.',
    dirigidoA: 'Mipymes que desean profesionalizar su área de personas sin sobrecostos de un departamento interno de recursos humanos.',
    alcance: [
      'Diseño y actualización de manuales de funciones y perfiles de cargo alineados a las tareas reales.',
      'Estructuración del proceso de inducción y reinducción laboral con formatos y registros de evidencia.',
      'Diseño de instrumentos objetivos de evaluación periódica de desempeño y retroalimentación.',
      'Auditoría y organización de carpetas laborales de personal.'
    ],
    beneficios: [
      'Claridad en las funciones cotidianas de cada colaborador y disminución de reprocesos operativos.',
      'Procesos de vinculación transparentes y ordenados desde el primer día.',
      'Retención del talento clave y alineación con los objetivos de la empresa.'
    ],
    faqs: [
      {
        q: '¿Cómo impacta el talento humano en la seguridad y salud?',
        a: 'Un perfil de cargo claro y una inducción adecuada garantizan que el trabajador conozca los riesgos específicos de su labor y las autorizaciones requeridas antes de operar.'
      }
    ]
  },
  {
    id: 4,
    slug: 'asesoria-juridica-laboral',
    nombre: 'Asesoría jurídica laboral y preventiva',
    descripcionCorta: 'Revisión de modalidades de vinculación, gestión disciplinaria, descargos y acompañamiento preventivo.',
    dirigidoA: 'Empleadores que buscan evitar demandas laborales, proteger sus decisiones disciplinarias y blindar sus contratos.',
    alcance: [
      'Auditoría a contratos de trabajo y contratos de prestación de servicios para prevenir riesgo de contrato realidad.',
      'Elaboración y actualización del Reglamento Interno de Trabajo (RIT) ajustado a la legislación vigente.',
      'Acompañamiento en procesos disciplinarios (citación a descargos, acta y aplicación de sanciones conforme al debido proceso).',
      'Atención y respuesta técnica a requerimientos del Ministerio del Trabajo o derechos de petición.'
    ],
    beneficios: [
      'Reducción drástica del riesgo de litigios y reclamaciones indemnizatorias costosas.',
      'Seguridad jurídica en los despidos y terminaciones contractuales.',
      'Respeto irrestricto al debido proceso en cada medida tomada.'
    ],
    faqs: [
      {
        q: '¿Por qué es riesgoso el contrato por prestación de servicios en labores operativas?',
        a: 'Si existe subordinación continuada, horario estricto y órdenes directas, un juez laboral puede declarar la existencia de un contrato de trabajo tácito (contrato realidad) y ordenar el pago retroactivo de prestaciones y aportes.'
      }
    ]
  },
  {
    id: 5,
    slug: 'gestion-ambiental',
    nombre: 'Gestión ambiental empresarial',
    descripcionCorta: 'Planes de manejo de residuos, permisos de vertimientos, emisiones y cumplimiento normativo ambiental.',
    dirigidoA: 'Talleres, manufacturas, restaurantes, constructoras y empresas de servicios con generación de residuos especiales o vertimientos.',
    alcance: [
      'Diagnóstico inicial de aspectos e impactos ambientales según la actividad de la empresa.',
      'Elaboración del Plan de Gestión Integral de Residuos Sólidos (PGIRS) y peligrosos (RESPEL).',
      'Acompañamiento en trámites de permisos de vertimientos, concesiones de aguas o emisiones ante la autoridad ambiental.',
      'Capacitación al personal en separación en la fuente y control de contingencias ambientales.'
    ],
    beneficios: [
      'Prevención de sanciones y cierres preventivos por parte de corporaciones autónomas o secretarías de ambiente.',
      'Disposición responsable y trazable de residuos con gestores autorizados.',
      'Alineación con estándares de sostenibilidad demandados por clientes.'
    ],
    faqs: [
      {
        q: '¿Qué es un residuo peligroso en una mipyme?',
        a: 'Son residuos con características corrosivas, reactivas, explosivas, tóxicas o inflamables (aceites usados, baterías, tarros de pintura, solventes, luminarias, etc.) que requieren entrega a gestor certificado.'
      }
    ]
  },
  {
    id: 6,
    slug: 'vigilancia-epidemiologica',
    nombre: 'Programas de vigilancia epidemiológica',
    descripcionCorta: 'Prevención de desórdenes musculoesqueléticos, valoraciones ergonómicas y planes de reintegro laboral.',
    dirigidoA: 'Empresas con personal administrativo con fatiga visual o personal operativo con esfuerzo físico y manipulación de cargas.',
    alcance: [
      'Inspecciones ergonómicas y análisis de puestos de trabajo (biomecánicos y pantallas de visualización).',
      'Encuestas de síntomas osteomusculares y seguimiento periódico a casos reportados.',
      'Diseño y ejecución de programas de pausas activas, talleres de estiramiento y escuela de espalda.',
      'Acompañamiento en la gestión de recomendaciones médicas y rutas de reintegro laboral post-incapacidad.'
    ],
    beneficios: [
      'Disminución del ausentismo por dolor lumbar, síndrome de túnel carpiano o fatiga postural.',
      'Mejora de la comodidad y productividad en cada puesto de trabajo.',
      'Cumplimiento técnico de las recomendaciones emitidas por EPS y ARL.'
    ],
    faqs: [
      {
        q: '¿El empleador puede conocer la historia clínica de un trabajador?',
        a: 'No. La historia clínica ocupacional goza de reserva legal. El empleador solo recibe el concepto de aptitud médica laboral con las recomendaciones o restricciones aplicables al puesto.'
      }
    ]
  },
  {
    id: 7,
    slug: 'seguridad-vial-pesv',
    nombre: 'Planes estratégicos de seguridad vial (PESV)',
    descripcionCorta: 'Diseño e implementación de las fases del PESV conforme a la Resolución 40595 de 2022 de la ANSV.',
    dirigidoA: 'Organizaciones con vehículos propios, motos de domicilios, camionetas de supervisión o personal que conduce por trabajo.',
    alcance: [
      'Diagnóstico de aplicabilidad y determinación del nivel del PESV (Básico, Estándar o Avanzado).',
      'Conformación y asesoría al Comité de Seguridad Vial institucional.',
      'Diseño de planes de mantenimiento preventivo y hojas de vida de vehículos y motocicletas.',
      'Procedimientos de selección, idoneidad y capacitación periódica de conductores.'
    ],
    beneficios: [
      'Reducción de siniestros viales y costos de reparación o deducibles de pólizas.',
      'Cumplimiento de las visitas de verificación de la Superintendencia de Transporte y Tránsito.',
      'Protección de la integridad física de los colaboradores en la vía pública.'
    ],
    faqs: [
      {
        q: '¿Aplica el PESV si los trabajadores usan sus motos particulares?',
        a: 'Sí. Si la empresa utiliza esas motocicletas para el cumplimiento de tareas laborales y reconoce rodamiento o gasolina, esos vehículos y conductores deben incluirse en la gestión de seguridad vial.'
      }
    ]
  },
  {
    id: 8,
    slug: 'auditorias-internas',
    nombre: 'Auditorías internas normativas e ISO',
    descripcionCorta: 'Auditorías de cumplimiento para SG-SST, ISO 45001, ISO 9001, ISO 14001 e ISO 39001.',
    dirigidoA: 'Empresas que deben realizar la auditoría anual obligatoria de su SG-SST o que preparan certificación internacional.',
    alcance: [
      'Planificación del programa de auditoría y elaboración del plan detallado con listas de verificación.',
      'Ejecución de entrevistas, revisión documental de registros y muestreo en campo.',
      'Informe formal de auditoría clasificando hallazgos en no conformidades mayores, menores y oportunidades de mejora.',
      'Acompañamiento en la formulación y cierre de los planes de acción correctiva.'
    ],
    beneficios: [
      'Detección anticipada de fallas antes de visitas de la ARL o entes de control.',
      'Cumplimiento del requisito legal de auditoría anual con participación del COPASST.',
      'Visión objetiva e imparcial sobre el grado real de madurez de los sistemas de gestión.'
    ],
    faqs: [
      {
        q: '¿Quién debe auditar el SG-SST?',
        a: 'Debe ser una persona idónea e independiente del proceso auditado (no puede auto-auditarse quien coordina el sistema), preferiblemente con formación como auditor interno.'
      }
    ]
  },
  {
    id: 9,
    slug: 'formaciones-brigadas',
    nombre: 'Formaciones, capacitaciones y brigadas',
    descripcionCorta: 'Entrenamiento teórico-práctico en prevención de riesgos, brigadas de emergencia y primeros auxilios.',
    dirigidoA: 'Personal operativo, administrativo y brigadistas que requieran cumplir su plan anual de capacitación.',
    alcance: [
      'Capacitación y conformación de la Brigada de Emergencia (primeros auxilios, contraincendios y evacuación).',
      'Talleres prácticos de uso y manejo seguro de extintores portátiles.',
      'Cursos de inducción y reinducción en seguridad y salud en el trabajo.',
      'Formaciones específicas: riesgo biomecánico, riesgo químico, orden y aseo industrial (5S).'
    ],
    beneficios: [
      'Personal preparado para reaccionar oportunamente ante situaciones reales de peligro.',
      'Soportes documentados (listas de asistencia, evaluaciones y certificados) para la carpeta de SST.',
      'Fomento de una cultura de autocuidado y reporte preventivo de condiciones inseguras.'
    ],
    faqs: [
      {
        q: '¿Las capacitaciones en SST son obligatorias para todos los trabajadores?',
        a: 'Sí. Todo trabajador debe participar en las capacitaciones programadas en el plan de trabajo anual de SST de acuerdo con la normatividad vigente.'
      }
    ]
  }
];
