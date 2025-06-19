import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { Search, Filter, Plus, Mail, Phone, MapPin, Calendar, User, MoveVertical as MoreVertical } from 'lucide-react-native';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadEmployees();
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadEmployees = () => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        joinDate: '2022-03-15',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'active',
      },
      {
        id: '2',
        name: 'Michael Chen',
        position: 'Product Manager',
        department: 'Marketing',
        email: 'michael.chen@company.com',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        joinDate: '2021-08-22',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'active',
      },
      {
        id: '3',
        name: 'Emma Wilson',
        position: 'Marketing Specialist',
        department: 'Marketing',
        email: 'emma.wilson@company.com',
        phone: '+1 (555) 345-6789',
        location: 'Los Angeles, CA',
        joinDate: '2023-01-10',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'on-leave',
      },
      {
        id: '4',
        name: 'David Rodriguez',
        position: 'Sales Director',
        department: 'Sales',
        email: 'david.rodriguez@company.com',
        phone: '+1 (555) 456-7890',
        location: 'Chicago, IL',
        joinDate: '2020-11-05',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'active',
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        position: 'HR Manager',
        department: 'HR',
        email: 'lisa.thompson@company.com',
        phone: '+1 (555) 567-8901',
        location: 'Austin, TX',
        joinDate: '2021-06-18',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'active',
      },
      {
        id: '6',
        name: 'James Park',
        position: 'Financial Analyst',
        department: 'Finance',
        email: 'james.park@company.com',
        phone: '+1 (555) 678-9012',
        location: 'Seattle, WA',
        joinDate: '2022-09-12',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        status: 'inactive',
      },
    ];

    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [searchQuery, employees, selectedDepartment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'on-leave':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'on-leave':
        return 'On Leave';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Employees</Text>
          <Text style={styles.headerSubtitle}>Manage your team members</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Department Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.departmentFilter}
        contentContainerStyle={styles.departmentFilterContent}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept}
            style={[
              styles.departmentButton,
              selectedDepartment === dept && styles.departmentButtonActive,
            ]}
            onPress={() => setSelectedDepartment(dept)}>
            <Text
              style={[
                styles.departmentButtonText,
                selectedDepartment === dept && styles.departmentButtonTextActive,
              ]}>
              {dept === 'all' ? 'All Departments' : dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Employee List */}
      <ScrollView
        style={styles.employeeList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredEmployees.map((employee) => (
          <TouchableOpacity key={employee.id} style={styles.employeeCard}>
            <View style={styles.employeeHeader}>
              <Image source={{ uri: employee.avatar }} style={styles.avatar} />
              <View style={styles.employeeInfo}>
                <View style={styles.employeeNameRow}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(employee.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(employee.status) }
                    ]}>
                      {getStatusText(employee.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.employeePosition}>{employee.position}</Text>
                <Text style={styles.employeeDepartment}>{employee.department}</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.employeeDetails}>
              <View style={styles.detailRow}>
                <Mail size={16} color="#64748b" />
                <Text style={styles.detailText}>{employee.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone size={16} color="#64748b" />
                <Text style={styles.detailText}>{employee.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#64748b" />
                <Text style={styles.detailText}>{employee.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#64748b" />
                <Text style={styles.detailText}>Joined {employee.joinDate}</Text>
              </View>
            </View>

            <View style={styles.employeeActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Mail size={16} color="#3b82f6" />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <User size={16} color="#10b981" />
                <Text style={styles.actionButtonText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <User size={48} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>No employees found</Text>
            <Text style={styles.emptyStateDescription}>
              Try adjusting your search or filter criteria
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
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
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
  departmentFilter: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  departmentFilterContent: {
    gap: 8,
  },
  departmentButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  departmentButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  departmentButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  departmentButtonTextActive: {
    color: '#fff',
  },
  employeeList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  employeeCard: {
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
  employeeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  employeePosition: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  moreButton: {
    padding: 4,
  },
  employeeDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  employeeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Regular',
  },
});