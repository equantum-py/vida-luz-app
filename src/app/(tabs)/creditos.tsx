import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { mockCreditos, Credito } from '@/mocks/creditos';
import { COLORS, FONT, RADIUS, SHADOW, SPACE, formatCurrency, formatDateFull } from '@/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function StatusBadge({ estado, label }: { estado: string; label: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVO: { bg: COLORS.successBg, text: COLORS.successText },
    PAGADO: { bg: COLORS.gray100,   text: COLORS.gray500 },
    REFINANCIADO: { bg: COLORS.infoBg, text: COLORS.info },
  };
  const c = colors[estado] ?? colors.ACTIVO;
  return (
    <View style={[badge.pill, { backgroundColor: c.bg }]}>
      <Text style={[badge.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  pill: { borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3 },
  text: { fontSize: FONT.xs, fontWeight: '700' },
});

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={prog.track}>
      <View style={[prog.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const prog = StyleSheet.create({
  track: { height: 6, backgroundColor: COLORS.gray200, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});

function CreditCard({ credito, onPress }: { credito: Credito; onPress: () => void }) {
  const isActive = credito.estado === 'ACTIVO';
  const barColor = credito.estado === 'PAGADO' ? COLORS.gray400 : COLORS.success;

  return (
    <TouchableOpacity style={styles.creditCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.creditCardHeader}>
        <View style={styles.creditTitleRow}>
          <Ionicons
            name={isActive ? 'cash-outline' : 'checkmark-circle-outline'}
            size={20}
            color={isActive ? COLORS.primary : COLORS.gray500}
          />
          <Text style={styles.creditType}>{credito.tipo}</Text>
        </View>
        <StatusBadge estado={credito.estado} label={credito.estadoLabel} />
      </View>

      <Text style={styles.creditDesc} numberOfLines={1}>{credito.descripcion}</Text>

      <View style={styles.creditAmounts}>
        <View>
          <Text style={styles.amountLabel}>Monto original</Text>
          <Text style={styles.amountValue}>{formatCurrency(credito.montoOriginal)}</Text>
        </View>
        {isActive && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amountLabel}>Cuota mensual</Text>
            <Text style={[styles.amountValue, { color: COLORS.primary }]}>
              {formatCurrency(credito.cuotaMensual)}
            </Text>
          </View>
        )}
        {!isActive && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amountLabel}>Completado</Text>
            <Text style={[styles.amountValue, { color: COLORS.gray500 }]}>Mar 2025</Text>
          </View>
        )}
      </View>

      <ProgressBar pct={credito.porcentajePagado} color={barColor} />
      <View style={styles.progressLabels}>
        <Text style={styles.progressText}>{credito.cuotasPagadas} cuotas pagadas</Text>
        <Text style={styles.progressText}>{credito.porcentajePagado}%</Text>
      </View>

      {isActive && credito.proximoPago && (
        <View style={styles.proximoRow}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.warning} />
          <Text style={styles.proximoText}>
            Próximo pago: {formatDateFull(credito.proximoPago)}
          </Text>
        </View>
      )}

      <View style={styles.detailLink}>
        <Text style={styles.detailLinkText}>Ver detalle y cronograma</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
}

function DetailModal({ credito, onClose }: { credito: Credito; onClose: () => void }) {
  const pagadas = credito.cronograma.filter((c) => c.estado === 'PAGADA');
  const pendientes = credito.cronograma.filter((c) => c.estado === 'PENDIENTE').slice(0, 6);

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={modal.safe} edges={['top']}>
        <View style={modal.header}>
          <Text style={modal.title}>{credito.tipo}</Text>
          <Pressable onPress={onClose} style={modal.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.gray700} />
          </Pressable>
        </View>

        <ScrollView style={modal.scroll} showsVerticalScrollIndicator={false}>
          {/* Summary */}
          <View style={modal.summaryGrid}>
            {[
              { label: 'Monto original', value: formatCurrency(credito.montoOriginal) },
              { label: 'Capital pendiente', value: formatCurrency(credito.capitalPendiente) },
              { label: 'Tasa anual', value: `${credito.tasaAnual}%` },
              { label: 'Plazo', value: `${credito.plazoMeses} meses` },
              { label: 'Cuota mensual', value: formatCurrency(credito.cuotaMensual) },
              { label: 'Garantía', value: credito.garantia },
            ].map((item) => (
              <View key={item.label} style={modal.summaryItem}>
                <Text style={modal.summaryLabel}>{item.label}</Text>
                <Text style={modal.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Timeline */}
          {credito.cronograma.length > 0 && (
            <>
              <Text style={modal.sectionTitle}>Últimas cuotas pagadas</Text>
              {pagadas.slice(-4).map((cuota) => (
                <View key={cuota.numero} style={modal.timelineRow}>
                  <View style={[modal.timelineDot, { backgroundColor: COLORS.success }]}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                  <View style={modal.timelineLine} />
                  <View style={modal.timelineContent}>
                    <Text style={modal.timelineTitle}>Cuota #{cuota.numero}</Text>
                    <Text style={modal.timelineSub}>{formatCurrency(cuota.total)} · Pagada</Text>
                  </View>
                </View>
              ))}

              <Text style={[modal.sectionTitle, { marginTop: SPACE.base }]}>Próximas cuotas</Text>
              {pendientes.map((cuota, i) => (
                <View key={cuota.numero} style={modal.timelineRow}>
                  <View style={[modal.timelineDot, { backgroundColor: i === 0 ? COLORS.warning : COLORS.gray300 }]}>
                    <Ionicons name="time-outline" size={10} color="#fff" />
                  </View>
                  {i < pendientes.length - 1 && <View style={modal.timelineLine} />}
                  <View style={modal.timelineContent}>
                    <Text style={modal.timelineTitle}>Cuota #{cuota.numero}</Text>
                    <Text style={modal.timelineSub}>
                      {formatCurrency(cuota.total)} · {i === 0 ? 'Próxima' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const modal = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.md,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  title: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.gray900 },
  closeBtn: {
    padding: SPACE.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.full,
  },
  scroll: { paddingHorizontal: SPACE.base },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.sm,
    marginTop: SPACE.base,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    padding: SPACE.md,
  },
  summaryLabel: { fontSize: FONT.xs, color: COLORS.gray500, marginBottom: 4 },
  summaryValue: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900 },
  sectionTitle: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900, marginTop: SPACE.xl, marginBottom: SPACE.md },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACE.md, position: 'relative' },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACE.md,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 22,
    width: 2,
    height: 28,
    backgroundColor: COLORS.gray200,
  },
  timelineContent: { flex: 1, paddingTop: 2 },
  timelineTitle: { fontSize: FONT.sm, fontWeight: '600', color: COLORS.gray900 },
  timelineSub: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 2 },
});

export default function CreditosScreen() {
  const [selected, setSelected] = useState<Credito | null>(null);
  const activos = mockCreditos.filter((c) => c.estado === 'ACTIVO');
  const pagados = mockCreditos.filter((c) => c.estado !== 'ACTIVO');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#0A2342', '#0D2D57']} style={styles.header}>
        <Text style={styles.headerTitle}>Mis Créditos</Text>
        <Text style={styles.headerSub}>{activos.length} activo · {pagados.length} finalizado</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activos.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>ACTIVOS</Text>
            {activos.map((c) => (
              <CreditCard key={c.id} credito={c} onPress={() => setSelected(c)} />
            ))}
          </>
        )}

        {pagados.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>HISTORIAL</Text>
            {pagados.map((c) => (
              <CreditCard key={c.id} credito={c} onPress={() => setSelected(c)} />
            ))}
          </>
        )}

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.info} />
          <Text style={styles.infoText}>
            Para solicitar un nuevo crédito acércate a nuestras oficinas o llama al (02) 290-1234.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {selected && <DetailModal credito={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { paddingHorizontal: SPACE.base, paddingTop: SPACE.base, paddingBottom: SPACE.xl },
  headerTitle: { fontSize: FONT['2xl'], fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACE.base },
  sectionLabel: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.gray500,
    letterSpacing: 1,
    marginBottom: SPACE.sm,
    marginTop: SPACE.md,
  },
  creditCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACE.base,
    marginBottom: SPACE.md,
    ...SHADOW.md,
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE.xs,
  },
  creditTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACE.xs },
  creditType: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900 },
  creditDesc: { fontSize: FONT.sm, color: COLORS.gray500, marginBottom: SPACE.md },
  creditAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACE.md },
  amountLabel: { fontSize: FONT.xs, color: COLORS.gray500, marginBottom: 2 },
  amountValue: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.gray900 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: SPACE.md },
  progressText: { fontSize: FONT.xs, color: COLORS.gray500 },
  proximoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 5,
    marginBottom: SPACE.sm,
  },
  proximoText: { fontSize: FONT.xs, color: COLORS.warningText, fontWeight: '500' },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: SPACE.xs,
  },
  detailLinkText: { fontSize: FONT.sm, color: COLORS.primary, fontWeight: '600' },
  infoCard: {
    flexDirection: 'row',
    gap: SPACE.sm,
    backgroundColor: COLORS.infoBg,
    borderRadius: RADIUS.lg,
    padding: SPACE.base,
    marginTop: SPACE.sm,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: FONT.sm, color: COLORS.info, lineHeight: 20 },
});
