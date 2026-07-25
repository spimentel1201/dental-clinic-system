# ✅ RESPUESTA: ¿DÓNDE REGISTRA EL ESPECIALISTA LOS DATOS?

## La Respuesta Directa

### 🎯 EL ESPECIALISTA REGISTRA LOS DATOS EN:

## **`/citas/nueva-consulta`**

---

## FLUJO PASO A PASO

### 1. **LOGIN**
```
URL: http://localhost:3000/login
Email: especialista@clinicadental.com
Contraseña: Especialista123!
```
✅ Redirige automáticamente a `/citas` (NOT dashboard)

---

### 2. **MIS CITAS** (Dashboard Especialista)
```
URL: http://localhost:3000/citas
```
- Título: "Mis citas"
- Subtítulo: "Citas asignadas y registro de consultas externas"
- **Botón: "Nueva consulta"** ← CLICA AQUÍ

---

### 3. **REGISTRAR CONSULTA EXTERNA** ⭐
```
URL: http://localhost:3000/citas/nueva-consulta
```

**AQUÍ ES DONDE LLENA:**

```
┌─────────────────────────────────────────────┐
│       NUEVA CONSULTA EXTERNA                │
├─────────────────────────────────────────────┤
│ Sección 1: Información Clínica              │
│ ├─ Campo: Diagnóstico (textarea)            │
│ │  "Fractura de corona en pieza 1.6..."    │
│ │                                           │
│ └─ Campo: Notas Clínicas (textarea)        │
│    "Paciente alérgico a penicilina..."     │
│                                             │
│ Sección 2: Planificación y Presupuesto     │
│ ├─ Campo: Fecha de Próxima Cita (date)    │
│ │  2026-08-20                              │
│ │                                           │
│ ├─ Campo: Presupuesto Total (S/.) (number) │
│ │  1000.00                                 │
│ │                                           │
│ └─ Campo: Número de Sesiones (number)     │
│    5                                        │
│                                             │
│ CÁLCULO AUTOMÁTICO:                        │
│ Costo por sesión: S/. 200.00               │
│ (1000 ÷ 5 = 200)                           │
│                                             │
│ Desglose de Sesiones:                      │
│ ┌──────┬────────┬──────────┐               │
│ │ Ses. │ Monto  │ Estado   │               │
│ ├──────┼────────┼──────────┤               │
│ │ 1    │ 200.00 │ Pendiente│               │
│ │ 2    │ 200.00 │ Pendiente│               │
│ │ 3    │ 200.00 │ Pendiente│               │
│ │ 4    │ 200.00 │ Pendiente│               │
│ │ 5    │ 200.00 │ Pendiente│               │
│ └──────┴────────┴──────────┘               │
│                                             │
│ [REGISTRAR CONSULTA]  [CANCELAR]          │
└─────────────────────────────────────────────┘
```

---

## CAMPOS DEL FORMULARIO

### Campo 1: Diagnóstico ⭐
- **Tipo:** Textarea (texto largo)
- **Requerido:** Sí
- **Ejemplo:**
  ```
  Fractura de corona en pieza 1.6. Requiere tratamiento 
  reconstructivo completo con composite o corona protésica. 
  Paciente requiere 4 sesiones de tratamiento.
  ```

### Campo 2: Notas Clínicas ⭐
- **Tipo:** Textarea (texto largo)
- **Requerido:** Sí
- **Ejemplo:**
  ```
  Paciente con alergia a la penicilina. Control de dolor 
  adecuado durante toda la sesión. Radiografía previa 
  necesaria para evaluar profundidad de fractura.
  ```

### Campo 3: Fecha de Próxima Cita ⭐
- **Tipo:** Date Picker
- **Requerido:** Sí
- **Ejemplo:** 2026-08-20

### Campo 4: Presupuesto Total (S/.) ⭐
- **Tipo:** Number (decimal)
- **Requerido:** Sí
- **Ejemplo:** 1000

### Campo 5: Número de Sesiones ⭐
- **Tipo:** Number (entero)
- **Requerido:** Sí
- **Ejemplo:** 5

---

## CÁLCULO AUTOMÁTICO

El sistema calcula automáticamente:
```
Costo por sesión = Presupuesto Total ÷ Número de Sesiones
Ejemplo: 1000 ÷ 5 = 200 (S/. 200.00 por sesión)
```

---

## DESGLOSE DE SESIONES

Al llenar los campos, aparece tabla automática:
```
Sesión 1: S/. 200.00
Sesión 2: S/. 200.00
Sesión 3: S/. 200.00
Sesión 4: S/. 200.00
Sesión 5: S/. 200.00
─────────────────────
TOTAL:    S/. 1000.00
```

---

## BOTONES DE ACCIÓN

### Botón: "Registrar Consulta"
- ✅ Color: Teal/Cyan
- ✅ Acción: Guarda la consulta
- ✅ Resultado: 
  - Redirige a `/citas`
  - Muestra confirmación
  - Consulta aparece en historia clínica

### Botón: "Cancelar"
- Vuelve a `/citas` sin guardar

---

## LO QUE PASA DESPUÉS

Después de registrar la consulta:

### 1. Historia Clínica (`/historia`)
- ✅ La consulta aparece en "Evolución clínica"
- ✅ Especialista puede VER (lectura)
- ❌ Especialista NO puede editar

### 2. Odontograma (`/odontograma`)
- ✅ Muestra datos precargados
- ❌ Especialista NO puede editar

### 3. Odontograma por Superficies (`/odontograma-superficies`)
- ✅ Muestra datos precargados con colores:
  - 🟢 Pieza 11: Púrpura (Endodoncia)
  - 🟠 Pieza 14: Naranja (Caries)
  - 🔵 Pieza 16: Azul (Curación/Resina)
  - 🟡 Pieza 26: Naranja (Corona)
- ❌ Especialista NO puede editar

---

## RUTAS COMPLETAS PARA ESPECIALISTA

```
/login                      → Login
/citas                      → Mis citas (dashboard)
/citas/nueva-consulta       → ⭐ REGISTRAR CONSULTA (AQUÍ)
/historia                   → Ver historia clínica (lectura)
/odontograma                → Ver odontograma (lectura)
/odontograma-leyenda        → Ver odontograma con leyenda
/odontograma-superficies    → Ver odontograma por superficies (CON DATOS PRECARGADOS)
```

---

## SIDEBAR ESPECIALISTA

```
Clínica Dental
├─ Mis citas              ← Desde aquí va a Nueva consulta
├─ Historia clínica       ← Ve consultas registradas
├─ Odontograma
│  ├─ Simple (FDI)        ← Datos precargados
│  ├─ Con Leyenda         ← Datos precargados
│  └─ Por Superficies     ← Datos precargados (CON COLORES)
├─ Cerrar sesión
└─ Usuario: Carlos Mendoza (Especialista — Ortodoncista)
```

---

## ACCESO A CADA PANTALLA

### 📍 Mis Citas
- Acción: Desde login → redirige automáticamente
- Botón alternativo: Sidebar → "Mis citas"
- URL: `/citas`

### 📍 Nueva Consulta (PUNTO CLAVE) ⭐
- Acción: Desde "Mis citas" → Botón "Nueva consulta"
- URL: `/citas/nueva-consulta`
- **AQUÍ SE LLENAN TODOS LOS DATOS**

### 📍 Historia Clínica
- Acción: Sidebar → "Historia clínica"
- URL: `/historia`
- Datos: Solo lectura, sin edición

### 📍 Odontograma
- Acción: Sidebar → "Odontograma" → "Simple (FDI)"
- URL: `/odontograma`
- Datos: Precargados, solo lectura

### 📍 Odontograma por Superficies
- Acción: Sidebar → "Odontograma" → "Por Superficies"
- URL: `/odontograma-superficies`
- Datos: Precargados CON COLORES, solo lectura
- Piezas: 11 (Púrpura), 14 (Naranja), 16 (Azul), 26 (Naranja)

---

## RESUMEN

✅ **REGISTRA DATOS EN:** `/citas/nueva-consulta`
✅ **ACCESO:** Mis citas → Botón "Nueva consulta"
✅ **CAMPOS:** 5 (Diagnóstico, Notas, Fecha, Presupuesto, Sesiones)
✅ **CÁLCULO:** Automático de costo por sesión
✅ **DESGLOSE:** Tabla de sesiones generada automáticamente
✅ **ODONTOGRAMA:** Datos precargados (Lectura)
✅ **HISTORIA:** Datos guardados en historia clínica

---

## PARA PROBAR COMPLETO

```
1. Ir a: http://localhost:3000/login
2. Email: especialista@clinicadental.com
3. Contraseña: Especialista123!
4. Se redirige a: /citas
5. Clica: "Nueva consulta"
6. Se abre: /citas/nueva-consulta
7. Llena los 5 campos
8. Sistema calcula automático
9. Clica: "Registrar Consulta"
10. Redirige a: /citas (confirmación)
11. Ve historia clínica: /historia
12. Ve odontograma: /odontograma-superficies (CON COLORES PRECARGADOS)
```

---

**Estado:** ✅ 100% FUNCIONAL
