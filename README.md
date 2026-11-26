# NexoClaro — Puentes de Oportunidad

> 🎨 **Ver Boceto Visual Interactivo (iOS & Android):**  
> 👉 **[https://christiandurang.github.io/NexoClaro/docs/boceto_nexoclaro.html](https://christiandurang.github.io/NexoClaro/docs/boceto_nexoclaro.html)**

**Hackathon Nacional de Innovación con IA · Ingenio Incluyente · UVM 2026**  
**Reto 1:** Puentes de oportunidad — Reducción de la brecha de acceso (**ODS 10**)  
**Campus:** UVM Toluca

## Equipo
- **Christian Duran Garcia** (Líder)
- **Oscar Daniel Perez Serrano**
- **Santiago Velazquez Hernandez**
- **Mentor:** Ana Margarita Estrada Vargas

## ¿Qué es NexoClaro?
Aplicación móvil inclusiva (iOS y Android) construida con **React Native + Expo**, **Google Gemini (`gemini-3.8-flash`)** y base de datos estructurada **SQLite (`expo-sqlite`)** que explica, traduce y guía paso a paso a adultos mayores, migrantes, estudiantes de primera generación y comunidades con baja conectividad para acceder a **becas, trámites oficiales (SAT, CURP, Pensión Bienestar), salud (IMSS-Bienestar) y empleo**.

## Funcionalidades del MVP (Fase 3)
1. **Inicio y Catálogo Offline (`HomeScreen`):** Cuadrícula 2×2 (*Becas, Trámites, Salud, Empleo*) con **7 guías reales precargadas en SQLite** consultables sin internet, barra de progreso porcentual y enlaces directos a portales oficiales (`sat.gob.mx`, `gob.mx/curp`, `subes.becasbenitojuarez.gob.mx`, `registro.imssbienestar.gob.mx`).
2. **Asistente IA Multimodal (`AssistantScreen`):** Chat por texto y **grabación de voz por micrófono (`expo-audio`)** conectado a **Gemini 3.8 Flash**, lectura en voz alta (`expo-speech`), **traducción Español ↔ Inglés** con un toque y botón **Guardar Guía** para convertir cualquier respuesta en un checklist offline.
3. **Checklists Interactivos (`GuidesScreen`):** Seguimiento paso a paso persistido en SQLite, lectura en voz alta de pasos pendientes y botón directo para abrir el portal oficial.
4. **Perfil Accesible (`ProfileScreen`):** Selección de perfil (*Adulto mayor*, *Estudiante 1ª generación*, *Persona migrante*, *General*), idioma (*Español / English*), nivel de lectura, **Letra extra grande en vivo** y lectura automática en voz alta.

## Cómo ejecutar el prototipo en tu celular (iOS o Android)
```bash
git clone https://github.com/ChristianDuranG/NexoClaro.git
cd NexoClaro
npm install
npm run tunnel
```
1. Instala **Expo Go** en tu iPhone (App Store) o Android (Play Store).
2. Escanea el código QR generado en la terminal.
3. *(Opcional)* Pega tu **Gemini API Key** de [Google AI Studio](https://aistudio.google.com/) en la pestaña **Perfil** dentro de la app (o en `.env` como `EXPO_PUBLIC_GEMINI_API_KEY`).

## Documentación y Esquema de Base de Datos
- 🎨 **Boceto Visual Interactivo:** [docs/boceto_nexoclaro.html](docs/boceto_nexoclaro.html)
- 📄 **Documentación Técnica y Funcional:** [docs/DOCUMENTACION_FASE2.md](docs/DOCUMENTACION_FASE2.md)
- 🗄️ **Esquema Relacional SQL (SQLite / MySQL):** [docs/schema_nexoclaro.sql](docs/schema_nexoclaro.sql)
