import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONT, RADIUS, SHADOW, SPACE } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const PIN_LENGTH = 4;

const NUMPAD: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [ci, setCi] = useState('1756823940');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleNumPress(key: string) {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      setError('');
      return;
    }
    if (key === '' || pin.length >= PIN_LENGTH) return;
    setPin((p) => p + key);
    setError('');
  }

  async function handleLogin() {
    if (ci.trim().length === 0) { setError('Ingresa tu número de CI.'); return; }
    if (pin.length < PIN_LENGTH) { setError(`El PIN debe tener ${PIN_LENGTH} dígitos.`); return; }
    setLoading(true);
    setError('');
    const result = await login(ci, pin);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)/');
    } else {
      setError(result.error ?? 'Error al iniciar sesión.');
      setPin('');
    }
  }

  function handleDemoFill() {
    setCi('1756823940');
    setPin('1234');
    setError('');
  }

  const canLogin = ci.trim().length > 0 && pin.length === PIN_LENGTH && !loading;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#0A2342', '#0D2D57']} style={styles.gradient}>

        {/* ── Brand section ── */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>VL</Text>
          </View>
          <Text style={styles.brandName}>Vida & Luz</Text>
          <Text style={styles.brandSub}>Cooperativa de Ahorro y Crédito</Text>
          <View style={styles.demoPill}>
            <Ionicons name="information-circle-outline" size={13} color={COLORS.accent} />
            <Text style={styles.demoText}>  Demo: CI 1756823940 · PIN 1234</Text>
          </View>
        </View>

        {/* ── Form card ── */}
        <View style={styles.card}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

            {/* CI field */}
            <Text style={styles.label}>Número de CI / Socio</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={COLORS.gray500} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={ci}
                onChangeText={(t) => { setCi(t); setError(''); }}
                placeholder="Ej. 1756823940"
                placeholderTextColor={COLORS.gray400}
                keyboardType="numeric"
                maxLength={13}
                editable={!loading}
              />
            </View>

            {/* PIN dots */}
            <Text style={[styles.label, { marginTop: SPACE.md }]}>PIN de 4 dígitos</Text>
            <View style={styles.pinRow}>
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.pinDot,
                    pin.length > i && styles.pinDotFilled,
                    pin.length === i && styles.pinDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Error */}
            {error.length > 0 && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={15} color={COLORS.danger} />
                <Text style={styles.errorText}> {error}</Text>
              </View>
            )}

            {/* Numpad */}
            <View style={styles.numpad}>
              {NUMPAD.map((row, ri) => (
                <View key={ri} style={styles.numRow}>
                  {row.map((key, ki) => {
                    const isEmpty = key === '';
                    const isBack = key === '⌫';
                    const isLoginKey = false;
                    return (
                      <Pressable
                        key={ki}
                        onPress={() => handleNumPress(key)}
                        disabled={isEmpty || loading}
                        style={({ pressed }) => [
                          styles.numKey,
                          isEmpty && styles.numKeyEmpty,
                          pressed && !isEmpty && styles.numKeyPressed,
                        ]}
                      >
                        {isBack ? (
                          <Ionicons name="backspace-outline" size={22} color={COLORS.gray700} />
                        ) : (
                          <Text style={[styles.numKeyText, isEmpty && { opacity: 0 }]}>{key}</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Login button */}
            <Pressable
              onPress={handleLogin}
              disabled={!canLogin}
              style={({ pressed }) => [
                styles.loginBtn,
                !canLogin && styles.loginBtnDisabled,
                pressed && canLogin && styles.loginBtnPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Ingresar</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
                </>
              )}
            </Pressable>

            {/* Demo shortcut */}
            <Pressable onPress={handleDemoFill} style={styles.demoBtn} disabled={loading}>
              <Text style={styles.demoBtnText}>Completar con datos demo</Text>
            </Pressable>
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const KEY_SIZE = (SCREEN_W - SPACE.xl * 2 - SPACE.md * 2) / 3;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradient: {
    flex: 1,
  },
  // Brand
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.xl,
    paddingTop: SPACE.lg,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,201,76,0.12)',
    marginBottom: SPACE.sm,
  },
  logoText: {
    fontSize: FONT['2xl'],
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  brandName: {
    fontSize: FONT['2xl'],
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: FONT.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
    backgroundColor: 'rgba(242,201,76,0.12)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(242,201,76,0.35)',
    paddingHorizontal: SPACE.md,
    paddingVertical: 5,
  },
  demoText: {
    fontSize: FONT.xs,
    color: COLORS.accent,
    fontWeight: '500',
  },
  // Card
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACE.xl,
    paddingTop: SPACE.xl,
    paddingBottom: SPACE.base,
    ...SHADOW.lg,
  },
  cardTitle: {
    fontSize: FONT.xl,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: SPACE.base,
  },
  // CI input
  label: {
    fontSize: FONT.sm,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACE.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SPACE.md,
    height: 48,
  },
  inputIcon: {
    marginRight: SPACE.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT.md,
    color: COLORS.gray900,
    fontWeight: '500',
  },
  // PIN dots
  pinRow: {
    flexDirection: 'row',
    gap: SPACE.base,
    marginTop: SPACE.sm,
    marginBottom: SPACE.sm,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pinDotActive: {
    borderColor: COLORS.accent,
  },
  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    marginBottom: SPACE.sm,
  },
  errorText: {
    fontSize: FONT.sm,
    color: COLORS.danger,
    fontWeight: '500',
    flex: 1,
  },
  // Numpad
  numpad: {
    gap: SPACE.sm,
    marginTop: SPACE.sm,
    marginBottom: SPACE.md,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACE.md,
  },
  numKey: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  numKeyEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  numKeyPressed: {
    backgroundColor: COLORS.gray200,
  },
  numKeyText: {
    fontSize: FONT.xl,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  // Login button
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.sm,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    ...SHADOW.sm,
  },
  loginBtnDisabled: {
    backgroundColor: COLORS.gray200,
  },
  loginBtnPressed: {
    backgroundColor: COLORS.accentDark,
  },
  loginBtnText: {
    fontSize: FONT.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Demo shortcut
  demoBtn: {
    alignItems: 'center',
    paddingVertical: SPACE.md,
  },
  demoBtnText: {
    fontSize: FONT.sm,
    color: COLORS.gray500,
    textDecorationLine: 'underline',
  },
});
