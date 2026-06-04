import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ArrowRight, ChevronRight, RotateCcw, Home,
  Zap, AlertTriangle, CheckCircle, MapPin, Phone, Clock,
  ExternalLink, Loader, Activity, Brain, Wind, Bone
} from "lucide-react";
import { GlassCard } from "./GlassCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type BodySystem = "gastrointestinal" | "cardiovascular" | "respiratory" | "neurological" | "musculoskeletal" | "general";
type TriageColor = "red" | "yellow" | "green";
type Phase = "intro" | "select-system" | "questions" | "calculating" | "result";
type QuestionType = "single" | "multiple" | "scale" | "duration";

interface Option {
  id: string;
  label: string;
  sublabel?: string;
  points: number;
  redFlag?: boolean;
}

interface TQuestion {
  id: string;
  text: string;
  educational: string;
  type: QuestionType;
  options?: Option[];
}

interface Drug {
  name: string;
  dose: string;
  frequency: string;
  purpose: string;
  warning?: string;
}

interface Recommendation {
  title: string;
  description: string;
  timeToAction: string;
  actions: string[];
  drugs: Drug[];
  referral: string;
  specialty: "gastroenterology" | "cardiology" | "neurology" | "pulmonology" | "orthopedics" | null;
  emergency: boolean;
}

interface Protocol {
  id: BodySystem;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: TQuestion[];
  redThreshold: number;
  yellowThreshold: number;
  recommendations: Record<TriageColor, Recommendation>;
}

// ─── Duration & Scale Options (reusable) ──────────────────────────────────────

const DURATION_OPTIONS: Option[] = [
  { id: "mins", label: "Minutos (< 1 hora)", sublabel: "Inicio muy reciente — altamente agudo", points: 5 },
  { id: "hrs1_6", label: "1 a 6 horas", sublabel: "Inicio agudo — requiere atención pronta", points: 3 },
  { id: "hrs6_24", label: "6 a 24 horas", sublabel: "Inicio subagudo — evolución en el día", points: 2 },
  { id: "days1_7", label: "1 a 7 días", sublabel: "Evolución en días — síntoma persistente", points: 1 },
  { id: "week_plus", label: "Más de 1 semana", sublabel: "Evolución crónica — síntoma prolongado", points: 0 },
];

// ─── Protocols ────────────────────────────────────────────────────────────────

const PROTOCOLS: Protocol[] = [
  // ── GASTROINTESTINAL ──────────────────────────────────────────────────────
  {
    id: "gastrointestinal",
    name: "Gastrointestinal",
    icon: "🫃",
    color: "#ff8c42",
    description: "Estómago, intestinos, hígado, páncreas, colon",
    redThreshold: 10,
    yellowThreshold: 5,
    questions: [
      {
        id: "gi_q1",
        text: "¿Cuál es tu síntoma digestivo principal en este momento?",
        educational: "El síntoma predominante nos orienta hacia el órgano comprometido. El dolor localizado sugiere inflamación focal (apendicitis, colecistitis), mientras que el generalizado puede indicar peritonitis o íleo.",
        type: "single",
        options: [
          { id: "dolor_gen", label: "Dolor abdominal generalizado", sublabel: "Dolor difuso en todo el abdomen", points: 3 },
          { id: "dolor_loc", label: "Dolor abdominal localizado", sublabel: "Zona específica: epigastrio, flanco, fosa ilíaca", points: 3 },
          { id: "nauseas_vomitos", label: "Náuseas y/o vómitos", sublabel: "Con o sin contenido alimentario", points: 2 },
          { id: "diarrea", label: "Diarrea", sublabel: "Deposiciones líquidas, frecuentes o con moco", points: 2 },
          { id: "estrenimiento", label: "Estreñimiento severo", sublabel: "Sin deposiciones > 3 días + distensión", points: 2 },
          { id: "sangrado", label: "Sangrado digestivo", sublabel: "Vómito con sangre roja/oscura o heces negras/rojas", points: 9, redFlag: true },
          { id: "disfagia", label: "Dificultad para tragar", sublabel: "Dolor u obstrucción al deglutir", points: 3 },
          { id: "distension_severa", label: "Distensión abdominal severa", sublabel: "Abdomen muy tenso, timpánico, no expulsa gases", points: 4 },
        ],
      },
      {
        id: "gi_q2",
        text: "¿Con qué intensidad calificas tu malestar actual?",
        educational: "La escala del dolor (EVA 1-10) es un indicador de gravedad. Dolor > 7/10 puede indicar perforación, pancreatitis aguda severa, isquemia mesentérica u obstrucción intestinal. Dolor 9-10 es una alarma crítica.",
        type: "scale",
      },
      {
        id: "gi_q3",
        text: "¿Cuánto tiempo llevas con estos síntomas?",
        educational: "La cronología es clave en triage digestivo. Un dolor abdominal de inicio súbito en minutos sugiere perforación o isquemia aguda. Horas puede indicar apendicitis. Días puede ser una infección o proceso inflamatorio.",
        type: "duration",
        options: DURATION_OPTIONS,
      },
      {
        id: "gi_q4",
        text: "¿Presentas alguno de estos signos o síntomas acompañantes?",
        educational: "Los signos acompañantes son determinantes en triage. Abdomen en tabla = posible peritonitis. Ictericia = compromiso hepático/biliar. Fiebre alta + escalofríos = posible sepsis de origen abdominal. Selecciona todos los que apliquen.",
        type: "multiple",
        options: [
          { id: "fiebre_alta", label: "Fiebre alta (> 38.5°C)", sublabel: "Con o sin escalofríos", points: 3 },
          { id: "abdomen_rigido", label: "Abdomen rígido al tacto ('en tabla')", sublabel: "No cede a la palpación, muy tenso", points: 8, redFlag: true },
          { id: "ictericia", label: "Ictericia", sublabel: "Coloración amarilla de piel, ojos u orina oscura", points: 4 },
          { id: "dolor_irradiado", label: "Dolor que irradia a espalda o hombro derecho", sublabel: "Puede indicar compromiso pancreático o biliar", points: 3 },
          { id: "perdida_conciencia", label: "Pérdida o alteración de la conciencia", sublabel: "Confusión, mareo severo, desmayo", points: 9, redFlag: true },
          { id: "escalofrios", label: "Escalofríos intensos y sudoración", sublabel: "Signo de posible sepsis abdominal", points: 3 },
          { id: "perdida_peso", label: "Pérdida de peso significativa sin causa", sublabel: "En semanas/meses sin dieta intencional", points: 2 },
          { id: "ninguno", label: "Ninguno de los anteriores", sublabel: "", points: 0 },
        ],
      },
      {
        id: "gi_q5",
        text: "¿Tienes antecedentes de alguna de estas condiciones?",
        educational: "Los antecedentes modifican la interpretación del triage. Una cirugía previa aumenta el riesgo de bridas/obstrucción. La úlcera conocida con dolor intenso puede indicar perforación. La IBD con fiebre puede indicar complicación severa.",
        type: "single",
        options: [
          { id: "cirugia_prev", label: "Cirugía abdominal previa", sublabel: "Apendicectomía, colecistectomía, cesárea, etc.", points: 2 },
          { id: "ulcera", label: "Úlcera gástrica o duodenal", sublabel: "Diagnóstico previo por endoscopía", points: 2 },
          { id: "ibd", label: "Enfermedad de Crohn o Colitis Ulcerosa", sublabel: "Enfermedad inflamatoria intestinal crónica", points: 2 },
          { id: "hernia", label: "Hernia abdominal o inguinal", sublabel: "Hernia no operada, palpable", points: 2 },
          { id: "cirrosis", label: "Cirrosis hepática o hepatitis crónica", sublabel: "Enfermedad hepática conocida", points: 3 },
          { id: "ninguno_ant", label: "Ninguno / No lo sé", sublabel: "", points: 0 },
        ],
      },
    ],
    recommendations: {
      green: {
        title: "Atención No Urgente",
        description: "Tus síntomas son compatibles con una afección digestiva leve o moderada. No presentas signos de alarma críticos. Puedes iniciar manejo en casa con seguimiento médico programado.",
        timeToAction: "Consulta médica en las próximas 24–72 horas",
        actions: [
          "Mantén dieta blanda y suave: arroz blanco, pollo hervido sin grasa, banana, manzana cocida, tostadas simples",
          "Hidratación abundante: 2–3 litros de agua o suero oral por día. Preferir sorbos pequeños y frecuentes",
          "Evita: alimentos irritantes, grasosos, picantes, alcohol, cafeína y lácteos",
          "Reposo relativo. Evita esfuerzos físicos y comidas copiosas",
          "Si los síntomas empeoran, aparece fiebre alta, vómito con sangre o dolor muy severo — acude a urgencias de inmediato",
          "Lleva un registro de síntomas: frecuencia, intensidad, relación con comidas",
        ],
        drugs: [
          { name: "Omeprazol", dose: "20 mg", frequency: "1 vez al día, en ayunas 30 min antes del desayuno", purpose: "Reduce la producción de ácido gástrico. Indicado en gastritis, reflujo, úlcera.", warning: "No usar más de 2 semanas sin consulta médica" },
          { name: "Butilescopolamina (Buscapina)", dose: "10–20 mg", frequency: "Cada 6–8 horas según necesidad", purpose: "Antiespasmódico para cólicos abdominales y espasmos intestinales.", warning: "Evitar en glaucoma o hiperplasia prostática" },
          { name: "Loperamida (Imodium)", dose: "2 mg inicial, luego 2 mg tras cada deposición", frequency: "Máximo 8 mg/día por no más de 2 días", purpose: "Antidiarreico. Reduce la frecuencia y fluidez de deposiciones.", warning: "NO usar si hay fiebre alta, sangre en heces o sospecha de infección bacteriana" },
          { name: "Metoclopramida (Plasil)", dose: "10 mg", frequency: "3 veces al día, 30 min antes de comidas", purpose: "Antiemético y procinético. Alivia náuseas, vómitos y sensación de plenitud.", warning: "No usar más de 5 días. Puede causar somnolencia" },
        ],
        referral: "Médico de cabecera o clínica de atención primaria para evaluación programada",
        specialty: null,
        emergency: false,
      },
      yellow: {
        title: "Atención Urgente",
        description: "Tus síntomas requieren evaluación médica dentro de las próximas horas. Presentas signos que sugieren una condición digestiva que puede progresar y necesita diagnóstico profesional.",
        timeToAction: "Acude a urgencias en las próximas 2–4 horas",
        actions: [
          "Acude a urgencias hospitalarias o consulta gastroenterológica de guardia HOY",
          "Mantén ayuno relativo: no ingieras alimentos sólidos hasta ser evaluado por médico",
          "Puedes tomar sorbos pequeños de agua o suero oral si toleras sin vomitar",
          "Anota la hora exacta de inicio de los síntomas — es información crítica para el médico",
          "Lleva contigo listado de medicamentos actuales y antecedentes médicos",
          "Si el dolor empeora súbitamente, aparece sangrado o pierdes el conocimiento: llama al número de emergencias inmediatamente",
        ],
        drugs: [
          { name: "Metoclopramida (Plasil)", dose: "10 mg", frequency: "Cada 8 horas", purpose: "Control de náuseas y vómitos hasta acceder a atención médica.", warning: "Uso temporal. No enmascarar síntomas con exceso de medicación" },
          { name: "Paracetamol (Acetaminofén)", dose: "500–1000 mg", frequency: "Cada 6–8 horas, máximo 4 g/día", purpose: "Control de fiebre y dolor leve. NO usar AINEs (ibuprofeno) sin evaluación médica.", warning: "Evitar si sospecha de enfermedad hepática" },
        ],
        referral: "Urgencias hospitalarias con guardia de gastroenterología o cirugía digestiva",
        specialty: "gastroenterology",
        emergency: false,
      },
      red: {
        title: "EMERGENCIA MÉDICA",
        description: "Tus síntomas presentan señales de alarma críticas compatibles con una emergencia digestiva grave. Puede tratarse de perforación, peritonitis, hemorragia digestiva u obstrucción intestinal. Requiere atención INMEDIATA.",
        timeToAction: "¡LLAME AL SERVICIO DE EMERGENCIAS AHORA! (911 / 112)",
        actions: [
          "🚨 LLAME AL 911 / 112 O AL NÚMERO DE EMERGENCIAS DE SU PAÍS INMEDIATAMENTE",
          "AYUNO ABSOLUTO: No ingiera nada por boca — ni agua, ni medicamentos por boca",
          "Permanezca en reposo en la posición que le resulte más cómoda. Evite movimientos bruscos",
          "Si alguien le acompaña, pídales que conduzca o llame a emergencias mientras usted reposa",
          "NO tome analgésicos por su cuenta — enmascaran síntomas críticos para el cirujano",
          "Tenga a mano su historial médico, medicamentos actuales y nombre de su médico de referencia",
          "Informe al personal de emergencias de todos los síntomas y la hora exacta de inicio",
        ],
        drugs: [],
        referral: "Hospital de urgencias con unidad de cirugía digestiva y gastroenterología de guardia. TRASLADO EN AMBULANCIA.",
        specialty: "gastroenterology",
        emergency: true,
      },
    },
  },

  // ── CARDIOVASCULAR ────────────────────────────────────────────────────────
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    icon: "❤️",
    color: "#ff3355",
    description: "Corazón, vasos sanguíneos, palpitaciones, presión arterial",
    redThreshold: 8,
    yellowThreshold: 4,
    questions: [
      {
        id: "cv_q1",
        text: "¿Cuál es tu síntoma cardiovascular principal?",
        educational: "El dolor torácico opresivo que irradia al brazo izquierdo o mandíbula es el síntoma cardinal del síndrome coronario agudo (infarto). Las palpitaciones pueden indicar arritmias. La hinchazón de piernas con disnea sugiere insuficiencia cardíaca.",
        type: "single",
        options: [
          { id: "dolor_pecho", label: "Dolor o presión en el pecho", sublabel: "Opresivo, quemante o como peso en el pecho", points: 5 },
          { id: "palpitaciones", label: "Palpitaciones o latidos irregulares", sublabel: "Sensación de corazón acelerado, lento o irregular", points: 2 },
          { id: "disnea_reposo", label: "Dificultad para respirar en reposo", sublabel: "Ahogo sin esfuerzo físico previo", points: 5 },
          { id: "mareo_sincope", label: "Mareo intenso o desmayo", sublabel: "Pérdida de conciencia breve o sensación inminente", points: 4 },
          { id: "edema_piernas", label: "Hinchazón de piernas", sublabel: "Edema bilateral con dificultad respiratoria", points: 3 },
          { id: "dolor_brazo", label: "Dolor en brazo izquierdo o mandíbula", sublabel: "Irradiación típica del infarto agudo de miocardio", points: 8, redFlag: true },
        ],
      },
      {
        id: "cv_q2",
        text: "¿El dolor o malestar se irradia hacia alguna zona?",
        educational: "La irradiación del dolor cardíaco hacia el brazo izquierdo, cuello, mandíbula o espalda es un signo clásico de isquemia miocárdica aguda. La irradiación a la espalda también puede indicar disección aórtica.",
        type: "single",
        options: [
          { id: "irradia_brazo_izq", label: "Brazo izquierdo", sublabel: "Señal clásica de infarto agudo de miocardio", points: 5, redFlag: true },
          { id: "irradia_mandibula", label: "Mandíbula / cuello", sublabel: "Irradiación cefálica del síndrome coronario", points: 5, redFlag: true },
          { id: "irradia_espalda", label: "Espalda / entre los omóplatos", sublabel: "Puede indicar disección aórtica", points: 4 },
          { id: "irradia_epigastrio", label: "Estómago / epigastrio", sublabel: "Infarto inferior puede simular dolor digestivo", points: 3 },
          { id: "no_irradia", label: "No se irradia", sublabel: "El dolor permanece en el pecho", points: 0 },
        ],
      },
      {
        id: "cv_q3",
        text: "¿Presentas alguno de estos síntomas acompañantes?",
        educational: "La tríada de dolor torácico + sudoración fría + náuseas es altamente sugestiva de infarto. La cianosis periférica indica hipoxemia severa. La pérdida de conciencia acompañando palpitaciones puede indicar arritmia maligna.",
        type: "multiple",
        options: [
          { id: "sudoracion_fria", label: "Sudoración fría profusa", sublabel: "Sudor frío, piel pálida y húmeda", points: 5, redFlag: true },
          { id: "palidez_ext", label: "Palidez extrema o cianosis", sublabel: "Labios o uñas azulados, piel muy pálida", points: 5, redFlag: true },
          { id: "nauseas_card", label: "Náuseas o vómitos", sublabel: "Frecuente en infarto inferior", points: 2 },
          { id: "ansiedad", label: "Ansiedad intensa o sensación de muerte inminente", sublabel: "Angina de pecho o infarto", points: 3 },
          { id: "sincope_card", label: "Pérdida de conciencia", sublabel: "Síncope — señal de alarma crítica", points: 8, redFlag: true },
          { id: "ninguno_card", label: "Ninguno de los anteriores", sublabel: "", points: 0 },
        ],
      },
      {
        id: "cv_q4",
        text: "¿Con qué intensidad calificas el dolor o malestar?",
        educational: "El dolor cardíaco severo (7-10/10) generalmente indica isquemia aguda activa o arritmia maligna. Muchos pacientes con infarto describen el dolor como 'el peor dolor de su vida'. Un dolor < 4/10 intermitente puede ser de origen no cardíaco.",
        type: "scale",
      },
      {
        id: "cv_q5",
        text: "¿Cuánto tiempo llevas con estos síntomas?",
        educational: "En el infarto agudo de miocardio, el TIEMPO ES MIOCARDIO. Cada minuto sin reperfusión destruye tejido cardíaco. Si el dolor es < 12 horas, la angioplastia de urgencia puede salvar el músculo cardíaco. Síntomas > 12h reducen las opciones terapéuticas.",
        type: "duration",
        options: DURATION_OPTIONS,
      },
    ],
    recommendations: {
      green: {
        title: "Evaluación Cardíaca Programada",
        description: "Tus síntomas, aunque relacionados con el sistema cardiovascular, no presentan signos de emergencia inmediata. Sin embargo, toda sintomatología cardíaca requiere evaluación profesional.",
        timeToAction: "Consulta con cardiólogo o médico en 24–48 horas",
        actions: [
          "Evita esfuerzos físicos intensos y situaciones de estrés hasta ser evaluado",
          "Si fumas, evita el tabaco — es el principal factor de riesgo cardiovascular modificable",
          "Lleva un registro de los episodios: duración, intensidad, desencadenante",
          "Si los síntomas reaparecen con más intensidad o se agregan nuevos, acude a urgencias",
          "Controla tu presión arterial si tienes tensiómetro en casa",
        ],
        drugs: [
          { name: "Aspirina (AAS)", dose: "100 mg", frequency: "1 vez al día, solo si ya la tenías prescrita", purpose: "Antiagregante plaquetario preventivo. NO iniciar sin indicación médica previa.", warning: "Solo si ya la toma habitualmente. No iniciar sin prescripción" },
        ],
        referral: "Consulta de cardiología programada con electrocardiograma basal",
        specialty: "cardiology",
        emergency: false,
      },
      yellow: {
        title: "Atención Urgente",
        description: "Tus síntomas cardiovasculares requieren evaluación urgente. Existe riesgo de síndrome coronario que debe ser descartado con electrocardiograma y marcadores cardíacos.",
        timeToAction: "Acude a urgencias en las próximas 1–2 horas",
        actions: [
          "Acude a urgencias hospitalarias AHORA — necesitas ECG y troponinas cardíacas de urgencia",
          "Reposo absoluto. Siéntate o recuéstate. Evita caminar o esforzarte",
          "Si tienes nitroglicerina prescrita, tómala según indicación de tu médico",
          "Acompañado: no conduzcas tú mismo. Pide que alguien te lleve o llama taxi/ambulancia",
          "Informa al llegar de todos tus síntomas y antecedentes cardíacos",
        ],
        drugs: [
          { name: "Aspirina (AAS)", dose: "300 mg (masticado)", frequency: "Dosis única al ingreso si se sospecha SCA", purpose: "Antiagregante de acción rápida en síndrome coronario agudo. Masticar para absorción más rápida.", warning: "Solo si NO eres alérgico a la aspirina y NO hay sangrado activo. Consultar antes de tomar" },
          { name: "Nitroglicerina sublingual", dose: "0.4 mg", frequency: "Cada 5 min (máx. 3 dosis) si hay prescripción previa", purpose: "Vasodilatador coronario para alivio del dolor anginoso.", warning: "Solo si ya la tienes prescrita. Contraindicado con medicamentos para disfunción eréctil" },
        ],
        referral: "Urgencias hospitalarias con guardia de cardiología. ECG en < 10 minutos de llegada.",
        specialty: "cardiology",
        emergency: false,
      },
      red: {
        title: "EMERGENCIA CARDÍACA",
        description: "Tus síntomas son altamente compatibles con un SÍNDROME CORONARIO AGUDO o arritmia maligna. Cada minuto sin atención médica puede ser irreversible. ACTÚE AHORA.",
        timeToAction: "🚨 LLAME AL 911 / 112 INMEDIATAMENTE",
        actions: [
          "🚨 LLAME AL 911 / 112 AHORA MISMO. No espere — pida ambulancia",
          "Siéntese o recuéstese en la posición más cómoda. NO se levante",
          "Si no es alérgico a la aspirina: MASQUE 300 mg de aspirina ahora (no trague entero)",
          "Afloje ropa ajustada: corbata, cinturón, botones del cuello",
          "Si pierde el conocimiento y alguien está presente: RCP inmediata",
          "No conduzca usted mismo al hospital bajo ninguna circunstancia",
          "Permanezca al teléfono con el servicio de emergencias hasta la llegada de la ambulancia",
        ],
        drugs: [
          { name: "Aspirina (AAS)", dose: "300 mg MASTICADO (no tragado entero)", frequency: "Dosis única de emergencia", purpose: "Antiagregante de acción inmediata. Masticar permite absorción en 3–5 minutos vs. 15–20 min si se traga.", warning: "SOLO si NO hay alergia conocida y NO hay sangrado activo. No retrasar la llamada al 911 por buscar aspirina" },
        ],
        referral: "SALA DE EMERGENCIAS — CÓDIGO AZUL CARDÍACO. Hemodinamia disponible 24h.",
        specialty: "cardiology",
        emergency: true,
      },
    },
  },

  // ── RESPIRATORIO ──────────────────────────────────────────────────────────
  {
    id: "respiratory",
    name: "Respiratorio",
    icon: "🫁",
    color: "#00d4ff",
    description: "Pulmones, vías respiratorias, bronquios, pleura",
    redThreshold: 9,
    yellowThreshold: 4,
    questions: [
      {
        id: "resp_q1",
        text: "¿Cuál es tu síntoma respiratorio principal?",
        educational: "La disnea en reposo indica insuficiencia respiratoria aguda hasta que se demuestre lo contrario. La hemoptisis (sangre en esputo) es siempre una señal de alarma. Las sibilancias indican obstrucción bronquial (asma, EPOC). La cianosis indica hipoxemia severa.",
        type: "single",
        options: [
          { id: "disnea_severa", label: "Dificultad respiratoria severa en reposo", sublabel: "No puede hablar frases completas, ahogo intenso", points: 7, redFlag: true },
          { id: "disnea_esfuerzo", label: "Dificultad respiratoria con esfuerzo", sublabel: "Se cansa rápido, le cuesta subir escaleras", points: 3 },
          { id: "hemoptisis", label: "Tos con sangre", sublabel: "Esputo con sangre roja o rosada", points: 8, redFlag: true },
          { id: "dolor_toracico_resp", label: "Dolor torácico al respirar", sublabel: "Dolor que aumenta con inspiración profunda", points: 3 },
          { id: "tos_persistente", label: "Tos persistente", sublabel: "Tos seca o productiva de > 3 semanas", points: 1 },
          { id: "sibilancias", label: "Sibilancias / silbidos al respirar", sublabel: "Sonido de pito al exhalar, falta de aire", points: 3 },
          { id: "fiebre_tos", label: "Fiebre con tos productiva", sublabel: "Esputo amarillo/verde, posible neumonía", points: 3 },
        ],
      },
      {
        id: "resp_q2",
        text: "¿Puedes completar frases completas sin fatigarte?",
        educational: "La capacidad de completar frases es un indicador funcional rápido de la reserva respiratoria. Si el paciente no puede terminar una frase sin tomar aire, el volumen corriente está severamente comprometido — señal de emergencia respiratoria.",
        type: "single",
        options: [
          { id: "frases_normal", label: "Sí, sin dificultad", sublabel: "Habla con normalidad", points: 0 },
          { id: "frases_algo", label: "Con algo de dificultad", sublabel: "Me canso pero puedo hablar", points: 2 },
          { id: "frases_no", label: "No, debo pausar para respirar", sublabel: "Cada pocas palabras necesito recuperar aire", points: 6, redFlag: true },
          { id: "frases_monosil", label: "Solo puedo decir palabras sueltas", sublabel: "Monosílabos — insuficiencia respiratoria severa", points: 9, redFlag: true },
        ],
      },
      {
        id: "resp_q3",
        text: "¿Presentas alguno de estos signos acompañantes?",
        educational: "La cianosis (coloración azul de labios/uñas) indica SpO₂ < 85% — emergencia. El uso de músculos accesorios (cuello, intercostales) indica trabajo respiratorio máximo. La fiebre alta > 39°C con tos y expectoración purulenta sugiere neumonía.",
        type: "multiple",
        options: [
          { id: "cianosis", label: "Labios o uñas azuladas (cianosis)", sublabel: "Coloración azulada — hipoxemia severa", points: 9, redFlag: true },
          { id: "musculos_accesorios", label: "Uso visible de músculos del cuello al respirar", sublabel: "Tiraje supraclavicular o intercostal", points: 5 },
          { id: "fiebre_alta_resp", label: "Fiebre alta > 39°C", sublabel: "Con o sin escalofríos", points: 3 },
          { id: "expectoracion_purulenta", label: "Expectoración purulenta", sublabel: "Esputo amarillo, verde o con mal olor", points: 2 },
          { id: "taquicardia_resp", label: "Latidos cardíacos muy acelerados", sublabel: "Taquicardia como respuesta a hipoxemia", points: 3 },
          { id: "ninguno_resp", label: "Ninguno de los anteriores", sublabel: "", points: 0 },
        ],
      },
      {
        id: "resp_q4",
        text: "¿Con qué intensidad calificas tu dificultad respiratoria?",
        educational: "En patología respiratoria, la percepción de disnea (escala de Borg modificada, 1-10) correlaciona con la gravedad funcional. Un paciente que califica la disnea 8-10 con saturación desconocida debe ser tratado como emergencia hasta descartarla.",
        type: "scale",
      },
      {
        id: "resp_q5",
        text: "¿Cuánto tiempo llevas con estas dificultades respiratorias?",
        educational: "La disnea de inicio súbito (minutos a horas) sugiere neumotórax, embolia pulmonar o asma aguda. De inicio en horas con fiebre sugiere neumonía. Crónica y progresiva puede indicar EPOC, insuficiencia cardíaca o enfermedad intersticial.",
        type: "duration",
        options: DURATION_OPTIONS,
      },
    ],
    recommendations: {
      green: {
        title: "Manejo Ambulatorio",
        description: "Tu función respiratoria no presenta compromiso severo actualmente. Los síntomas son compatibles con una condición respiratoria manejable en forma ambulatoria con tratamiento adecuado.",
        timeToAction: "Consulta médica en 24–48 horas",
        actions: [
          "Ventilación adecuada: ambientes bien ventilados, evitar humo y contaminantes",
          "Hidratación abundante para facilitar la expectoración: 2–3 litros/día",
          "Reposo relativo. Evita exposición al frío y cambios bruscos de temperatura",
          "Si tienes asma: usa tu inhalador de rescate (salbutamol) según necesidad",
          "Consulta médica si la tos no mejora en 7 días o si aparece fiebre",
        ],
        drugs: [
          { name: "Paracetamol", dose: "500–1000 mg", frequency: "Cada 6–8 horas si hay fiebre o malestar general", purpose: "Antipirético y analgésico. No tiene efecto sobre la tos.", warning: "No exceder 4 g/día. Evitar en enfermedad hepática" },
          { name: "Ambroxol (Mucosolvan)", dose: "30 mg", frequency: "3 veces al día con comida", purpose: "Mucolítico: fluidifica las secreciones para facilitar su eliminación.", warning: "No usar en tos seca sin secreciones" },
          { name: "Salbutamol (Ventolin) inhalado", dose: "2 puffs (200 mcg)", frequency: "Cada 4–6 horas si hay sibilancias", purpose: "Broncodilatador de rescate. Solo si hay obstrucción bronquial conocida.", warning: "Solo si tienes prescripción médica previa o diagnóstico de asma/EPOC" },
        ],
        referral: "Médico de cabecera. Solicitar radiografía de tórax si tos > 2 semanas",
        specialty: "pulmonology",
        emergency: false,
      },
      yellow: {
        title: "Atención Urgente",
        description: "Tus síntomas respiratorios sugieren un compromiso que requiere evaluación médica urgente. Puede ser una neumonía, crisis asmática moderada u otro proceso que necesita diagnóstico y tratamiento inmediato.",
        timeToAction: "Acude a urgencias en las próximas 1–3 horas",
        actions: [
          "Acude a urgencias hospitalarias HOY para evaluación clínica, SpO₂ y radiografía",
          "Posición semisentada (45–90°): facilita la mecánica respiratoria",
          "Si tienes inhalador de salbutamol prescrito, úsalo ahora (2–4 puffs)",
          "Evita cualquier esfuerzo físico",
          "Si empeoras (no puedes terminar frases, cianosis): llama al 911 de inmediato",
        ],
        drugs: [
          { name: "Salbutamol (Ventolin) inhalado", dose: "2–4 puffs (200–400 mcg)", frequency: "Cada 20 min hasta 3 dosis, luego cada 4 horas", purpose: "Broncodilatador de acción corta para alivio urgente de obstrucción bronquial.", warning: "Solo si tienes diagnóstico de asma/EPOC. Puede causar taquicardia" },
          { name: "Paracetamol", dose: "1000 mg", frequency: "Cada 6 horas si fiebre > 38°C", purpose: "Control de fiebre para reducir demanda metabólica de O₂.", warning: "No exceder 4 g/día" },
        ],
        referral: "Urgencias hospitalarias con disponibilidad de oxigenoterapia y radiología",
        specialty: "pulmonology",
        emergency: false,
      },
      red: {
        title: "EMERGENCIA RESPIRATORIA",
        description: "Presentas signos de insuficiencia respiratoria aguda severa. La hipoxemia severa puede provocar daño cerebral en minutos. REQUIERE ATENCIÓN DE EMERGENCIA INMEDIATA.",
        timeToAction: "🚨 LLAME AL 911 / 112 INMEDIATAMENTE",
        actions: [
          "🚨 LLAME AL 911 / 112 AHORA. No se mueva — pida que llamen por usted si puede",
          "Siéntese erguido o recuéstese a 45° — esta posición optimiza la mecánica respiratoria",
          "Respira de forma controlada: inspiración lenta por nariz, expiración lenta por boca",
          "Si tienes inhalador de salbutamol: ÚSA LO AHORA — 4 puffs",
          "Afloja ropa ajustada al cuello, pecho y cintura",
          "NO te quedes solo — pide que alguien permanezca contigo hasta la ambulancia",
        ],
        drugs: [
          { name: "Salbutamol (Ventolin) inhalado", dose: "4–8 puffs con espaciador", frequency: "Cada 20 minutos máximo, solo si tienes diagnóstico de asma", purpose: "Broncodilatación de emergencia en crisis asmática severa.", warning: "SOLO si tienes asma diagnosticada y el inhalador disponible. No retrasar llamada al 911" },
        ],
        referral: "URGENCIAS con UCI respiratoria. TRASLADO EN AMBULANCIA con O₂.",
        specialty: "pulmonology",
        emergency: true,
      },
    },
  },

  // ── NEUROLÓGICO ───────────────────────────────────────────────────────────
  {
    id: "neurological",
    name: "Neurológico",
    icon: "🧠",
    color: "#a855f7",
    description: "Cerebro, nervios, medula espinal, cefalea, mareos, convulsiones",
    redThreshold: 8,
    yellowThreshold: 4,
    questions: [
      {
        id: "neuro_q1",
        text: "¿Cuál es tu síntoma neurológico principal?",
        educational: "El síntoma neurológico es la clave del diagnóstico diferencial. La 'peor cefalea de la vida' es el signo cardinal de hemorragia subaracnoidea. La debilidad o alteración del habla de inicio súbito sugieren ACV (ictus). Las convulsiones requieren evaluación urgente siempre.",
        type: "single",
        options: [
          { id: "cefalea_severa", label: "Cefalea: 'la peor de mi vida'", sublabel: "Inicio súbito tipo 'thunderclap' — señal crítica", points: 8, redFlag: true },
          { id: "debilidad_un_lado", label: "Debilidad o parálisis de un lado del cuerpo", sublabel: "Brazo o pierna que no responde — posible ACV", points: 9, redFlag: true },
          { id: "alt_habla", label: "Dificultad para hablar o entender", sublabel: "Palabras confusas, arrastradas — posible ACV", points: 9, redFlag: true },
          { id: "convulsiones", label: "Convulsiones o episodios convulsivos", sublabel: "Movimientos involuntarios, pérdida de conciencia", points: 8, redFlag: true },
          { id: "mareo_vertigo", label: "Mareo intenso o vértigo", sublabel: "Sensación de movimiento, inestabilidad severa", points: 3 },
          { id: "cefalea_habitual", label: "Cefalea (dolor de cabeza) habitual", sublabel: "Similar a episodios previos, tipo tensional o migraña", points: 1 },
          { id: "entumecimiento", label: "Entumecimiento u hormigueo", sublabel: "Pérdida de sensibilidad en cara, brazo o pierna", points: 3 },
          { id: "confusion", label: "Confusión o alteración del estado mental", sublabel: "No reconoce lugares o personas, desorientado", points: 6, redFlag: true },
        ],
      },
      {
        id: "neuro_q2",
        text: "¿Cómo fue el inicio de los síntomas?",
        educational: "El modo de inicio es diagnóstico en neurología. Inicio en segundos = hemorragia intracraneal o ACV isquémico (ventana terapéutica de 4.5h para trombolisis). Inicio en horas/días puede indicar meningitis, tumor o proceso inflamatorio con más tiempo terapéutico.",
        type: "single",
        options: [
          { id: "inicio_segundos", label: "Súbito, en segundos o minutos", sublabel: "Máxima intensidad de forma casi instantánea", points: 6 },
          { id: "inicio_horas", label: "Gradual, en horas", sublabel: "Fue empeorando progresivamente en el día", points: 3 },
          { id: "inicio_dias", label: "Progresivo, en días a semanas", sublabel: "Instalación lenta y progresiva", points: 1 },
          { id: "inicio_episodico", label: "En episodios que van y vienen", sublabel: "Aparece y desaparece (migraña, AIT)", points: 2 },
        ],
      },
      {
        id: "neuro_q3",
        text: "¿Presentas alguno de estos signos acompañantes?",
        educational: "Rigidez de nuca + fiebre + cefalea = tríada de MENINGITIS — emergencia infecciosa. Fotofobia severa agrega valor diagnóstico. El vómito explosivo sin náuseas previas indica hipertensión endocraneana. La alteración visual súbita puede indicar ACV de circulación posterior.",
        type: "multiple",
        options: [
          { id: "rigidez_nuca", label: "Rigidez de nuca (no puede doblar la cabeza hacia pecho)", sublabel: "Signo de Kernig — posible meningitis", points: 7, redFlag: true },
          { id: "fotofobia", label: "Fotofobia severa (molestia intensa con la luz)", sublabel: "Signo meníngeo frecuente", points: 3 },
          { id: "fiebre_neuro", label: "Fiebre alta > 38.5°C", sublabel: "Infección del SNC hasta descartar", points: 4 },
          { id: "vomito_explosivo", label: "Vómito explosivo sin náuseas previas", sublabel: "Hipertensión endocraneana", points: 4 },
          { id: "alt_visual", label: "Alteración visual súbita", sublabel: "Visión doble, pérdida de campo visual, ceguera parcial", points: 5, redFlag: true },
          { id: "ninguno_neuro", label: "Ninguno de los anteriores", sublabel: "", points: 0 },
        ],
      },
      {
        id: "neuro_q4",
        text: "¿Con qué intensidad calificas el síntoma?",
        educational: "La intensidad del síntoma neurológico debe correlacionarse con su carácter. Una cefalea 10/10 de inicio súbito es la 'peor de la vida' (señal roja de hemorragia). Un mareo 8/10 con inestabilidad severa puede indicar infarto cerebeloso. La cefalea tensional rara vez supera 6/10.",
        type: "scale",
      },
      {
        id: "neuro_q5",
        text: "¿Cuánto tiempo llevas con estos síntomas?",
        educational: "El tiempo es cerebro. En ACV isquémico, la trombolisis es eficaz hasta 4.5 horas del inicio de síntomas, y la trombectomía hasta 24h en casos seleccionados. Cada minuto de ACV sin tratar = 1.9 millones de neuronas destruidas. Registra la hora exacta de inicio.",
        type: "duration",
        options: DURATION_OPTIONS,
      },
    ],
    recommendations: {
      green: {
        title: "Seguimiento Neurológico",
        description: "Tus síntomas neurológicos, aunque molestos, no presentan signos de alarma graves en este momento. Sin embargo, toda sintomatología neurológica nueva merece evaluación médica.",
        timeToAction: "Consulta con neurólogo o médico en 24–72 horas",
        actions: [
          "Reposo en ambiente tranquilo, oscuro y silencioso (ideal para cefalea tensional/migraña)",
          "Hidratación adecuada — la deshidratación es desencadenante frecuente de cefalea",
          "Evita pantallas, ruido intenso y actividades que exacerben los síntomas",
          "Si es migraña conocida: usa tu medicación habitual según tu médico ha indicado",
          "Si los síntomas cambian, empeoran o aparecen nuevos síntomas: acude a urgencias",
        ],
        drugs: [
          { name: "Ibuprofeno", dose: "400–600 mg", frequency: "Cada 6–8 horas con comida", purpose: "AINE para cefalea tensional y dolor musculoesquelético.", warning: "Evitar en úlcera, insuficiencia renal o anticoagulación. Máximo 5 días sin consulta" },
          { name: "Paracetamol", dose: "500–1000 mg", frequency: "Cada 6–8 horas", purpose: "Analgésico y antipirético. Primera línea en cefalea leve-moderada.", warning: "No exceder 4 g/día. Preferir en pacientes con problemas gástricos" },
          { name: "Sumatriptán (si migraña diagnosticada)", dose: "50–100 mg oral o 6 mg subcutáneo", frequency: "1 dosis al inicio, repetir 1h después si necesario (máx 2 dosis/día)", purpose: "Triptán específico para abortar crisis migrañosa.", warning: "Solo con prescripción médica. Contraindicado en enfermedad cardiovascular" },
        ],
        referral: "Consulta de neurología para evaluación. TC cráneo si cefalea nueva o de características atípicas.",
        specialty: "neurology",
        emergency: false,
      },
      yellow: {
        title: "Evaluación Neurológica Urgente",
        description: "Tus síntomas neurológicos requieren evaluación urgente. Hay elementos que necesitan descartarse con estudios de imagen y evaluación especializada.",
        timeToAction: "Acude a urgencias en las próximas 1–3 horas",
        actions: [
          "Acude a urgencias hospitalarias AHORA — necesitas tomografía craneal urgente",
          "NO conduzcas: los síntomas neurológicos pueden afectar la coordinación y los reflejos",
          "Anota la hora EXACTA de inicio de los síntomas — es crítico para el médico",
          "Pide a alguien que te acompañe — podrías perder la orientación",
          "No tomes analgésicos potentes antes de la evaluación — podrían enmascarar síntomas",
        ],
        drugs: [],
        referral: "Urgencias neurológicas con disponibilidad de TC craneal urgente",
        specialty: "neurology",
        emergency: false,
      },
      red: {
        title: "EMERGENCIA NEUROLÓGICA — POSIBLE ACV",
        description: "Presentas signos de alarma neurológica crítica. Puede tratarse de un ACV (ictus), hemorragia intracraneal o meningitis. Cada segundo sin atención puede significar daño neurológico irreversible.",
        timeToAction: "🚨 LLAME AL 911 / 112 INMEDIATAMENTE — CÓDIGO ICTUS",
        actions: [
          "🚨 LLAME AL 911 / 112 AHORA. Diga 'posible ACV o ictus' — activa protocolo de código ictus",
          "TEST FAST: Face (cara caída) — Arm (brazo que cae) — Speech (habla arrastrada) — Time (hora de inicio)",
          "Recuéstese de lado (posición de seguridad) si hay riesgo de vómito o pérdida de conciencia",
          "NO le des nada por boca — ni agua ni medicamentos",
          "NO lo dejes solo bajo ninguna circunstancia",
          "Registra la HORA EXACTA del primer síntoma — determina si puede recibir trombolisis",
          "Si convulsiona: aleja objetos peligrosos, no le sujetes la lengua, colócalo de lado al terminar",
        ],
        drugs: [],
        referral: "URGENCIAS HOSPITALARIAS con UNIDAD DE ICTUS. CÓDIGO ICTUS activado. TC urgente < 25 min.",
        specialty: "neurology",
        emergency: true,
      },
    },
  },

  // ── MUSCULOESQUELÉTICO ────────────────────────────────────────────────────
  {
    id: "musculoskeletal",
    name: "Musculoesquelético",
    icon: "🦴",
    color: "#f59e0b",
    description: "Huesos, articulaciones, músculos, columna vertebral, tendones",
    redThreshold: 10,
    yellowThreshold: 5,
    questions: [
      {
        id: "msk_q1",
        text: "¿Cuál es el tipo de lesión o problema que presentas?",
        educational: "El mecanismo de lesión determina el triage. Un trauma de alta energía (accidente vial, caída de altura) puede ocasionar fracturas inestables o lesiones de columna. La deformidad visible sugiere fractura o luxación. El dolor articular con fiebre puede indicar artritis séptica — emergencia infectológica.",
        type: "single",
        options: [
          { id: "trauma_alto", label: "Trauma de alta energía", sublabel: "Accidente de tráfico, caída de altura, golpe severo", points: 5 },
          { id: "deformidad", label: "Deformidad visible del miembro", sublabel: "Angulación anormal, acortamiento — posible fractura/luxación", points: 6, redFlag: true },
          { id: "dolor_articular", label: "Dolor articular agudo", sublabel: "Articulación (rodilla, tobillo, muñeca, hombro, cadera)", points: 2 },
          { id: "lumbalgia", label: "Dolor lumbar", sublabel: "Zona lumbar baja con o sin irradiación a pierna", points: 2 },
          { id: "cervicalgia", label: "Dolor cervical", sublabel: "Cuello — especialmente post trauma", points: 2 },
          { id: "dolor_muscular", label: "Dolor muscular difuso", sublabel: "Mialgia generalizada o localizada sin trauma", points: 1 },
          { id: "articular_fiebre", label: "Articulación caliente, roja e hinchada + fiebre", sublabel: "Posible artritis séptica — requiere urgencia", points: 7, redFlag: true },
        ],
      },
      {
        id: "msk_q2",
        text: "¿Puedes mover la zona afectada con normalidad?",
        educational: "La impotencia funcional completa (no puede mover la extremidad) sugiere fractura, luxación o rotura tendinosa. La debilidad de una extremidad tras trauma cervical obliga a descartar lesión medular — manipulación incorrecta puede agravar el daño irreversiblemente.",
        type: "single",
        options: [
          { id: "mov_normal", label: "Sí, movimiento conservado y sin dolor severo", sublabel: "Función relativamente normal", points: 0 },
          { id: "mov_limitado", label: "Movimiento limitado con dolor", sublabel: "Puede moverse pero con dificultad y dolor", points: 2 },
          { id: "mov_imposible", label: "No puedo mover la zona por dolor severo", sublabel: "Impotencia funcional significativa", points: 4 },
          { id: "mov_paralisis", label: "Parálisis — no hay movimiento posible", sublabel: "Sin movimiento voluntario — puede indicar lesión nerviosa", points: 7, redFlag: true },
          { id: "debilidad_extremidad", label: "Debilidad marcada en brazos o piernas tras golpe en cuello/espalda", sublabel: "Posible lesión medular — emergencia absoluta", points: 9, redFlag: true },
        ],
      },
      {
        id: "msk_q3",
        text: "¿Presentas alguno de estos signos acompañantes?",
        educational: "El cambio de coloración (morado intenso) indica lesión vascular asociada a fractura. El entumecimiento o hormigueo en una extremidad post trauma sugiere compromiso nervioso. La fiebre con articulación inflamada puede indicar artritis séptica — infección articular que destruye el cartílago en 24-48h.",
        type: "multiple",
        options: [
          { id: "inflamacion_severa", label: "Inflamación marcada con calor local", sublabel: "Zona muy hinchada, caliente al tacto", points: 2 },
          { id: "cambio_color", label: "Cambio de coloración severo (morado intenso)", sublabel: "Hematoma extenso o cianosis distal — puede indicar lesión vascular", points: 4 },
          { id: "entumecimiento", label: "Entumecimiento u hormigueo distal a la lesión", sublabel: "Pérdida de sensibilidad en dedos o pie — compromiso nervioso", points: 3 },
          { id: "fiebre_msk", label: "Fiebre", sublabel: "Con o sin articulación inflamada", points: 3 },
          { id: "herida_abierta", label: "Herida abierta con hueso o tendón visible", sublabel: "Fractura expuesta — emergencia quirúrgica", points: 8, redFlag: true },
          { id: "ninguno_msk", label: "Ninguno de los anteriores", sublabel: "", points: 0 },
        ],
      },
      {
        id: "msk_q4",
        text: "¿Con qué intensidad calificas el dolor?",
        educational: "Un dolor musculoesquelético 9-10/10 sin trauma mayor es inusual y debe hacer sospechar fracturas por estrés, necrosis avascular, osteomielitis o síndrome compartimental. El síndrome compartimental con dolor desproporcionado al trauma es una emergencia vascular — requiere fasciotomía en horas.",
        type: "scale",
      },
      {
        id: "msk_q5",
        text: "¿Cuánto tiempo llevas con el dolor o lesión?",
        educational: "Un trauma reciente con signos de alarma necesita evaluación urgente para descartar lesiones ocultas. La lumbalgia crónica con irradiación nueva puede indicar hernia discal complicada. Las articulaciones inflamadas de inicio rápido (< 24h) son más sospechosas de infección o gota aguda.",
        type: "duration",
        options: DURATION_OPTIONS,
      },
    ],
    recommendations: {
      green: {
        title: "Manejo Conservador",
        description: "Tu lesión musculoesquelética puede manejarse en forma conservadora con reposo, analgesia y seguimiento médico. No presenta signos de fractura inestable, lesión vascular ni nerviosa.",
        timeToAction: "Consulta médica o traumatológica en 24–72 horas",
        actions: [
          "PRICE: Protección, Reposo, Hielo (20 min/hora), Compresión con venda elástica, Elevación del miembro",
          "Aplica frío local en las primeras 48h: bolsa de hielo envuelta en tela, 20 minutos cada 2 horas",
          "Después de 48h puedes alternar frío y calor para mejorar la circulación",
          "Evita apoyar o cargar peso en el miembro lesionado si hay dolor",
          "Consulta traumatología para descartar fractura con radiografía si el dolor es intenso o persistente",
        ],
        drugs: [
          { name: "Ibuprofeno", dose: "400–600 mg", frequency: "Cada 8 horas con comida", purpose: "AINE con efecto antiinflamatorio, analgésico y antipirético. Ideal en lesiones musculoesqueléticas agudas.", warning: "Contraindicado con anticoagulantes, en úlcera gástrica o insuficiencia renal. Máximo 7 días" },
          { name: "Diclofenaco gel 1%", dose: "2–4 g tópico", frequency: "3–4 veces al día sobre la zona afectada", purpose: "AINE tópico con excelente penetración local y mínimos efectos sistémicos.", warning: "No aplicar sobre heridas abiertas o piel lesionada" },
          { name: "Metamizol (Dipirona)", dose: "500–1000 mg", frequency: "Cada 6–8 horas según necesidad", purpose: "Analgésico potente para dolor musculoesquelético moderado-severo.", warning: "Monitorizar posible agranulocitosis en uso prolongado. Evitar en alérgicos a pirazolonas" },
        ],
        referral: "Traumatología/ortopedia ambulatoria para evaluación y radiografía si corresponde",
        specialty: "orthopedics",
        emergency: false,
      },
      yellow: {
        title: "Evaluación Traumatológica Urgente",
        description: "Tu lesión musculoesquelética requiere evaluación médica urgente. Hay signos que sugieren posible fractura, luxación o lesión de partes blandas significativa que necesita diagnóstico por imagen.",
        timeToAction: "Acude a urgencias en las próximas 2–4 horas",
        actions: [
          "Inmoviliza la zona: tablilla improvisada, cabestrillo o venda para evitar movimientos",
          "No intentes 'reducir' o enderezar una deformidad por tu cuenta — puede agravar la lesión",
          "Aplica hielo envuelto en tela para reducir la inflamación durante el traslado",
          "En traumatismo de cuello: evita mover la cabeza, mantén el cuello alineado hasta evaluación",
          "Acude a urgencias traumatológicas con radiografía disponible",
        ],
        drugs: [
          { name: "Metamizol (Dipirona)", dose: "500–1000 mg", frequency: "Cada 6 horas si el dolor es muy intenso", purpose: "Analgesia de urgencia previa a evaluación médica.", warning: "Analgesia antes del diagnóstico puede enmascarar síntomas — informar al médico que lo tomó" },
          { name: "Ibuprofeno", dose: "600 mg", frequency: "Dosis única si no hay contraindicación, hasta evaluación", purpose: "Analgesia y antiinflamatorio provisional.", warning: "Evitar si hay sospecha de sangrado interno" },
        ],
        referral: "Urgencias traumatológicas con radiología disponible. Posible yeso, inmovilización o quirófano.",
        specialty: "orthopedics",
        emergency: false,
      },
      red: {
        title: "EMERGENCIA TRAUMATOLÓGICA",
        description: "Presentas signos de lesión grave: posible fractura con compromiso vascular o nervioso, luxación, fractura expuesta o lesión medular. REQUIERE ATENCIÓN DE EMERGENCIA INMEDIATA.",
        timeToAction: "🚨 LLAME AL 911 / 112 INMEDIATAMENTE",
        actions: [
          "🚨 LLAME AL 911 / 112. Informe: 'trauma severo con posible fractura/lesión medular'",
          "NO MOVILICE al paciente si hay sospecha de lesión en cuello o columna — espere a la ambulancia",
          "Si hay fractura expuesta: cubra la herida con paño limpio HÚMEDO. NO intente introducir el hueso",
          "Controla el sangrado con presión directa firme con tela limpia",
          "Mantén al paciente caliente y tranquilo para prevenir shock",
          "Si hay síndrome compartimental (dolor desproporcionado, extremidad fría, sin pulso): urgencia quirúrgica en horas",
        ],
        drugs: [],
        referral: "URGENCIAS TRAUMATOLÓGICAS con quirófano disponible. TRASLADO EN AMBULANCIA con inmovilización adecuada.",
        specialty: "orthopedics",
        emergency: true,
      },
    },
  },
];

const SYSTEMS_OVERVIEW = [
  { id: "gastrointestinal" as BodySystem, name: "Gastrointestinal", icon: "🫃", color: "#ff8c42", description: "Estómago, intestinos, hígado" },
  { id: "cardiovascular" as BodySystem, name: "Cardiovascular", icon: "❤️", color: "#ff3355", description: "Corazón, presión, palpitaciones" },
  { id: "respiratory" as BodySystem, name: "Respiratorio", icon: "🫁", color: "#00d4ff", description: "Pulmones, bronquios, vías aéreas" },
  { id: "neurological" as BodySystem, name: "Neurológico", icon: "🧠", color: "#a855f7", description: "Cerebro, nervios, cefalea, ACV" },
  { id: "musculoskeletal" as BodySystem, name: "Musculoesquelético", icon: "🦴", color: "#f59e0b", description: "Huesos, articulaciones, músculos" },
];

const TRIAGE_CONFIG = {
  red: { label: "ROJO — EMERGENCIA", bg: "rgba(255,51,85,0.12)", border: "rgba(255,51,85,0.4)", color: "#ff3355", icon: AlertTriangle },
  yellow: { label: "AMARILLO — URGENTE", bg: "rgba(255,184,0,0.12)", border: "rgba(255,184,0,0.4)", color: "#ffb800", icon: AlertTriangle },
  green: { label: "VERDE — NO URGENTE", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)", color: "#00ff88", icon: CheckCircle },
};

const GI_CENTERS = [
  { name: "Hospital Regional — Gastroenterología", dist: "0.8 km", addr: "Av. Salud 245, Piso 3", phone: "+1 (555) 234-5678", open: "Abierto 24h", emergency: true },
  { name: "Centro Digestivo Avanzado", dist: "1.1 km", addr: "Calle Clínica 88", phone: "+1 (555) 345-6789", open: "Lun–Vie 08:00–20:00", emergency: false },
  { name: "Clínica Gastroenterológica Dr. Medina", dist: "1.8 km", addr: "Blvd. Salud 316, Local 4", phone: "+1 (555) 456-7890", open: "Lun–Sáb 07:00–22:00", emergency: false },
  { name: "Instituto de Enfermedades Digestivas", dist: "2.4 km", addr: "Av. Universidad 501", phone: "+1 (555) 567-8901", open: "Abierto 24h", emergency: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────

interface TriageAssessmentProps {
  onBack: () => void;
  onNavigateNearby: (specialty: string) => void;
}

export function TriageAssessment({ onBack, onNavigateNearby }: TriageAssessmentProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [hasRedFlag, setHasRedFlag] = useState(false);
  const [triageColor, setTriageColor] = useState<TriageColor>("green");
  const [calcProgress, setCalcProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, questionIdx]);

  const selectSystem = (sys: BodySystem) => {
    const p = PROTOCOLS.find((x) => x.id === sys)!;
    setProtocol(p);
    setQuestionIdx(0);
    setAnswers({});
    setScaleValue(null);
    setTotalPoints(0);
    setHasRedFlag(false);
    setPhase("questions");
  };

  const currentQuestion = protocol?.questions[questionIdx];
  const totalQuestions = protocol?.questions.length ?? 0;

  const getScalePoints = (v: number) => {
    if (v <= 3) return 1;
    if (v <= 6) return 3;
    if (v <= 8) return 5;
    return 7;
  };

  const toggleOption = (qId: string, optId: string, isMultiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[qId] ?? [];
      if (isMultiple) {
        if (optId === "ninguno" || optId === "ninguno_ant" || optId === "ninguno_card" || optId === "ninguno_resp" || optId === "ninguno_neuro" || optId === "ninguno_msk") {
          return { ...prev, [qId]: [optId] };
        }
        const withoutNone = current.filter(
          (id) => !["ninguno", "ninguno_ant", "ninguno_card", "ninguno_resp", "ninguno_neuro", "ninguno_msk"].includes(id)
        );
        if (withoutNone.includes(optId)) return { ...prev, [qId]: withoutNone.filter((x) => x !== optId) };
        return { ...prev, [qId]: [...withoutNone, optId] };
      }
      return { ...prev, [qId]: [optId] };
    });
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "scale") return scaleValue !== null;
    return (answers[currentQuestion.id] ?? []).length > 0;
  };

  const accumulatePoints = () => {
    if (!currentQuestion || !protocol) return;
    let pts = 0;
    let rf = hasRedFlag;

    if (currentQuestion.type === "scale" && scaleValue !== null) {
      pts += getScalePoints(scaleValue);
      if (scaleValue >= 9) rf = true;
    } else {
      const selected = answers[currentQuestion.id] ?? [];
      currentQuestion.options?.forEach((opt) => {
        if (selected.includes(opt.id)) {
          pts += opt.points;
          if (opt.redFlag) rf = true;
        }
      });
    }
    setTotalPoints((prev) => prev + pts);
    setHasRedFlag(rf);
    return { newTotal: totalPoints + pts, newRf: rf };
  };

  const handleNext = () => {
    const result = accumulatePoints();
    if (!protocol) return;

    if (questionIdx < totalQuestions - 1) {
      setQuestionIdx((i) => i + 1);
      setScaleValue(null);
    } else {
      // Calculate triage
      const newTotal = result?.newTotal ?? totalPoints;
      const newRf = result?.newRf ?? hasRedFlag;
      let color: TriageColor;
      if (newRf || newTotal >= protocol.redThreshold) color = "red";
      else if (newTotal >= protocol.yellowThreshold) color = "yellow";
      else color = "green";
      setTriageColor(color);
      setPhase("calculating");
      // Animate progress then show result
      let p = 0;
      const iv = setInterval(() => {
        p += 14;
        setCalcProgress(Math.min(p, 100));
        if (p >= 100) { clearInterval(iv); setTimeout(() => setPhase("result"), 400); }
      }, 140);
    }
  };

  const handleBack = () => {
    if (questionIdx > 0) {
      setQuestionIdx((i) => i - 1);
      setScaleValue(null);
    } else {
      setPhase("select-system");
    }
  };

  const reset = () => {
    setPhase("intro");
    setProtocol(null);
    setQuestionIdx(0);
    setAnswers({});
    setScaleValue(null);
    setTotalPoints(0);
    setHasRedFlag(false);
    setCalcProgress(0);
  };

  const rec = protocol ? protocol.recommendations[triageColor] : null;
  const isGI = protocol?.id === "gastrointestinal";
  const showGIMap = isGI && (triageColor === "red" || triageColor === "yellow");

  return (
    <div ref={scrollRef} className="relative min-h-screen overflow-y-auto pb-28">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ top: "-80px", left: "50%", transform: "translateX(-50%)", width: 380, height: 380, background: "radial-gradient(circle, rgba(26,110,255,0.08) 0%, transparent 70%)" }} />
      </div>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10">
            <div className="px-5 pt-14 pb-4 flex items-center gap-3">
              <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}>
                <ArrowLeft size={16} color="#6b9ac4" />
              </button>
              <div>
                <h2 style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600 }}>Triage Médico IA</h2>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#00ff88", letterSpacing: "0.1em" }}>● SISTEMA ACTIVO</p>
              </div>
            </div>

            <div className="px-5 py-6">
              <div className="flex justify-center mb-6">
                <div className="relative" style={{ width: 110, height: 110 }}>
                  {[0, 1].map((i) => (
                    <motion.div key={i} className="absolute rounded-full" style={{ inset: `-${(i + 1) * 16}px`, border: `1px solid rgba(26,110,255,${0.2 - i * 0.07})` }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }} transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity }} />
                  ))}
                  <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", boxShadow: "0 0 40px rgba(26,110,255,0.5)" }}>
                    <Activity size={42} color="#fff" />
                  </div>
                </div>
              </div>

              <h1 className="text-center mb-2" style={{ color: "#e8f4ff", fontSize: "1.4rem", fontWeight: 700 }}>Evaluación de Triage</h1>
              <p className="text-center mb-6" style={{ color: "#6b9ac4", fontSize: "0.85rem", lineHeight: 1.6 }}>
                Sistema de clasificación médica basado en protocolos internacionales de triage hospitalario (START, ESI, Manchester)
              </p>

              {/* Color system explanation */}
              <GlassCard className="mb-4">
                <div className="p-4 space-y-3">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase" }}>Sistema de Clasificación</p>
                  {[
                    { color: "#ff3355", label: "ROJO — Emergencia inmediata", desc: "Riesgo vital. Llame al 911 de inmediato." },
                    { color: "#ffb800", label: "AMARILLO — Urgente", desc: "Necesita atención en 1–4 horas." },
                    { color: "#00ff88", label: "VERDE — No urgente", desc: "Atención en 24–72 horas. Manejo ambulatorio." },
                  ].map(({ color, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                      <div>
                        <p style={{ color: "#e8f4ff", fontSize: "0.8rem", fontWeight: 600 }}>{label}</p>
                        <p style={{ color: "#6b9ac4", fontSize: "0.72rem" }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="mb-6 px-4 py-3 rounded-xl" style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.2)" }}>
                <p style={{ color: "#ffb800", fontSize: "0.72rem", lineHeight: 1.5 }}>
                  ⚠️ <strong>Aviso médico:</strong> Esta evaluación es orientativa y no reemplaza el diagnóstico médico profesional. En caso de emergencia grave, llame al 911 / 112 directamente.
                </p>
              </div>

              <button onClick={() => setPhase("select-system")} className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", boxShadow: "0 0 30px rgba(26,110,255,0.4)", color: "#fff", fontSize: "0.95rem", fontWeight: 700 }}>
                <Zap size={18} />Iniciar Evaluación de Triage<ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SYSTEM SELECTION ── */}
        {phase === "select-system" && (
          <motion.div key="select" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="relative z-10">
            <div className="px-5 pt-14 pb-4 flex items-center gap-3">
              <button onClick={() => setPhase("intro")} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}>
                <ArrowLeft size={16} color="#6b9ac4" />
              </button>
              <div>
                <h2 style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600 }}>¿Qué sistema está afectado?</h2>
                <p style={{ color: "#6b9ac4", fontSize: "0.72rem" }}>Selecciona la zona con síntomas</p>
              </div>
            </div>

            <div className="px-5 space-y-3">
              {SYSTEMS_OVERVIEW.map(({ id, name, icon, color, description }, i) => (
                <motion.div key={id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <button onClick={() => selectSystem(id)} className="w-full text-left transition-all active:scale-95">
                    <GlassCard>
                      <div className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <p style={{ color: "#e8f4ff", fontSize: "0.95rem", fontWeight: 600 }}>{name}</p>
                          <p style={{ color: "#6b9ac4", fontSize: "0.75rem" }}>{description}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                        <ArrowRight size={14} color="#4a6a8a" />
                      </div>
                    </GlassCard>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QUESTIONS ── */}
        {phase === "questions" && protocol && currentQuestion && (
          <motion.div key={`q-${questionIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="relative z-10">
            {/* Header */}
            <div className="px-5 pt-14 pb-3 flex items-center gap-3">
              <button onClick={handleBack} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}>
                <ArrowLeft size={16} color="#6b9ac4" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.2rem" }}>{protocol.icon}</span>
                  <span style={{ color: protocol.color, fontSize: "0.75rem", fontWeight: 600 }}>{protocol.name}</span>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(26,110,255,0.1)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${((questionIdx + 1) / totalQuestions) * 100}%`, background: `linear-gradient(90deg, #1a6eff, ${protocol.color})` }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#6b9ac4", whiteSpace: "nowrap" }}>
                    {questionIdx + 1}/{totalQuestions}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 space-y-4">
              {/* Question card */}
              <GlassCard>
                <div className="p-4">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase", marginBottom: 8 }}>
                    Pregunta {questionIdx + 1} de {totalQuestions}
                  </p>
                  <p style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>
                    {currentQuestion.text}
                  </p>
                  <div className="rounded-xl p-3" style={{ background: "rgba(26,110,255,0.07)", border: "1px solid rgba(26,110,255,0.12)" }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, color: "#00d4ff", letterSpacing: "0.08em", marginBottom: 4 }}>
                      ℹ CONTEXTO CLÍNICO
                    </p>
                    <p style={{ color: "#8ab4d8", fontSize: "0.72rem", lineHeight: 1.5 }}>
                      {currentQuestion.educational}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* SINGLE / MULTIPLE OPTIONS */}
              {(currentQuestion.type === "single" || currentQuestion.type === "multiple" || currentQuestion.type === "duration") && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.type === "multiple" && (
                    <p style={{ color: "#6b9ac4", fontSize: "0.72rem", textAlign: "center" }}>Selecciona todos los que apliquen</p>
                  )}
                  {currentQuestion.options.map((opt) => {
                    const sel = (answers[currentQuestion.id] ?? []).includes(opt.id);
                    const isRed = opt.redFlag;
                    return (
                      <button key={opt.id} onClick={() => toggleOption(currentQuestion.id, opt.id, currentQuestion.type === "multiple")} className="w-full text-left transition-all active:scale-[0.98]">
                        <div className="px-4 py-3 rounded-xl flex items-center gap-3" style={{
                          background: sel ? (isRed ? "rgba(255,51,85,0.15)" : "rgba(26,110,255,0.18)") : "rgba(6,18,50,0.7)",
                          border: `1px solid ${sel ? (isRed ? "rgba(255,51,85,0.5)" : "rgba(26,110,255,0.5)") : "rgba(26,110,255,0.15)"}`,
                        }}>
                          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{
                            background: sel ? (isRed ? "#ff3355" : "#1a6eff") : "rgba(26,110,255,0.08)",
                            border: `1px solid ${sel ? "transparent" : "rgba(26,110,255,0.3)"}`,
                          }}>
                            {sel && <CheckCircle size={12} color="#fff" />}
                          </div>
                          <div className="flex-1">
                            <p style={{ color: sel ? "#e8f4ff" : "#a0c4e8", fontSize: "0.85rem", fontWeight: sel ? 600 : 400 }}>{opt.label}</p>
                            {opt.sublabel && <p style={{ color: sel ? "#7aa8d0" : "#4a6a8a", fontSize: "0.68rem", marginTop: 1 }}>{opt.sublabel}</p>}
                          </div>
                          {isRed && <AlertTriangle size={14} color="#ff3355" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SCALE */}
              {currentQuestion.type === "scale" && (
                <GlassCard>
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <span style={{ color: "#00ff88", fontSize: "0.7rem" }}>Sin dolor</span>
                      <span style={{ color: "#ff3355", fontSize: "0.7rem" }}>Insoportable</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                        const c = n <= 3 ? "#00ff88" : n <= 6 ? "#ffb800" : n <= 8 ? "#ff8800" : "#ff3355";
                        const sel = scaleValue === n;
                        return (
                          <button key={n} onClick={() => setScaleValue(n)} className="py-3 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-90"
                            style={{ background: sel ? `${c}25` : "rgba(6,18,50,0.8)", border: `1px solid ${sel ? c : "rgba(26,110,255,0.18)"}`, boxShadow: sel ? `0 0 12px ${c}50` : "none" }}>
                            <span style={{ color: sel ? c : "#6b9ac4", fontSize: "1.1rem", fontWeight: 700 }}>{n}</span>
                          </button>
                        );
                      })}
                    </div>
                    {scaleValue && (
                      <p className="text-center" style={{ color: scaleValue <= 3 ? "#00ff88" : scaleValue <= 6 ? "#ffb800" : scaleValue <= 8 ? "#ff8800" : "#ff3355", fontSize: "0.82rem", fontWeight: 600 }}>
                        {scaleValue <= 3 ? "Leve" : scaleValue <= 6 ? "Moderado" : scaleValue <= 8 ? "Severo" : "🚨 Muy severo — posible emergencia"}
                      </p>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Next button */}
              <button onClick={handleNext} disabled={!canProceed()} className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                style={{
                  background: canProceed() ? "linear-gradient(135deg, #1a6eff, #00d4ff)" : "rgba(26,110,255,0.08)",
                  boxShadow: canProceed() ? "0 0 20px rgba(26,110,255,0.35)" : "none",
                  color: canProceed() ? "#fff" : "#2a4a6a",
                  fontSize: "0.9rem", fontWeight: 700,
                }}>
                {questionIdx < totalQuestions - 1 ? (<>Siguiente pregunta <ArrowRight size={16} /></>) : (<><Zap size={16} /> Calcular Triage</>)}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── CALCULATING ── */}
        {phase === "calculating" && (
          <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8" style={{ background: "#020915" }}>
            <div className="relative" style={{ width: 120, height: 120, marginBottom: 32 }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="absolute rounded-full" style={{ inset: `-${(i + 1) * 14}px`, border: `1px solid rgba(26,110,255,${0.3 - i * 0.08})` }}
                  animate={{ rotate: 360 }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }} />
              ))}
              <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", boxShadow: "0 0 40px rgba(26,110,255,0.6)" }}>
                <Loader size={40} color="#fff" />
              </div>
            </div>
            <p style={{ color: "#e8f4ff", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Procesando Triage</p>
            <p style={{ color: "#6b9ac4", fontSize: "0.8rem", marginBottom: 24 }}>Analizando signos y síntomas reportados</p>
            <div className="w-64 rounded-full overflow-hidden" style={{ height: 6, background: "rgba(26,110,255,0.1)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#1a6eff,#00d4ff)", boxShadow: "0 0 10px rgba(0,212,255,0.7)" }}
                initial={{ width: "0%" }} animate={{ width: `${calcProgress}%` }} transition={{ duration: 0.15 }} />
            </div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00d4ff", fontSize: "0.7rem", marginTop: 8 }}>{calcProgress}%</p>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && protocol && rec && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <div className="px-5 pt-14 pb-4 flex items-center gap-3">
              <div>
                <h2 style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600 }}>Resultado del Triage</h2>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#6b9ac4", letterSpacing: "0.1em" }}>
                  {protocol.icon} {protocol.name.toUpperCase()} · ANÁLISIS COMPLETADO
                </p>
              </div>
            </div>

            <div className="px-5 space-y-4">
              {/* Triage color hero */}
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: TRIAGE_CONFIG[triageColor].bg, border: `1px solid ${TRIAGE_CONFIG[triageColor].border}`, boxShadow: `0 0 30px ${TRIAGE_CONFIG[triageColor].color}20` }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15" style={{ background: `radial-gradient(circle, ${TRIAGE_CONFIG[triageColor].color} 0%, transparent 70%)`, transform: "translate(40%,-40%)" }} />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${TRIAGE_CONFIG[triageColor].color}20` }}>
                    <span style={{ fontSize: "1.5rem" }}>{protocol.icon}</span>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-1" style={{ background: `${TRIAGE_CONFIG[triageColor].color}20`, border: `1px solid ${TRIAGE_CONFIG[triageColor].color}50` }}>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: TRIAGE_CONFIG[triageColor].color }} />
                      <span style={{ color: TRIAGE_CONFIG[triageColor].color, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                        {TRIAGE_CONFIG[triageColor].label}
                      </span>
                    </div>
                    <p style={{ color: "#e8f4ff", fontSize: "0.95rem", fontWeight: 700 }}>{rec.title}</p>
                  </div>
                </div>
                <p style={{ color: "#a0c4e8", fontSize: "0.8rem", lineHeight: 1.5, marginBottom: 10 }}>{rec.description}</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <Clock size={14} style={{ color: TRIAGE_CONFIG[triageColor].color, flexShrink: 0 }} />
                  <p style={{ color: TRIAGE_CONFIG[triageColor].color, fontSize: "0.8rem", fontWeight: 700 }}>{rec.timeToAction}</p>
                </div>
              </div>

              {/* ACTIONS */}
              <GlassCard>
                <div className="p-4">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase", marginBottom: 12 }}>
                    ⚡ Acciones Inmediatas
                  </p>
                  <div className="space-y-3">
                    {rec.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${TRIAGE_CONFIG[triageColor].color}20`, border: `1px solid ${TRIAGE_CONFIG[triageColor].color}40` }}>
                          <span style={{ color: TRIAGE_CONFIG[triageColor].color, fontSize: "0.55rem", fontWeight: 700 }}>{i + 1}</span>
                        </div>
                        <p style={{ color: "#a0c4e8", fontSize: "0.8rem", lineHeight: 1.5 }}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* MEDICATIONS */}
              {rec.drugs.length > 0 ? (
                <GlassCard>
                  <div className="p-4">
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase", marginBottom: 12 }}>
                      💊 Soluciones Farmacológicas
                    </p>
                    <div className="space-y-4">
                      {rec.drugs.map((drug, i) => (
                        <div key={i} className="rounded-xl p-3" style={{ background: "rgba(26,110,255,0.07)", border: "1px solid rgba(26,110,255,0.14)" }}>
                          <div className="flex items-center justify-between mb-1">
                            <p style={{ color: "#00d4ff", fontSize: "0.88rem", fontWeight: 700 }}>{drug.name}</p>
                            <span className="px-2 py-0.5 rounded-lg" style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", fontSize: "0.62rem", fontWeight: 600 }}>{drug.dose}</span>
                          </div>
                          <p style={{ color: "#6b9ac4", fontSize: "0.7rem", marginBottom: 4 }}>⏱ {drug.frequency}</p>
                          <p style={{ color: "#a0c4e8", fontSize: "0.75rem", lineHeight: 1.4, marginBottom: drug.warning ? 6 : 0 }}>{drug.purpose}</p>
                          {drug.warning && (
                            <p style={{ color: "#ffb800", fontSize: "0.68rem", lineHeight: 1.4 }}>⚠ {drug.warning}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ) : triageColor === "red" ? (
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,51,85,0.08)", border: "1px solid rgba(255,51,85,0.25)" }}>
                  <p style={{ color: "#ff3355", fontSize: "0.8rem", fontWeight: 600, marginBottom: 4 }}>🚫 NO automedicarse en emergencia</p>
                  <p style={{ color: "#a0c4e8", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    En situaciones de emergencia, la automedicación puede enmascarar síntomas críticos y dificultar el diagnóstico. El personal médico de emergencias administrará la medicación adecuada.
                  </p>
                </div>
              ) : null}

              {/* REFERRAL */}
              <GlassCard>
                <div className="p-4">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase", marginBottom: 10 }}>
                    🏥 Derivación y Seguimiento
                  </p>
                  <p style={{ color: "#a0c4e8", fontSize: "0.82rem", lineHeight: 1.5 }}>{rec.referral}</p>
                </div>
              </GlassCard>

              {/* GI MAP SECTION */}
              {showGIMap && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <GlassCard glow="cyan">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin size={16} color="#00d4ff" />
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "#00d4ff", textTransform: "uppercase" }}>
                          Centros Gastroenterológicos Cercanos
                        </p>
                      </div>

                      {/* Stylized Map */}
                      <div className="rounded-xl overflow-hidden mb-4 relative" style={{ height: 160, background: "#04102A", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {[20, 40, 60, 80].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(26,110,255,0.08)" strokeWidth="0.5" />)}
                          {[20, 40, 60, 80].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="rgba(26,110,255,0.08)" strokeWidth="0.5" />)}
                          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(26,110,255,0.2)" strokeWidth="1" />
                          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(26,110,255,0.2)" strokeWidth="1" />
                          {/* City blocks */}
                          {[[10,22,18,14],[30,22,15,14],[58,22,18,14],[10,62,16,14],[30,62,16,14],[60,62,16,14]].map(([x,y,w,h],i) => (
                            <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(10,25,60,0.7)" stroke="rgba(26,110,255,0.07)" strokeWidth="0.3" rx="0.5" />
                          ))}
                          {/* GI Centers */}
                          <circle cx="32" cy="38" r="2.5" fill="#00d4ff" opacity="0.9" />
                          <circle cx="68" cy="32" r="2.5" fill="#00d4ff" opacity="0.9" />
                          <circle cx="25" cy="68" r="2.5" fill="#ff8c42" opacity="0.9" />
                          <circle cx="72" cy="70" r="2.5" fill="#ff8c42" opacity="0.9" />
                          {/* User location */}
                          <circle cx="50" cy="50" r="5" fill="rgba(26,110,255,0.2)" />
                          <circle cx="50" cy="50" r="3" fill="#1a6eff" />
                          <circle cx="50" cy="50" r="1.2" fill="#fff" />
                          {/* Radius */}
                          <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="0.5" strokeDasharray="2 2" />
                        </svg>
                        {/* Scan line */}
                        <motion.div className="absolute left-0 right-0 pointer-events-none" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)" }}
                          animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#00d4ff" }} /><span style={{ color: "#00d4ff", fontSize: "0.5rem", fontWeight: 600 }}>Hospital c/GI</span></div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#ff8c42" }} /><span style={{ color: "#ff8c42", fontSize: "0.5rem", fontWeight: 600 }}>Clínica GI</span></div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "rgba(0,212,255,0.6)" }}>37.7749° N · 122.4194° W</p>
                        </div>
                      </div>

                      {/* GI Centers list */}
                      <div className="space-y-3 mb-4">
                        {GI_CENTERS.map((c, i) => (
                          <div key={i} className="rounded-xl p-3" style={{ background: "rgba(0,212,255,0.05)", border: `1px solid ${c.emergency ? "rgba(255,51,85,0.25)" : "rgba(0,212,255,0.15)"}` }}>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.emergency ? "rgba(255,51,85,0.15)" : "rgba(0,212,255,0.12)" }}>
                                <span style={{ fontSize: "1rem" }}>🏥</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="truncate" style={{ color: "#e8f4ff", fontSize: "0.8rem", fontWeight: 600 }}>{c.name}</p>
                                  {c.emergency && <span className="shrink-0 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,51,85,0.15)", border: "1px solid rgba(255,51,85,0.3)", color: "#ff3355", fontSize: "0.5rem", fontWeight: 700 }}>24H</span>}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span style={{ color: "#6b9ac4", fontSize: "0.65rem" }}>📍 {c.dist}</span>
                                  <span style={{ color: "#6b9ac4", fontSize: "0.65rem" }}>⏰ {c.open}</span>
                                </div>
                                <p style={{ color: "#4a6a8a", fontSize: "0.62rem", marginTop: 2 }}>{c.addr}</p>
                                <a href={`tel:${c.phone}`} className="flex items-center gap-1 mt-1">
                                  <Phone size={9} color="#00d4ff" />
                                  <span style={{ color: "#00d4ff", fontSize: "0.65rem" }}>{c.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Maps buttons */}
                      <div className="flex gap-2">
                        <a href="https://www.google.com/maps/search/gastroenterologo+cerca+de+mi/" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                          style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(26,110,255,0.2))", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: "0.78rem", fontWeight: 700 }}>
                          <ExternalLink size={14} />Abrir en Google Maps
                        </a>
                        <button onClick={() => onNavigateNearby("gastroenterology")} className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                          style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", color: "#fff", fontSize: "0.78rem", fontWeight: 700 }}>
                          <MapPin size={14} />Mapa completo
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Navigate to Nearby (non-GI urgent) */}
              {!showGIMap && (triageColor === "red" || triageColor === "yellow") && rec.specialty && (
                <button onClick={() => onNavigateNearby(rec.specialty!)} className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", boxShadow: "0 0 30px rgba(26,110,255,0.4)", color: "#fff", fontSize: "0.92rem", fontWeight: 700 }}>
                  <MapPin size={18} />Encontrar Centro Médico Cercano<ChevronRight size={18} />
                </button>
              )}

              {/* Reset / Home */}
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)", color: "#6b9ac4", fontSize: "0.82rem", fontWeight: 600 }}>
                  <RotateCcw size={14} />Nueva Evaluación
                </button>
                <button onClick={onBack} className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)", color: "#6b9ac4", fontSize: "0.82rem", fontWeight: 600 }}>
                  <Home size={14} />Inicio
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
