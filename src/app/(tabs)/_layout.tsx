import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/theme';
import { mockNotificaciones } from '@/mocks/notificaciones';
import { View, Text, StyleSheet } from 'react-native';

const unreadCount = mockNotificaciones.filter((n) => !n.leida).length;

function NotifBadge() {
  if (unreadCount === 0) return null;
  return (
    <View style={badge.container}>
      <Text style={badge.text}>{unreadCount}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(outline: IoniconsName, solid: IoniconsName) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Ionicons name={focused ? solid : outline} size={24} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.gray200,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: tabIcon('home-outline', 'home'),
        }}
      />
      <Tabs.Screen
        name="creditos"
        options={{
          title: 'Créditos',
          tabBarIcon: tabIcon('cash-outline', 'cash'),
        }}
      />
      <Tabs.Screen
        name="aportes"
        options={{
          title: 'Aportes',
          tabBarIcon: tabIcon('trending-up-outline', 'trending-up'),
        }}
      />
      <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Avisos',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={24}
                color={color}
              />
              <NotifBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: tabIcon('person-outline', 'person'),
        }}
      />
    </Tabs>
  );
}
