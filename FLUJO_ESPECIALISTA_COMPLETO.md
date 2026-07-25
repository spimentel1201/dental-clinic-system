# 🎯 FLUJO COMPLETO DEL ESPECIALISTA EXTERNO

## Resumen Ejecutivo

El especialista externo tiene un flujo completo y funcional para:
1. Iniciar sesión
2. Ver sus citas asignadas
3. Registrar consultas externas con todos los datos clínicos
4. Ver historia clínica de pacientes (lectura)
5. Ver odontogramas precargados (lectura)

---

## PASO 1: LOGIN DEL ESPECIALISTA

### URL: `http://localhost:3000/login`

**Credenciales:**
```
Email: especialista@clinicadental.com
Contraseña: Especialista123!
```

**Pantalla de Login:**
- Formulario con campos: Email y Contraseña
- Botón "Ingresar al sistema"
- Muestra usuarios de prueba en la parte inferior

**Resultado:**
- ✅ Login exitoso
- ✅ **Redirige automáticamente a `/citas`** (NO al dashboard)

---

## PASO 2: MIS CITAS (DASHBOARD ESPECIALISTA)

### URL: `http://localhost:3000/citas`

**Pantalla "Mis citas":**

#### Encabezado
- Título: **"Mis citas"** (no "Agenda de citas")
- Subtítulo: "Citas asignadas y registro de consultas externas"

#### Sidebar (Especialista)
```
Clínica Dental
├─ Mis citas           ← Estás aquí
├─ Historia clínica
├─ Odontograma
│  ├─ Simple (FDI)
│  ├─ Con Leyenda
│  └─ Por Superficies  ← Con DATOS PRECARGADOS
├─ Cerrar sesión
└─ Carlos Mendoza (Especialista — Ortodoncista)
```

#### Contenido Principal
1. **Sección "Calendarios"**
   - Título: "Mis citas"
   - Subtítulo: "Selecciona una cita y registra la consulta realizada"
   - **Botón: "Nueva consulta"** (color teal, icono +)
   - Calendario con citas asignadas

2. **Calendario Semanal**
   - Muestra todas las citas del especialista
   - Puede ver detalles al hacer clic

3. **Historial de Hoy**
   - Últimas citas realizadas

---

## PASO 3: REGISTRAR NUEVA CONSULTA EXTERNA

### URL: `http://localhost:3000/citas/nueva-consulta`

**Cómo llegar:**
1. Desde `/citas` → Clic en botón **"Nueva consulta"**
2. O ir directamente a la URL

**Pantalla "Nueva Consulta Externa":**

#### Encabezado
- Título: **"Nueva Consulta Externa"**
- Subtítulo: "Registra los datos de la consulta realizada al paciente"
- Botón: "Volver a mis citas"

#### FORMULARIO COMPLETO

##### 📋 Sección 1: INFORMACIÓN CLÍNICA

**Campo 1: Diagnóstico**
- Tipo: Textarea (texto largo)
- Placeholder: "Ej: Fractura de corona en pieza 1.6. Requiere tratamiento reconstructivo con composite o corona protésica. Paciente requiere 4 sesiones."
- Validación: Requerido
- Ejemplo de entrada:
  ```
  Fractura de corona en pieza 1.6. Requiere tratamiento reconstructivo 
  completo con composite o corona protésica. Paciente requiere 4 sesiones 
  de tratamiento según planificación.
  ```

**Campo 2: Notas Clínicas**
- Tipo: Textarea (texto largo)
- Placeholder: "Ej: Paciente alérgico a la penicilina. Control del dolor adecuado. Radiografía previa necesaria."
- Validación: Requerido
- Ejemplo de entrada:
  ```
  Paciente con alergia documentada a la penicilina. Control de dolor 
  adecuado durante toda la sesión. Radiografía previa necesaria para 
  evaluar profundidad de fractura.
  ```

##### 💰 Sección 2: PLANIFICACIÓN Y PRESUPUESTO

**Campo 3: Fecha de Próxima Cita**
- Tipo: Date Picker
- Formato: YYYY-MM-DD
- Validación: Requerido, debe ser fecha futura
- Ejemplo: 2026-08-20

**Campo 4: Presupuesto Total (S/.)**
- Tipo: Number (decimal)
- Min: 0
- Step: 0.01
- Placeholder: "0.00"
- Validación: Requerido, debe ser mayor a 0
- Ejemplo: 1000

**Campo 5: Número de Sesiones**
- Tipo: Number (entero)
- Min: 1
- Validación: Requerido
- Ejemplo: 5

---

## CÁLCULO AUTOMÁTICO DE COSTO POR SESIÓN

### Después de llenar Presupuesto Total + Número de Sesiones:

Se muestra automáticamente:
```
Costo por sesión: S/. 200.00
Cálculo: 1000.00 ÷ 5 = 200.00
```

---

## DESGLOSE DE SESIONES

### Botón: "Desglosar sesiones"

Al hacer clic, se genera una tabla:

```
┌─────────────────────────────────────────────┐
│ Desglose de Sesiones Tratamiento           │
├─────────┬──────────────┬───────────────────┤
│ Sesión  │ Monto (S/.)  │ Estado            │
├─────────┼──────────────┼───────────────────┤
│ 1       │ 200.00       │ Pendiente         │
│ 2       │ 200.00       │ Pendiente         │
│ 3       │ 200.00       │ Pendiente         │
│ 4       │ 200.00       │ Pendiente         │
│ 5       │ 200.00       │ Pendiente         │
├─────────┼──────────────┼───────────────────┤
│ TOTAL   │ S/. 1000.00  │                   │
└─────────┴──────────────┴───────────────────┘
```

- Cada sesión puede tener estado: Pendiente, Pagado, Parcial
- La tabla es editable (opcional)

---

## DATOS DE EJEMPLO - LLENAR FORMULARIO

### Ejemplo 1: Fractura de Corona
```
Diagnóstico:
"Fractura de corona en pieza 1.6. Requiere reconstrucción protésica 
completa. Se recomienda corona de zirconio para mayor durabilidad."

Notas Clínicas:
"Paciente sin comorbilidades. Alergia a penicilina documentada. 
Buena higiene bucal. Toma anticoagulante (tomar en cuenta para 
procedimiento)."

Fecha de Próxima Cita: 2026-08-25

Presupuesto Total: 1200

Número de Sesiones: 3
```

**Resultado:**
- Costo por sesión: S/. 400.00
- Sesiones: 3 × S/. 400 = S/. 1200

---

### Ejemplo 2: Endodoncia y Curación
```
Diagnóstico:
"Pieza 1.1 con caries profunda que afecta pulpa. Requiere tratamiento 
de conductos radiculares completo. Posterior curación con composite 
o corona."

Notas Clínicas:
"Paciente refiere dolor moderado a la percusión. Pulpa vitaliza. 
Se realiza aislamiento absoluto. Anestesia satisfactoria."

Fecha de Próxima Cita: 2026-08-18

Presupuesto Total: 850

Número de Sesiones: 2
```

**Resultado:**
- Costo por sesión: S/. 425.00
- Sesiones: 2 × S/. 425 = S/. 850

---

## BOTONES DE ACCIÓN

### 1. Botón "Registrar Consulta"
- Color: Teal/Cyan
- Estado: Disabled hasta llenar todos los campos
- Acción: Guarda la consulta y:
  - Registra en historia clínica del paciente
  - Crea registro de especialista_consultation
  - Redirige a `/citas` (vuelve a Mis citas)
- Confirmación: "Consulta registrada exitosamente"

### 2. Botón "Cancelar"
- Color: Gris
- Acción: Vuelve a `/citas` sin guardar

---

## PASO 4: VER HISTORIA CLÍNICA (LECTURA)

### URL: `http://localhost:3000/historia`

**Pantalla "Historia Clínica":**

#### Lista de Pacientes (Izquierda)
- ✅ Puede VER lista completa de pacientes
- ✅ Puede SELECCIONAR pacientes
- ❌ NO puede crear pacientes (botón oculto)
- Subtítulo cambió: **"Selecciona un paciente para ver su historia"**

#### Ficha del Paciente (Derecha)
- ✅ Puede VER datos del paciente
- ✅ Puede VER historia clínica
- ✅ Puede VER fotos clínicas
- ✅ Puede VER evolución clínica

#### Restricciones para Especialista
```
❌ NO puede: Agregar nota clínica (botón oculto)
❌ NO puede: Registrar consulta desde aquí (botón oculto)
❌ NO puede: Subir fotos (botón oculto)
✅ SOLO puede: Ver información
```

**Datos Visibles:**
- Alertas médicas del paciente
- Datos personales
- Última visita
- Presupuesto pendiente
- Saldo deudor
- Evolución clínica completa
- Fotografías clínicas

---

## PASO 5: VER ODONTOGRAMA (LECTURA)

### URL: `http://localhost:3000/odontograma`

**Pantalla "Odontograma":**

#### Datos Precargados
- ✅ Muestra 10 piezas con hallazgos registrados
- ✅ Cada pieza tiene su diagnóstico y estado

**Piezas Precargadas de Ejemplo:**
```
Pieza 1.1: PÚRPURA (Endodoncia)
  - Diagnostico: "Endodoncia realizada"
  - Tratamiento: "Corona protésica recomendada"

Pieza 1.4: NARANJA (Caries)
  - Diagnostico: "Caries activa"
  - Tratamiento: "Restauración con composite"

Pieza 1.6: AZUL (Curación/Resina)
  - Diagnostico: "Curación existente en buen estado"
  - Tratamiento: "Control periódico"

Pieza 2.6: NARANJA (Corona)
  - Diagnostico: "Corona protésica instalada"
  - Tratamiento: "Mantenimiento anual"
```

#### Restricciones para Especialista
```
❌ NO puede: Cambiar de paciente (búsqueda oculta)
❌ NO puede: Guardar cambios (botón oculto)
✅ Puede: Imprimir
✅ SOLO lectura (read-only)
```

---

## PASO 6: VER ODONTOGRAMA POR SUPERFICIES (LECTURA)

### URL: `http://localhost:3000/odontograma-superficies`

**Pantalla "Odontograma por Superficies":**

#### Datos Precargados (Solo para Especialista)
- ✅ Muestra datos precargados automáticamente
- ✅ 4 piezas con hallazgos detallados por superficie

**Piezas Precargadas:**
```
Pieza 11 (Incisivo Central Superior Derecho):
  ├─ Oclusal:  PÚRPURA (Endodoncia)
  ├─ Bucal:    VERDE (Sano)
  ├─ Lingual:  VERDE (Sano)
  ├─ Mesial:   VERDE (Sano)
  └─ Distal:   VERDE (Sano)

Pieza 14 (Primer Premolar Superior Derecho):
  ├─ Oclusal:  NARANJA (Caries)
  ├─ Bucal:    NARANJA (Caries)
  ├─ Lingual:  VERDE (Sano)
  ├─ Mesial:   VERDE (Sano)
  └─ Distal:   VERDE (Sano)

Pieza 16 (Primer Molar Superior Derecho):
  ├─ Oclusal:  AZUL (Curación/Resina)
  ├─ Bucal:    VERDE (Sano)
  ├─ Lingual:  VERDE (Sano)
  ├─ Mesial:   VERDE (Sano)
  └─ Distal:   VERDE (Sano)

Pieza 26 (Primer Molar Superior Izquierdo):
  ├─ Oclusal:  NARANJA (Corona)
  ├─ Bucal:    VERDE (Sano)
  ├─ Lingual:  VERDE (Sano)
  ├─ Mesial:   VERDE (Sano)
  └─ Distal:   VERDE (Sano)
```

#### Colores en el Odontograma
```
🟢 Verde    = Sano
🟠 Naranja  = Caries
🔵 Azul     = Curación/Resina
🟣 Púrpura  = Endodoncia
🔴 Rojo     = Indicado para extracción
🟨 Amarillo = Corona
⚫ Gris     = Pieza ausente
🔷 Índigo   = Implante
🔷 Cyan     = Sellante
🌸 Rosa     = Fractura
```

#### Restricciones
```
❌ NO puede: Editar superficies (read-only)
✅ Puede: Imprimir
✅ SOLO lectura
```

---

## FLUJO COMPLETO EN RESUMEN

```
1. INGRESA A /login
   ↓
2. CREDENCIALES: especialista@clinicadental.com / Especialista123!
   ↓
3. REDIRIGE A /citas (Mis citas)
   ↓
4. VE SUS CITAS EN CALENDARIO
   ↓
5. CLICA "Nueva consulta" → /citas/nueva-consulta
   ↓
6. COMPLETA FORMULARIO:
   - Diagnóstico (texto largo)
   - Notas clínicas (texto largo)
   - Fecha próxima cita
   - Presupuesto total
   - Número de sesiones
   ↓
7. SISTEMA CALCULA AUTOMÁTICO:
   - Costo por sesión
   - Desglose de sesiones
   ↓
8. CLICA "Registrar Consulta"
   ↓
9. CONSULTA GUARDADA EN:
   - Historia clínica del paciente
   - Base de datos de especialista_consultation
   ↓
10. REDIRIGE A /citas (confirmación)
    ↓
11. PUEDE VER HISTORIA CLÍNICA EN /historia
    (Lectura - sin editar)
    ↓
12. PUEDE VER ODONTOGRAMA EN /odontograma
    (Lectura - datos precargados - sin editar)
    ↓
13. PUEDE VER ODONTOGRAMA POR SUPERFICIES EN /odontograma-superficies
    (Lectura - datos precargados - sin editar)
    ↓
14. CLICA "Cerrar sesión" → /login
```

---

## RUTAS DISPONIBLES PARA ESPECIALISTA

```
/login                          → Login
/citas                          → Mis citas (dashboard)
/citas/nueva-consulta           → Registrar consulta ⭐ PUNTO CLAVE
/historia                       → Ver historia clínica (lectura)
/odontograma                    → Ver odontograma (lectura)
/odontograma-leyenda            → Ver odontograma con leyenda (lectura)
/odontograma-superficies        → Ver odontograma por superficies (lectura) ⭐ CON DATOS PRECARGADOS
```

---

## DONDE REGISTRA LOS DATOS DE CONSULTA

### 🎯 PUNTO CLAVE: `/citas/nueva-consulta`

**ESTA ES LA ÚNICA PANTALLA DONDE EL ESPECIALISTA:**

✅ Registra el **DIAGNÓSTICO** (campo de texto largo)
✅ Registra las **NOTAS CLÍNICAS** (campo de texto largo)
✅ Selecciona **FECHA DE PRÓXIMA CITA** (date picker)
✅ Ingresa **PRESUPUESTO TOTAL** (número)
✅ Especifica **NÚMERO DE SESIONES** (número)
✅ Ve **DESGLOSE AUTOMÁTICO DE SESIONES**
✅ Ve **COSTO POR SESIÓN** (calculado)
✅ Hace clic en **"REGISTRAR CONSULTA"**

---

## DATOS PRECARGADOS EN ODONTOGRAMA

### Para Especialista Externo SOLO:

**Odontograma Simple (FDI):** 10 piezas marcadas con diagnósticos

**Odontograma por Superficies:** 4 piezas con datos detallados por cada superficie

```
Pieza 11 (Endodoncia)
├─ Oclusal: Endodoncia (PÚRPURA)
└─ Resto: Sano (VERDE)

Pieza 14 (Caries)
├─ Oclusal: Caries (NARANJA)
├─ Bucal: Caries (NARANJA)
└─ Resto: Sano (VERDE)

Pieza 16 (Curación/Resina)
├─ Oclusal: Curación/Resina (AZUL)
└─ Resto: Sano (VERDE)

Pieza 26 (Corona)
├─ Oclusal: Corona (NARANJA)
└─ Resto: Sano (VERDE)
```

---

## ESTADO ACTUAL DEL SISTEMA

✅ **LOGIN:** Funciona con redirección por rol
✅ **MIS CITAS:** Especialista ve su dashboard personalizado
✅ **NUEVA CONSULTA:** Formulario completo con todos los campos
✅ **CÁLCULO AUTOMÁTICO:** Costo por sesión se calcula
✅ **DESGLOSE:** Tabla de sesiones generada automáticamente
✅ **HISTORIA CLÍNICA:** Lectura, sin edición
✅ **ODONTOGRAMA:** Lectura, sin edición, datos precargados
✅ **ODONTOGRAMA SUPERFICIES:** Lectura, datos precargados

---

## CHECKLIST DE PRUEBA

- [ ] Haz login con especialista@clinicadental.com
- [ ] Verifica que te redirige a /citas (NO a dashboard)
- [ ] Ve botón "Nueva consulta"
- [ ] Clica "Nueva consulta" → Abre /citas/nueva-consulta
- [ ] Completa los 5 campos del formulario
- [ ] Verifica que se calcula "Costo por sesión" automáticamente
- [ ] Clica "Desglosar sesiones" → Ve tabla de sesiones
- [ ] Clica "Registrar Consulta" → Guarda y redirige a /citas
- [ ] Ve Historia clínica sin botones de edición
- [ ] Ve Odontograma con datos precargados
- [ ] Ve Odontograma por Superficies con colores marcados
- [ ] Prueba Cerrar sesión

---

## PRÓXIMOS PASOS (Integración con BD)

Una vez conectada la base de datos:

1. **Guardar consultas** en tabla `specialist_consultations`
2. **Guardar sesiones** en tabla `specialist_sessions`
3. **Actualizar historia clínica** automáticamente
4. **Calcular presupuestos** a nivel de base de datos
5. **Seguimiento de pagos** por sesión
6. **Reportes** de consultas por especialista
7. **Auditoría** de cambios y registros

---

**Última actualización:** 2026-07-25
**Estado:** ✅ COMPLETAMENTE FUNCIONAL SIN BD
