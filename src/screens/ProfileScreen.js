import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { COLORS } from '../theme';

const GRUPOS = [
  { id: 'adulto_mayor', label: '👵 Adulto mayor' },
  { id: 'primera_generacion', label: '🎓 Estudiante 1ª generación' },
  { id: 'migrante', label: '🌎 Persona migrante' },
  { id: 'general', label: '👤 Público general' },
];

export default function ProfileScreen() {
  const { perfil, updatePerfil, apiKey, setApiKey, fs } = useApp();
  const [grupo, setGrupo] = useState(perfil?.grupo_objetivo || 'adulto_mayor');
  const [idioma, setIdioma] = useState(perfil?.idioma || 'es');
  const [nivel, setNivel] = useState(perfil?.nivel_lectura || 'muy_sencillo');
  const [textoGrande, setTextoGrande] = useState(Boolean(perfil?.texto_grande));
  const [lecturaAuto, setLecturaAuto] = useState(Boolean(perfil?.lectura_auto));
  const [localKey, setLocalKey] = useState(apiKey);

  const handleSave = () => {
    updatePerfil({
      nombre: perfil?.nombre || 'Usuario NexoClaro',
      grupo_objetivo: grupo,
      idioma,
      nivel_lectura: nivel,
      texto_grande: textoGrande,
      lectura_auto: lecturaAuto,
    });
    setApiKey(localKey.trim());
    Alert.alert(
      idioma === 'en' ? 'Profile Saved' : 'Perfil Guardado en SQLite',
      idioma === 'en'
        ? 'Your accessibility preferences have been updated.'
        : 'Tus preferencias de accesibilidad, idioma y voz se guardaron correctamente.'
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontSize: fs(24) }]}>
          Configura tu <Text style={styles.titleGold}>guía</Text>
        </Text>
        <Text style={[styles.sub, { fontSize: fs(13) }]}>
          Adaptamos el tono, idioma y tamaño de letra para ti
        </Text>

        {/* Grupo objetivo */}
        <Text style={[styles.label, { fontSize: fs(14) }]}>Perfil de atención</Text>
        <View style={styles.optionsWrap}>
          {GRUPOS.map((g) => {
            const active = grupo === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGrupo(g.id)}
                style={[styles.optionCard, active && styles.optionActive]}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive, { fontSize: fs(14) }]}>
                  {g.label}
                </Text>
                {active && <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Idioma */}
        <Text style={[styles.label, { fontSize: fs(14) }]}>Idioma de respuestas</Text>
        <View style={styles.row}>
          {[
            { id: 'es', label: '🇲🇽 Español' },
            { id: 'en', label: '🇺🇸 English' },
          ].map((lang) => {
            const active = idioma === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setIdioma(lang.id)}
                style={[styles.pillBtn, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive, { fontSize: fs(14) }]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nivel de lectura */}
        <Text style={[styles.label, { fontSize: fs(14) }]}>Nivel de explicación</Text>
        <View style={styles.row}>
          {[
            { id: 'muy_sencillo', label: 'Muy sencillo' },
            { id: 'estandar', label: 'Estándar' },
          ].map((lvl) => {
            const active = nivel === lvl.id;
            return (
              <TouchableOpacity
                key={lvl.id}
                onPress={() => setNivel(lvl.id)}
                style={[styles.pillBtn, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive, { fontSize: fs(14) }]}>
                  {lvl.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Switches de accesibilidad */}
        <GlassCard style={styles.switchCard}>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { fontSize: fs(14) }]}>🔎 Letra extra grande</Text>
            <Switch
              value={textoGrande}
              onValueChange={setTextoGrande}
              trackColor={{ true: COLORS.emerald }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { fontSize: fs(14) }]}>🔊 Lectura automática en voz</Text>
            <Switch
              value={lecturaAuto}
              onValueChange={setLecturaAuto}
              trackColor={{ true: COLORS.emerald }}
            />
          </View>
        </GlassCard>

        {/* Gemini API Key opcional en vivo */}
        <Text style={[styles.label, { fontSize: fs(14) }]}>Gemini API Key (Opcional en vivo)</Text>
        <TextInput
          style={[styles.keyInput, { fontSize: fs(13) }]}
          value={localKey}
          onChangeText={setLocalKey}
          placeholder="AIzaSy... (de Google AI Studio)"
          placeholderTextColor={COLORS.muted}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={[styles.saveBtnText, { fontSize: fs(15) }]}>Guardar Perfil en SQLite</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 18, paddingBottom: 115 },
  title: { fontWeight: '800', color: COLORS.obsidian },
  titleGold: { fontStyle: 'italic', color: COLORS.gold },
  sub: { color: COLORS.muted, marginTop: 2, marginBottom: 18 },
  label: { fontWeight: '700', color: COLORS.obsidian, marginBottom: 8, marginTop: 6 },
  optionsWrap: { gap: 8, marginBottom: 14 },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    borderRadius: 16,
    padding: 14,
  },
  optionActive: { borderColor: COLORS.gold, borderWidth: 1.5, backgroundColor: '#FFFDF8' },
  optionText: { fontWeight: '600', color: COLORS.obsidian },
  optionTextActive: { fontWeight: '800' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  pillBtn: {
    flex: 1,
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  pillActive: { backgroundColor: COLORS.obsidian, borderColor: COLORS.obsidian },
  pillText: { fontWeight: '700', color: COLORS.muted },
  pillTextActive: { color: COLORS.white },
  switchCard: { marginVertical: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontWeight: '700', color: COLORS.obsidian },
  divider: { height: 1, backgroundColor: COLORS.subtleBorder, marginVertical: 12 },
  keyInput: {
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    borderRadius: 14,
    padding: 13,
    color: COLORS.obsidian,
    marginBottom: 18,
  },
  saveBtn: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  saveBtnText: { color: COLORS.white, fontWeight: '800' },
});
