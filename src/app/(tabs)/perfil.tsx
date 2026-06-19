import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONT, RADIUS, SHADOW, SPACE } from '@/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingItem {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  color?: string;
  badge?: string;
}

function SettingsGroup({ title, items }: { title: string; items: SettingItem[] }) {
  return (
    <View style={group.container}>
      <Text style={group.title}>{title}</Text>
      <View style={group.card}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[group.row, i < items.length - 1 && group.rowBorder]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={[group.iconBox, { backgroundColor: item.color ?? COLORS.gray100 }]}>
              <Ionicons
                name={item.icon}
                size={18}
                color={item.color ? COLORS.primary : COLORS.gray700}
              />
            </View>
            <Text style={group.label}>{item.label}</Text>
            {item.badge && (
              <View style={group.badge}>
                <Text style={group.badgeText}>{item.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const group = StyleSheet.create({
  container: { marginBottom: SPACE.base },
  title: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.gray500,
    letterSpacing: 1,
    marginBottom: SPACE.sm,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACE.base,
    gap: SPACE.md,
  },
  rowBorder: { borderBottomWidth: 1, borderColor: COLORS.gray100 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: FONT.base, color: COLORS.gray900, fontWeight: '500' },
  badge: {
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: FONT.xs, fontWeight: '700', color: COLORS.successText },
});

function DatosModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const rows = [
    { label: 'Nombre completo', value: user?.nombreCompleto ?? '' },
    { label: 'Cédula de Identidad', value: user?.ci ?? '' },
    { label: 'N° de Socio', value: `#${user?.numeroSocio}` },
    { label: 'Tipo de socio', value: user?.tipo ?? '' },
    { label: 'Correo electrónico', value: user?.email ?? '' },
    { label: 'Celular', value: user?.celular ?? '' },
    { label: 'Dirección', value: user?.direccion ?? '' },
    { label: 'Ciudad', value: `${user?.ciudad}, ${user?.provincia}` },
    { label: 'Socio desde', value: `Enero ${user?.anioIngreso}` },
  ];

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={dm.safe} edges={['top']}>
        <View style={dm.header}>
          <Text style={dm.title}>Datos Personales</Text>
          <Pressable onPress={onClose} style={dm.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.gray700} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={dm.content}>
          {rows.map((r) => (
            <View key={r.label} style={dm.row}>
              <Text style={dm.rowLabel}>{r.label}</Text>
              <Text style={dm.rowValue}>{r.value}</Text>
            </View>
          ))}
          <View style={dm.notice}>
            <Ionicons name="lock-closed-outline" size={14} color={COLORS.gray500} />
            <Text style={dm.noticeText}>
              Para actualizar tus datos, acércate a nuestras oficinas con tu CI original.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const dm = StyleSheet.create({
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
  closeBtn: { padding: SPACE.sm, backgroundColor: COLORS.gray100, borderRadius: RADIUS.full },
  content: { padding: SPACE.base },
  row: {
    paddingVertical: SPACE.md,
    borderBottomWidth: 1,
    borderColor: COLORS.gray100,
  },
  rowLabel: { fontSize: FONT.xs, color: COLORS.gray500, marginBottom: 4 },
  rowValue: { fontSize: FONT.base, fontWeight: '600', color: COLORS.gray900 },
  notice: {
    flexDirection: 'row',
    gap: SPACE.sm,
    alignItems: 'flex-start',
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    padding: SPACE.md,
    marginTop: SPACE.xl,
  },
  noticeText: { flex: 1, fontSize: FONT.xs, color: COLORS.gray500, lineHeight: 18 },
});

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [showDatos, setShowDatos] = useState(false);

  function handleLogout() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  }

  function showComingSoon(feature: string) {
    Alert.alert('Próximamente', `La función "${feature}" estará disponible en la versión final de la app.`);
  }

  const CUENTA: SettingItem[] = [
    { icon: 'person-outline', label: 'Datos Personales', onPress: () => setShowDatos(true) },
    { icon: 'people-outline', label: 'Mis Beneficiarios', onPress: () => showComingSoon('Beneficiarios') },
    { icon: 'document-outline', label: 'Mis Documentos', onPress: () => showComingSoon('Documentos') },
  ];

  const SEGURIDAD: SettingItem[] = [
    { icon: 'key-outline', label: 'Cambiar PIN', onPress: () => showComingSoon('Cambiar PIN') },
    { icon: 'finger-print-outline', label: 'Configurar Biometría', onPress: () => showComingSoon('Biometría'), badge: 'PRÓXIMO' },
  ];

  const AYUDA: SettingItem[] = [
    { icon: 'headset-outline', label: 'Contactar Cooperativa', onPress: () => showComingSoon('Contacto') },
    { icon: 'help-circle-outline', label: 'Preguntas Frecuentes', onPress: () => showComingSoon('FAQ') },
    { icon: 'information-circle-outline', label: 'Términos y Privacidad', onPress: () => showComingSoon('Términos') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#0A2342', '#0D2D57']} style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.iniciales ?? 'VL'}</Text>
          </View>
          <Text style={styles.userName}>{user?.nombreCompleto}</Text>
          <Text style={styles.userSocio}>Socio #{user?.numeroSocio} · Activo desde {user?.anioIngreso}</Text>

          {/* Score chip */}
          <View style={styles.scoreChip}>
            <Ionicons name="ribbon-outline" size={14} color={COLORS.accent} />
            <Text style={styles.scoreChipText}>
              Score {user?.scoreCooperativo}/{user?.scoreMax} — {user?.scoreCategoria}
            </Text>
          </View>
        </LinearGradient>

        {/* Info summary */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{user?.ciudad}</Text>
            <Text style={styles.infoLabel}>Ciudad</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{user?.tipo}</Text>
            <Text style={styles.infoLabel}>Estado</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{new Date().getFullYear() - (user?.anioIngreso ?? 2019)} años</Text>
            <Text style={styles.infoLabel}>Antigüedad</Text>
          </View>
        </View>

        {/* Settings groups */}
        <View style={styles.groups}>
          <SettingsGroup title="CUENTA" items={CUENTA} />
          <SettingsGroup title="SEGURIDAD" items={SEGURIDAD} />
          <SettingsGroup title="AYUDA" items={AYUDA} />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.version}>
            Vida & Luz App · Demo V1.0{'\n'}
            Cooperativa de Ahorro y Crédito
          </Text>
        </View>
      </ScrollView>

      {showDatos && <DatosModal onClose={() => setShowDatos(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    alignItems: 'center',
    paddingTop: SPACE.lg,
    paddingBottom: SPACE['2xl'],
    paddingHorizontal: SPACE.base,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACE.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: FONT['2xl'], fontWeight: '800', color: COLORS.primary },
  userName: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.white, textAlign: 'center' },
  userSocio: { fontSize: FONT.sm, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: SPACE.md,
    backgroundColor: 'rgba(242,201,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242,201,76,0.4)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACE.md,
    paddingVertical: 5,
  },
  scoreChipText: { fontSize: FONT.sm, color: COLORS.accent, fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACE.base,
    paddingHorizontal: SPACE.xl,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
    ...SHADOW.sm,
  },
  infoItem: { flex: 1, alignItems: 'center' },
  infoValue: { fontSize: FONT.md, fontWeight: '700', color: COLORS.gray900 },
  infoLabel: { fontSize: FONT.xs, color: COLORS.gray500, marginTop: 2 },
  infoDivider: { width: 1, backgroundColor: COLORS.gray200 },
  groups: { padding: SPACE.base, paddingTop: SPACE.xl },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.sm,
    height: 52,
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACE.xl,
    borderWidth: 1,
    borderColor: COLORS.danger + '40',
  },
  logoutText: { fontSize: FONT.base, fontWeight: '700', color: COLORS.danger },
  version: {
    fontSize: FONT.xs,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACE.xl,
  },
});
