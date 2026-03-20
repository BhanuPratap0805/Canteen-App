import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import AdminNavigator from './src/screens/admin/AdminNavigator';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isAuthLoading, logout, updateProfile, markActivity } = useAuth();

  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // If no user is logged in, show login screen
  if (!user) {
    return (
      <NavigationContainer onStateChange={markActivity}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer onStateChange={markActivity}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#1A1A2E',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      >
        {user.role === 'admin' ? (
          // Admin Navigation
          <Stack.Screen
            name="Admin"
            options={{ headerShown: false }}
          >
            {(props) => (
              <AdminNavigator
                {...props}
                adminUser={user}
                onLogout={logout}
                onUpdateUser={updateProfile}
              />
            )}
          </Stack.Screen>
        ) : (
          // User Navigation
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
            >
              {(props) => (
                <HomeScreen
                  {...props}
                  user={user}
                  onLogout={logout}
                  onUpdateUser={updateProfile}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'Your Cart' }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{ title: 'Payment' }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{
                title: 'Order Confirmed',
                headerShown: false,
                gestureEnabled: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '600',
  },
});
