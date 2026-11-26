import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { getPasosByServicio, togglePasoCompletado } from '../db/database';
import { COLORS } from '../theme';

export default function GuidesScreen() {
  const {
    perfil,
    servicios,
    selectedServiceId,
    setSelectedServiceId,
    refreshServicios,
    fs,
  } = useApp();
  const isEn = perfil?.idioma === 'en';
  const [pasos, setPasos] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  const currentService =
    servicios.find((s) => s.id === selectedServiceId) || servicios[0] || null;

  useEffect(() => {
    if (currentService) {
      setPasos(getPasosByServicio(currentService.id));
    }
  }, [currentService?.id, servicios]);

  const handleToggle = (paso) => {
    togglePasoCompletado(paso.id, paso.completado);
    setPasos(getPasosByServicio(currentService.id));
    refreshServicios();
  };

  const total = pasos.length;
  const done = pasos.filter((p) => p.completado === 1).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const readPendingSteps = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    const pending = pasos.filter((p) => !p.completado);
    const listToRead = pending.length > 0 ? pending : pasos;
    const text = listToRead.map((p) => `Paso ${p.orden}: ${p.instruccion}`).join('. ');
    setSpeaking(true);
    Speech.speak(text, {
      language: isEn ? 'en-US' : 'es-MX',
      rate: 0.92,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { fontSize: fs(24) }]}>
          {isEn ? 'My Offline ' : 'Mis '}
          <Text style={styles.titleGold}>{isEn ? 'Guides' : 'Guías'}</Text>
        </Text>
        <Text style={[styles.sub, { fontSize: fs(13) }]}>
          {isEn ? 'Synced locally in SQLite · Works offline' : 'Guardadas en SQLite · Sin internet'}
        </Text>

        {/* Selector horizontal de guías */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorRow}>
          {servicios.map((s) => {
            const active = currentService?.id === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedServiceId(s.id)}
                style={[styles.selChip, active && styles.selChipActive]}
              >
                <Text
                  style={[styles.selText, active && styles.selTextActive, { fontSize: fs(12.5) }]}
                  numberOfLines={1}
                >
                  {s.titulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {currentService && (
          <>
            <GlassCard style={styles.progressCard}>
              <View style={styles.rowBetween}>
                <View style={styles.badge}>
                  <Text style={[styles.badgeText, { fontSize: fs(11) }]}>
                    {currentService.categoria}
                  </Text>
                </View>
                <Text style={[styles.pctText, { fontSize: fs(15) }]}>{pct}%</Text>
              </View>
              <Text style={[styles.guideTitle, { fontSize: fs(18) }]}>{currentService.titulo}</Text>
              <Text style={[styles.guideMeta, { fontSize: fs(13) }]}>
                {currentService.resumen_claro}
              </Text>
              <Text style={[styles.reqText, { fontSize: fs(12) }]}>
                <Text style={{ fontWeight: '700' }}>
                  {isEn ? 'Requirements: ' : 'Requisitos: '}
                </Text>
                {currentService.requisitos}
              </Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` }]} />
              </View>
              <Text style={[styles.countText, { fontSize: fs(12) }]}>
                {done} de {total} {isEn ? 'steps completed' : 'pasos completados'}
              </Text>
            </GlassCard>

            {/* Checklist de Pasos */}
            <View style={styles.stepsList}>
              {pasos.map((paso) => {
                const isDone = paso.completado === 1;
                return (
                  <TouchableOpacity
                    key={paso.id}
                    activeOpacity={0.8}
                    onPress={() => handleToggle(paso)}
                    style={[styles.stepCard, isDone && styles.stepDone]}
                  >
                    <Ionicons
                      name={isDone ? 'checkbox' : 'square-outline'}
                      size={24}
                      color={isDone ? COLORS.emerald : COLORS.gold}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.stepNum, { fontSize: fs(12) }]}>
                        {isEn ? `Step ${paso.orden}` : `Paso ${paso.orden}`}
                      </Text>
                      <Text
                        style={[
                          styles.stepText,
                          isDone && styles.stepTextDone,
                          { fontSize: fs(14) },
                        ]}
                      >
                        {paso.instruccion}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.voiceBtn} onPress={readPendingSteps}>
              <Ionicons
                name={speaking ? 'stop-circle' : 'volume-high'}
                size={20}
                color={COLORS.obsidian}
              />
              <Text style={[styles.voiceText, { fontSize: fs(14) }]}>
                {speaking
                  ? isEn ? 'Stop reading' : 'Detener lectura'
                  : isEn ? 'Read pending steps aloud' : 'Leer pasos pendientes en voz alta'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 18, paddingBottom: 110 },
  title: { fontWeight: '800', color: COLORS.obsidian },
  titleGold: { fontStyle: 'italic', color: COLORS.gold },
  sub: { color: COLORS.muted, marginTop: 2, marginBottom: 14 },
  selectorRow: { marginBottom: 16 },
  selChip: {
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    maxWidth: 210,
  },
  selChipActive: { backgroundColor: COLORS.obsidian, borderColor: COLORS.obsidian },
  selText: { fontWeight: '700', color: COLORS.muted },
  selTextActive: { color: COLORS.white },
  progressCard: { marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: COLORS.gold, fontWeight: '700' },
  pctText: { fontWeight: '800', color: COLORS.emerald },
  guideTitle: { fontWeight: '800', color: COLORS.obsidian, marginBottom: 6 },
  guideMeta: { color: COLORS.ink, lineHeight: 20, marginBottom: 8 },
  reqText: { color: COLORS.muted, marginBottom: 12 },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(18, 19, 22, 0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: COLORS.emerald, borderRadius: 999 },
  countText: { color: COLORS.muted, fontWeight: '600', marginTop: 6 },
  stepsList: { gap: 10, marginBottom: 18 },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 16,
    padding: 14,
  },
  stepDone: {
    backgroundColor: 'rgba(240, 253, 244, 0.9)',
    borderColor: '#BBF7D0',
  },
  stepNum: { fontWeight: '800', color: COLORS.gold, marginBottom: 2 },
  stepText: { color: COLORS.obsidian, lineHeight: 20 },
  stepTextDone: { color: COLORS.muted, textDecorationLine: 'line-through' },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1.5,
    borderColor: COLORS.subtleBorder,
    padding: 14,
    borderRadius: 16,
  },
  voiceText: { fontWeight: '700', color: COLORS.obsidian },
});
