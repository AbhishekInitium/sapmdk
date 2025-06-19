import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { TrendingUp, TrendingDown, ChartBar as BarChart3, ChartPie as PieChart, Calendar, Download, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export default function Analytics() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [departmentData, setDepartmentData] = useState<ChartData[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadAnalyticsData();
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadAnalyticsData = () => {
    // Mock data for revenue chart
    setRevenueData([
      { label: 'Jan', value: 65, color: '#3b82f6' },
      { label: 'Feb', value: 78, color: '#3b82f6' },
      { label: 'Mar', value: 52, color: '#3b82f6' },
      { label: 'Apr', value: 89, color: '#3b82f6' },
      { label: 'May', value: 95, color: '#3b82f6' },
      { label: 'Jun', value: 87, color: '#3b82f6' },
    ]);

    // Mock data for department breakdown
    setDepartmentData([
      { label: 'Sales', value: 35, color: '#10b981' },
      { label: 'Marketing', value: 25, color: '#3b82f6' },
      { label: 'Engineering', value: 20, color: '#f59e0b' },
      { label: 'HR', value: 12, color: '#8b5cf6' },
      { label: 'Finance', value: 8, color: '#ef4444' },
    ]);

    // Mock metrics
    setMetrics([
      {
        title: 'Revenue Growth',
        value: '12.5%',
        change: '+2.3%',
        trend: 'up',
        color: '#10b981',
      },
      {
        title: 'Customer Acquisition',
        value: '847',
        change: '+15.2%',
        trend: 'up',
        color: '#3b82f6',
      },
      {
        title: 'Conversion Rate',
        value: '3.2%',
        change: '-0.5%',
        trend: 'down',
        color: '#f59e0b',
      },
      {
        title: 'Avg. Order Value',
        value: '$156',
        change: '+8.1%',
        trend: 'up',
        color: '#8b5cf6',
      },
    ]);
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const renderBarChart = (data: ChartData[]) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const chartHeight = 200;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Revenue Trend</Text>
          <TouchableOpacity style={styles.chartAction}>
            <Download size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
        <View style={styles.barChart}>
          <View style={styles.yAxis}>
            {[100, 75, 50, 25, 0].map((value) => (
              <Text key={value} style={styles.yAxisLabel}>{value}K</Text>
            ))}
          </View>
          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {data.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.value / maxValue) * (chartHeight - 40),
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderPieChart = (data: ChartData[]) => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Department Breakdown</Text>
          <TouchableOpacity style={styles.chartAction}>
            <PieChart size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChart}>
            <PieChart size={120} color="#e2e8f0" />
            <View style={styles.pieChartCenter}>
              <Text style={styles.pieChartCenterText}>100%</Text>
            </View>
          </View>
          <View style={styles.pieChartLegend}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Business insights and metrics</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}>
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <View style={[
                  styles.trendIndicator,
                  { backgroundColor: metric.color + '20' }
                ]}>
                  {metric.trend === 'up' ? (
                    <TrendingUp size={12} color={metric.color} />
                  ) : (
                    <TrendingDown size={12} color={metric.color} />
                  )}
                </View>
              </View>
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.value}
              </Text>
              <Text style={[
                styles.metricChange,
                { color: metric.trend === 'up' ? '#10b981' : '#ef4444' }
              ]}>
                {metric.change} from last {selectedPeriod}
              </Text>
            </View>
          ))}
        </View>

        {/* Charts */}
        {renderBarChart(revenueData)}
        {renderPieChart(departmentData)}

        {/* Performance Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Performance Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <BarChart3 size={24} color="#3b82f6" />
              <Text style={styles.summaryCardTitle}>Total Sales</Text>
              <Text style={styles.summaryCardValue}>$2.4M</Text>
              <Text style={styles.summaryCardChange}>+12.5% vs last month</Text>
            </View>
            <View style={styles.summaryCard}>
              <Calendar size={24} color="#10b981" />
              <Text style={styles.summaryCardTitle}>Active Projects</Text>
              <Text style={styles.summaryCardValue}>47</Text>
              <Text style={styles.summaryCardChange}>+3 new this month</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  filterButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
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
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  trendIndicator: {
    borderRadius: 12,
    padding: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  metricChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Inter-SemiBold',
  },
  chartAction: {
    padding: 4,
  },
  barChart: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingVertical: 20,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  chartArea: {
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingBottom: 20,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  pieChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartCenterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Inter-SemiBold',
  },
  pieChartLegend: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontFamily: 'Inter-Regular',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: 'Inter-SemiBold',
  },
  summaryContainer: {
    padding: 20,
    paddingTop: 0,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  summaryCardChange: {
    fontSize: 12,
    color: '#10b981',
    fontFamily: 'Inter-Regular',
  },
});