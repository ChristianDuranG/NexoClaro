import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { COLORS } from '../theme';

const CATEGORIAS = ['Todas', 'Becas', 'Trámites', 'Salud', 'Empleo'];

export default function HomeScreen({ navigation }) {
  const { perfil, servicios, refreshServicios, setSelectedServiceId, fs } = useApp();
  const [catActiva, setCatActiva] = useState('Todas');
  const isEn = perfil?.idioma === 'en';

  const handleFilter = (cat) => {
    setCatActiva(cat);
    refreshServicios(cat);
  };

  const openGuide = (id) => {
    setSelectedServiceId(id);
    navigation.navigate('Guías');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Luxury */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { fontSize: fs(11) }]}>
              {isEn ? 'INCLUSIVE GUIDE · ODS 10' : 'GUÍA INCLUSIVA · ODS 10'}
            </Text>
            <Text style={[styles.title, { fontSize: fs(26) }]}>
              Nexo<Text style={styles.titleGold}>Claro</Text>
            </Text>
            <Text style={[styles.subtitle, { fontSize: fs(13) }]}>
              {isEn
                ? 'Clear rights & procedures without barriers'
                : 'Derechos y trámites sin barreras'}
            </Text>
          </View>
          <View style={styles.offlinePill}>
            <View style={styles.dot} />
            <Text style={[styles.offlineText, { fontSize: fs(11) }]}>SQLite Offline</Text>
          </View>
        </View>

        {/* Hero Voz & Gemini CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.heroBtn}
          onPress={() => navigation.navigate('Asistente')}
        >
          <View style={styles.micOrb}>
            <Ionicons name="mic" size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, { fontSize: fs(16) }]}>
              {isEn ? 'Ask with your voice or text' : 'Pregunta con tu voz o texto'}
            </Text>
            <Text style={[styles.heroSub, { fontSize: fs(12.5) }]}>
              {isEn
                ? 'Gemini explains step by step in simple words'
                : 'Gemini te explica paso a paso y sin tecnicismos'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.gold} />
        </TouchableOpacity>

        {/* Categorías */}
        <Text style={[styles.sectionTitle, { fontSize: fs(16) }]}>
          {isEn ? 'Explore offline guides' : 'Explora sin internet'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {CATEGORIAS.map((cat) => {
            const active = cat === catActiva;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleFilter(cat)}
                style={[styles.catChip, active && styles.catChipActive]}
              >
                <Text style={[styles.catText, active && styles.catTextActive, { fontSize: fs(13) }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de Guías en SQLite */}
        <View style={styles.list}>
          {servicios.map((item) => {
            const total = item.total_pasos || 0;
            const done = item.pasos_completados || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => openGuide(item.id)}>
                <GlassCard style={styles.guideCard}>
                  <View style={styles.guideTop}>
                    <View style={styles.tagBadge}>
                      <Text style={[styles.tagText, { fontSize: fs(11) }]}>{item.categoria}</Text>
                    </View>
                    <Text style={[styles.pctText, { fontSize: fs(12) }]}>
                      {done}/{total} {isEn ? 'steps' : 'pasos'} ({pct}%)
                    </Text>
                  </View>
                  <Text style={[styles.guideTitle, { fontSize: fs(16) }]}>{item.titulo}</Text>
                  <Text style={[styles.guideDesc, { fontSize: fs(13) }]} numberOfLines={2}>
                    {item.resumen_claro}
                  </Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 18, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  eyebrow: {
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.gold,
    marginBottom: 2,
  },
  title: { fontWeight: '800', color: COLORS.obsidian, letterSpacing: -0.5 },
  titleGold: { fontStyle: 'italic', color: COLORS.gold },
  subtitle: { color: COLORS.muted, marginTop: 2 },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.emerald },
  offlineText: { fontWeight: '700', color: COLORS.emerald },
  heroBtn: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(168, 130, 60, 0.5)',
    shadowColor: '#121316',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 22,
  },
  micOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { color: COLORS.white, fontWeight: '800' },
  heroSub: { color: '#D4D4D8', marginTop: 2 },
  sectionTitle: { fontWeight: '800', color: COLORS.obsidian, marginBottom: 10 },
  catRow: { marginBottom: 16 },
  catChip: {
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.subtleBorder,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: COLORS.obsidian,
    borderColor: COLORS.obsidian,
  },
  catText: { fontWeight: '700', color: COLORS.muted },
  catTextActive: { color: COLORS.white },
  list: { gap: 12 },
  guideCard: { marginBottom: 2 },
  guideTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: { fontWeight: '700', color: COLORS.gold },
  pctText: { fontWeight: '700', color: COLORS.emerald },
  guideTitle: { fontWeight: '800', color: COLORS.obsidian, marginBottom: 4 },
  guideDesc: { color: COLORS.muted, lineHeight: 19, marginBottom: 10 },
  barBg: {
    height: 7,
    backgroundColor: 'rgba(18, 19, 22, 0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.emerald,
    borderRadius: 999,
  },
});
