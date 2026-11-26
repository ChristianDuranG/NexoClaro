export const COLORS = {
  cream: '#F6F3EC',
  creamDark: '#ECE6DA',
  obsidian: '#121316',
  charcoal: '#27272A',
  ink: '#18181B',
  muted: '#57534E',
  gold: '#A8823C',
  goldLight: 'rgba(168, 130, 60, 0.14)',
  emerald: '#0F766E',
  emeraldLight: 'rgba(15, 118, 110, 0.12)',
  glass: 'rgba(255, 255, 255, 0.78)',
  glassStrong: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.96)',
  subtleBorder: 'rgba(18, 19, 22, 0.10)',
  white: '#FFFFFF',
  danger: '#B91C1C',
};

export function scaleFont(base, textoGrande) {
  return textoGrande ? Math.round(base * 1.2) : base;
}
