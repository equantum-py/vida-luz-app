import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { mockAportes } from '@/mocks/aportes';
import { COLORS, FONT, RADIUS, SHADOW, SPACE, formatCurrency } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_MESES = 6;
const BAR_MAX_H = 90;
const BAR_PADDING = SPACE.base * 2 + SPACE.sm * 5;
const BAR_W = (SCREEN_W - BAR_PADDING) / CHART_MESES;
const MAX_VAL = 50;

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function StatCard({ icon, label, value, sub, accent }: {
  icon: IoniconsName; label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <View style={[stat.card, accent && stat.cardAccent]}>
      <Ionicons name={icon} size={20} color={accent ? COLORS.primary : COLORS.gray500} />
      <Text style={[stat.label, accent && stat.labelAccent]}>{label}</Text>
      <Text style={[stat.value, accent && stat.valueAccent]}>{value}</Text>
      {sub && <Text style={stat.sub}>{sub}</Text>}
    </View>
  );
}

const stat = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACE.md,
    gap: 4,
    ...SHADOW.sm,
  },
  cardAccent: { backgroundColor: COLORS.accent },
  label: { fontSize: FONT.xs, color: COLORS.gray500 },
  labelAccent: { color: COLORS.primaryDark },
  value: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.gray900 },
  valueAccent: { color: COLORS.primary },
  sub: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 1 },
});

export default function AportesScreen() {
  const data = mockAportes;
  const lastSix = data.historial.slice(-CHART_MESES);
  const maxVal = Math.max(...lastSix.map((a) => a.monto), 1);
  const currentMes = 6;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#0A2342', '#0D2D57']} style={styles.header}>
        <Text style={styles.headerTitle}>Mis Aportes</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalAmount}>{formatCurrency(data.totalAcumulado)}</Text>
          <View style={styles.totalBadge}>
            <Ionicons name="trending-up" size={12} color={COLORS.success} />
            <Text style={styles.totalBadgeText}> +{data.tasaRendimiento}% anual</Text>
          </View>
        </View>
        <Text style={styles.totalSub}>Total acumulado · {data.mesesAcumulados} meses como socio</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="wallet-outline"
            label="Aporte mensual"
            value={formatCurrency(data.aporteMensual)}
            accent
          />
          <StatCard
            icon="star-outline"
            label="Proyección 2026"
            value={formatCurrency(data.proyeccionAnual)}
            sub="estimado fin de año"
          />
        </View>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Últimos 6 meses</Text>
          <View style={styles.chart}>
            {lastSix.map((aporte, i) => {
              const barH = Math.round((aporte.monto / maxVal) * BAR_MAX_H);
              const isCurrent = aporte.mes === currentMes;
              return (
                <View key={aporte.id} style={styles.barWrapper}>
                  {/* Amount label */}
                  <Text style={[styles.barAmount, isCurrent && { color: COLORS.primary, fontWeight: '700' }]}>
                    ${aporte.monto}
                  </Text>
                  {/* Bar */}
                  <View style={[styles.barTrack, { height: BAR_MAX_H }]}>
                    <View
                      style={[
                        styles.barFill,
                        { height: barH, backgroundColor: isCurrent ? COLORS.accent : COLORS.primary },
                        isCurrent && { borderWidth: 2, borderColor: COLORS.accentDark },
                      ]}
                    />
                  </View>
                  {/* Month label */}
                  <Text style={[styles.barLabel, isCurrent && { color: COLORS.primary, fontWeight: '700' }]}>
                    {aporte.mesCorto}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.legendText}>Mes actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Meses anteriores</Text>
            </View>
          </View>
        </View>

        {/* Consistency badge */}
        <View style={styles.consistencyCard}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.consistencyTitle}>Aportes regulares</Text>
            <Text style={styles.consistencyText}>
              12 meses consecutivos de aporte puntual. ¡Excelente historial!
            </Text>
          </View>
        </View>

        {/* History list */}
        <Text style={styles.historyTitle}>Historial de aportes</Text>
        {[...data.historial].reverse().map((aporte) => (
          <View key={aporte.id} style={styles.historyRow}>
            <View style={styles.historyDot}>
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyMes}>{aporte.mesLabel}</Text>
              {aporte.fechaPago && (
                <Text style={styles.historyFecha}>Acreditado el {aporte.fechaPago.split('-')[2]} del mes</Text>
              )}
            </View>
            <View>
              <Text style={styles.historyMonto}>{formatCurrency(aporte.monto)}</Text>
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>PAGADO</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { paddingHorizontal: SPACE.base, paddingTop: SPACE.base, paddingBottom: SPACE.xl },
  headerTitle: { fontSize: FONT['2xl'], fontWeight: '800', color: COLORS.white },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm, marginTop: SPACE.sm },
  totalAmount: { fontSize: FONT['4xl'], fontWeight: '800', color: COLORS.white, letterSpacing: -1 },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  totalBadgeText: { fontSize: FONT.xs, fontWeight: '700', color: COLORS.success },
  totalSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACE.base },
  // Stats
  statsRow: { flexDirection: 'row', gap: SPACE.sm, marginBottom: SPACE.md },
  // Chart
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACE.base,
    marginBottom: SPACE.md,
    ...SHADOW.md,
  },
  chartTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900, marginBottom: SPACE.base },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.xs,
  },
  barWrapper: { alignItems: 'center', flex: 1 },
  barAmount: { fontSize: FONT.xs, color: COLORS.gray500, marginBottom: 4 },
  barTrack: { width: '70%', justifyContent: 'flex-end', backgroundColor: COLORS.gray100, borderRadius: 4 },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 6 },
  chartLegend: { flexDirection: 'row', gap: SPACE.base, marginTop: SPACE.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FONT.xs, color: COLORS.gray500 },
  // Consistency
  consistencyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACE.md,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.lg,
    padding: SPACE.base,
    marginBottom: SPACE.base,
  },
  consistencyTitle: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.successText },
  consistencyText: { fontSize: FONT.xs, color: COLORS.successText, marginTop: 2, lineHeight: 18 },
  // History
  historyTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900, marginBottom: SPACE.md },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACE.md,
    marginBottom: SPACE.sm,
    ...SHADOW.sm,
  },
  historyDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: { flex: 1 },
  historyMes: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.gray900 },
  historyFecha: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 2 },
  historyMonto: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900, textAlign: 'right' },
  historyBadge: {
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  historyBadgeText: { fontSize: 9, fontWeight: '700', color: COLORS.successText },
});
