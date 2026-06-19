import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { mockDashboard } from '@/mocks/dashboard';
import { mockMovimientos } from '@/mocks/movimientos';
import { COLORS, FONT, RADIUS, SHADOW, SPACE, formatCurrency, formatDate } from '@/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const QUICK_ACTIONS = [
  { id: 'creditos', label: 'Mis Créditos', icon: 'cash-outline' as IoniconsName, tab: '/(tabs)/creditos', color: '#E8F4FD', iconColor: '#2B6CB0' },
  { id: 'aportes',  label: 'Mis Aportes',  icon: 'trending-up-outline' as IoniconsName, tab: '/(tabs)/aportes', color: '#EBFBEE', iconColor: '#276749' },
  { id: 'pagar',    label: 'Pagar Cuota',  icon: 'card-outline' as IoniconsName, tab: '/(tabs)/creditos', color: '#FFF8E6', iconColor: '#975A16' },
  { id: 'avisos',   label: 'Avisos',       icon: 'notifications-outline' as IoniconsName, tab: '/(tabs)/notificaciones', color: '#FFF5F5', iconColor: '#9B2C2C' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const d = mockDashboard;
  const movimientos = mockMovimientos.slice(0, 5);

  const scoreColor =
    d.resumenScore.score >= 80 ? COLORS.success :
    d.resumenScore.score >= 60 ? COLORS.warning : COLORS.danger;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── Header gradient ── */}
        <LinearGradient colors={['#0A2342', '#0D2D57']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hola, {user?.nombre ?? 'Socio'} 👋</Text>
              <Text style={styles.headerSub}>Socio #{user?.numeroSocio}</Text>
            </View>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push('/(tabs)/notificaciones')}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Score */}
          <View style={styles.scoreRow}>
            <Ionicons name="ribbon-outline" size={16} color={COLORS.accent} />
            <Text style={styles.scoreLabel}>Score Cooperativo</Text>
            <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
              <Text style={styles.scoreBadgeText}>{d.resumenScore.score} / {d.resumenScore.scoreMax}</Text>
            </View>
            <Text style={styles.scoreCategoria}>{d.resumenScore.categoria}</Text>
          </View>

          {/* Balance cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScroll}
            contentContainerStyle={styles.cardsContent}
          >
            {/* Card 1: Aportes */}
            <LinearGradient
              colors={['#F2C94C', '#D4A017']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceCard}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
                <Text style={styles.cardTypeLabel}>Mis Aportes</Text>
              </View>
              <Text style={styles.cardAmount}>{formatCurrency(d.aportes.totalAcumulado)}</Text>
              <Text style={styles.cardSub}>Tasa {d.aportes.tasaRendimientoAnual}% anual</Text>
            </LinearGradient>

            {/* Card 2: Próxima cuota */}
            <View style={[styles.balanceCard, styles.balanceCardDark]}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
                <Text style={[styles.cardTypeLabel, { color: COLORS.accent }]}>Próxima Cuota</Text>
              </View>
              <Text style={[styles.cardAmount, { color: COLORS.white }]}>
                {formatCurrency(d.proximaCuota.monto)}
              </Text>
              <Text style={[styles.cardSub, { color: 'rgba(255,255,255,0.65)' }]}>
                Vence {formatDate(d.proximaCuota.fecha)} · {d.proximaCuota.diasRestantes} días
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>

        {/* ── Content area ── */}
        <View style={styles.content}>

          {/* Quick actions */}
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => router.push(action.tab as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIconBox, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={22} color={action.iconColor} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent movements */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Movimientos recientes</Text>
          </View>

          {movimientos.map((mov, i) => (
            <View key={mov.id} style={[styles.movRow, i < movimientos.length - 1 && styles.movRowBorder]}>
              <View style={[
                styles.movIconBox,
                { backgroundColor: mov.tipo === 'RENDIMIENTO' ? COLORS.successBg : mov.tipo === 'APORTE' ? '#EBFBEE' : '#FFF5F5' },
              ]}>
                <Ionicons
                  name={mov.icono as IoniconsName}
                  size={18}
                  color={mov.tipo === 'RENDIMIENTO' ? COLORS.success : mov.tipo === 'APORTE' ? '#276749' : '#9B2C2C'}
                />
              </View>
              <View style={styles.movInfo}>
                <Text style={styles.movDesc} numberOfLines={1}>{mov.descripcion}</Text>
                <Text style={styles.movDate}>{mov.fechaFormato}</Text>
              </View>
              <Text style={[
                styles.movAmount,
                mov.signo === 'CREDITO' ? styles.movCredit : styles.movDebit,
              ]}>
                {mov.signo === 'CREDITO' ? '+' : '-'}{formatCurrency(mov.monto)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  // Header
  header: {
    paddingHorizontal: SPACE.base,
    paddingTop: SPACE.base,
    paddingBottom: SPACE['2xl'],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FONT.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: FONT.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  bellBtn: {
    position: 'relative',
    padding: SPACE.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.full,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  // Score
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACE.md,
    marginBottom: SPACE.base,
  },
  scoreLabel: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.75)' },
  scoreBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  scoreBadgeText: { fontSize: FONT.xs, fontWeight: '700', color: '#fff' },
  scoreCategoria: { fontSize: FONT.sm, color: COLORS.accent, fontWeight: '600' },
  // Balance cards
  cardsScroll: { marginBottom: -SPACE['2xl'] },
  cardsContent: { gap: SPACE.md, paddingRight: SPACE.base },
  balanceCard: {
    width: 220,
    borderRadius: RADIUS.xl,
    padding: SPACE.base,
    ...SHADOW.md,
  },
  balanceCardDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACE.sm },
  cardTypeLabel: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.primaryDark },
  cardAmount: { fontSize: FONT['3xl'], fontWeight: '800', color: COLORS.primaryDark, letterSpacing: -0.5 },
  cardSub: { fontSize: FONT.xs, color: COLORS.gray700, marginTop: 2 },
  // Content
  content: {
    backgroundColor: COLORS.gray50,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    marginTop: -SPACE.lg,
    paddingTop: SPACE['2xl'],
    paddingHorizontal: SPACE.base,
    paddingBottom: SPACE['3xl'],
    minHeight: 500,
  },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900, marginBottom: SPACE.md },
  // Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.md,
    marginBottom: SPACE.xl,
  },
  actionItem: { width: '22%', alignItems: 'center', gap: SPACE.xs },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: FONT.xs, fontWeight: '600', color: COLORS.gray700, textAlign: 'center' },
  // Movements
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACE.md,
    gap: SPACE.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACE.md,
    marginBottom: SPACE.sm,
    ...SHADOW.sm,
  },
  movRowBorder: {},
  movIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movInfo: { flex: 1 },
  movDesc: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.gray900 },
  movDate: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 2 },
  movAmount: { fontSize: FONT.sm, fontWeight: '700' },
  movCredit: { color: COLORS.success },
  movDebit: { color: COLORS.gray900 },
});
