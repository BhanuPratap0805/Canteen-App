import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from './AdminDashboard';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import OrderHistory from './OrderHistory';
import VoucherManagement from './VoucherManagement';

const Stack = createNativeStackNavigator();

const AdminNavigator = ({ adminUser, onLogout, onUpdateUser }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        options={{ title: 'Admin Dashboard' }}
      >
        {(props) => (
          <AdminDashboard
            {...props}
            adminUser={adminUser}
            onLogout={onLogout}
            onUpdateUser={onUpdateUser}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="MenuManagement"
        component={MenuManagement}
        options={{ title: 'Menu Management' }}
      />
      <Stack.Screen
        name="OrderManagement"
        component={OrderManagement}
        options={{ title: 'Order Management' }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{ title: 'Order History' }}
      />
      <Stack.Screen
        name="VoucherManagement"
        component={VoucherManagement}
        options={{ title: 'Voucher Management' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
