# FICHA DE REGISTRO DE INCIDENTE DE SEGURIDAD Y CADENA DE CUSTODIA

## 1. Metadatos y Clasificación General
* **ID del Incidente:** `INC-AAAA-MMDD-NNN`
* **Fecha y Hora de Apertura (UTC):** `AAAA-MM-DDTHH:MM:SSZ`
* **Estado Actual:** `[ ] Nuevo` | `[ ] En Triaje (N1)` | `[ ] En Contención (N2)` | `[ ] Crisis (N3)` | `[ ] Cerrado`
* **Analista Responsable:** `<Nombre y Rol>`
* **Nivel de Confidencialidad (TLP 2.0):** `[ ] TLP:RED` | `[ ] TLP:AMBER+STRICT` | `[ ] TLP:AMBER` | `[ ] TLP:GREEN` | `[ ] TLP:CLEAR`
* **Taxonomía del Incidente (CCN-STIC 817 / INCIBE-CERT):**
  * **Categoría principal:** `<Ej. Intrusión / Contenido dañino / Disponibilidad / Fraude>`
  * **Subcategoría:** `<Ej. Explotación de vulnerabilidad / Malware / Phishing>`
* **Valoración de Criticidad:** `[ ] Baja` | `[ ] Media` | `[ ] Alta` | `[ ] Muy Alta` | `[ ] Crítica`
* **Justificación de Impacto (Tríada CID):** `<Breve descripción del impacto en Confidencialidad, Integridad y Disponibilidad>`

---

## 2. Marcas de Tiempo (Timestamps - Formato ISO 8601 UTC)
* **Tiempo de Ocurrencia ($T_0$):** `AAAA-MM-DDTHH:MM:SSZ` *(Inicio estimado de la actividad maliciosa)*
* **Tiempo de Detección ($T_d$):** `AAAA-MM-DDTHH:MM:SSZ` *(Generación de la alerta o reporte inicial)*
* **Tiempo de Contención ($T_c$):** `AAAA-MM-DDTHH:MM:SSZ` *(Aislamiento efectivo de la amenaza)*
* **Tiempo de Resolución ($T_r$):** `AAAA-MM-DDTHH:MM:SSZ` *(Restauración normalizada del servicio)*
* **Métricas Operativas:**
  * **MTTD ($T_d - T_0$):** `<HH:MM:SS>`
  * **MTTR ($T_r - T_d$):** `<HH:MM:SS>`

---

## 3. Origen de la Alerta y Detección
* **Fuente de Detección:** `[ ] SIEM` | `[ ] EDR` | `[ ] IDS/IPS/Firewall` | `[ ] Usuario / Service Desk` | `[ ] CSIRT Externo`
* **Herramienta y Regla Disparada:** `<Nombre de la herramienta e ID/Nombre de la regla>`
* **Resumen Inicial del Evento:** `<Descripción objetiva de qué disparó la alerta>`

---

## 4. Inventario de Activos Involucrados (CMDB)

| Hostname / FQDN | Dirección IP | Sistema Operativo | Rol del Activo | Usuario / Propietario | Criticidad del Activo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<host-01.dominio.local>` | `<10.x.x.x>` | `<SO y versión>` | `<Puesto / Servidor>` | `<usuario>` | `<Baja/Media/Alta/Crítica>` |
| `<host-02.dominio.local>` | `<10.x.x.x>` | `<SO y versión>` | `<Servidor BD / Ficheros>` | `<departamento>` | `<Baja/Media/Alta/Crítica>` |

---

## 5. Indicadores de Compromiso (IoCs) y Contexto MITRE ATT&CK

### Tácticas y Técnicas Observadas (MITRE ATT&CK)
* **Táctica / Técnica 1:** `<Ej. TA0001 - Initial Access / T1566 - Phishing>`
* **Táctica / Técnica 2:** `<Ej. TA0002 - Execution / T1059 - Command and Scripting Interpreter>`
* **Táctica / Técnica 3:** `<Ej. TA0008 - Lateral Movement / T1021 - Remote Services>`

### Tabla de Observables (IoCs)

| Tipo de IoC | Valor del Observable (Defanged) | Contexto / Descripción | Acción Aplicada |
| :--- | :--- | :--- | :--- |
| **Hash (SHA-256)** | `<sha256_del_artefacto>` | `<Nombre del archivo sospechoso>` | `<Bloqueado en EDR>` |
| **Dirección IP** | `<IP_externa>` | `<Servidor de Mando y Control (C2)>` | `<Bloqueada en Firewall>` |
| **Dominio / URL** | `<dominio[.]example>` | `<Dominio de descarga / exfiltración>` | `<Bloqueado en DNS/Proxy>` |

---

## 6. Línea Temporal Unificada (Timeline)

| Marca de Tiempo (UTC) | Origen / Actor | Descripción del Evento o Acción Ejecutada | Referencia / Evidencia |
| :--- | :--- | :--- | :--- |
| `AAAA-MM-DDTHH:MM:SSZ` | `<Atacante / Sistema>` | `<Descripción cronológica del evento>` | `<Log SIEM / Alerta EDR>` |
| `AAAA-MM-DDTHH:MM:SSZ` | `<Analista N1>` | `<Apertura de ficha y validación inicial>` | `<Ticket INC-...>` |
| `AAAA-MM-DDTHH:MM:SSZ` | `<Analista N2>` | `<Aislamiento de host y bloqueo perimetral>` | `<Consola EDR / FW>` |

---

## 7. Registro de Seguimiento y Escalado Operativo

### Nivel 1: Triaje Inicial
* **Descarte de Falso Positivo:** `[ ] Confirmado Verdadero Positivo`
* **Enriquecimiento Preliminar (OSINT / TI):** `<Resultado de consulta de reputación de IoCs>`
* **Motivo de Escalado a N2:** `<Ej. Confirmación de ejecución maliciosa en activo corporativo>`
* **Hora de Escalado a N2 (UTC):** `AAAA-MM-DDTHH:MM:SSZ`

### Nivel 2: Análisis y Contención
* **Medidas de Contención Aplicadas:** `<Aislamiento de red, revocación de credenciales, bloqueo de IoCs>`
* **Alcance Identificado (Threat Hunting):** `<¿Se han detectado otros equipos afectados?>`
* **Motivo de Escalado a N3:** `<Ej. Afectación a datos personales / Interrupción de servicio crítico>`
* **Hora de Escalado a N3 (UTC):** `AAAA-MM-DDTHH:MM:SSZ`

### Nivel 3: Comité de Crisis
* **Integrantes Convocados:** `[ ] CISO` | `[ ] Dirección` | `[ ] Legal / DPD` | `[ ] Operaciones TI` | `[ ] Comunicación`
* **Decisiones Ejecutivas Adoptadas:** `<Activación DRP/BCP, parada controlada, etc.>`
* **Notificaciones Regulatorias Requeridas:**
  * `[ ] AEPD (Brecha de datos personales - Plazo 72h RGPD)`
  * `[ ] INCIBE-CERT / CCN-CERT (Notificación temprana 24h / Completa 72h)`
  * `[ ] Fuerzas y Cuerpos de Seguridad (Denuncia formal)`

---

## 8. Registro de Cadena de Custodia (ISO/IEC 27037 / UNE 71506)

### Identificación de la Evidencia Digital
* **ID de Evidencia:** `EV-NNN`
* **Incidente Asociado:** `INC-AAAA-MMDD-NNN`
* **Descripción del Elemento:** `<Ej. Imagen de memoria RAM / Copia forense de disco / Exportación de logs>`
* **Activo de Origen:** `<Hostname e IP>`
* **Herramienta y Método de Adquisición:** `<Ej. Velociraptor / FTK Imager en vivo>`
* **Fecha y Hora de Adquisición (UTC):** `AAAA-MM-DDTHH:MM:SSZ`
* **Algoritmo y Valor Hash Original (SHA-256):** `<hash_sha256_calculado_en_origen>`
* **Ubicación de Almacenamiento Seguro:** `<Repositorio WORM / Caja fuerte física>`

### Control de Transferencias y Accesos

| Fecha / Hora (UTC) | Persona que Entrega | Persona que Recibe | Motivo del Traslado / Acceso | Verificación Hash SHA-256 | Firma / Validación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AAAA-MM-DDTHH:MM:SSZ` | `<Técnico Adquisición>` | `<Repositorio Forense>` | `<Custodia inicial tras volcado>` | `[ ] Coincide` | `<Firma>` |
| `AAAA-MM-DDTHH:MM:SSZ` | `<Custodio>` | `<Analista DFIR N2>` | `<Copia de trabajo para análisis>` | `[ ] Coincide` | `<Firma>` |
