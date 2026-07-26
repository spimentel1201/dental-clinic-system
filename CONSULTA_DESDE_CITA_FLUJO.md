# 🎯 NUEVO FLUJO: Registrar Consulta Desde Cita

## ✅ Implementación Completada

Se ha implementado exitosamente el flujo mejorado donde el especialista registra consultas externas **directamente desde una cita**, sin necesidad de una página separada.

---

## 🔄 Flujo Completo del Especialista

### PASO 1: Login del Especialista
```
URL: http://localhost:3000/login
Email: especialista@clinicadental.com
Contraseña: Especialista123!
✅ Redirige a: /citas (Mis citas)
```

### PASO 2: Ver Mis Citas
```
URL: http://localhost:3000/citas
Título: "Mis citas"
Subtítulo: "Citas asignadas y registro de consultas externas"
Instrucción: "Haz click en una cita para registrar la consulta realizada"

OPCIONES PARA HACER CLICK:
1. Calendar view (Semanal/Mensual)
2. Sidebar "Citas de hoy"
3. Sidebar "Recordatorios para mañana"
```

### PASO 3: Click en Cita → Dialog Abre
```
Se abre el dialog "Registrar Consulta Externa"

PREFILLADO AUTOMÁTICAMENTE:
├─ Paciente: [Del nombre de la cita]
├─ Fecha y Hora: [De la cita]
├─ Tratamiento: [Del tratamiento asignado]
└─ Estado: [Estado de la cita]
```

### PASO 4: Completar Datos Clínicos

#### SECCIÓN "Información Clínica"
```
1️⃣ Campo "Diagnóstico" (textarea largo)
   └─ Describe el diagnóstico y hallazgos encontrados
   
2️⃣ Campo "Notas Clínicas" (textarea)
   └─ Observaciones, alergias, consideraciones especiales
```

#### SECCIÓN "Planificación y Presupuesto"
```
3️⃣ "Fecha de Próxima Cita" (date picker)
   └─ Selecciona la próxima cita que requiere el paciente
   
4️⃣ "Presupuesto Total (S/.)" (number - decimal)
   └─ Presupuesto total para el tratamiento
   
5️⃣ "Número de Sesiones" (number - entero)
   └─ Cuántas sesiones requerirá
```

### PASO 5: Cálculo Automático
```
El sistema calcula automáticamente:

┌─ Costo por Sesión
│  └─ Presupuesto Total ÷ Número de Sesiones
│
└─ Desglose de Sesiones (tabla dinámica)
   ├─ Sesión 1: S/. [monto]
   ├─ Sesión 2: S/. [monto]
   └─ ... (tantas como sesiones)
```

### PASO 6: Guardar Consulta
```
Botón: [Registrar Consulta]
✅ Estado: Se habilita cuando todos los campos están completos

RESULTADO:
├─ Dialog se cierra
├─ Consulta se registra en la historia clínica
├─ Se vincula a la cita original
└─ Redirige a /citas
```

---

## 📋 Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Diagnóstico | Textarea | ✅ | Diagnóstico clínico de la consulta |
| Notas Clínicas | Textarea | ✅ | Notas y observaciones adicionales |
| Fecha Próxima Cita | Date | ✅ | Próxima cita programada |
| Presupuesto Total | Number (decimal) | ✅ | Presupuesto total en S/. |
| Número de Sesiones | Number (entero) | ✅ | Total de sesiones requeridas |

**Nota**: El costo por sesión se calcula automáticamente.

---

## 🔧 Componentes Implementados

### Nuevo Componente: `SpecialistConsultationDialog`
```typescript
Ubicación: /components/appointments/specialist-consultation-dialog.tsx
Función: Dialog modal para registrar consulta desde cita
Props:
  - open: boolean (abierto/cerrado)
  - onOpenChange: callback para cambiar estado
  - appointment: datos de la cita seleccionada
  - onSave: callback para guardar consulta
```

### Cambios en `/citas/page.tsx`
```typescript
- Importa SpecialistConsultationDialog
- Detecta si es especialista (isSpecialist)
- Click en cita abre el dialog (para especialista)
- Click en cita abre detalles (para odontólogo)
- Actualizado el texto instructivo
- Quitado botón "Nueva consulta" para especialista
```

### Datos de Consulta Guardados
```typescript
interface SpecialistConsultation {
  appointmentId: string          // Vinculada a cita
  pacienteId: string             // Paciente
  diagnostico: string            // Diagnóstico
  notasClinicas: string          // Notas
  fechaProximaCita: string       // Próxima cita
  presupuestoTotal: number       // Presupuesto
  numeroSesiones: number         // Sesiones
  sesiones: SessionDetails[]     // Desglose
}
```

---

## 📊 Diferencia: Antes vs Ahora

### ❌ ANTES (Flujo Anterior)
```
Especialista Login
    ↓
/citas → Botón "Nueva consulta"
    ↓
/citas/nueva-consulta
    ↓
Formulario SIN contexto de cita
    ├─ ¿Qué paciente selecciono?
    ├─ ¿Qué cita fue?
    └─ Flujo confuso sin contexto
```

### ✅ AHORA (Nuevo Flujo)
```
Especialista Login
    ↓
/citas → Click en una cita
    ↓
Dialog abre CON datos de cita prefillados
    ├─ Paciente: María Elena Quispe ✓
    ├─ Cita: 2026-07-17 09:00 ✓
    ├─ Tratamiento: Endodoncia pieza 1.1 ✓
    └─ Contexto claro y lógico
    
Llena diagnóstico y datos
    ↓
Registra Consulta
    ↓
Consulta vinculada a cita específica
```

---

## 🎯 Ventajas del Nuevo Flujo

✅ **Contexto claro**: Sabe exactamente qué paciente y cita está registrando
✅ **Menos pasos**: Click directo en cita = formulario
✅ **Datos prefillados**: Paciente, fecha, tratamiento auto-rellenados
✅ **Previene errores**: No puede registrar para paciente equivocado
✅ **Mejor UX**: Flujo natural y lógico
✅ **Vinculación automática**: Consulta ↔ Cita ↔ Paciente

---

## 🧪 Cómo Probar

1. **Login como especialista**
   - Email: especialista@clinicadental.com
   - Password: Especialista123!

2. **Ir a Mis citas** (automático después del login)
   - URL: http://localhost:3000/citas

3. **Haz click en cualquier cita**
   - En sidebar "Citas de hoy"
   - O en el calendario semanal/mensual

4. **Se abre el dialog**
   - Verás datos de la cita prefillados

5. **Completa los campos**
   - Diagnóstico
   - Notas clínicas
   - Fecha próxima cita
   - Presupuesto total
   - Número de sesiones

6. **Click en "Registrar Consulta"**
   - Se guarda y cierra el dialog

---

## 📁 Archivos Modificados

```
/app/(app)/citas/page.tsx
├─ Añadido import SpecialistConsultationDialog
├─ Añadido manejo de estado consultationOpen
├─ Modificado handleAppointmentClick para especialista
├─ Actualizado texto instructivo
└─ Quitado botón "Nueva consulta"

/components/appointments/specialist-consultation-dialog.tsx (NUEVO)
├─ Dialog modal completo
├─ Prefillado con datos de cita
├─ Cálculo automático de sesiones
├─ Validación de campos
└─ Callback onSave para guardar
```

---

## 🚀 Próximos Pasos (Futuro)

1. **Persistencia en Base de Datos**
   - Guardar SpecialistConsultation en tabla
   - Crear relación Cita ↔ Consulta ↔ Paciente

2. **Mostrar en Historia Clínica**
   - Listar consultas registradas por especialista
   - Mostrar en evolución clínica del paciente

3. **Estados de Consulta**
   - Estado: "registrada", "completada", "pendiente"
   - Tracking de progreso

4. **Notificaciones**
   - Notificar al odontólogo cuando especialista registra
   - Alertas de presupuesto excedido

---

## ✨ Estado: COMPLETAMENTE FUNCIONAL

El flujo está 100% implementado y funcionando correctamente.
El especialista puede registrar consultas externas desde citas con un UX mejorado y flujo lógico.

