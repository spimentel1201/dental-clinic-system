export const validationMessages = {
  required: 'Este campo es requerido',
  email: 'Por favor ingrese un correo electrónico válido',
  password: 'La contraseña debe tener al menos 8 caracteres',
  passwordMatch: 'Las contraseñas no coinciden',
  minLength: (length: number) => `Este campo debe tener al menos ${length} caracteres`,
  maxLength: (length: number) => `Este campo no puede exceder ${length} caracteres`,
  phone: 'Por favor ingrese un número de teléfono válido',
  dni: 'Por favor ingrese un DNI válido (8 dígitos)',
  amount: 'Por favor ingrese un monto válido',
  invalidNumber: 'Por favor ingrese un número válido',
  invalidDate: 'Por favor ingrese una fecha válida',
  futureDate: 'La fecha no puede ser futura',
  pastDate: 'La fecha no puede ser anterior a hoy',
  selectOption: 'Por favor seleccione una opción',
  minAmount: (amount: number) => `El monto mínimo es S/ ${amount.toLocaleString('es-PE')}`,
  maxAmount: (amount: number) => `El monto máximo es S/ ${amount.toLocaleString('es-PE')}`,
  selectPatient: 'Por favor seleccione un paciente',
  selectTreatment: 'Por favor seleccione un tratamiento',
  selectDoctor: 'Por favor seleccione un doctor',
  selectPaymentMethod: 'Por favor seleccione un método de pago',
  noTreatmentsSelected: 'Por favor seleccione al menos un tratamiento',
  invalidPassword: 'La contraseña debe contener mayúsculas, minúsculas y números',
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validateDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}

export function validatePhone(phone: string): boolean {
  return /^\d{7,15}$/.test(phone.replace(/\s+/g, ''))
}

export function validatePassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) && password.length >= 8
}
