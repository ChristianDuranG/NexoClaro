import React, { useState } from 'react';
import {
  Linking,
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

const CAT_TILES = [
  { id: 'Becas', icon: 'school', title: 'Becas', sub: 'Apoyos y registro' },
  { id: 'Trámites', icon: 'document-text', title: 'Trámites', sub: 'SAT, CURP, pensión' },
  { id: 'Salud', icon: 'medkit', title: 'Salud', sub: 'IMSS-Bienestar' },
  { id: 'Empleo', icon: 'briefcase', title: 'Empleo', sub: 'Capacitación' },
];

export default function HomeScreen({ navigation }) {
  const { perfil, servicios, refreshServicios, setSelectedServiceId, fs } = useApp();
  const [catActiva, setCatActiva] = useState('Todas');
  const isEn = perfil?.idioma === 'en';

  const handleSelectCat = (cat) => {
    const next = catActiva === cat ? 'Todas' : cat;
    setCatActiva(next);
    refreshServicios(next);
  };

  const openGuide = (id) => {
    setSelectedServiceId(id);
    navigation.navigate('Guías');
  };

  const openOfficialUrl = (url) => {
    if (!url || !url.startsWith('http')) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header estilo Boceto Luxury */}
        <GlassCard style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { fontSize: fs(24) }]}>
                Nexo<Text style={styles.titleGold}>Claro</Text>
              </Text>
              <Text style={[styles.subtitle, { fontSize: fs(13) }]}>
                {isEn
                  ? 'Rights & services without barriers'
                  : 'Derechos y servicios sin barreras'}
              </Text>
            </View>
            <View style={styles.offlinePill}>
              <View style={styles.dot} />
              <Text style={[styles.offlineText, { fontSize: fs(11) }]}>SQLite Offline</Text>
            </View>
          </View>
        </GlassCard>

        {/* Hero Voz & Gemini CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.heroBtn}
          onPress={() => navigation.navigate('Asistente')}
        >
          <View style={styles.micOrb}>
            <Ionicons name="mic" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, { fontSize: fs(15.5) }]}>
              {isEn ? 'Ask with your voice' : 'Pregunta con tu voz'}
            </Text>
            <Text style={[styles.heroSub, { fontSize: fs(12.5) }]}>
              {isEn ? 'Gemini explains step by step' : 'Gemini explica paso a paso'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
        </TouchableOpacity>

        {/* Cuadrícula 2x2 igual al Boceto */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontSize: fs(15.5) }]}>
            {isEn ? 'Explore offline' : 'Explora sin internet'}
          </Text>
          {catActiva !== 'Todas' && (
            <TouchableOpacity onPress={() => handleSelectCat('Todas')}>
              <Text style={[styles.resetLink, { fontSize: fs(12.5) }]}>
                {isEn ? 'Show all' : 'Ver todas'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.catGrid}>
          {CAT_TILES.map((tile) => {
            const active = catActiva === tile.id;
            return (
              <TouchableOpacity
                key={tile.id}
                activeOpacity={0.85}
                onPress={() => handleSelectCat(tile.id)}
                style={[styles.catTile, active && styles.catTileActive]}
              >
                <View style={styles.tileTop}>
                  <Ionicons
                    name={tile.icon}
                    size={20}
                    color={active ? COLORS.white : COLORS.gold}
                  />
                  <Text style={[styles.tileTitle, active && styles.tileTitleActive, { fontSize: fs(14.5) }]}>
                    {tile.title}
                  </Text>
                </View>
                <Text style={[styles.tileSub, active && styles.tileSubActive, { fontSize: fs(12) }]}>
                  {tile.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Guías más tramitadas de la categoría */}
        <Text style={[styles.sectionTitle, { fontSize: fs(15.5), marginBottom: 10 }]}>
          {catActiva === 'Todas'
            ? isEn ? 'Popular guides' : 'Guías más tramitadas'
            : `${catActiva}: ${isEn ? 'Most requested' : 'Más solicitadas'}`}
        </Text>

        <View style={styles.list}>
          {servicios.map((item) => {
            const total = item.total_pasos || 0;
            const done = item.pasos_completados || 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const hasUrl = item.fuente_oficial && item.fuente_oficial.startsWith('http');

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
                  <Text style={[styles.guideTitle, { fontSize: fs(15.5) }]}>{item.titulo}</Text>
                  <Text style={[styles.guideDesc, { fontSize: fs(12.5) }]} numberOfLines={2}>
                    {item.resumen_claro}
                  </Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                  </View>
                  {hasUrl && (
                    <TouchableOpacity
                      style={styles.linkBtn}
                      onPress={() => openOfficialUrl(item.fuente_oficial)}
                    >
                      <Ionicons name="open-outline" size={14} color={COLORS.gold} />
                      <Text style={[styles.linkText, { fontSize: fs(12) }]} numberOfLines={1}>
                        {isEn ? 'Official portal' : 'Ir al portal oficial'}
                      </Text>
                    </TouchableOpacity>
                  )}
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
  scroll: { padding: 16, paddingBottom: 110 },
  headerCard: { marginBottom: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
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
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 130, 60, 0.5)',
    marginBottom: 18,
  },
  micOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { color: COLORS.white, fontWeight: '800' },
  heroSub: { color: '#D4D4D8', marginTop: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: '800', color: COLORS.obsidian },
  resetLink: { fontWeight: '700', color: COLORS.gold },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  catTile: {
    width: '48.3%',
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#121316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  catTileActive: {
    backgroundColor: COLORS.obsidian,
    borderColor: COLORS.gold,
  },
  tileTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tileTitle: { fontWeight: '800', color: COLORS.obsidian },
  tileTitleActive: { color: COLORS.white },
  tileSub: { color: COLORS.muted },
  tileSubActive: { color: '#D4D4D8' },
  list: { gap: 12 },
  guideCard: { marginBottom: 2 },
  guideTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  linkText: { fontWeight: '700', color: COLORS.gold },
});
