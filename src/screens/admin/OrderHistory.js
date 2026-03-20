import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const OrderHistory = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const orderHistoryData = {
    today: [
      {
        id: 'ORD001',
        customerName: 'John Doe',
        items: 3,
        total: 170,
        time: '10:30 AM',
        status: 'completed',
      },
      {
        id: 'ORD002',
        customerName: 'Jane Smith',
        items: 3,
        total: 200,
        time: '10:45 AM',
        status: 'completed',
      },
      {
        id: 'ORD003',
        customerName: 'Mike Johnson',
        items: 2,
        total: 220,
        time: '11:00 AM',
        status: 'completed',
      },
      {
        id: 'ORD004',
        customerName: 'Sarah Wilson',
        items: 2,
        total: 140,
        time: '11:15 AM',
        status: 'completed',
      },
    ],
    week: [
      {
        id: 'ORD005',
        customerName: 'Tom Brown',
        items: 4,
        total: 280,
        time: 'Yesterday 2:30 PM',
        status: 'completed',
      },
      {
        id: 'ORD006',
        customerName: 'Emma Davis',
        items: 2,
        total: 150,
        time: 'Yesterday 3:45 PM',
        status: 'completed',
      },
      {
        id: 'ORD007',
        customerName: 'Chris Lee',
        items: 5,
        total: 320,
        time: 'Feb 18 1:15 PM',
        status: 'completed',
      },
    ],
    month: [
      {
        id: 'ORD008',
        customerName: 'Alex Kim',
        items: 3,
        total: 190,
        time: 'Feb 15 12:00 PM',
        status: 'completed',
      },
      {
        id: 'ORD009',
        customerName: 'Lisa Wang',
        items: 4,
        total: 240,
        time: 'Feb 14 6:30 PM',
        status: 'completed',
      },
    ],
  };

  const stats = {
    today: {
      totalOrders: 24,
      totalRevenue: 1850,
      averageOrder: 77,
    },
    week: {
      totalOrders: 156,
      totalRevenue: 12450,
      averageOrder: 80,
    },
    month: {
      totalOrders: 624,
      totalRevenue: 49800,
      averageOrder: 80,
    },
  };

  const currentStats = stats[selectedPeriod];
  const currentOrders = orderHistoryData[selectedPeriod];

  const renderStatCard = (title, value, subtitle) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemLeft}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.orderTime}>{item.time}</Text>
      </View>
      <View style={styles.orderItemRight}>
        <Text style={styles.orderItems}>{item.items} items</Text>
        <Text style={styles.orderTotal}>₹{item.total}</Text>
      </View>
    </View>
  );

  const renderPeriodButton = (period, label) => (
    <TouchableOpacity
      key={period}
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.activePeriod,
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.activePeriodText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.periodSelector}>
          {renderPeriodButton('today', 'Today')}
          {renderPeriodButton('week', 'This Week')}
          {renderPeriodButton('month', 'This Month')}
        </View>

        <View style={styles.statsContainer}>
          {renderStatCard('Total Orders', currentStats.totalOrders, 'Orders')}
          {renderStatCard('Revenue', `₹${currentStats.totalRevenue}`, 'Total Sales')}
          {renderStatCard('Average', `₹${currentStats.averageOrder}`, 'Per Order')}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Sales Trend</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>📊 Chart visualization would go here</Text>
            <Text style={styles.chartSubtext}>Showing sales data for {selectedPeriod}</Text>
          </View>
        </View>

        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <FlatList
            data={currentOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.topItemsSection}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          <View style={styles.topItemsList}>
            <View style={styles.topItem}>
              <Text style={styles.topItemEmoji}>🫓</Text>
              <View style={styles.topItemInfo}>
                <Text style={styles.topItemName}>Masala Dosa</Text>
                <Text style={styles.topItemSales}>45 orders</Text>
              </View>
              <Text style={styles.topItemRevenue}>₹2,700</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemEmoji}>🍛</Text>
              <View style={styles.topItemInfo}>
                <Text style={styles.topItemName}>Veg Biryani</Text>
                <Text style={styles.topItemSales}>38 orders</Text>
              </View>
              <Text style={styles.topItemRevenue}>₹4,560</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemEmoji}>🧀</Text>
              <View style={styles.topItemInfo}>
                <Text style={styles.topItemName}>Paneer Tikka</Text>
                <Text style={styles.topItemSales}>32 orders</Text>
              </View>
              <Text style={styles.topItemRevenue}>₹4,800</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#2196F3',
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  activePeriod: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#FFFFFF',
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
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999999',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  chartPlaceholder: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  ordersSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    padding: 16,
    paddingBottom: 8,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItemLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 11,
    color: '#999999',
  },
  orderItemRight: {
    alignItems: 'flex-end',
  },
  orderItems: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  topItemsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginBottom: 16,
  },
  topItemsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topItemEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  topItemSales: {
    fontSize: 12,
    color: '#666666',
  },
  topItemRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default OrderHistory;
