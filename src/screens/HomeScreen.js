import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuItem from '../components/MenuItem';
import { useCart } from '../context/CartContext';
import menuData from '../data/menuData.json';

const HomeScreen = ({ navigation, onLogout, onUpdateUser, user }) => {
  const { getCartCount, getCartTotal } = useCart();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const [profileVisible, setProfileVisible] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');

  const userLabel = user?.mobileNumber
    ? `+91 ${user.mobileNumber}`
    : 'Customer';

  const displayLabel = user?.name || 'Customer';

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
    Alert.alert('Saved', 'Profile updated successfully.');
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

  const renderHeader = () => {
    return (
      <View>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroGreeting}>Welcome to</Text>
              <Text style={styles.heroTitle}>Campus Canteen 🍽️</Text>
              <Text style={styles.heroSubtitle}>Fresh & Delicious Food</Text>
              <View style={styles.userPill}>
                <Text style={styles.userPillText}>Signed in as {displayLabel} ({userLabel})</Text>
              </View>
            </View>
            
            {/* Profile and Logout Section */}
            <View style={styles.profileSection}>
              {/* Profile Button */}
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => {
                  setDisplayName(user?.name || '');
                  setProfileVisible(true);
                }}
              >
                <Text style={styles.profileButtonText}>👤</Text>
              </TouchableOpacity>
              
              {/* Logout Button */}
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statLabel}>Fast</Text>
          </View>
          <View style={styles.statCardMid}>
            <Text style={styles.statIcon}>🌿</Text>
            <Text style={styles.statLabel}>Fresh</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>Affordable</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Menu</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />

      <Modal
        visible={profileVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>My Profile</Text>
            <Text style={styles.modalSub}>Mobile: {userLabel}</Text>

            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.profileInput}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name"
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

      <FlatList
        data={menuData.menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />

      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartButtonInner}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartButtonText}>View Cart</Text>
            <Text style={styles.cartTotal}>₹{cartTotal} ›</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 100,
  },
  heroBanner: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  heroLeft: {
    flex: 1,
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  heroGreeting: {
    fontSize: 14,
    color: '#FFE0CC',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#FFE0CC',
  },
  userPill: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statCardMid: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    marginHorizontal: 8,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cartBadge: {
    backgroundColor: '#FF6B35',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cartTotal: {
    color: '#FF6B35',
    fontSize: 17,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
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

export default HomeScreen;
