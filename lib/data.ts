// Datos de ejemplo para el sistema de gestión odontológica

export type Patient = {
  id: string
  nombres: string
  apellidos: string
  dni: string
  celular: string
  edad: number
  alertas: { tipo: 'alergia' | 'cronica' | 'embarazo'; detalle: string }[]
  ultimaVisita: string
  saldoDeudor: number
}

export const patients: Patient[] = [
  {
    id: 'P-001',
    nombres: 'María Elena',
    apellidos: 'Quispe Huamán',
    dni: '45879123',
    celular: '987 654 321',
    edad: 34,
    alertas: [
      { tipo: 'alergia', detalle: 'Alergia a la penicilina' },
      { tipo: 'embarazo', detalle: 'Sospecha de embarazo (2do trimestre)' },
    ],
    ultimaVisita: '2026-07-14',
    saldoDeudor: 850,
  },
  {
    id: 'P-002',
    nombres: 'Jorge Luis',
    apellidos: 'Mamani Ticona',
    dni: '72345689',
    celular: '912 345 678',
    edad: 47,
    alertas: [{ tipo: 'cronica', detalle: 'Diabetes tipo 2 — controlada' }],
    ultimaVisita: '2026-07-10',
    saldoDeudor: 320,
  },
  {
    id: 'P-003',
    nombres: 'Rosa Angélica',
    apellidos: 'Flores Condori',
    dni: '41236785',
    celular: '956 234 187',
    edad: 28,
    alertas: [],
    ultimaVisita: '2026-07-16',
    saldoDeudor: 0,
  },
  {
    id: 'P-004',
    nombres: 'Carlos Alberto',
    apellidos: 'Vargas Paredes',
    dni: '09876543',
    celular: '934 567 890',
    edad: 61,
    alertas: [{ tipo: 'cronica', detalle: 'Hipertensión arterial' }],
    ultimaVisita: '2026-07-08',
    saldoDeudor: 1250,
  },
  {
    id: 'P-005',
    nombres: 'Lucía Fernanda',
    apellidos: 'Choque Apaza',
    dni: '63451278',
    celular: '901 234 567',
    edad: 19,
    alertas: [],
    ultimaVisita: '2026-07-15',
    saldoDeudor: 150,
  },
]

export type AppointmentNote = {
  id: string
  citaId: string
  fecha: string
  diagnosis?: string
  notas?: string
  cambioEstado?: { de: string; a: string; fecha: string }
}

export type Appointment = {
  id: string
  pacienteId: string
  paciente: string
  celular: string
  fecha: string // YYYY-MM-DD
  hora: string // HH:mm
  duracionMin: number
  tratamiento: string
  doctor: string
  estado: 'confirmada' | 'pendiente' | 'cancelada' | 'atendida' | 'no-presentó'
  diagnosis?: string
  notas?: AppointmentNote[]
  presupuestoId?: string
}

export const appointments: Appointment[] = [
  { id: 'C-101', pacienteId: 'P-001', paciente: 'María Elena Quispe', celular: '987 654 321', fecha: '2026-07-17', hora: '09:00', duracionMin: 60, tratamiento: 'Endodoncia pieza 1.1', doctor: 'Dra. Salas', estado: 'confirmada' },
  { id: 'C-102', pacienteId: 'P-003', paciente: 'Rosa Flores Condori', celular: '956 234 187', fecha: '2026-07-17', hora: '10:30', duracionMin: 30, tratamiento: 'Profilaxis dental', doctor: 'Dr. Rivera', estado: 'pendiente' },
  { id: 'C-103', pacienteId: 'P-002', paciente: 'Jorge Mamani Ticona', celular: '912 345 678', fecha: '2026-07-17', hora: '11:30', duracionMin: 45, tratamiento: 'Curación pieza 3.6', doctor: 'Dra. Salas', estado: 'confirmada' },
  { id: 'C-104', pacienteId: 'P-005', paciente: 'Lucía Choque Apaza', celular: '901 234 567', fecha: '2026-07-17', hora: '15:00', duracionMin: 30, tratamiento: 'Control de ortodoncia', doctor: 'Dr. Rivera', estado: 'pendiente' },
  { id: 'C-105', pacienteId: 'P-004', paciente: 'Carlos Vargas Paredes', celular: '934 567 890', fecha: '2026-07-17', hora: '16:30', duracionMin: 90, tratamiento: 'Cambio de corona pieza 2.5', doctor: 'Dra. Salas', estado: 'confirmada' },
  { id: 'C-106', pacienteId: 'P-001', paciente: 'María Elena Quispe', celular: '987 654 321', fecha: '2026-07-18', hora: '09:30', duracionMin: 45, tratamiento: 'Control post-endodoncia', doctor: 'Dra. Salas', estado: 'pendiente' },
  { id: 'C-107', pacienteId: 'P-002', paciente: 'Jorge Mamani Ticona', celular: '912 345 678', fecha: '2026-07-15', hora: '10:00', duracionMin: 60, tratamiento: 'Curación pieza 3.7', doctor: 'Dr. Rivera', estado: 'atendida' },
  { id: 'C-108', pacienteId: 'P-005', paciente: 'Lucía Choque Apaza', celular: '901 234 567', fecha: '2026-07-14', hora: '11:00', duracionMin: 30, tratamiento: 'Ajuste de brackets', doctor: 'Dr. Rivera', estado: 'atendida' },
  { id: 'C-109', pacienteId: 'P-004', paciente: 'Carlos Vargas Paredes', celular: '934 567 890', fecha: '2026-07-16', hora: '15:30', duracionMin: 60, tratamiento: 'Cementado de corona', doctor: 'Dra. Salas', estado: 'cancelada' },
  { id: 'C-110', pacienteId: 'P-003', paciente: 'Rosa Flores Condori', celular: '956 234 187', fecha: '2026-07-13', hora: '09:00', duracionMin: 45, tratamiento: 'Blanqueamiento dental', doctor: 'Dra. Salas', estado: 'atendida' },
]

export type BudgetPayment = {
  id: string
  budgetId: string
  sesionId?: string
  monto: number
  metodoPago: 'efectivo' | 'yape-plin' | 'otros'
  fecha: string
  estado: 'registrado' | 'confirmado'
}

export type TreatmentSession = {
  id: string
  numero: number
  piezas: string[]
  costo: number
  estado: 'pendiente' | 'completado'
  totalPagado: number
  pagos: BudgetPayment[]
}

export type BudgetItem = {
  tratamiento: string
  pieza: string
  costo: number
  sesionId: string
  estado: 'pendiente' | 'en_proceso' | 'completado'
}

export type Budget = {
  id: string
  pacienteId: string
  paciente: string
  fecha: string
  items: BudgetItem[]
  sesiones: TreatmentSession[]
  presupuestoTotal: number
  totalPagado: number
  estado: 'borrador' | 'enviado' | 'aceptado' | 'en-proceso' | 'completado'
  pagos: BudgetPayment[]
}

export type Payment = {
  id: string
  pacienteId: string
  paciente: string
  fecha: string
  monto: number
  metodo: 'Efectivo' | 'Tarjeta' | 'Yape' | 'Plin'
  concepto: string
  presupuestoId?: string
  budgetPaymentId?: string
}

export const payments: Payment[] = [
  { id: 'AB-501', pacienteId: 'P-001', paciente: 'María Elena Quispe', fecha: '2026-07-17', monto: 250, metodo: 'Yape', concepto: 'Abono endodoncia — sesión 2', presupuestoId: 'PR-001' },
  { id: 'AB-502', pacienteId: 'P-003', paciente: 'Rosa Flores Condori', fecha: '2026-07-17', monto: 120, metodo: 'Efectivo', concepto: 'Profilaxis dental — pago total', presupuestoId: 'PR-003' },
  { id: 'AB-503', pacienteId: 'P-002', paciente: 'Jorge Mamani Ticona', fecha: '2026-07-17', monto: 180, metodo: 'Tarjeta', concepto: 'Abono curación pieza 3.6', presupuestoId: 'PR-002' },
  { id: 'AB-504', pacienteId: 'P-005', paciente: 'Lucía Choque Apaza', fecha: '2026-07-17', monto: 100, metodo: 'Plin', concepto: 'Mensualidad ortodoncia — julio', presupuestoId: 'PR-005' },
  { id: 'AB-505', pacienteId: 'P-004', paciente: 'Carlos Vargas Paredes', fecha: '2026-07-17', monto: 400, metodo: 'Efectivo', concepto: 'Adelanto cambio de corona', presupuestoId: 'PR-004' },
  { id: 'AB-506', pacienteId: 'P-001', paciente: 'María Elena Quispe', fecha: '2026-07-14', monto: 300, metodo: 'Yape', concepto: 'Abono endodoncia — sesión 1', presupuestoId: 'PR-001' },
  { id: 'AB-507', pacienteId: 'P-004', paciente: 'Carlos Vargas Paredes', fecha: '2026-07-08', monto: 350, metodo: 'Tarjeta', concepto: 'Adelanto presupuesto general', presupuestoId: 'PR-004' },
]

export const budgets: Budget[] = [
  {
    id: 'PR-001',
    pacienteId: 'P-001',
    paciente: 'María Elena Quispe',
    fecha: '2026-07-14',
    items: [
      { tratamiento: 'Endodoncia', pieza: '1.1', costo: 700, sesionId: 'S-001-1', estado: 'en_proceso' },
      { tratamiento: 'Curación (resina)', pieza: '1.4', costo: 180, sesionId: 'S-001-2', estado: 'pendiente' },
      { tratamiento: 'Curación (resina)', pieza: '2.6', costo: 180, sesionId: 'S-001-2', estado: 'pendiente' },
      { tratamiento: 'Profilaxis', pieza: '—', costo: 120, sesionId: 'S-001-3', estado: 'completado' },
    ],
    sesiones: [
      {
        id: 'S-001-1',
        numero: 1,
        piezas: ['1.1'],
        costo: 700,
        estado: 'completado',
        totalPagado: 550,
        pagos: [
          { id: 'BP-001', budgetId: 'PR-001', sesionId: 'S-001-1', monto: 300, metodoPago: 'yape-plin', fecha: '2026-07-14', estado: 'confirmado' },
          { id: 'BP-002', budgetId: 'PR-001', sesionId: 'S-001-1', monto: 250, metodoPago: 'yape-plin', fecha: '2026-07-17', estado: 'confirmado' },
        ],
      },
      {
        id: 'S-001-2',
        numero: 2,
        piezas: ['1.4', '2.6'],
        costo: 360,
        estado: 'pendiente',
        totalPagado: 0,
        pagos: [],
      },
      {
        id: 'S-001-3',
        numero: 3,
        piezas: [],
        costo: 120,
        estado: 'completado',
        totalPagado: 120,
        pagos: [{ id: 'BP-003', budgetId: 'PR-001', sesionId: 'S-001-3', monto: 120, metodoPago: 'efectivo', fecha: '2026-07-02', estado: 'confirmado' }],
      },
    ],
    presupuestoTotal: 1180,
    totalPagado: 670,
    estado: 'en-proceso',
    pagos: [
      { id: 'BP-001', budgetId: 'PR-001', sesionId: 'S-001-1', monto: 300, metodoPago: 'yape-plin', fecha: '2026-07-14', estado: 'confirmado' },
      { id: 'BP-002', budgetId: 'PR-001', sesionId: 'S-001-1', monto: 250, metodoPago: 'yape-plin', fecha: '2026-07-17', estado: 'confirmado' },
      { id: 'BP-003', budgetId: 'PR-001', sesionId: 'S-001-3', monto: 120, metodoPago: 'efectivo', fecha: '2026-07-02', estado: 'confirmado' },
    ],
  },
  {
    id: 'PR-002',
    pacienteId: 'P-002',
    paciente: 'Jorge Mamani Ticona',
    fecha: '2026-07-10',
    items: [
      { tratamiento: 'Curación (resina)', pieza: '3.6', costo: 180, sesionId: 'S-002-1', estado: 'en_proceso' },
      { tratamiento: 'Curación (resina)', pieza: '3.7', costo: 180, sesionId: 'S-002-2', estado: 'pendiente' },
      { tratamiento: 'Extracción simple', pieza: '4.8', costo: 140, sesionId: 'S-002-2', estado: 'pendiente' },
    ],
    sesiones: [
      {
        id: 'S-002-1',
        numero: 1,
        piezas: ['3.6'],
        costo: 180,
        estado: 'completado',
        totalPagado: 180,
        pagos: [{ id: 'BP-004', budgetId: 'PR-002', sesionId: 'S-002-1', monto: 180, metodoPago: 'otros', fecha: '2026-07-17', estado: 'confirmado' }],
      },
      {
        id: 'S-002-2',
        numero: 2,
        piezas: ['3.7', '4.8'],
        costo: 320,
        estado: 'pendiente',
        totalPagado: 0,
        pagos: [],
      },
    ],
    presupuestoTotal: 500,
    totalPagado: 180,
    estado: 'en-proceso',
    pagos: [{ id: 'BP-004', budgetId: 'PR-002', sesionId: 'S-002-1', monto: 180, metodoPago: 'otros', fecha: '2026-07-17', estado: 'confirmado' }],
  },
]

export type Expense = {
  id: string
  concepto: string
  categoria: 'fijo' | 'variable' | 'laboratorio'
  monto: number
  fecha: string
}

export const expenses: Expense[] = [
  { id: 'G-01', concepto: 'Alquiler del local', categoria: 'fijo', monto: 2200, fecha: '2026-07-01' },
  { id: 'G-02', concepto: 'Luz y agua', categoria: 'fijo', monto: 380, fecha: '2026-07-05' },
  { id: 'G-03', concepto: 'Materiales dentales', categoria: 'variable', monto: 1450, fecha: '2026-07-06' },
  { id: 'G-04', concepto: 'Honorarios técnico dental — coronas', categoria: 'laboratorio', monto: 900, fecha: '2026-07-12' },
  { id: 'G-05', concepto: 'Insumos de bioseguridad', categoria: 'variable', monto: 320, fecha: '2026-07-09' },
]

export const monthlyRevenue = [
  { mes: 'Feb', ingresos: 14200, costos: 8900 },
  { mes: 'Mar', ingresos: 16800, costos: 9400 },
  { mes: 'Abr', ingresos: 15300, costos: 9100 },
  { mes: 'May', ingresos: 18900, costos: 10200 },
  { mes: 'Jun', ingresos: 21400, costos: 11000 },
  { mes: 'Jul', ingresos: 17650, costos: 9800 },
]

export const treatmentDistribution = [
  { tratamiento: 'Curaciones', cantidad: 42 },
  { tratamiento: 'Profilaxis', cantidad: 31 },
  { tratamiento: 'Endodoncias', cantidad: 12 },
  { tratamiento: 'Extracciones', cantidad: 15 },
  { tratamiento: 'Coronas', cantidad: 8 },
  { tratamiento: 'Ortodoncia', cantidad: 22 },
]

// Odontograma — estados por pieza dental (nomenclatura FDI / MINSA)
export type ToothCondition =
  | 'sano'
  | 'caries'
  | 'curacion'
  | 'endodoncia'
  | 'extraccion'
  | 'corona'
  | 'ausente'
  | 'implante'
  | 'sellante'
  | 'fractura'

export const toothConditionLabels: Record<ToothCondition, string> = {
  sano: 'Sano',
  caries: 'Caries',
  curacion: 'Curación / Resina',
  endodoncia: 'Endodoncia',
  extraccion: 'Indicado p/ extracción',
  corona: 'Corona',
  ausente: 'Pieza ausente',
  implante: 'Implante',
  sellante: 'Sellante',
  fractura: 'Fractura',
}

// Cuadrantes FDI: 1 (sup. der.), 2 (sup. izq.), 3 (inf. izq.), 4 (inf. der.)
export const upperRight = [18, 17, 16, 15, 14, 13, 12, 11]
export const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
export const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38]
export const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41]

export const initialToothStates: Record<number, ToothCondition> = {
  11: 'endodoncia',
  14: 'caries',
  16: 'curacion',
  25: 'corona',
  26: 'caries',
  36: 'caries',
  37: 'caries',
  38: 'ausente',
  46: 'curacion',
  48: 'extraccion',
}

// Tipos para Odontograma V2 (con símbolos y leyenda)
export type ToothSymbol = 'amalgama' | 'ausente' | 'caries' | 'corona' | 'extraccion' | 'endodoncia' | 'retenido' | 'implante'

export type ToothFindingV2 = {
  toothId: string
  simbolos: { tipo: ToothSymbol; color: string }[]
  observaciones: string
  tratamientoSugerido?: string
}

export type OdontogramV2Finding = Record<string, ToothFindingV2>

// Tipos para Odontograma V3 (por superficies)
export type Surface = 'oclusal' | 'bucal' | 'lingual' | 'mesial' | 'distal'
export type SurfaceCondition = 'normal' | 'caries' | 'restauracion' | 'desgaste' | 'mancha'

export type ToothFindingV3 = {
  toothId: string
  superficies: Record<Surface, { condicion: SurfaceCondition; observacion?: string }>
  diagnostico?: string
  tratamientoSugerido?: string
}

export type OdontogramV3Finding = Record<string, ToothFindingV3>

export const clinicalHistory = [
  {
    fecha: '2026-07-14',
    doctor: 'Dra. Salas',
    procedimiento: 'Endodoncia pieza 1.1 — Sesión 1',
    notas: 'Se realizó apertura cameral y conductometría. Paciente tolera bien el procedimiento con anestesia local sin vasoconstrictor por sospecha de embarazo. Próxima sesión: obturación de conductos.',
  },
  {
    fecha: '2026-07-02',
    doctor: 'Dra. Salas',
    procedimiento: 'Profilaxis y destartraje',
    notas: 'Limpieza profunda supragingival. Se indica técnica de cepillado y uso de hilo dental. Encías con gingivitis leve en sector anteroinferior.',
  },
  {
    fecha: '2026-06-18',
    doctor: 'Dr. Rivera',
    procedimiento: 'Evaluación integral y odontograma',
    notas: 'Primera consulta. Se registra odontograma inicial: caries en piezas 1.4 y 2.6, pieza 1.1 con necrosis pulpar. Se genera presupuesto general PR-001.',
  },
]

export const formatSoles = (n: number) =>
  `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
