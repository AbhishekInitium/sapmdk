import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Search,
  Filter,
  ShoppingCart,
  Calendar,
  User,
  DollarSign,
  Package,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import { sapSalesOrderService, SalesOrder } from '@/services/sapSalesOrderService';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SalesOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SalesOrder[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'pending', 'processing', 'completed'];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      const orders = await sapSalesOrderService.getSalesOrders(100);
      setSalesOrders(orders);
      setFilteredOrders(orders);
    } catch (error) {
      console.error('Error loading sales orders:', error);
      Alert.alert(
        'Error',
        'Failed to load sales orders. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSalesOrders();
  }, []);

  useEffect(() => {
    let filtered = salesOrders;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => {
        const deliveryStatus = order.OverallDeliveryStatus;
        switch (selectedFilter) {
          case 'pending':
            return deliveryStatus === 'A';
          case 'processing':
            return deliveryStatus === 'B';
          case 'completed':
            return deliveryStatus === 'C';
          default:
            return true;
        }
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.SalesOrder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.SoldToPartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.CreatedByUser.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, salesOrders, selectedFilter]);

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'A':
        return <Clock size={16} color="#f59e0b" />;
      case 'B':
        return <AlertCircle size={16} color="#3b82f6" />;
      case 'C':
        return <CheckCircle size={16} color="#10b981" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const calculateTotalValue = () => {
    return filteredOrders.reduce((total, order) => {
      return total + parseFloat(order.TotalNetAmount || '0');
    }, 0);
  };

  const formatCurrency = (amount: string, currency: string = 'USD') => {
    const numAmount = parseFloat(amount || '0');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(numAmount);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={48} text="Loading Sales Orders..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sales Orders</Text>
          <Text style={styles.headerSubtitle}>SAP S/4HANA Integration</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <ShoppingCart size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <ShoppingCart size={20} color="#3b82f6" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>{filteredOrders.length}</Text>
            <Text style={styles.summaryLabel}>Total Orders</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <DollarSign size={20} color="#10b981" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryValue}>
              {formatCurrency(calculateTotalValue().toString())}
            </Text>
            <Text style={styles.summaryLabel}>Total Value</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusFilter}
        contentContainerStyle={styles.statusFilterContent}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.statusButton,
              selectedFilter === filter && styles.statusButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text
              style={[
                styles.statusButtonText,
                selectedFilter === filter && styles.statusButtonTextActive,
              ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sales Orders List */}
      <ScrollView
        style={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredOrders.map((order) => (
          <TouchableOpacity key={order.SalesOrder} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>#{order.SalesOrder}</Text>
                <View style={styles.orderMeta}>
                  <View style={styles.metaItem}>
                    <User size={12} color="#64748b" />
                    <Text style={styles.metaText}>{order.SoldToPartyName}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Calendar size={12} color="#64748b" />
                    <Text style={styles.metaText}>
                      {sapSalesOrderService.formatSAPDate(order.CreationDate)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.orderStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: sapSalesOrderService.getStatusColor(order.OverallDeliveryStatus) + '20' }
                ]}>
                  {getDeliveryStatusIcon(order.OverallDeliveryStatus)}
                  <Text style={[
                    styles.statusText,
                    { color: sapSalesOrderService.getStatusColor(order.OverallDeliveryStatus) }
                  ]}>
                    {sapSalesOrderService.getStatusText(order.OverallDeliveryStatus)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.orderAmount}>
                <DollarSign size={16} color="#10b981" />
                <Text style={styles.amountText}>
                  {formatCurrency(order.TotalNetAmount, order.TransactionCurrency)}
                </Text>
              </View>
              <View style={styles.orderItems}>
                <Package size={16} color="#64748b" />
                <Text style={styles.itemsText}>
                  {order.to_Item?.results?.length || 0} items
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderType}>
                <Text style={styles.orderTypeText}>Type: {order.SalesOrderType}</Text>
                <Text style={styles.createdByText}>Created by: {order.CreatedByUser}</Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>

            {/* Order Items Preview */}
            {order.to_Item?.results && order.to_Item.results.length > 0 && (
              <View style={styles.itemsPreview}>
                <Text style={styles.itemsPreviewTitle}>Items:</Text>
                {order.to_Item.results.slice(0, 2).map((item, index) => (
                  <View key={item.SalesOrderItem} style={styles.itemPreview}>
                    <Text style={styles.itemText} numberOfLines={1}>
                      {item.SalesOrderItemText || item.Material}
                    </Text>
                    <Text style={styles.itemQuantity}>
                      {item.OrderQuantity} {item.OrderQuantityUnit}
                    </Text>
                  </View>
                ))}
                {order.to_Item.results.length > 2 && (
                  <Text style={styles.moreItemsText}>
                    +{order.to_Item.results.length - 2} more items
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <ShoppingCart size={48} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>No sales orders found</Text>
            <Text style={styles.emptyStateDescription}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Sales orders will appear here once they are created'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Inter-Bold',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusFilter: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statusFilterContent: {
    gap: 8,
  },
  statusButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    fontFamily: 'Inter-SemiBold',
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    fontFamily: 'Inter-SemiBold',
  },
  orderItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemsText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderType: {
    flex: 1,
  },
  orderTypeText: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  createdByText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  itemsPreview: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  itemsPreviewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  itemPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#3b82f6',
    fontStyle: 'italic',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});