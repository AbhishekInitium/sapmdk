import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <AlertTriangle size={48} color="#ef4444" />
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorDetails}>
                {this.state.error.message}
              </Text>
            )}
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <RefreshCw size={16} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  errorDetails: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});