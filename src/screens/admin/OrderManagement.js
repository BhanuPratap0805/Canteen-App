import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';

const OrderManagement = ({ navigation }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'John Doe',
      items: [
        { name: 'Masala Dosa', quantity: 2, price: 60 },
        { name: 'Cold Coffee', quantity: 1, price: 50 },
      ],
      total: 170,
      status: 'pending',
      time: '10:30 AM',
      date: '2024-02-20',
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      items: [
        { name: 'Veg Biryani', quantity: 1, price: 120 },
        { name: 'Gulab Jamun', quantity: 2, price: 40 },
      ],
      total: 200,
      status: 'preparing',
      time: '10:45 AM',
      date: '2024-02-20',
    },
    {
      id: 'ORD003',
      customerName: 'Mike Johnson',
      items: [
        { name: 'Paneer Tikka', quantity: 1, price: 150 },
        { name: 'Veg Burger', quantity: 1, price: 70 },
      ],
      total: 220,
      status: 'ready',
      time: '11:00 AM',
      date: '2024-02-20',
    },
    {
      id: 'ORD004',
      customerName: 'Sarah Wilson',
      items: [
        { name: 'Samosa (2 pcs)', quantity: 2, price: 30 },
        { name: 'Chole Bhature', quantity: 1, price: 80 },
      ],
      total: 140,
      status: 'completed',
      time: '11:15 AM',
      date: '2024-02-20',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const statusColors = {
    pending: '#FF9800',
    preparing: '#2196F3',
    ready: '#4CAF50',
    completed: '#9E9E9E',
  };

  const statusLabels = {
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
  };

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    Alert.alert('Success', `Order status updated to ${statusLabels[newStatus]}`);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
    };
    return statusFlow[currentStatus];
  };

  const renderOrderItem = ({ item }) => {
    const nextStatus = getNextStatus(item.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.orderTime}>{item.time} • {item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{statusLabels[item.status]}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {item.items.map((orderItem, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {orderItem.quantity}x {orderItem.name}
              </Text>
              <Text style={styles.itemPrice}>₹{orderItem.price * orderItem.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
          {nextStatus && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: statusColors[nextStatus] }]}
              onPress={() => updateOrderStatus(item.id, nextStatus)}
            >
              <Text style={styles.actionButtonText}>
                Mark as {statusLabels[nextStatus]}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilter,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.activeFilterText,
        ]}
      >
        {filter === 'all' ? 'All' : statusLabels[filter]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {orders.filter(o => o.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {orders.filter(o => o.status === 'preparing').length}
            </Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {orders.filter(o => o.status === 'ready').length}
            </Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['all', 'pending', 'preparing', 'ready', 'completed'].map(renderFilterButton)}
        </ScrollView>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#999999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 6,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 13,
    color: '#1A1A2E',
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default OrderManagement;
