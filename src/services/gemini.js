const GEMINI_MODEL = 'gemini-2.5-flash';

function buildSystemInstruction(perfil) {
  const grupos = {
    adulto_mayor: 'un adulto mayor que necesita explicaciones pacientes, cálidas, sin tecnicismos y pasos muy claros',
    primera_generacion: 'un estudiante universitario de primera generación que nunca ha realizado trámites de becas o escolares',
    migrante: 'una persona migrante que puede desconocer términos legales locales y necesita orientación empática y directa',
    general: 'una persona que busca entender trámites o derechos oficiales de manera sencilla',
  };

  const idiomaTexto = perfil?.idioma === 'en' ? 'English' : 'Español sencillo';
  const nivelTexto =
    perfil?.nivel_lectura === 'muy_sencillo'
      ? 'Usa palabras cotidianas, frases cortas y evita siglas sin explicarlas.'
      : 'Usa un tono claro, amable y directo.';

  return `Eres NexoClaro, un asistente social inclusivo diseñado para reducir la brecha de acceso a becas, trámites, salud y empleo (ODS 10).
Estás atendiendo a ${grupos[perfil?.grupo_objetivo] || grupos.general}.
Idioma obligatorio de respuesta: ${idiomaTexto}.
Regla de claridad: ${nivelTexto}
Formato obligatorio:
- Empieza con una frase breve y amable de 1 línea.
- Da una lista numerada de máximo 4 o 5 pasos concretos (1., 2., 3., ...).
- Termina indicando qué documento básico necesita tener a la mano.`;
}

export async function askGemini({ apiKey, perfil, textPrompt, audioBase64 = null, audioMimeType = 'audio/m4a' }) {
  const cleanKey = (apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '').trim();

  if (!cleanKey) {
    return {
      text: buildOfflineDemoReply(textPrompt, perfil),
      isDemoFallback: true,
    };
  }

  const parts = [];
  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType: audioMimeType,
        data: audioBase64,
      },
    });
    parts.push({
      text:
        perfil?.idioma === 'en'
          ? 'Listen to the user audio question and answer following your system instructions.'
          : 'Escucha la pregunta en audio del usuario y respóndele siguiendo tus instrucciones de claridad y pasos numerados.',
    });
  } else {
    parts.push({ text: textPrompt });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${cleanKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(perfil) }],
        },
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error Gemini (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    throw new Error('Gemini no devolvió texto en la respuesta.');
  }
  return { text: reply.trim(), isDemoFallback: false };
}

export function extractStepsFromText(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^\d+[\.\)]\s+/.test(l) || /^[-•]\s+/.test(l))
    .map((l) => l.replace(/^\d+[\.\)]\s+/, '').replace(/^[-•]\s+/, '').replace(/\*\*/g, '').trim());

  if (lines.length >= 2) return lines.slice(0, 6);

  return text
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 15)
    .slice(0, 4);
}

function buildOfflineDemoReply(prompt, perfil) {
  const isEn = perfil?.idioma === 'en';
  if (isEn) {
    return `Here is a simple guide for your question (Offline Demo Mode — add your Gemini API Key in Profile for live AI):\n1. Prepare your official ID and basic personal details.\n2. Check the official portal or visit your nearest local office.\n3. Keep your confirmation receipt or folio number safe.\n4. Save this guide to your offline checklist.`;
  }
  return `¡Con gusto te ayudo con eso! (Modo Demo Local — agrega tu Gemini API Key en Perfil para respuestas en vivo):\n1. Ten a la mano tu identificación oficial (INE) y tu CURP.\n2. Acércate al módulo oficial o entra al portal gob.mx correspondiente.\n3. Llena el formulario con tu correo o teléfono activo.\n4. Guarda tu comprobante o número de folio para dar seguimiento.`;
}
