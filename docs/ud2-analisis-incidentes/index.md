---
title: UD2 - Análisis de incidentes de ciberseguridad
layout: default
---

# UD2. Análisis de incidentes de ciberseguridad

> La unidad se trabaja como analista de nivel 1 de un SOC: la persona que ve primero la alerta y decide si es un incidente, cuánto importa y qué hacer con ella.

## 1. Resultado de aprendizaje

RA2. Analiza incidentes de ciberseguridad utilizando herramientas, mecanismos de detección y alertas de seguridad.

### Criterios de evaluación

- a) Se ha clasificado y definido la taxonomía de incidentes de ciberseguridad que pueden afectar a la organización.
- b) Se han establecido controles, herramientas y mecanismos de monitorización, identificación, detección y alerta de incidentes.
- c) Se han establecido controles y mecanismos de detección e identificación de incidentes de seguridad física.
- d) Se han establecido controles, herramientas y mecanismos de monitorización, identificación, detección y alerta de incidentes a través de la investigación en fuentes abiertas (OSINT).
- e) Se ha realizado una clasificación, valoración, documentación y seguimiento de los incidentes detectados dentro de la organización.

## 2. El caso ACME Logística

Toda la unidad transcurre en una empresa ficticia de transporte con sede en Jaén. Su SOC usa Wazuh como SIEM y Suricata como detector de intrusiones de red, y su CPD tiene control de acceso por tarjeta. Los ejemplos siguen un mismo incidente, de la primera alerta a la ficha de registro.

## 3. Módulos y prácticas

| Módulo | CE | Pregunta que responde | Práctica |
| --- | --- | --- | --- |
| 1. Taxonomía y valoración de incidentes | 2.a | ¿Qué tipo de incidente es y cuánto importa? | P1. Clasifica y valora como en el SOC |
| 2. Monitorización técnica: SIEM (Wazuh) y NIDS (Suricata) | 2.b | ¿Cómo lo veo en mis sistemas y en mi red? | P2. Suricata y Wazuh con las capturas del caso |
| 3. Detección e identificación en seguridad física | 2.c | ¿Y si el atacante entra por la puerta? | P3. Correlaciona el CPD con los inicios de sesión |
| 4. Ciberinteligencia OSINT y fuentes abiertas | 2.d | ¿Qué se ve de mi organización desde fuera? | P4. Del evento de MISP a la lista de bloqueo |
| 5. Triaje, registro inicial y seguimiento | 2.e | ¿Qué hago con cada alerta y cómo lo dejo escrito? | P5. Tu turno en la cola |

Cada módulo incluye un ejemplo resuelto y tres actividades de autoevaluación.

## 4. Laboratorio

- `ids01` (Ubuntu Server 26.04): Suricata, jq, nftables, dnstwist y Python. Con ella se hacen P2 a P5.
- `wazuh01` (Ubuntu Server 24.04): servidor de Wazuh para la segunda parte de P2.
- `PC-ADM-07` (Windows 11 con Sysmon): opcional en esta unidad; se usa en las siguientes.

## 5. Evaluación

Las prácticas se entregan en el aula virtual y se defienden oralmente en la última sesión de la unidad. La unidad se cierra con un examen práctico de triaje.

## 6. Material

- [Apuntes completos de la unidad](../../ud2-analisis-incidentes/)
- [Unidad interactiva, con las actividades autocorregibles](../../ud2-analisis-incidentes/curso/)
- [Contenido en PDF](../../ud2-analisis-incidentes/descargas/UD2_Analisis_Incidentes_Contenido.pdf)
- [Recursos para las prácticas](../../ud2-analisis-incidentes/descargas/UD2_Recursos_alumnado.zip)
- [Guía de instalación del laboratorio](../../ud2-analisis-incidentes/descargas/UD2_Guia_instalacion_laboratorio.pdf)
- [Volver al módulo](../)
