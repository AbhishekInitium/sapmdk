import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: 'approval' | 'document' | 'employee';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'completed';
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      loadDashboardData();
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadDashboardData = () => {
    // Simulate loading data from SAP services
    setMetrics([
      {
        id: '1',
        title: 'Total Revenue',
        value: '$2.4M',
        change: '+12.5%',
        trend: 'up',
        icon: <DollarSign size={24} color="#10b981" />,
      },
      {
        id: '2',
        title: 'Active Employees',
        value: '1,247',
        change: '+3.2%',
        trend: 'up',
        icon: <Users size={24} color="#3b82f6" />,
      },
      {
        id: '3',
        title: 'Pending Approvals',
        value: '23',
        change: '-8.1%',
        trend: 'down',
        icon: <FileText size={24} color="#f59e0b" />,
      },
      {
        id: '4',
        title: 'System Health',
        value: '98.5%',
        change: '+0.3%',
        trend: 'up',
        icon: <CheckCircle size={24} color="#10b981" />,
      },
    ]);

    setActivities([
      {
        id: '1',
        type: 'approval',
        title: 'Purchase Order #PO-2024-001',
        description: 'Awaiting manager approval for office supplies',
        timestamp: '2 hours ago',
        status: 'pending',
      },
      {
        id: '2',
        type: 'employee',
        title: 'New Employee Onboarding',
        description: 'Sarah Johnson joined the Marketing team',
        timestamp: '4 hours ago',
        status: 'completed',
      },
      {
        id: '3',
        type: 'document',
        title: 'Monthly Report Generated',
        description: 'Q4 financial report is ready for review',
        timestamp: '6 hours ago',
        status: 'approved',
      },
    ]);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} color="#f59e0b" />;
      case 'approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'completed':
        return <CheckCircle size={16} color="#10b981" />;
      default:
        return <AlertCircle size={16} color="#ef4444" />;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <TouchableOpacity key={metric.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                {metric.icon}
                <View style={[
                  styles.trendBadge,
                  { backgroundColor: metric.trend === 'up' ? '#dcfce7' : '#fef3c7' }
                ]}>
                  {metric.trend === 'up' ? (
                    <TrendingUp size={12} color="#10b981" />
                  ) : (
                    <TrendingDown size={12} color="#f59e0b" />
                  )}
                  <Text style={[
                    styles.trendText,
                    { color: metric.trend === 'up' ? '#10b981' : '#f59e0b' }
                  ]}>
                    {metric.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {activities.map((activity) => (
            <TouchableOpacity key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {getStatusIcon(activity.status)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionCard}>
            <FileText size={32} color="#3b82f6" />
            <Text style={styles.quickActionText}>Create Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Users size={32} color="#10b981" />
            <Text style={styles.quickActionText}>Add Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <DollarSign size={32} color="#f59e0b" />
            <Text style={styles.quickActionText}>Process Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <CheckCircle size={32} color="#8b5cf6" />
            <Text style={styles.quickActionText}>Approve Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'Inter-Bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  metricsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  metricTitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  activityContainer: {
    padding: 20,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  quickActionsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
});