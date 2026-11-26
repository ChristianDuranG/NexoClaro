import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { File } from 'expo-file-system';
import { useApp } from '../context/AppContext';
import { askGemini, extractStepsFromText } from '../services/gemini';
import { saveConsultaIA, saveCustomGuide } from '../db/database';
import { COLORS } from '../theme';

const QUICK_PROMPTS_ES = [
  '¿Cómo tramito mi CURP gratis?',
  '¿Qué necesito para pedir una beca?',
  '¿Cómo me registro al IMSS-Bienestar?',
];

const QUICK_PROMPTS_EN = [
  'How do I apply for a scholarship?',
  'Explain free public healthcare registration',
];

export default function AssistantScreen({ navigation }) {
  const { perfil, apiKey, refreshServicios, setSelectedServiceId, fs } = useApp();
  const isEn = perfil?.idioma === 'en';
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: isEn
        ? 'Hello! I am NexoClaro. Ask me by typing or pressing the microphone, and I will explain any procedure in simple steps.'
        : '¡Hola! Soy NexoClaro. Escríbeme o presiona el micrófono para explicarte cualquier beca, trámite o servicio de salud paso a paso.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [speakingId, setSpeakingId] = useState(null);

  const speakText = (msgId, text) => {
    if (speakingId === msgId) {
      Speech.stop();
      setSpeakingId(null);
      return;
    }
    Speech.stop();
    setSpeakingId(msgId);
    Speech.speak(text.replace(/\*\*/g, ''), {
      language: isEn ? 'en-US' : 'es-MX',
      rate: 0.92,
      onDone: () => setSpeakingId(null),
      onStopped: () => setSpeakingId(null),
    });
  };

  const sendTextQuestion = async (questionText) => {
    const q = (questionText ?? input).trim();
    if (!q || loading) return;

    const userMsg = { id: `${Date.now()}-u`, role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { text } = await askGemini({ apiKey, perfil, textPrompt: q });
      const aiMsg = { id: `${Date.now()}-a`, role: 'ai', text, question: q };
      setMessages((prev) => [...prev, aiMsg]);
      if (perfil?.id) {
        saveConsultaIA(perfil.id, q, text, perfil.idioma || 'es');
      }
      if (perfil?.lectura_auto) {
        speakText(aiMsg.id, text);
      }
    } catch (err) {
      Alert.alert('Aviso', err.message || 'No se pudo conectar con Gemini.');
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      // Stop and send audio to Gemini
      setLoading(true);
      try {
        await recorder.stop();
        const uri = recorder.uri;
        setRecording(false);
        if (!uri) throw new Error('No se generó el archivo de audio.');

        const base64 = await new File(uri).base64();

        const userMsg = {
          id: `${Date.now()}-u`,
          role: 'user',
          text: isEn ? '🎙️ Voice question sent' : '🎙️ Consulta de voz enviada',
        };
        setMessages((prev) => [...prev, userMsg]);

        const { text } = await askGemini({
          apiKey,
          perfil,
          textPrompt: 'Consulta por voz',
          audioBase64: base64,
          audioMimeType: 'audio/m4a',
        });

        const aiMsg = {
          id: `${Date.now()}-a`,
          role: 'ai',
          text,
          question: isEn ? 'Voice Guide' : 'Guía por Voz',
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (perfil?.id) {
          saveConsultaIA(perfil.id, '[Audio de voz]', text, perfil.idioma || 'es');
        }
        if (perfil?.lectura_auto) {
          speakText(aiMsg.id, text);
        }
      } catch (err) {
        setRecording(false);
        Alert.alert('Error de audio', err.message || 'No se pudo procesar el audio.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Start recording
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso requerido', 'Activa el permiso del micrófono para hablar con NexoClaro.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch (err) {
      Alert.alert('Micrófono', err.message || 'No se pudo iniciar la grabación.');
    }
  };

  const handleSaveAsChecklist = (msg) => {
    const steps = extractStepsFromText(msg.text);
    const title = (msg.question || 'Guía NexoClaro').slice(0, 48);
    const newId = saveCustomGuide({
      categoria: 'IA Guardada',
      titulo: title,
      resumen_claro: msg.text.split('\n')[0] || 'Guía generada con Gemini',
      pasos: steps,
    });
    refreshServicios();
    setSelectedServiceId(newId);
    Alert.alert(
      isEn ? 'Saved Offline!' : '¡Guardada en SQLite!',
      isEn
        ? 'Your step-by-step checklist is now available without internet.'
        : 'Tu guía paso a paso ya está lista en la pestaña Guías incluso sin internet.',
      [
        { text: 'OK' },
        { text: isEn ? 'Open Guides' : 'Ir a Guías', onPress: () => navigation.navigate('Guías') },
      ]
    );
  };

  const prompts = isEn ? QUICK_PROMPTS_EN : QUICK_PROMPTS_ES;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontSize: fs(20) }]}>
              Asistente <Text style={styles.titleGold}>NexoClaro</Text>
            </Text>
            <Text style={[styles.sub, { fontSize: fs(12) }]}>
              Gemini 2.5 Flash · {perfil?.idioma === 'en' ? 'English' : 'Español'} ·{' '}
              {perfil?.nivel_lectura === 'muy_sencillo' ? 'Muy sencillo' : 'Estándar'}
            </Text>
          </View>
        </View>

        {/* Sugerencias rápidas */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {prompts.map((p) => (
              <TouchableOpacity key={p} style={styles.quickChip} onPress={() => sendTextQuestion(p)}>
                <Text style={[styles.quickText, { fontSize: fs(12) }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <View key={m.id} style={[styles.bubble, isUser ? styles.bUser : styles.bAi]}>
                <Text style={[isUser ? styles.tUser : styles.tAi, { fontSize: fs(14) }]}>
                  {m.text}
                </Text>
                {!isUser && (
                  <View style={styles.aiActions}>
                    <TouchableOpacity
                      style={styles.actionPill}
                      onPress={() => speakText(m.id, m.text)}
                    >
                      <Ionicons
                        name={speakingId === m.id ? 'stop-circle' : 'volume-high'}
                        size={16}
                        color={COLORS.gold}
                      />
                      <Text style={[styles.actionText, { fontSize: fs(12) }]}>
                        {speakingId === m.id
                          ? isEn ? 'Stop' : 'Detener'
                          : isEn ? 'Listen' : 'Escuchar'}
                      </Text>
                    </TouchableOpacity>

                    {m.id !== 'welcome' && (
                      <TouchableOpacity
                        style={[styles.actionPill, styles.savePill]}
                        onPress={() => handleSaveAsChecklist(m)}
                      >
                        <Ionicons name="bookmark" size={15} color={COLORS.emerald} />
                        <Text style={[styles.saveText, { fontSize: fs(12) }]}>
                          {isEn ? 'Save Checklist' : 'Guardar Guía'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
          {loading && (
            <View style={[styles.bubble, styles.bAi, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
              <ActivityIndicator color={COLORS.gold} />
              <Text style={[styles.tAi, { fontSize: fs(13) }]}>
                {isEn ? 'Thinking clearly...' : 'Preparando explicación clara...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Dock */}
        <View style={styles.dockWrap}>
          <View style={styles.dock}>
            <TextInput
              style={[styles.input, { fontSize: fs(14) }]}
              value={input}
              onChangeText={setInput}
              placeholder={isEn ? 'Type or tap mic to speak...' : 'Escribe o toca el micrófono...'}
              placeholderTextColor={COLORS.muted}
              multiline
            />
            <TouchableOpacity
              style={[styles.iconBtn, recording && styles.recordingBtn]}
              onPress={toggleRecording}
            >
              <Ionicons name={recording ? 'stop' : 'mic'} size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendTextQuestion()}>
              <Ionicons name="send" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {recording && (
            <Text style={styles.recBanner}>
              ● {isEn ? 'Recording voice... tap stop to send' : 'Grabando voz... toca ⏹ para enviar'}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.subtleBorder,
    backgroundColor: COLORS.glassStrong,
  },
  title: { fontWeight: '800', color: COLORS.obsidian },
  titleGold: { fontStyle: 'italic', color: COLORS.gold },
  sub: { color: COLORS.muted, marginTop: 2 },
  chipsRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  quickChip: {
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  quickText: { color: COLORS.obsidian, fontWeight: '600' },
  chatContainer: { padding: 16, paddingBottom: 24, gap: 12 },
  bubble: {
    maxWidth: '90%',
    borderRadius: 18,
    padding: 14,
  },
  bUser: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.obsidian,
    borderBottomRightRadius: 4,
  },
  bAi: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderBottomLeftRadius: 4,
    shadowColor: '#121316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tUser: { color: COLORS.white, lineHeight: 21 },
  tAi: { color: COLORS.obsidian, lineHeight: 22 },
  aiActions: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionText: { fontWeight: '700', color: COLORS.gold },
  savePill: { backgroundColor: COLORS.emeraldLight },
  saveText: { fontWeight: '700', color: COLORS.emerald },
  dockWrap: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 94,
    backgroundColor: COLORS.cream,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glassStrong,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 6,
  },
  input: { flex: 1, maxHeight: 90, color: COLORS.obsidian },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingBtn: { backgroundColor: COLORS.danger },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBanner: {
    textAlign: 'center',
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 12,
    marginTop: 6,
  },
});

