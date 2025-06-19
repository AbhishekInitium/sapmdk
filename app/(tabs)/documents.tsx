import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
} from 'lucide-react-native';

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  createdBy: string;
  createdDate: string;
  status: 'draft' | 'approved' | 'pending' | 'archived';
  tags: string[];
}

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadDocuments();
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadDocuments = () => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Q4 Financial Report 2024',
        type: 'PDF',
        size: '2.4 MB',
        createdBy: 'Sarah Johnson',
        createdDate: '2024-01-15',
        status: 'approved',
        tags: ['Finance', 'Quarterly', 'Report'],
      },
      {
        id: '2',
        title: 'Employee Handbook v3.2',
        type: 'DOCX',
        size: '1.8 MB',
        createdBy: 'HR Department',
        createdDate: '2024-01-12',
        status: 'approved',
        tags: ['HR', 'Policy', 'Handbook'],
      },
      {
        id: '3',
        title: 'Project Proposal - Digital Transformation',
        type: 'PPTX',
        size: '5.2 MB',
        createdBy: 'Michael Chen',
        createdDate: '2024-01-10',
        status: 'pending',
        tags: ['Project', 'Strategy', 'Digital'],
      },
      {
        id: '4',
        title: 'Vendor Contract - TechCorp Solutions',
        type: 'PDF',
        size: '892 KB',
        createdBy: 'Legal Team',
        createdDate: '2024-01-08',
        status: 'draft',
        tags: ['Legal', 'Contract', 'Vendor'],
      },
      {
        id: '5',
        title: 'Marketing Campaign Analysis',
        type: 'XLSX',
        size: '3.1 MB',
        createdBy: 'Emma Wilson',
        createdDate: '2024-01-05',
        status: 'approved',
        tags: ['Marketing', 'Analysis', 'Campaign'],
      },
    ];

    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'draft':
        return '#6b7280';
      case 'archived':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getFileIcon = (type: string) => {
    return <FileText size={24} color="#3b82f6" />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <Text style={styles.headerSubtitle}>Manage your business documents</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      <ScrollView
        style={styles.documentsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredDocuments.map((document) => (
          <TouchableOpacity key={document.id} style={styles.documentCard}>
            <View style={styles.documentHeader}>
              <View style={styles.documentInfo}>
                {getFileIcon(document.type)}
                <View style={styles.documentDetails}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <View style={styles.documentMeta}>
                    <View style={styles.metaItem}>
                      <User size={12} color="#64748b" />
                      <Text style={styles.metaText}>{document.createdBy}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Calendar size={12} color="#64748b" />
                      <Text style={styles.metaText}>{document.createdDate}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(document.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(document.status) }
                ]}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.documentFooter}>
              <View style={styles.tagsContainer}>
                {document.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Tag size={10} color="#64748b" />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.documentActions}>
                <Text style={styles.documentSize}>{document.size}</Text>
                <TouchableOpacity style={styles.actionButton}>
                  <Eye size={16} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Download size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  documentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  documentDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    fontFamily: 'Inter-SemiBold',
  },
  documentMeta: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentSize: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  actionButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});