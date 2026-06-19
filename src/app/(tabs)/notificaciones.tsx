import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockNotificaciones, Notificacion } from '@/mocks/notificaciones';
import { COLORS, FONT, RADIUS, SHADOW, SPACE } from '@/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TYPE_STYLES: Record<string, { bg: string; iconColor: string; borderColor: string }> = {
  ALERTA:       { bg: COLORS.warningBg, iconColor: COLORS.warning, borderColor: '#F0A050' },
  EVENTO:       { bg: '#EEF2FF',        iconColor: COLORS.primary,  borderColor: '#B0BDF5' },
  EXITO:        { bg: COLORS.successBg, iconColor: COLORS.success,  borderColor: '#86C99A' },
  INFORMACION:  { bg: COLORS.infoBg,   iconColor: COLORS.info,     borderColor: '#76C7D8' },
  MANTENIMIENTO:{ bg: COLORS.gray100,  iconColor: COLORS.gray500,  borderColor: COLORS.gray300 },
};

function NotifItem({ notif, onPress }: { notif: Notificacion; onPress: () => void }) {
  const style = TYPE_STYLES[notif.tipo] ?? TYPE_STYLES.INFORMACION;

  return (
    <TouchableOpacity
      style={[styles.item, !notif.leida && styles.itemUnread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, { backgroundColor: style.bg, borderColor: style.borderColor }]}>
        <Ionicons name={notif.icono as IoniconsName} size={20} color={style.iconColor} />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle, !notif.leida && styles.itemTitleUnread]} numberOfLines={1}>
            {notif.titulo}
          </Text>
          {!notif.leida && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.itemMsg} numberOfLines={2}>{notif.mensaje}</Text>
        <Text style={styles.itemDate}>{notif.fechaFormato}</Text>
      </View>
    </TouchableOpacity>
  );
}

function NotifModal({ notif, onClose }: { notif: Notificacion; onClose: () => void }) {
  const style = TYPE_STYLES[notif.tipo] ?? TYPE_STYLES.INFORMACION;
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={modal.safe} edges={['top']}>
        <View style={modal.header}>
          <Pressable onPress={onClose} style={modal.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.gray700} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={modal.content}>
          <View style={[modal.iconBig, { backgroundColor: style.bg }]}>
            <Ionicons name={notif.icono as IoniconsName} size={36} color={style.iconColor} />
          </View>
          <Text style={modal.title}>{notif.titulo}</Text>
          <Text style={modal.date}>{notif.fechaFormato}</Text>
          <Text style={modal.body}>{notif.mensaje}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const modal = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.md,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  closeBtn: { padding: SPACE.sm, backgroundColor: COLORS.gray100, borderRadius: RADIUS.full },
  content: { alignItems: 'center', padding: SPACE.xl },
  iconBig: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACE.base,
  },
  title: { fontSize: FONT.xl, fontWeight: '700', color: COLORS.gray900, textAlign: 'center' },
  date: { fontSize: FONT.sm, color: COLORS.gray500, marginTop: 4, marginBottom: SPACE.xl },
  body: { fontSize: FONT.base, color: COLORS.gray700, lineHeight: 24, textAlign: 'center' },
});

export default function NotificacionesScreen() {
  const [selected, setSelected] = useState<Notificacion | null>(null);
  const [notifs, setNotifs] = useState(mockNotificaciones);

  const unread = notifs.filter((n) => !n.leida);
  const read = notifs.filter((n) => n.leida);

  function handleOpen(notif: Notificacion) {
    setNotifs((prev) => prev.map((n) => n.id === notif.id ? { ...n, leida: true } : n));
    setSelected({ ...notif, leida: true });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unread.length > 0 && (
            <Text style={styles.headerSub}>{unread.length} sin leer</Text>
          )}
        </View>
        {unread.length > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unread.length} nuevas</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {unread.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>NUEVAS</Text>
            {unread.map((n) => (
              <NotifItem key={n.id} notif={n} onPress={() => handleOpen(n)} />
            ))}
          </>
        )}

        {read.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>ANTERIORES</Text>
            {read.map((n) => (
              <NotifItem key={n.id} notif={n} onPress={() => handleOpen(n)} />
            ))}
          </>
        )}

        {unread.length === 0 && read.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyTitle}>Sin notificaciones</Text>
            <Text style={styles.emptyText}>Te avisaremos cuando haya novedades importantes.</Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {selected && <NotifModal notif={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
    ...SHADOW.sm,
  },
  headerTitle: { fontSize: FONT['2xl'], fontWeight: '800', color: COLORS.gray900 },
  headerSub: { fontSize: FONT.sm, color: COLORS.gray500, marginTop: 2 },
  unreadBadge: {
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
  },
  unreadBadgeText: { fontSize: FONT.sm, fontWeight: '700', color: COLORS.danger },
  scroll: { flex: 1, paddingHorizontal: SPACE.base },
  sectionLabel: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.gray500,
    letterSpacing: 1,
    marginTop: SPACE.base,
    marginBottom: SPACE.sm,
  },
  item: {
    flexDirection: 'row',
    gap: SPACE.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACE.base,
    marginBottom: SPACE.sm,
    ...SHADOW.sm,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  itemContent: { flex: 1 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACE.xs },
  itemTitle: { flex: 1, fontSize: FONT.sm, fontWeight: '500', color: COLORS.gray700 },
  itemTitleUnread: { fontWeight: '700', color: COLORS.gray900 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  itemMsg: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 3, lineHeight: 17 },
  itemDate: { fontSize: FONT.xs, color: COLORS.gray400, marginTop: 5 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: SPACE.sm },
  emptyTitle: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.gray500 },
  emptyText: { fontSize: FONT.sm, color: COLORS.gray400, textAlign: 'center' },
});
