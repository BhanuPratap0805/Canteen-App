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
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';

const VoucherManagement = ({ navigation }) => {
  const [vouchers, setVouchers] = useState([
    {
      id: '1',
      code: 'WELCOME10',
      description: 'Get 10% off on your first order',
      discount: 10,
      discountType: 'percentage',
      minOrder: 100,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 45,
      validFrom: '2024-02-01',
      validTo: '2024-02-29',
      isActive: true,
    },
    {
      id: '2',
      code: 'FLAT50',
      description: 'Flat ₹50 off on orders above ₹200',
      discount: 50,
      discountType: 'fixed',
      minOrder: 200,
      maxDiscount: null,
      usageLimit: 50,
      usedCount: 12,
      validFrom: '2024-02-15',
      validTo: '2024-02-28',
      isActive: true,
    },
    {
      id: '3',
      code: 'WEEKEND20',
      description: '20% off on weekends',
      discount: 20,
      discountType: 'percentage',
      minOrder: 150,
      maxDiscount: 100,
      usageLimit: 200,
      usedCount: 78,
      validFrom: '2024-02-10',
      validTo: '2024-02-25',
      isActive: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validTo: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      minOrder: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validTo: '',
      isActive: true,
    });
    setEditingVoucher(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (voucher) => {
    setFormData({
      code: voucher.code,
      description: voucher.description,
      discount: voucher.discount.toString(),
      discountType: voucher.discountType,
      minOrder: voucher.minOrder.toString(),
      maxDiscount: voucher.maxDiscount ? voucher.maxDiscount.toString() : '',
      usageLimit: voucher.usageLimit.toString(),
      validFrom: voucher.validFrom,
      validTo: voucher.validTo,
      isActive: voucher.isActive,
    });
    setEditingVoucher(voucher);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.discount || !formData.validFrom || !formData.validTo) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newVoucher = {
      id: editingVoucher ? editingVoucher.id : Date.now().toString(),
      code: formData.code.toUpperCase(),
      description: formData.description,
      discount: parseFloat(formData.discount),
      discountType: formData.discountType,
      minOrder: parseFloat(formData.minOrder) || 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: parseInt(formData.usageLimit) || 0,
      usedCount: editingVoucher ? editingVoucher.usedCount : 0,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      isActive: formData.isActive,
    };

    if (editingVoucher) {
      setVouchers(vouchers.map(voucher => 
        voucher.id === editingVoucher.id ? newVoucher : voucher
      ));
      Alert.alert('Success', 'Voucher updated successfully');
    } else {
      setVouchers([...vouchers, newVoucher]);
      Alert.alert('Success', 'Voucher created successfully');
    }

    setModalVisible(false);
    resetForm();
  };

  const toggleVoucherStatus = (voucherId) => {
    setVouchers(vouchers.map(voucher => 
      voucher.id === voucherId 
        ? { ...voucher, isActive: !voucher.isActive }
        : voucher
    ));
    Alert.alert('Success', 'Voucher status updated');
  };

  const deleteVoucher = (voucherId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this voucher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setVouchers(vouchers.filter(voucher => voucher.id !== voucherId));
            Alert.alert('Success', 'Voucher deleted successfully');
          },
        },
      ]
    );
  };

  const renderVoucherItem = ({ item }) => (
    <View style={styles.voucherCard}>
      <View style={styles.voucherHeader}>
        <View style={styles.voucherInfo}>
          <Text style={styles.voucherCode}>{item.code}</Text>
          <Text style={styles.voucherDescription}>{item.description}</Text>
          <Text style={styles.voucherDates}>
            Valid: {item.validFrom} to {item.validTo}
          </Text>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.isActive ? '#4CAF50' : '#9E9E9E' 
        }]}>
          <Text style={styles.statusText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.voucherDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Discount:</Text>
          <Text style={styles.detailValue}>
            {item.discountType === 'percentage' 
              ? `${item.discount}%` 
              : `₹${item.discount}`
            }
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Min Order:</Text>
          <Text style={styles.detailValue}>₹{item.minOrder}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Usage:</Text>
          <Text style={styles.detailValue}>
            {item.usedCount}/{item.usageLimit}
          </Text>
        </View>
      </View>

      <View style={styles.voucherActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.toggleButton]}
          onPress={() => toggleVoucherStatus(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteVoucher(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#9C27B0" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voucher Management</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {vouchers.filter(v => v.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Uses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {vouchers.reduce((sum, v) => sum + (v.usageLimit - v.usedCount), 0)}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Create New Voucher</Text>
        </TouchableOpacity>

        <FlatList
          data={vouchers}
          keyExtractor={(item) => item.id}
          renderItem={renderVoucherItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Voucher Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.code}
                  onChangeText={(text) => setFormData({ ...formData, code: text })}
                  placeholder="Enter voucher code"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter voucher description"
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Discount *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.discount}
                    onChangeText={(text) => setFormData({ ...formData, discount: text })}
                    placeholder="Amount"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.typeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.discountType === 'percentage' && styles.selectedType,
                      ]}
                      onPress={() => setFormData({ ...formData, discountType: 'percentage' })}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        formData.discountType === 'percentage' && styles.selectedTypeText,
                      ]}>
                        %
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.discountType === 'fixed' && styles.selectedType,
                      ]}
                      onPress={() => setFormData({ ...formData, discountType: 'fixed' })}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        formData.discountType === 'fixed' && styles.selectedTypeText,
                      ]}>
                        ₹
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Min Order</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.minOrder}
                    onChangeText={(text) => setFormData({ ...formData, minOrder: text })}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Max Discount</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.maxDiscount}
                    onChangeText={(text) => setFormData({ ...formData, maxDiscount: text })}
                    placeholder="No limit"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Usage Limit</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.usageLimit}
                    onChangeText={(text) => setFormData({ ...formData, usageLimit: text })}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Status</Text>
                  <View style={styles.typeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        formData.isActive && styles.selectedType,
                      ]}
                      onPress={() => setFormData({ ...formData, isActive: true })}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        formData.isActive && styles.selectedTypeText,
                      ]}>
                        Active
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        !formData.isActive && styles.selectedType,
                      ]}
                      onPress={() => setFormData({ ...formData, isActive: false })}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        !formData.isActive && styles.selectedTypeText,
                      ]}>
                        Inactive
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Valid From *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.validFrom}
                    onChangeText={(text) => setFormData({ ...formData, validFrom: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Valid To *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.validTo}
                    onChangeText={(text) => setFormData({ ...formData, validTo: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#9C27B0',
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
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  voucherCard: {
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
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  voucherDates: {
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
  voucherDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  voucherActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  toggleButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1A1A2E',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  selectedType: {
    backgroundColor: '#9C27B0',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default VoucherManagement;
