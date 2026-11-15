# SUPUESTO PRÁCTICO (UD2): TRIAJE, DOCUMENTACIÓN Y ESCALADO DE CIBERINCIDENTES

## 1. Contexto del Escenario
Eres analista en el Centro de Operaciones de Seguridad (SOC) que presta servicio a **Distribuciones del Sur S.L.**, una empresa logística española con 180 empleados. Durante el turno de mañana del **16 de noviembre de 2026**, la consola del SIEM y el EDR reciben dos alertas simultáneas.

### Mecanismo Técnico Conceptual
El escenario simula una cadena de intrusión que comienza con ingeniería social dirigida por correo electrónico hacia un departamento administrativo, seguida de ejecución de código no autorizado y movimiento lateral hacia un servidor interno con información sensible. El objetivo del ejercicio es discriminar actividad administrativa legítima de una intrusión real, ejecutar una contención ordenada preservando evidencias volátiles y evaluar el escalado legal.

---

## 2. Telemetría y Alertas Disponibles para el Alumnado

### Alerta 1 (SIEM - IDS de Red)
* **Timestamp (UTC):** `2026-11-16T09:10:05Z`
* **Regla:** `NET-SCAN-012: Detección de sondeo de puertos TCP en subred de servidores`
* **Origen:** `10.10.5.5` (`SRV-AUDIT-01.delsur.local`)
* **Destino:** Subred `10.10.2.0/24`
* **Nota de la CMDB:** `SRV-AUDIT-01` es el servidor interno de gestión de vulnerabilidades con escaneo semanal programado los lunes a las 09:00 UTC.

### Alerta 2 (EDR Corporativo)
* **Timestamp (UTC):** `2026-11-16T09:18:40Z`
* **Regla:** `EDR-BEHAV-044: Proceso ofimático genera intérprete de comandos con conexión externa`
* **Activo afectado:** `PC-RRHH-04.delsur.local` (`10.10.20.34`) | **SO:** Windows 11 Pro | **Usuario:** `c.ruiz` (Recursos Humanos)
* **Cronología técnica extraída del EDR (UTC):**
  * `09:14:12Z`: El cliente de correo abre el archivo adjunto `CV_Candidato_Urgente.zip`.
  * `09:15:02Z`: Ejecución de un script oculto que establece conexión saliente hacia `198.51.100.77:443` (dominio `cdn-recursos-cloud[.]example`).
  * `09:17:55Z`: Acceso autenticado mediante protocolo SMB desde `PC-RRHH-04` hacia `SRV-NOMINAS-01.delsur.local` (`10.10.2.15`, servidor crítico de Recursos Humanos) y lectura masiva de archivos en el recurso compartido `\Contratos_2026`.
* **Datos de Inteligencia de Amenazas (OSINT):** La IP `198.51.100.77` figura reportada en feeds de inteligencia como infraestructura activa de Mando y Control (C2).

---

## 3. Tareas a Realizar por el Alumnado

Utilizando la **Plantilla de Ficha de Incidente y Cadena de Custodia**, resuelve las siguientes fases:

### Fase 1: Nivel 1 — Triaje Inicial y Documentación
1. **Filtrado de alertas:** Determina qué alerta corresponde a un falso positivo y cuál constituye un incidente real, justificando tu decisión.
2. **Apertura de ficha:** Cumplimenta los bloques 1 al 5 de la ficha de incidente (ID normalizado, timestamps en formato ISO 8601 UTC, cálculo del MTTD, inventario de activos involucrados, IoCs y mapeo de hasta 3 tácticas principales en MITRE ATT&CK).
3. **Clasificación y valoración:** Asigna la categoría según la taxonomía de **CCN-STIC 817 / INCIBE-CERT**, el nivel de criticidad y la etiqueta **TLP 2.0** adecuada.

### Fase 2: Nivel 2 — Análisis, Contención y Cadena de Custodia
1. **Secuencia de contención:** Enumera en orden lógico las acciones técnicas inmediatas que aplicarías sobre `PC-RRHH-04`, `SRV-NOMINAS-01`, la cuenta `c.ruiz` y el perímetro de red. *Restricción:* Debes evitar la pérdida de evidencias volátiles.
2. **Preservación forense:** Cumplimenta el apartado 8 (Cadena de Custodia) simulando la adquisición de la memoria RAM de `PC-RRHH-04` antes de su aislamiento definitivo o apagado.

### Fase 3: Nivel 3 — Escalado al Comité de Crisis
1. **Criterio de escalado:** Justifica por qué este incidente requiere activar el Nivel 3 (Comité de Crisis).
2. **Cumplimiento normativo:** Indica a qué organismos externos debe notificarse el incidente en España y cuáles son los plazos máximos legales aplicables (RGPD y marco NIS2 / INCIBE-CERT).

---

## 4. Guía Conceptual de Validación (Uso Docente)

* **Discriminación N1:** La Alerta 1 corresponde a actividad autorizada documentada en la CMDB (`<falso_positivo_programado>`). La Alerta 2 es un verdadero positivo de categoría *Intrusión / Contenido dañino* con criticidad *Muy Alta* debido al acceso a datos personales sensibles (`SRV-NOMINAS-01`).
* **Orden de actuación N2:** Priorizar la adquisición de memoria RAM (volátil) y el aislamiento de red mediante EDR antes de reiniciar equipos o restablecer contraseñas, manteniendo íntegro el registro de hashes SHA-256 en la cadena de custodia.
* **Escalado N3:** La exposición de datos personales de trabajadores activa la obligación de evaluar la notificación a la **AEPD** (plazo de 72 horas según Art. 33 RGPD) y el reporte técnico a **INCIBE-CERT**. Los valores exactos de tiempos de respuesta y redactado final se completarán según el análisis del grupo: `<completar_por_el_alumnado>`.