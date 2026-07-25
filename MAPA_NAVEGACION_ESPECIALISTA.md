# 🗺️ MAPA DE NAVEGACIÓN - ESPECIALISTA EXTERNO

## DIAGRAMA DEL FLUJO COMPLETO

```
┌──────────────────────────────────────────────────────────────────────┐
│                           ESPECIALISTA                               │
│                                                                      │
│  1. INGRESA A LOGIN                                                 │
│     ↓                                                                │
│  ┌─────────────────────────────────────────┐                       │
│  │ URL: /login                             │                       │
│  │ Email: especialista@clinicadental.com   │                       │
│  │ Password: Especialista123!              │                       │
│  │ Botón: "Ingresar al sistema"            │                       │
│  └─────────────────────────────────────────┘                       │
│     ↓                                                                │
│  2. REDIRIGE A MIS CITAS (NO DASHBOARD)                           │
│     ↓                                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ URL: /citas                                                 │   │
│  │ Título: "Mis citas"                                         │   │
│  │ Subtítulo: "Citas asignadas y registro de consultas"       │   │
│  │                                                             │   │
│  │ Botón: [Nueva consulta]  ← CLICA AQUÍ                     │   │
│  │ Calendario: Citas asignadas                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│     ↓                                                                │
│  3. REGISTRA CONSULTA ⭐ PUNTO CLAVE                               │
│     ↓                                                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ URL: /citas/nueva-consulta                                   │  │
│  │ Título: "Nueva Consulta Externa"                             │  │
│  │                                                              │  │
│  │ FORMULARIO:                                                 │  │
│  │ ┌────────────────────────────────────────────────┐          │  │
│  │ │ 1️⃣  Diagnóstico (textarea largo)              │          │  │
│  │ │    "Fractura de corona en pieza 1.6..."       │          │  │
│  │ │                                                │          │  │
│  │ │ 2️⃣  Notas Clínicas (textarea largo)           │          │  │
│  │ │    "Paciente alérgico a penicilina..."        │          │  │
│  │ │                                                │          │  │
│  │ │ 3️⃣  Fecha de Próxima Cita (date)             │          │  │
│  │ │    2026-08-20                                 │          │  │
│  │ │                                                │          │  │
│  │ │ 4️⃣  Presupuesto Total (S/.) (number)         │          │  │
│  │ │    1000.00                                    │          │  │
│  │ │                                                │          │  │
│  │ │ 5️⃣  Número de Sesiones (number)              │          │  │
│  │ │    5                                           │          │  │
│  │ │                                                │          │  │
│  │ │ 💰 CÁLCULO AUTOMÁTICO:                        │          │  │
│  │ │    Costo por sesión: S/. 200.00               │          │  │
│  │ │    (1000 ÷ 5 = 200)                           │          │  │
│  │ │                                                │          │  │
│  │ │ 📊 DESGLOSE DE SESIONES:                      │          │  │
│  │ │    Sesión 1-5: S/. 200.00 c/u                 │          │  │
│  │ │    Total: S/. 1000.00                         │          │  │
│  │ │                                                │          │  │
│  │ │ [Registrar Consulta]  [Cancelar]              │          │  │
│  │ └────────────────────────────────────────────────┘          │  │
│  │                                                              │  │
│  │ 👉 TODOS LOS DATOS SE COMPLETAN AQUÍ 👈                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│     ↓                                                                │
│  4. DESPUÉS DE REGISTRAR (Redirige a /citas)                       │
│     ↓                                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Los datos ahora están guardados en:                         │   │
│  │                                                             │   │
│  │ ✅ Historia Clínica (/historia)                            │   │
│  │    ├─ Aparece en "Evolución clínica"                       │   │
│  │    ├─ Diagnóstico visible                                  │   │
│  │    ├─ Notas clínicas visible                               │   │
│  │    └─ Solo lectura (NO editar)                             │   │
│  │                                                             │   │
│  │ ✅ Odontograma (/odontograma)                              │   │
│  │    ├─ 10 piezas precargadas                                │   │
│  │    └─ Solo lectura (NO editar)                             │   │
│  │                                                             │   │
│  │ ✅ Odontograma por Superficies (/odontograma-superficies) │   │
│  │    ├─ Datos precargados con COLORES                        │   │
│  │    ├─ Pieza 11: PÚRPURA (Endodoncia)                      │   │
│  │    ├─ Pieza 14: NARANJA (Caries)                          │   │
│  │    ├─ Pieza 16: AZUL (Curación/Resina)                    │   │
│  │    ├─ Pieza 26: NARANJA (Corona)                          │   │
│  │    └─ Solo lectura (NO editar)                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## MENÚ LATERAL (SIDEBAR)

```
┌─────────────────────────────────────┐
│      Clínica Dental                 │
│      Mollendo, Arequipa             │
├─────────────────────────────────────┤
│                                     │
│  📋 Mis citas                       │
│     ↓ Desde aquí accedes a:         │
│        [Nueva consulta] botón       │
│                                     │
│  📄 Historia clínica                │
│     ↓ Ver datos guardados           │
│        (Solo lectura)               │
│                                     │
│  🦷 Odontograma                     │
│     ├─ Simple (FDI)                 │
│     ├─ Con Leyenda                  │
│     └─ Por Superficies ⭐           │
│        (CON DATOS PRECARGADOS)      │
│                                     │
├─────────────────────────────────────┤
│  🚪 Cerrar sesión                   │
│                                     │
│  👤 Carlos Mendoza                  │
│     Especialista — Ortodoncista     │
└─────────────────────────────────────┘
```

---

## FLUJO DE PANTALLAS DETALLADO

### Pantalla 1: LOGIN
```
┌────────────────────────────────────────┐
│            LOGIN                       │
├────────────────────────────────────────┤
│                                        │
│  Email: [especialista@...]            │
│  Contraseña: [••••••••]               │
│                                        │
│  [Ingresar al sistema]                │
│                                        │
│  USUARIOS DE PRUEBA:                  │
│  👨‍⚕️ Odontólogo (Admin)               │
│     admin@clinicadental.com           │
│     Admin123!                         │
│                                        │
│  👨‍🔬 Especialista Externo             │
│     especialista@clinicadental.com    │
│     Especialista123!                  │
│                                        │
└────────────────────────────────────────┘
URL: /login
```

↓ **LOGIN EXITOSO** ↓

### Pantalla 2: MIS CITAS (Dashboard Especialista)
```
┌──────────────────────────────────────────┐
│        Mis citas                         │
│ Citas asignadas y registro de consultas  │
├──────────────────────────────────────────┤
│                                          │
│  [Nueva consulta]  ← BOTÓN IMPORTANTE   │
│                                          │
│  📅 Calendario de Citas                 │
│  ├─ Lunes 14: Cita con María Elena      │
│  ├─ Martes 15: Cita con Jorge Luis      │
│  └─ Miércoles 16: Cita con Rosa         │
│                                          │
│  📊 Historial de Hoy                    │
│  ├─ 08:00 - María Elena Quispe          │
│  └─ 10:30 - Jorge Luis Mamani           │
│                                          │
└──────────────────────────────────────────┘
URL: /citas
```

↓ **CLICA "Nueva consulta"** ↓

### Pantalla 3: REGISTRAR CONSULTA EXTERNA ⭐
```
┌──────────────────────────────────────────────┐
│     Nueva Consulta Externa                   │
│ Registra los datos de la consulta realizada  │
├──────────────────────────────────────────────┤
│                                              │
│  📋 INFORMACIÓN CLÍNICA                     │
│  ┌──────────────────────────────────────┐  │
│  │ Diagnóstico:                         │  │
│  │ [Fractura de corona en pieza 1.6...] │  │
│  │ (textarea - texto largo)             │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ Notas Clínicas:                      │  │
│  │ [Paciente alérgico a penicilina...]  │  │
│  │ (textarea - texto largo)             │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  💰 PLANIFICACIÓN Y PRESUPUESTO            │
│  ┌──────────────────────────────────────┐  │
│  │ Fecha de Próxima Cita: [2026-08-20]  │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ Presupuesto Total (S/.): [1000.00]   │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ Número de Sesiones: [5]              │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  💡 AUTOMÁTICO:                            │
│  Costo por sesión: S/. 200.00              │
│  (1000 ÷ 5 = 200)                         │
│                                              │
│  📊 Desglose de Sesiones:                  │
│  ┌────┬────────┬──────────┐               │
│  │Ses.│ Monto  │ Estado   │               │
│  ├────┼────────┼──────────┤               │
│  │ 1  │ 200.00 │Pendiente │               │
│  │ 2  │ 200.00 │Pendiente │               │
│  │ 3  │ 200.00 │Pendiente │               │
│  │ 4  │ 200.00 │Pendiente │               │
│  │ 5  │ 200.00 │Pendiente │               │
│  └────┴────────┴──────────┘               │
│                                              │
│  [Registrar Consulta]  [Cancelar]         │
│                                              │
│  ℹ️ Esta información será registrada en    │
│     la historia clínica del paciente       │
│                                              │
└──────────────────────────────────────────────┘
URL: /citas/nueva-consulta
👈 AQUÍ SE LLENAN TODOS LOS DATOS DEL ESPECIALISTA 👈
```

↓ **CLICA "Registrar Consulta"** ↓

### Pantalla 4: HISTORIA CLÍNICA (Lectura)
```
┌──────────────────────────────────────────┐
│        Historia Clínica                  │
│ Ficha de paciente, antecedentes y        │
│ expedientes fotográfico                  │
├──────────────────────────────────────────┤
│                                          │
│  📋 PACIENTES (Lado Izquierdo)          │
│  ├─ María Elena Quispe  ← Seleccionado  │
│  ├─ Jorge Luis Mamani                   │
│  ├─ Rosa Angélica Flores                │
│  ├─ Carlos Alberto Vargas               │
│  └─ Lucia Fernanda Choque               │
│                                          │
│  👤 DATOS PACIENTE (Lado Derecho)       │
│  ├─ Nombre: María Elena Quispe Huamán   │
│  ├─ DNI: 45879123                       │
│  ├─ Edad: 34 años                       │
│  └─ Datos de contacto                   │
│                                          │
│  ⚠️ ALERTAS MÉDICAS                     │
│  ├─ Alergia: Alergia a la penicilina    │
│  └─ Embarazo: Sospecha de embarazo      │
│                                          │
│  📝 EVOLUCIÓN CLÍNICA ✅               │
│  ├─ Endodoncia pieza 1.1 — Dra. Salas  │
│  ├─ Profilaxis y destartraje             │
│  ├─ Evaluación integral y odontograma    │
│  │   └─ "Consulta registrada por        │
│  │      especialista Carlos Mendoza"    │
│  └─ (Solo lectura - NO editar)          │
│                                          │
│  📷 FOTOGRAFÍAS CLÍNICAS (Solo ver)    │
│  ├─ Vista frontal                       │
│  └─ Vista oclusal                       │
│                                          │
└──────────────────────────────────────────┘
URL: /historia
MODO: SOLO LECTURA (sin botones de edición)
```

### Pantalla 5: ODONTOGRAMA (Lectura)
```
┌──────────────────────────────────────────┐
│        Odontograma                       │
├──────────────────────────────────────────┤
│                                          │
│  [Imprimir]                             │
│  (Sin botón "Guardar" para especialista)│
│                                          │
│  Paciente: María Elena Quispe            │
│                                          │
│  🦷 10 PIEZAS CON DATOS PRECARGADOS    │
│  ├─ Pieza 1.1: Endodoncia               │
│  ├─ Pieza 1.4: Caries                   │
│  ├─ Pieza 1.6: Curación/Resina          │
│  ├─ Pieza 2.6: Corona                   │
│  └─ ... (6 piezas más)                  │
│                                          │
│  HALLAZGOS REGISTRADOS                  │
│  ├─ Endodoncia pieza 1.1                │
│  ├─ Caries activa pieza 1.4             │
│  ├─ Curación en buen estado 1.6         │
│  └─ Corona instalada 2.6                │
│                                          │
└──────────────────────────────────────────┘
URL: /odontograma
MODO: SOLO LECTURA (datos precargados)
```

### Pantalla 6: ODONTOGRAMA POR SUPERFICIES (Lectura) ⭐
```
┌──────────────────────────────────────────┐
│   Odontograma por Superficies           │
│ Documenta el estado detallado de cada   │
│ superficie dental (oclusal, bucal...)   │
├──────────────────────────────────────────┤
│                                          │
│  Paciente: María Elena Quispe            │
│  (Sin búsqueda - solo lectura)          │
│                                          │
│  CONDICIONES DENTALES (Leyenda):        │
│  🟢 Sano  🟠 Caries  🔵 Curación        │
│  🟣 Endodoncia  🔴 Extracción           │
│  🟨 Corona  ⚫ Ausente  🔷 Implante      │
│  🔷 Sellante  🌸 Fractura               │
│                                          │
│  🦷 PIEZAS PRECARGADAS CON COLORES:    │
│                                          │
│  Pieza 11 (Incisivo Central):           │
│  ┌─────────────────────────────┐        │
│  │ Oclusal:  🟣 PÚRPURA        │        │
│  │ Bucal:    🟢 VERDE (Sano)   │        │
│  │ Lingual:  🟢 VERDE (Sano)   │        │
│  │ Mesial:   🟢 VERDE (Sano)   │        │
│  │ Distal:   🟢 VERDE (Sano)   │        │
│  │ → Diagnóstico: Endodoncia   │        │
│  └─────────────────────────────┘        │
│                                          │
│  Pieza 14 (Premolar):                   │
│  ┌─────────────────────────────┐        │
│  │ Oclusal:  🟠 NARANJA        │        │
│  │ Bucal:    🟠 NARANJA        │        │
│  │ Lingual:  🟢 VERDE (Sano)   │        │
│  │ Mesial:   🟢 VERDE (Sano)   │        │
│  │ Distal:   🟢 VERDE (Sano)   │        │
│  │ → Diagnóstico: Caries activa│        │
│  └─────────────────────────────┘        │
│                                          │
│  Pieza 16 (Molar):                      │
│  ┌─────────────────────────────┐        │
│  │ Oclusal:  🔵 AZUL           │        │
│  │ Bucal:    🟢 VERDE (Sano)   │        │
│  │ Lingual:  🟢 VERDE (Sano)   │        │
│  │ Mesial:   🟢 VERDE (Sano)   │        │
│  │ Distal:   🟢 VERDE (Sano)   │        │
│  │ → Diag.: Curación/Resina   │        │
│  └─────────────────────────────┘        │
│                                          │
│  Pieza 26 (Molar):                      │
│  ┌─────────────────────────────┐        │
│  │ Oclusal:  🟨 NARANJA        │        │
│  │ Bucal:    🟢 VERDE (Sano)   │        │
│  │ Lingual:  🟢 VERDE (Sano)   │        │
│  │ Mesial:   🟢 VERDE (Sano)   │        │
│  │ Distal:   🟢 VERDE (Sano)   │        │
│  │ → Diagnóstico: Corona       │        │
│  └─────────────────────────────┘        │
│                                          │
│  [Imprimir]                             │
│                                          │
└──────────────────────────────────────────┘
URL: /odontograma-superficies
MODO: SOLO LECTURA (datos precargados con colores)
```

---

## ACCESO RÁPIDO

| Pantalla | URL | Cómo Acceder | Datos |
|----------|-----|------------|-------|
| Login | `/login` | Ir directo | Email/Password |
| Mis citas | `/citas` | Login→Automático | Calendario citas |
| **Nueva Consulta** ⭐ | `/citas/nueva-consulta` | "Nueva consulta" botón | **FORMULARIO** |
| Historia | `/historia` | Sidebar | Lectura |
| Odontograma | `/odontograma` | Sidebar | Lectura precargado |
| Superficies | `/odontograma-superficies` | Sidebar | Lectura con colores |

---

## RESUMEN VISUAL

```
LOGIN
  ↓
MIS CITAS (/citas)
  ↓
[Nueva consulta] BOTÓN
  ↓
REGISTRA CONSULTA (/citas/nueva-consulta) ⭐ AQUÍ
  ├─ Diagnóstico (texto largo)
  ├─ Notas clínicas (texto largo)
  ├─ Fecha próxima cita
  ├─ Presupuesto total
  └─ Número de sesiones
  ↓
DATOS GUARDADOS EN:
  ├─ Historia clínica (/historia)
  ├─ Odontograma (/odontograma)
  └─ Odontograma Superficies (/odontograma-superficies)
```

---

**Última actualización:** 2026-07-25
**Estado:** ✅ COMPLETAMENTE FUNCIONAL
