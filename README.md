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
Aplicación móvil inclusiva (iOS y Android) construida con **React Native + Expo**, **Google Gemini (`gemini-2.5-flash`)** y base de datos estructurada **SQLite (`expo-sqlite`)** que explica, traduce y guía paso a paso a adultos mayores, migrantes, estudiantes de primera generación y comunidades con baja conectividad para acceder a **becas, trámites oficiales, salud y empleo**.

## Funcionalidades del MVP (Fase 3)
1. **Perfil Accesible (`ProfileScreen`):** Selección de perfil (*Adulto mayor*, *Estudiante 1ª generación*, *Persona migrante*, *General*), idioma (*Español* / *English*), nivel de lectura, **Letra extra grande en vivo** y lectura automática en voz alta.
2. **Catálogo Offline (`HomeScreen`):** 6 guías reales precargadas en **SQLite** (Becas, Trámites, Salud, Empleo) consultables sin internet con barra de progreso.
3. **Asistente IA Multimodal (`AssistantScreen`):** Chat por texto y **grabación de voz con micrófono (`expo-av`)** conectado a **Gemini 2.5 Flash**, lectura en voz alta (`expo-speech`) y botón **Guardar Guía** para convertir cualquier respuesta en un checklist offline.
4. **Checklists Interactivos (`GuidesScreen`):** Seguimiento paso a paso persistido en SQLite y lectura en voz alta de pasos pendientes.

## Cómo ejecutar el proyecto
```bash
npm install
npx expo start
```
1. Instala **Expo Go** en tu iPhone (App Store) o Android (Play Store).
2. Escanea el código QR generado por `npx expo start`.
3. *(Opcional)* Pega tu **Gemini API Key** de [Google AI Studio](https://aistudio.google.com/) en la pestaña **Perfil** dentro de la app (o en `.env` como `EXPO_PUBLIC_GEMINI_API_KEY`).

## Documentación y Esquema de Base de Datos
- 🎨 **Boceto Visual Interactivo:** [docs/boceto_nexoclaro.html](docs/boceto_nexoclaro.html)
- 📄 **Documentación Técnica y Funcional:** [docs/DOCUMENTACION_FASE2.md](docs/DOCUMENTACION_FASE2.md)
- 🗄️ **Esquema Relacional SQL (SQLite / MySQL):** [docs/schema_nexoclaro.sql](docs/schema_nexoclaro.sql)
