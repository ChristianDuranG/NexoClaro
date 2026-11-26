# Documentación Fase 2 · Boceto y Arquitectura — NexoClaro

**Hackathon Nacional de Innovación con IA · Ingenio Incluyente · UVM 2026**  
**Reto 1:** Puentes de oportunidad (ODS 10 — Reducción de la brecha de acceso)  
**Equipo:** Christian Duran Garcia (Líder), Oscar Daniel Perez Serrano, Santiago Velazquez Hernandez  
**Mentor:** Ana Margarita Estrada Vargas  

---

## 1. Resumen del Boceto y Propuesta
**NexoClaro** es una aplicación móvil multiplataforma (iOS y Android) diseñada para eliminar las barreras de comprensión y acceso a becas, trámites oficiales, orientación en salud y empleo. El diseño prioriza **alto contraste, tipografía amplia, navegación simple de 4 pestañas, interacción por voz y soporte sin conexión (offline)**.

## 2. Descripción de Pantallas del Boceto
1. **Pantalla 1 · Mi Perfil Accesible:**  
   Permite elegir el perfil del usuario (*Adulto mayor*, *Estudiante de primera generación*, *Persona migrante* o *General*), idioma preferido (*Español* / *Inglés*), nivel de lectura (*Muy sencillo* / *Estándar*) y tamaño de letra grande. Se almacena localmente en la tabla `perfil_usuario`.
2. **Pantalla 2 · Inicio y Catálogo Offline:**  
   Presenta un botón principal para consultar al asistente por voz o texto, cuatro categorías claras (**Becas**, **Trámites**, **Salud**, **Empleo**) y acceso inmediato a guías precargadas en SQLite que funcionan sin internet.
3. **Pantalla 3 · Asistente IA (Gemini Voz + Texto):**  
   Interfaz conversacional donde el usuario escribe o graba una pregunta con el micrófono (`expo-av`). Gemini (`gemini-2.5-flash`) recibe el audio o texto junto con el perfil de accesibilidad y responde en lenguaje claro y paso a paso. Incluye botón de **Escuchar en voz alta** (`expo-speech`) y **Guardar como Guía Offline**.
4. **Pantalla 4 · Mis Guías y Checklist:**  
   Muestra las guías precargadas y las guardadas desde el asistente convertidas en un checklist interactivo donde el usuario marca su avance (`pasos_servicio.completado`), con opción de lectura en voz alta.

## 3. Base de Datos Estructurada
La persistencia local se implementa con **SQLite (`expo-sqlite`)** siguiendo un modelo relacional de 4 tablas con llaves foráneas:
- `perfil_usuario`: preferencias de accesibilidad e idioma.
- `servicios`: catálogo de becas, trámites, salud y empleo.
- `pasos_servicio`: pasos ordenados vinculados a `servicios` (`FK servicio_id`).
- `consultas_ia`: historial de preguntas y guías generadas por Gemini vinculadas a `perfil_usuario` (`FK perfil_id`).

## 4. Integración de IA (Google Gemini)
- **Modelo:** `gemini-2.5-flash` vía API REST oficial.
- **Personalización:** Cada petición inyecta un *System Prompt* con el grupo objetivo, idioma y nivel de lectura del usuario para garantizar explicaciones empáticas, libres de tecnicismos, traducidas y estructuradas en pasos concretos.
- **Multimodalidad:** Soporta entrada de texto y notas de voz grabadas desde el dispositivo.

