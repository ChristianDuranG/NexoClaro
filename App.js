import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import AssistantScreen from './src/screens/AssistantScreen';
import GuidesScreen from './src/screens/GuidesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { COLORS } from './src/theme';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { ready } = useApp();

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.obsidian,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => (
            <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFill} />
          ),
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Inicio: focused ? 'home' : 'home-outline',
              Asistente: focused ? 'sparkles' : 'sparkles-outline',
              Guías: focused ? 'checkmark-circle' : 'checkmark-circle-outline',
              Perfil: focused ? 'person' : 'person-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Asistente" component={AssistantScreen} />
        <Tab.Screen name="Guías" component={GuidesScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <MainTabs />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 64,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 8,
    shadowColor: '#121316',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    paddingTop: 6,
  },
});
