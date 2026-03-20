import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AdminDashboard = ({ navigation, onLogout, onUpdateUser, adminUser }) => {
  const adminLabel = adminUser?.email || 'admin@canteen.com';
  const [profileVisible, setProfileVisible] = useState(false);
  const [displayName, setDisplayName] = useState(adminUser?.name || 'Admin');
  const displayLabel = adminUser?.name || 'Admin';

  const handleSaveProfile = () => {
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter a display name.');
      return;
    }

    if (onUpdateUser && typeof onUpdateUser === 'function') {
      onUpdateUser({ name: trimmedName });
    }

    setProfileVisible(false);
    Alert.alert('Saved', 'Admin profile updated successfully.');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed && onLogout && typeof onLogout === 'function') {
        onLogout();
      }
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (onLogout && typeof onLogout === 'function') {
              onLogout();
            }
          },
        },
      ]
    );
  };
  const menuItems = [
    {
      id: '1',
      title: 'Menu Management',
      subtitle: 'Add, edit, or remove menu items',
      icon: '🍽️',
      color: '#FF6B35',
      screen: 'MenuManagement',
    },
    {
      id: '2',
      title: 'Orders',
      subtitle: 'View and manage customer orders',
      icon: '📋',
      color: '#4CAF50',
      screen: 'OrderManagement',
    },
    {
      id: '3',
      title: 'Order History',
      subtitle: 'View past orders and analytics',
      icon: '📊',
      color: '#2196F3',
      screen: 'OrderHistory',
    },
    {
      id: '4',
      title: 'Voucher Management',
      subtitle: 'Create and manage discount vouchers',
      icon: '🎫',
      color: '#9C27B0',
      screen: 'VoucherManagement',
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuCard, { borderLeftColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.8}
    >
      <View style={styles.menuCardLeft}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>Manage your canteen</Text>
            <View style={styles.adminPill}>
              <Text style={styles.adminPillText}>Signed in as {displayLabel} ({adminLabel})</Text>
            </View>
          </View>
          
          {/* Profile and Logout Section */}
          <View style={styles.profileSection}>
            {/* Profile Button */}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => {
                setDisplayName(adminUser?.name || 'Admin');
                setProfileVisible(true);
              }}
            >
              <Text style={styles.profileButtonText}>👤</Text>
            </TouchableOpacity>
            
            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={profileVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Admin Profile</Text>
            <Text style={styles.modalSub}>Email: {adminLabel}</Text>

            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.profileInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter admin name"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancel]}
                onPress={() => setProfileVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSave]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Menu Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹1,850</Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management</Text>
        {menuItems.map(renderMenuItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  adminPill: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  adminPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  menuCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  arrow: {
    fontSize: 20,
    color: '#B0B0B0',
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  modalSub: {
    marginTop: 4,
    marginBottom: 12,
    color: '#666',
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  profileInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  modalCancel: {
    backgroundColor: '#8E8E93',
  },
  modalSave: {
    backgroundColor: '#FF6B35',
  },
  modalBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default AdminDashboard;
