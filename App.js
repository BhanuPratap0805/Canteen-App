import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { onAuthChange } from './src/services/authService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <CartProvider>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        </CartProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerTintColor: '#1A1A2E',
              headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
            }}
          >
            {user ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
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
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{
                    title: 'Register',
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
});
