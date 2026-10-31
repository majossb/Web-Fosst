/**
 * BANCO MAESTRO DE CUESTIONARIO FOSST v0.2
 * Modelado fiel según Banco_maestro_cuestionario_FOSST_v0_2.md
 * Se preservan identificadores, formulaciones propuestas, reglas y estados de certeza.
 */

export const ESTADOS_CERTEZA = {
  NO_APLICA: 'No aplica',
  NO_OCURRE: 'No ocurre',
  NO_EVALUADO: 'No se ha evaluado',
  NO_SE_CONOCE: 'No se conoce / No sé',
  EVIDENCIA_INSUFICIENTE: 'No existe evidencia suficiente',
  VERIFICAR: 'Necesito verificarlo',
  PRACTICA_INFORMAL: 'Práctica informal',
  PRACTICA_DEFINIDA: 'Práctica definida',
  SEGUIMIENTO: 'Se realiza seguimiento',
  EFICACIA_EVALUADA: 'Se ha evaluado su eficacia'
};

export const BANCO_PREGUNTAS = [
  // --- CAPA 1: CONTEXTO Y CARACTERIZACIÓN (P1 a P7) ---
  {
    id: 'P1',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿Cuál es su rol en la empresa?',
    pregunta: '¿Cuál describe mejor su función principal en la empresa?',
    tipo: 'seleccion_unica',
    opciones: [
      { id: 'gerencia', label: 'Gerente, director o propietario' },
      { id: 'administracion', label: 'Líder administrativo, financiero o de operaciones' },
      { id: 'sst_talento', label: 'Responsable de talento humano, SST o seguridad' },
      { id: 'operativo', label: 'Líder de cuadrilla, supervisor o coordinador operativo' },
      { id: 'otro', label: 'Otro rol en la organización' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P2',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿A qué se dedica principalmente su empresa?',
    pregunta: '¿Cuál es la actividad principal de la empresa? Si realiza varias, indique la que ocupa más tiempo o genera más ingresos.',
    tipo: 'seleccion_unica',
    opciones: [
      { id: 'comercio_servicios', label: 'Comercio al por menor / mayor o servicios profesionales' },
      { id: 'manufactura_taller', label: 'Industria manufacturera, taller o producción' },
      { id: 'construccion_obras', label: 'Construcción, instalaciones, montajes u obras civiles' },
      { id: 'alimentos_restaurantes', label: 'Alimentos, procesamiento o restaurantes / gastronomía' },
      { id: 'transporte_logistica', label: 'Transporte de carga / pasajeros o logística y distribución' },
      { id: 'salud_asistencial', label: 'Servicios de salud, estética o laboratorios' },
      { id: 'otra_actividad', label: 'Otra actividad económica' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P3',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿Cuáles de estas situaciones hacen parte de su operación habitual?',
    pregunta: 'En las actividades habituales, ¿cuáles de estas tareas o condiciones se realizan? (Seleccione todas las que apliquen)',
    tipo: 'seleccion_multiple',
    opciones: [
      { id: 'alturas', label: 'Trabajo en alturas (escaleras, andamios, techos > 2.0 m)' },
      { id: 'quimicos', label: 'Uso o almacenamiento de sustancias químicas, pinturas o solventes' },
      { id: 'maquinaria_pesada', label: 'Operación de maquinaria pesada, montacargas o equipos de corte' },
      { id: 'cargas_fisicas', label: 'Levantamiento manual constante de cargas o esfuerzo físico pesado' },
      { id: 'ninguna_riesgo_critico', label: 'Labores estrictamente administrativas / oficina sin riesgos críticos' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P4',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿Cuántas personas trabajan directamente para su empresa?',
    pregunta: 'En un día habitual, ¿cuántas personas trabajan para la empresa en total (personal directo y terceros)?',
    tipo: 'seleccion_unica',
    opciones: [
      { id: '1_a_10', label: 'Hasta 10 personas (microempresa)' },
      { id: '11_a_50', label: 'De 11 a 50 personas (pequeña empresa)' },
      { id: 'mas_de_50', label: 'Más de 50 personas (mediana empresa)' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P5',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿De qué formas vinculan a las personas que trabajan con ustedes?',
    pregunta: '¿Qué tipos de vinculación o terceros están presentes actualmente en la operación?',
    tipo: 'seleccion_multiple',
    opciones: [
      { id: 'contrato_laboral', label: 'Contrato de trabajo directo (término fijo, indefinido u obra)' },
      { id: 'prestacion_servicios', label: 'Contratos por prestación de servicios u honorarios' },
      { id: 'temporales_contratistas', label: 'Personal por empresa de servicios temporales o contratistas en sitio' },
      { id: 'informal', label: 'Vinculaciones informales, apoyo familiar o pagos por día' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P6',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: 'En el trabajo, ¿se usan vehículos o motos de alguna de estas formas?',
    pregunta: 'Durante el trabajo, ¿qué medios de transporte se usan, incluidos vehículos propios, de trabajadores o servicios contratados?',
    tipo: 'seleccion_multiple',
    opciones: [
      { id: 'flota_propia', label: 'Vehículos o camionetas propios o arrendados por la empresa' },
      { id: 'motos_mensajeria', label: 'Motocicletas para domicilios, mensajería o visitas técnicas' },
      { id: 'vehiculo_trabajador', label: 'Trabajadores que usan su propio vehículo/moto y reciben rodamiento' },
      { id: 'ninguno_movilidad', label: 'No se utilizan vehículos ni motos en las tareas laborales' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'P7',
    dimension: 'Perfil y aplicabilidad',
    capa: 'contexto',
    preguntaOriginal: '¿Su actividad genera alguno de estos elementos?',
    pregunta: '¿Cuáles de estas situaciones ambientales se presentan en la actividad de la empresa?',
    tipo: 'seleccion_multiple',
    opciones: [
      { id: 'residuos_peligrosos', label: 'Residuos peligrosos (aceites usados, baterías, envases de químicos, biológicos)' },
      { id: 'vertimientos_aguas', label: 'Vertimientos de aguas residuales no domésticas (lavado industrial, grasas, químicos)' },
      { id: 'emisiones_ruido', label: 'Emisiones al aire, humos, polvos o ruido perceptible hacia el exterior' },
      { id: 'ninguno_ambiental', label: 'Solo residuos ordinarios similares a los domésticos (papel, cartón, oficina)' }
    ],
    reglaAplicabilidad: () => true
  },

  // --- CAPA 2: NÚCLEO TRANSVERSAL (OT1, CT1, CT3, CV1, CV3, SG1, SG2, SG4, AC1, AC2, AC3, SA1, SA2, CF1, EM1, EC1, EC2) ---
  {
    id: 'OT1',
    dimension: 'Organización del trabajo',
    capa: 'nucleo',
    preguntaOriginal: '¿Cada cargo de la empresa tiene definido por escrito qué debe hacer la persona que lo ocupa?',
    pregunta: 'En la práctica, ¿cómo se sabe qué tareas corresponden a cada persona y quién decide cuando hay dudas?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'formal_escrito', label: 'Existen perfiles de cargo documentados y actualizados para todo el personal' },
      { id: 'verbal_informal', label: 'Se explica verbalmente en el día a día sin documentos formales' },
      { id: 'dudas_frecuentes', label: 'Hay cruces de funciones, duplicidad o desacuerdos frecuentes sobre las tareas' },
      { id: 'no_evaluado', label: 'No se ha evaluado este aspecto formalmente' },
      { id: 'necesito_verificar', label: 'Necesito verificarlo con gerencia o talento humano' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'CT1',
    dimension: 'Contratación y seguridad social',
    capa: 'nucleo',
    preguntaOriginal: '¿Todas las personas que trabajan con la empresa tienen su vínculo formalizado por escrito?',
    pregunta: 'Pensando en todas las personas que trabajan para la empresa, ¿qué proporción tiene contrato u otro soporte de vinculación firmado?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'todas_firmado', label: 'El 100% cuenta con contrato escrito firmado antes de iniciar labores' },
      { id: 'mayoria_firmado', label: 'La gran mayoría, pero existen personas pendientes de formalizar o firmar' },
      { id: 'minoria_o_informal', label: 'Predominan acuerdos verbales o existen dudas sobre la formalización' },
      { id: 'necesito_verificar', label: 'Necesito verificar las carpetas contractuales' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'CT3',
    dimension: 'Contratación y seguridad social',
    capa: 'nucleo',
    preguntaOriginal: '¿Alguien en la empresa verifica periódicamente que las afiliaciones y los aportes a seguridad social estén al día?',
    pregunta: 'En los últimos 12 meses, ¿con qué frecuencia alguien revisó que afiliaciones y aportes de cada persona estuvieran al día?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'mensual_persona_a_persona', label: 'Se revisa mensualmente persona a persona la planilla PILA completa (salud, pensión, ARL, caja)' },
      { id: 'solo_pago_global', label: 'Se paga la planilla global sin auditar afiliaciones individuales o novedades' },
      { id: 'irregular', label: 'La verificación es esporádica o se han presentado retrasos en aportes' },
      { id: 'necesito_verificar', label: 'Necesito verificar los soportes con el área contable' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'CV1',
    dimension: 'Disciplina y convivencia',
    capa: 'nucleo',
    preguntaOriginal: 'Cuando surge un conflicto o una falta en el trabajo, ¿existe una ruta definida para atenderlo?',
    pregunta: 'La última vez que hubo un conflicto o una queja laboral, ¿qué ocurrió para atenderla?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'comite_convivencia_activo', label: 'Se tramitó mediante el Comité de Convivencia Laboral o procedimiento documentado' },
      { id: 'dialogo_directo_informal', label: 'Se resolvió de forma informal hablando con gerencia o supervisión directa' },
      { id: 'sin_procedimiento', label: 'No se atendió formalmente o generó malestar continuo en el equipo' },
      { id: 'no_se_han_presentado', label: 'No se han presentado quejas o situaciones de este tipo' },
      { id: 'necesito_verificar', label: 'Necesito verificar la existencia de actas o comité' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'CV3',
    dimension: 'Disciplina y convivencia',
    capa: 'nucleo',
    preguntaOriginal: 'En los últimos 12 meses, ¿se han repetido situaciones de conflicto o quejas parecidas entre el personal o con jefes?',
    pregunta: 'En los últimos 12 meses, ¿con qué frecuencia se repitió un problema similar de convivencia o trato?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'nunca', label: 'Nunca se presentaron situaciones reiteradas' },
      { id: 'una_o_dos_veces', label: 'Ocurrió 1 o 2 veces y se logró resolver' },
      { id: 'frecuente_tres_o_mas', label: 'Ocurre de forma reiterada (3 o más veces en el año)' },
      { id: 'no_se_registra', label: 'No se lleva registro ni seguimiento de estas quejas' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'SG1',
    dimension: 'Seguridad y salud en el trabajo',
    capa: 'nucleo',
    preguntaOriginal: '¿Hay una persona designada como responsable de la seguridad y salud en el trabajo?',
    pregunta: '¿Quién coordina actualmente las actividades de seguridad y salud en el trabajo? Si nadie tiene esa función, indíquelo.',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'profesional_con_licencia', label: 'Un profesional o tecnólogo con licencia vigente en SST y curso de 50 horas' },
      { id: 'responsable_interno_sin_licencia', label: 'Una persona interna designada pero sin formación ni licencia específica en SST' },
      { id: 'nadie_formalmente', label: 'Nadie tiene asignada esta responsabilidad actualmente' },
      { id: 'asesor_externo_puntual', label: 'Un asesor externo contratado por horas o visitas puntuales' },
      { id: 'necesito_verificar', label: 'Necesito verificar la vigencia de la licencia y la designación formal' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'SG2',
    dimension: 'Seguridad y salud en el trabajo',
    capa: 'nucleo',
    preguntaOriginal: '¿Tienen un plan de trabajo anual de seguridad y salud en el trabajo con actividades programadas para este año?',
    pregunta: '¿Qué actividades de seguridad y salud se planearon para este año y cuál es su estado actual?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'plan_anual_firmado_al_dia', label: 'Hay un plan de trabajo anual documentado, firmado por gerencia y en ejecución' },
      { id: 'plan_desactualizado', label: 'Existe un documento de años anteriores que no se ha actualizado ni ejecutado' },
      { id: 'sin_plan_trabajo', label: 'No se cuenta con un plan de trabajo anual en SST' },
      { id: 'necesito_verificar', label: 'Necesito verificar la existencia del plan con el área técnica' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'SG4',
    dimension: 'Seguridad y salud en el trabajo',
    capa: 'nucleo',
    preguntaOriginal: '¿Han identificado por escrito qué situaciones de cada tarea o puesto de trabajo pueden lastimar a las personas?',
    pregunta: '¿Cómo identifica la empresa las situaciones del trabajo que podrían causar lesiones o afectar la salud?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'matriz_peligros_actualizada', label: 'Contamos con una Matriz de Identificación de Peligros (GTC 45 o similar) actualizada este año' },
      { id: 'matriz_antigua_sin_revision', label: 'Existe un formato antiguo que no refleja los cambios recientes de la operación' },
      { id: 'inspecciones_empiricas', label: 'Se revisa visualmente en el día a día pero no está documentado' },
      { id: 'sin_identificacion_peligros', label: 'No se ha realizado identificación formal de peligros' },
      { id: 'necesito_verificar', label: 'Necesito verificar si la matriz está vigente' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'AC1',
    dimension: 'Accidentes e incidentes',
    capa: 'nucleo',
    preguntaOriginal: 'En los últimos 12 meses, ¿algún trabajador se ha lesionado o ha tenido un accidente en el trabajo?',
    pregunta: 'En los últimos 12 meses, ¿cuántas lesiones o accidentes relacionados con el trabajo se reportaron o atendieron?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'cero_accidentes', label: 'Cero accidentes reportados en el último año' },
      { id: 'uno_a_dos_accidentes', label: 'De 1 a 2 accidentes de trabajo' },
      { id: 'tres_o_mas_accidentes', label: '3 o más accidentes de trabajo' },
      { id: 'no_se_lleva_registro', label: 'No se lleva registro estadístico formal' },
      { id: 'necesito_verificar', label: 'Necesito verificar el consolidado de accidentalidad ante la ARL' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'AC2',
    dimension: 'Accidentes e incidentes',
    capa: 'nucleo',
    preguntaOriginal: 'En los últimos 12 meses, ¿han ocurrido situaciones que pudieron lastimar a alguien pero no llegaron a hacerlo?',
    pregunta: 'En los últimos 12 meses, ¿cuántas veces ocurrió una situación que pudo causar lesión o daño (incidentes o conatos), aunque nadie resultara lesionado?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'se_reportan_e_intervienen', label: 'Ocurrieron incidentes y se cuenta con reporte e intervención de la condición' },
      { id: 'ocurrieron_sin_reporte', label: 'Ocurrieron situaciones pero generalmente no se reportan ni se investigan' },
      { id: 'no_se_tiene_conocimiento', label: 'No se tiene conocimiento de incidentes o casi-accidentes' },
      { id: 'no_se_ha_evaluado', label: 'No se ha establecido mecanismo para reporte de incidentes' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'AC3',
    dimension: 'Accidentes e incidentes',
    capa: 'nucleo',
    preguntaOriginal: 'Si hoy ocurriera un accidente de trabajo, ¿tienen definido quién hace qué (atender, reportar e investigar)?',
    pregunta: 'Si ocurre un accidente hoy, ¿quién se encarga de atender la situación, comunicarla a la ARL y revisar qué pasó?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'procedimiento_claro_menos_48h', label: 'Ruta clara: primer respondiente, reporte a la ARL en < 48 horas e investigación formal con COPASST' },
      { id: 'se_sabe_a_donde_llamar', label: 'Se sabe cómo pedir ambulancia o llevarlo al centro médico, pero no los pasos legales e investigativos' },
      { id: 'improvisacion', label: 'No hay claridad de quién debe asumir el caso y se improvisa en el momento' },
      { id: 'necesito_verificar', label: 'Necesito verificar si el protocolo está por escrito y divulgado' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'SA1',
    dimension: 'Salud y exámenes ocupacionales',
    capa: 'nucleo',
    preguntaOriginal: '¿La empresa tiene definido cómo se gestionan los exámenes médicos ocupacionales de su personal?',
    pregunta: '¿Cómo se determina y coordina qué evaluaciones médicas ocupacionales (ingreso, periódicas, egreso) corresponden a las personas trabajadoras?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'profesiograma_y_examenes_al_dia', label: 'Hay profesiograma con énfasis por cargo y se practican exámenes de ingreso y periódicos' },
      { id: 'solo_ingreso_basico', label: 'Únicamente se realizan exámenes de ingreso básicos sin profesiograma formal' },
      { id: 'no_se_realizan', label: 'No se realizan evaluaciones médicas ocupacionales' },
      { id: 'necesito_verificar', label: 'Necesito verificar si los conceptos de aptitud reposan en archivo' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'SA2',
    dimension: 'Salud y exámenes ocupacionales',
    capa: 'nucleo',
    preguntaOriginal: 'En los últimos 12 meses, ¿ha habido personas en alguna de estas situaciones?',
    pregunta: 'En los últimos 12 meses, ¿se presentaron situaciones en las que una persona necesitó ajustes de tareas, restricciones médicas o apoyo para regresar al trabajo?',
    tipo: 'seleccion_multiple',
    opciones: [
      { id: 'restricciones_medicas', label: 'Trabajadores con recomendaciones o restricciones laborales emitidas por médico / ARL / EPS' },
      { id: 'incapacidad_prolongada', label: 'Personas con incapacidades prolongadas (> 30 días) por enfermedad común o laboral' },
      { id: 'enfermedad_laboral_calificada', label: 'Casos en estudio o con calificación de presunta enfermedad laboral' },
      { id: 'ninguna_situacion_salud', label: 'Ninguna persona ha estado en estas circunstancias médicas' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'CF1',
    dimension: 'Competencias y formación',
    capa: 'nucleo',
    preguntaOriginal: '¿Toda persona nueva recibe una inducción al empezar su trabajo?',
    pregunta: 'Cuando alguien empieza a trabajar, ¿cómo aprende las tareas, los riesgos y cuándo debe pedir ayuda?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'induccion_estructurada_con_soporte', label: 'Recibe inducción formal en SST y puesto de trabajo con registro firmado antes de operar' },
      { id: 'instruccion_verbal_rapida', label: 'Un compañero o jefe le explica en el puesto brevemente el primer día sin registro' },
      { id: 'aprende_sobre_la_marcha', label: 'Inicia directo a trabajar y aprende sobre la marcha' },
      { id: 'necesito_verificar', label: 'Necesito verificar si existen registros de inducción' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'EM1',
    dimension: 'Emergencias y saneamiento',
    capa: 'nucleo',
    preguntaOriginal: 'Si hoy hubiera una emergencia (incendio, sismo, evacuación), ¿tienen definido qué hacer y quién lo hace?',
    pregunta: 'Si hoy ocurriera una emergencia (conato de incendio, sismo, evacuación médica), ¿qué haría primero cada persona y quién coordinaría la respuesta?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'plan_emergencias_brigada_dotacion', label: 'Hay plan de emergencias, brigadistas formados, rutas señalizadas, botiquín y extintores vigentes' },
      { id: 'extintores_sin_brigada', label: 'Hay extintores o botiquín pero no brigada formal ni plan documentado' },
      { id: 'sin_preparacion_emergencias', label: 'No se tiene preparación ni elementos para atender una emergencia' },
      { id: 'necesito_verificar', label: 'Necesito verificar la vigencia de los extintores y el plan' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'EC1',
    dimension: 'Costos y continuidad',
    capa: 'nucleo',
    preguntaOriginal: '¿La empresa conoce cuánto le han costado en el último año las ausencias, incapacidades y accidentes?',
    pregunta: 'En los últimos 12 meses, ¿la empresa ha estimado el tiempo perdido o los gastos asociados con ausencias, incapacidades o accidentes?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'medido_y_registrado', label: 'Se lleva cálculo del ausentismo laboral y su costo económico directo e indirecto' },
      { id: 'solo_dias_incapacidad', label: 'Se cuentan los días de incapacidad cobrados pero no el costo total de reemplazo' },
      { id: 'no_se_ha_estimado', label: 'No se ha estimado ni se lleva registro de estos costos' },
      { id: 'necesito_verificar', label: 'Necesito verificar con contabilidad' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'EC2',
    dimension: 'Costos y continuidad',
    capa: 'nucleo',
    preguntaOriginal: 'Si un accidente o la ausencia de una persona clave detuviera la operación una semana, ¿qué efecto tendría?',
    pregunta: 'Si una persona clave o un proceso esencial no estuviera disponible durante una semana, ¿qué actividad se detendría y qué alternativa existe?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'impacto_critico_paralisis', label: 'Se detendría la producción o el servicio de forma crítica; no hay reemplazo inmediato' },
      { id: 'retraso_moderado_costo', label: 'Generaría retrasos y sobrecostos, pero otros integrantes podrían suplir parcialmente' },
      { id: 'proceso_respaldado', label: 'La operación cuenta con contingencia y perfiles cruzados para continuar con normalidad' },
      { id: 'no_evaluado', label: 'No se ha evaluado la continuidad de la operación ante imprevistos' }
    ],
    reglaAplicabilidad: () => true
  },

  // --- CAPA 3: MÓDULOS CONDICIONALES POR REGLA ---
  {
    id: 'OT2',
    dimension: 'Organización del trabajo',
    capa: 'condicional',
    preguntaOriginal: '¿Tienen una forma periódica de evaluar cómo va el desempeño de cada persona?',
    pregunta: 'En los últimos 6 meses, ¿con qué frecuencia se conversó con las personas sobre resultados, dificultades y apoyos que necesitan?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'evaluacion_periodica_formal', label: 'Periódicamente con instrumentos definidos y plan de retroalimentación' },
      { id: 'retroalimentacion_informal', label: 'Conversaciones informales solo cuando surge un problema' },
      { id: 'no_se_realiza', label: 'No se realiza evaluación de desempeño' },
      { id: 'necesito_verificar', label: 'Necesito verificar registros de evaluación' }
    ],
    reglaAplicabilidad: (respuestas) => respuestas.P4 === '11_a_50' || respuestas.P4 === 'mas_de_50'
  },
  {
    id: 'CT2',
    dimension: 'Contratación y seguridad social',
    capa: 'condicional',
    preguntaOriginal: '¿La forma en que trabaja cada persona (horario, quién le da instrucciones) coincide con su contrato?',
    pregunta: 'En el trabajo cotidiano, ¿hay diferencias entre las tareas, horarios o instrucciones reales y lo acordado en los contratos por prestación de servicios?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'autonomia_real', label: 'Existe autonomía técnica y administrativa real según el objeto contractual' },
      { id: 'subordinacion_o_dudas', label: 'Cumplen horario estricto, reciben órdenes directas o realizan labores idénticas al personal de nómina' },
      { id: 'no_se_ha_revisado', label: 'No se ha revisado la exposición a riesgo de contrato realidad' },
      { id: 'necesito_verificar', label: 'Requiere revisión jurídica preventiva' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P5) && respuestas.P5.includes('prestacion_servicios')
  },
  {
    id: 'CT4',
    dimension: 'Contratación y seguridad social',
    capa: 'condicional',
    preguntaOriginal: '¿La empresa tiene un reglamento interno de trabajo?',
    pregunta: '¿La empresa cuenta con Reglamento Interno de Trabajo publicado y actualizado conforme a la normativa vigente?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'rit_vigente_publicado', label: 'Cuenta con RIT aprobado, fijado en lugar visible y entregado al personal' },
      { id: 'rit_antiguo_sin_actualizar', label: 'Tiene un RIT antiguo que no incorpora las recientes reformas laborales' },
      { id: 'no_cuenta_con_rit', label: 'No cuenta con Reglamento Interno de Trabajo' },
      { id: 'necesito_verificar', label: 'Necesito verificar si aplica por número de trabajadores comerciales o industriales' }
    ],
    reglaAplicabilidad: (respuestas) => respuestas.P4 === '11_a_50' || respuestas.P4 === 'mas_de_50'
  },
  {
    id: 'AC4',
    dimension: 'Accidentes e incidentes',
    capa: 'condicional',
    preguntaOriginal: 'Después del último accidente, ¿se analizó qué lo causó?',
    pregunta: 'Después del accidente más reciente, ¿qué se hizo para identificar las causas básicas e inmediatas y generar medidas de control?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'investigacion_copasst_equipo', label: 'Se conformó el equipo investigador (jefe, COPASST, SST) y se elaboró informe formal con plan de acción' },
      { id: 'se_hablo_con_el_afectado', label: 'Solo se conversó con el trabajador para que tuviera más cuidado' },
      { id: 'no_se_investigo', label: 'No se realizó investigación de causas' },
      { id: 'necesito_verificar', label: 'Necesito verificar los informes radicados ante la ARL' }
    ],
    reglaAplicabilidad: (respuestas) => respuestas.AC1 === 'uno_a_dos_accidentes' || respuestas.AC1 === 'tres_o_mas_accidentes'
  },
  {
    id: 'AC6',
    dimension: 'Accidentes e incidentes',
    capa: 'condicional',
    preguntaOriginal: '¿Alguno de esos accidentes fue grave (por ejemplo, hospitalización, amputación o fallecimiento)?',
    pregunta: '¿Alguno de los accidentes reportados tuvo consecuencias graves (hospitalización, fractura de huesos largos, amputación, trauma craneal o fallecimiento)?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'si_evento_grave', label: 'Sí, ocurrió un accidente con consecuencias graves o incapacidad prolongada' },
      { id: 'no_eventos_leves', label: 'No, fueron eventos leves con incapacidad temporal de pocos días' },
      { id: 'necesito_verificar', label: 'Necesito verificar el diagnóstico médico de incapacidad' }
    ],
    reglaAplicabilidad: (respuestas) => respuestas.AC1 === 'uno_a_dos_accidentes' || respuestas.AC1 === 'tres_o_mas_accidentes'
  },
  {
    id: 'CF2',
    dimension: 'Competencias y formación',
    capa: 'condicional',
    preguntaOriginal: 'Para las tareas de mayor exposición, ¿hay claridad sobre quién está formado y autorizado?',
    pregunta: 'Antes de asignar una tarea crítica (alturas, químicos, maquinaria pesada), ¿cómo se confirma que la persona está certificada y autorizada?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'certificaciones_y_permisos_escritos', label: 'Se verifican certificados vigentes, aptitud médica y se emite permiso de trabajo escrito' },
      { id: 'solo_experiencia_verbal', label: 'Se confía en la experiencia declarada por el trabajador sin auditar soportes' },
      { id: 'sin_control_de_autorizacion', label: 'No existe procedimiento para autorizar tareas críticas' },
      { id: 'necesito_verificar', label: 'Necesito verificar los certificados de trabajo en alturas o manejo técnico' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P3) && (
      respuestas.P3.includes('alturas') || respuestas.P3.includes('quimicos') || respuestas.P3.includes('maquinaria_pesada')
    )
  },
  {
    id: 'VI1',
    dimension: 'Seguridad vial (PESV)',
    capa: 'condicional',
    preguntaOriginal: '¿Han revisado si su empresa está obligada a tener un Plan Estratégico de Seguridad Vial (PESV)?',
    pregunta: '¿La empresa ha determinado, con base en la Resolución 40595 de 2022 y tamaño de flota/conductores, si debe diseñar e implementar un PESV?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'si_determinado_y_documentado', label: 'Sí, se realizó el diagnóstico de aplicabilidad y se definió el nivel (Básico, Estándar o Avanzado)' },
      { id: 'se_sabe_que_aplica_sin_documentar', label: 'Sabemos que tenemos vehículos/motos pero no se ha determinado el nivel formalmente' },
      { id: 'no_se_ha_evaluado_pesv', label: 'No se ha revisado si la normatividad de seguridad vial nos aplica' },
      { id: 'necesito_verificar', label: 'Necesito verificar la cantidad exacta de vehículos y conductores con logística' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P6) && !respuestas.P6.includes('ninguno_movilidad')
  },
  {
    id: 'VI3',
    dimension: 'Seguridad vial (PESV)',
    capa: 'condicional',
    preguntaOriginal: '¿La empresa revisa que quienes conducen por el trabajo tengan su licencia de conducción y documentos al día?',
    pregunta: 'Antes de conducir por trabajo, ¿cómo se comprueba que la persona y los documentos requeridos (licencia, SOAT, revisión técnico-mecánica) están vigentes?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'archivo_hojas_de_vida_y_alertas', label: 'Se tiene hoja de vida de conductores y vehículos con matriz de vencimientos al día' },
      { id: 'revision_inicial_sin_seguimiento', label: 'Se revisó al ingresar pero no se verifica periódicamente la vigencia o comparendos' },
      { id: 'no_se_verifica', label: 'No se realiza control documental de conductores ni vehículos' },
      { id: 'necesito_verificar', label: 'Necesito consultar el RUNT y las carpetas de conductores' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P6) && !respuestas.P6.includes('ninguno_movilidad')
  },
  {
    id: 'AM1',
    dimension: 'Gestión ambiental',
    capa: 'condicional',
    preguntaOriginal: '¿Han revisado si su actividad necesita algún permiso ambiental (vertimientos, emisiones, agua)?',
    pregunta: '¿La empresa ha determinado con la autoridad ambiental correspondiente qué permisos, concesiones o planes de manejo aplican a su sede?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'permisos_identificados_o_al_dia', label: 'Se cuenta con diagnóstico ambiental y los permisos o registros requeridos están vigentes' },
      { id: 'dudas_sobre_permisos', label: 'Se realizan vertimientos o emisiones pero no se tiene certeza de si requieren trámite legal' },
      { id: 'no_se_ha_evaluado_ambiental', label: 'No se ha realizado diagnóstico de requerimientos ambientales' },
      { id: 'necesito_verificar', label: 'Necesito verificar con la corporación autónoma o secretaría de ambiente' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P7) && !respuestas.P7.includes('ninguno_ambiental')
  },
  {
    id: 'CO1',
    dimension: 'Contratistas y terceros',
    capa: 'condicional',
    preguntaOriginal: 'Antes de que un contratista empiece a trabajar, ¿revisan sus documentos de seguridad social y de SST?',
    pregunta: 'Antes de que un contratista comience labores en sus instalaciones o proyectos, ¿qué información se revisa y quién valida que puede iniciar?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'filtro_estricto_seguridad_social_sst', label: 'Se exige y valida afiliación a seguridad social al día (ARL acorde al riesgo), inducción y elementos de protección' },
      { id: 'solo_factura_o_rut', label: 'Se solicita documentación contable sin verificar seguridad social ni SST del personal en sitio' },
      { id: 'sin_control_de_terceros', label: 'Ingresan a laborar sin filtro previo de seguridad y salud' },
      { id: 'necesito_verificar', label: 'Necesito verificar con el área de compras o supervisión de contratos' }
    ],
    reglaAplicabilidad: (respuestas) => Array.isArray(respuestas.P5) && (
      respuestas.P5.includes('temporales_contratistas') || respuestas.P5.includes('prestacion_servicios')
    )
  },

  // --- CAPA 4: PREGUNTAS NUEVAS PROPUESTAS DE CONTROL Y EVOLUCIÓN (N-OP1, N-PE1, N-TE1, N-CM1, N-RQ1) ---
  {
    id: 'N-OP1',
    dimension: 'Organización del trabajo',
    capa: 'propuesta_nueva',
    preguntaOriginal: 'Nueva v0.2: Frecuencia de errores o reprocesos',
    pregunta: 'En los últimos 3 meses, ¿con qué frecuencia hubo que repetir una tarea operativa, corregir un error o rehacer una entrega importante?',
    tipo: 'frecuencia',
    opciones: [
      { id: 'nunca', label: 'Nunca o casi nunca' },
      { id: 'una_vez', label: 'Ocurrió 1 vez de forma aislada' },
      { id: 'dos_a_tres_veces', label: 'De 2 a 3 veces' },
      { id: 'cuatro_o_mas', label: '4 o más veces (recurrente)' },
      { id: 'no_se_registra', label: 'No se lleva registro operativo de reprocesos' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'N-PE1',
    dimension: 'Personas y continuidad',
    capa: 'propuesta_nueva',
    preguntaOriginal: 'Nueva v0.2: Dependencia de personas clave',
    pregunta: 'Si una persona clave del equipo operativo o administrativo faltara mañana por incapacidad o renuncia, ¿qué tareas quedarían detenidas?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'ninguna_respaldo_definido', label: 'Ninguna esencial; los procesos están documentados y el reemplazo está entrenado' },
      { id: 'una_o_dos_afectadas', label: 'Una o dos actividades críticas sufrirían retrasos importantes' },
      { id: 'paralisis_critica', label: 'Habría parálisis operativa o descontrol en información confidencial / clientes' },
      { id: 'necesito_verificar', label: 'No se ha realizado análisis de vulnerabilidad por talento humano' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'N-TE1',
    dimension: 'Tecnología e información',
    capa: 'propuesta_nueva',
    preguntaOriginal: 'Nueva v0.2: Dependencia de sistemas o datos',
    pregunta: '¿Qué actividades esenciales se detendrían si un sistema, archivo de red o conexión clave no estuviera disponible durante un día completo?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'operacion_con_contingencia', label: 'Se cuenta con copias de seguridad probadas y plan de contingencia offline' },
      { id: 'paralisis_facturacion_servicio', label: 'Se detendría la facturación, los despachos o la atención a clientes' },
      { id: 'riesgo_perdida_irreversible', label: 'No hay certeza de copias de seguridad ni respaldos automáticos' },
      { id: 'necesito_verificar', label: 'Necesito verificar con el soporte de sistemas o proveedores de software' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'N-CM1',
    dimension: 'Cambios y crecimiento',
    capa: 'propuesta_nueva',
    preguntaOriginal: 'Nueva v0.2: Cambios operativos recientes',
    pregunta: 'En los últimos 12 meses, ¿qué cambios importantes tuvo la empresa (nuevas máquinas, cambio de sede, nuevo turno, aumento súbito de personal)?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'cambios_con_gestion_riesgo', label: 'Hubo cambios importantes y se revisaron los riesgos antes de implementarlos' },
      { id: 'cambios_sin_revision_riesgo', label: 'Hubo cambios operativos pero no se evaluó el impacto en seguridad ni salud' },
      { id: 'sin_cambios_relevantes', label: 'La operación se ha mantenido estable sin modificaciones sustanciales' },
      { id: 'necesito_verificar', label: 'Requiere revisión de las modificaciones de procesos' }
    ],
    reglaAplicabilidad: () => true
  },
  {
    id: 'N-RQ1',
    dimension: 'Requisitos aplicables',
    capa: 'propuesta_nueva',
    preguntaOriginal: 'Nueva v0.2: Cómo se determina aplicabilidad',
    pregunta: 'Cuando la empresa necesita saber qué requisito legal le aplica, ¿cómo lo determina y quién confirma la conclusión?',
    tipo: 'seleccion_unica_con_certeza',
    opciones: [
      { id: 'asesoria_especializada_continua', label: 'Consulta a un asesor técnico/jurídico especializado o matriz legal actualizada' },
      { id: 'busqueda_en_internet_o_experiencia', label: 'Búsquedas puntuales en internet o por recomendaciones informales de conocidos' },
      { id: 'solo_tras_requerimiento', label: 'Solo se atiende cuando llega una visita de la ARL o el Ministerio del Trabajo' },
      { id: 'necesito_verificar', label: 'No se cuenta con un método definido de actualización jurídica' }
    ],
    reglaAplicabilidad: () => true
  }
];
