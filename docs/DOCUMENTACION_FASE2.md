# Documentación Completa · Fase 2: Boceto, Arquitectura y Especificación — NexoClaro

**Evento:** Hackathon Nacional de Innovación con IA · Ingenio Incluyente · UVM 2026  
**Reto 1:** Puentes de oportunidad — Reducción de la brecha de acceso (**ODS 10**)  
**Integrantes del Equipo:**
- Christian Duran Garcia (Líder)
- Oscar Daniel Perez Serrano
- Santiago Velazquez Hernandez  
**Mentor:** Ana Margarita Estrada Vargas  

**Enlaces del Proyecto:**
- **Repositorio GitHub:** `https://github.com/ChristianDuranG/NexoClaro`
- **Boceto Visual Interactivo (iOS & Android):** `https://christiandurang.github.io/NexoClaro/docs/boceto_nexoclaro.html`
- **Documentación Colaborativa (Google Workspace):** `[PENDIENTE: Pegar enlace de Google Docs compartido]`

---

## 1. Resumen Ejecutivo
**NexoClaro** es una aplicación móvil multiplataforma (iOS y Android) diseñada para eliminar la brecha de acceso a derechos y servicios esenciales en poblaciones en situación de desventaja (ODS 10). Mediante **Google Gemini (`gemini-2.5-flash`)**, la app explica, traduce y simplifica información oficial sobre becas, trámites, salud y empleo en guías paso a paso adaptadas al idioma y nivel de lectura de cada persona. Además, incorpora interacción por voz (entrada y lectura en voz alta) y una **base de datos estructurada local (`SQLite`)** que permite consultar guías y checklists incluso sin conexión a internet.

---

## 2. Problema, Población Objetivo y Alineación ODS 10
* **Población objetivo:** Adultos mayores, personas migrantes, estudiantes de primera generación y comunidades con baja conectividad o recursos limitados.
* **El problema:** La información sobre becas, trámites oficiales, servicios de salud y empleo suele ser confusa, dispersa o estar redactada en lenguaje técnico inaccesible. Quien no comprende los requisitos o pasos queda excluido.
* **Impacto esperado (ODS 10):** Reducir la desigualdad de acceso democratizando la comprensión de trámites y derechos públicos mediante lenguaje claro, soporte multimodal por voz, traducción y disponibilidad offline.

---

## 3. Boceto y Diseño UI/UX (*Luxury Liquid Glass* de Alto Contraste)
El diseño visual del boceto combina una estética moderna **Liquid Glass** (tarjetas translúcidas con desenfoque, bordes definidos y fondo alabastro cálido `#F6F3EC`) con **alto contraste** (negro obsidiana `#121316` y acentos oro/esmeralda) pensado específicamente para facilitar la lectura en adultos mayores y usuarios primerizos, adaptado tanto a **iOS** como a **Android**.

### Descripción de las 4 Pantallas Principales:
1. **Pantalla 1 · Mi Perfil Accesible:**
   - Permite seleccionar el perfil de atención (*Adulto mayor*, *Estudiante de primera generación*, *Persona migrante* o *General*).
   - Configura idioma (*Español* / *Inglés*), nivel de lectura (*Muy sencillo* / *Estándar*), interruptor de **Letra extra grande** e interruptor de **Lectura automática en voz alta**.
   - Persiste inmediatamente en la tabla `perfil_usuario` de SQLite.
2. **Pantalla 2 · Inicio y Catálogo Offline:**
   - Botón principal de acceso rápido: **"Pregunta con tu voz"** para abrir el asistente IA.
   - Cuatro categorías claras con tarjetas amplias: **Becas**, **Trámites**, **Salud** y **Empleo**.
   - Lista de guías rápidas precargadas en SQLite para consulta **100% sin internet** (ej. *Beca Jóvenes Escribiendo el Futuro*, *Registro IMSS-Bienestar*, *Pensión Adultos Mayores*, *Trámite CURP*).
3. **Pantalla 3 · Asistente IA Multimodal (Gemini Voz + Texto):**
   - Chat accesible donde el usuario puede escribir o grabar una nota de voz con el micrófono (`expo-av`).
   - Gemini procesa el texto o audio considerando el perfil del usuario y responde en lenguaje sencillo, estructurado en pasos numerados.
   - Botones de acción en cada respuesta: **Escuchar** (síntesis de voz con `expo-speech`), **Traducir** y **Guardar como Checklist Offline** (almacena la guía generada en SQLite).
4. **Pantalla 4 · Mis Guías y Checklist:**
   - Muestra las guías precargadas y las generadas por Gemini convertidas en checklists interactivos con **barra de progreso porcentual**.
   - Permite marcar/desmarcar cada paso (`pasos_servicio.completado`) y escuchar los pasos pendientes en voz alta.

---

## 4. Stack Tecnológico Completo, Paqueterías y Herramientas
| Capa | Tecnología / Paquete | Propósito en el Proyecto |
| :--- | :--- | :--- |
| **App Móvil (iOS y Android)** | **React Native + Expo (JavaScript)** | Desarrollo multiplataforma nativo compatible con iPhone (iOS) y Android desde una sola base de código. |
| **Navegación** | `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-safe-area-context` | Navegación fluida entre las 4 pestañas respetando áreas seguras (*Dynamic Island* / barras Android). |
| **Base de Datos Estructurada** | **`expo-sqlite` (SQLite relacional)** | Almacenamiento local estructurado con llaves primarias/foráneas para operación offline. |
| **Diseño de BD y Diagrama** | **MySQL Workbench** + `schema_nexoclaro.sql` | Modelado Entidad-Relación (EER) estándar SQL compatible con SQLite. |
| **Inteligencia Artificial** | **Google Gemini API (`gemini-2.5-flash`)** vía `fetch` REST | Asistente conversacional, comprensión de audio, traducción y simplificación de lenguaje. |
| **Accesibilidad y Voz** | **`expo-speech`** (Text-to-Speech) y **`expo-av`** (Audio/Micrófono) | Lectura en voz alta de guías/respuestas y grabación de consultas por voz. |
| **Iconografía** | `@expo/vector-icons` | Iconos claros y de alto contraste para navegación intuitiva. |
| **Colaboración y Gestión** | **Google Workspace (Google Docs & Google Drive)** | Redacción colaborativa de documentación, control de entregables y compartición en la nube. |
| **Control de Versiones** | **Git + GitHub + GitHub Pages** | Repositorio público de código y publicación web del boceto interactivo. |

---

## 5. Arquitectura y Base de Datos Estructurada
La base de datos sigue un modelo relacional de **4 tablas** (definido en [schema_nexoclaro.sql](schema_nexoclaro.sql)):

1. **`perfil_usuario`**: `id` (PK), `nombre`, `grupo_objetivo`, `idioma`, `nivel_lectura`, `texto_grande`.
2. **`servicios`**: `id` (PK), `categoria`, `titulo`, `resumen_claro`, `requisitos`, `fuente_oficial`.
3. **`pasos_servicio`**: `id` (PK), `servicio_id` (FK → `servicios.id` `ON DELETE CASCADE`), `orden`, `instruccion`, `completado`.
4. **`consultas_ia`**: `id` (PK), `perfil_id` (FK → `perfil_usuario.id` `ON DELETE CASCADE`), `pregunta`, `respuesta_gemini`, `idioma`, `fecha`.

### Flujo de Integración con Gemini:
1. El usuario envía una consulta escrita o grabada en audio desde la app.
2. La app consulta la tabla `perfil_usuario` en SQLite para obtener idioma, grupo objetivo y nivel de lectura.
3. Se construye un *System Prompt* dinámico enviado junto con el texto/audio a `gemini-2.5-flash`.
4. La respuesta simplificada se muestra en tarjetas claras, se puede reproducir con `expo-speech` y se guarda en `consultas_ia` / `servicios` + `pasos_servicio` para uso offline.

---

## 6. Manual de Usuario (Paso a Paso)
1. **Acceso:** Abre **Expo Go** en tu iPhone o Android y escanea el código QR del proyecto **NexoClaro** *(o abre la app instalada)*.
2. **Configuración inicial:** En la pestaña **Perfil**, selecciona tu grupo (ej. *Adulto mayor*), tu idioma y activa **Letra extra grande** si lo necesitas. Presiona **Guardar en SQLite**.
3. **Consulta sin internet:** En **Inicio**, elige una categoría (**Becas**, **Trámites**, **Salud** o **Empleo**) para abrir cualquier guía precargada sin usar datos móviles.
4. **Asistente por voz o texto:** Entra a **Asistente**, toca el botón de **micrófono** para hablar o escribe tu duda y presiona enviar.
5. **Escuchar y guardar:** Toca **Escuchar** para oír la explicación en voz alta o **Guardar como Checklist Offline** para conservar los pasos en la pestaña **Guías** e ir marcándolos conforme los completes.

---

## 7. Accesibilidad e Impacto Social
- **Accesibilidad:** Alto contraste visual, tipografía escalable, lenguaje libre de tecnicismos, traducción inmediata, entrada por voz, lectura narrada y operación offline.
- **Impacto:** Permite que cualquier persona, sin importar su edad, idioma, nivel académico o conectividad, comprenda y ejerza su derecho a una beca, trámite oficial, atención médica o empleo.
