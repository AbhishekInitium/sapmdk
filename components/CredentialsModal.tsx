import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Eye, EyeOff, Lock, User, X } from 'lucide-react-native';

interface CredentialsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (credentials: { username: string; password: string; apiUrl: string }) => void;
  loading?: boolean;
}

export default function CredentialsModal({ 
  visible, 
  onClose, 
  onSubmit, 
  loading = false 
}: CredentialsModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SALES_ORDER_SRV');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'Please enter the API URL');
      return;
    }

    onSubmit({
      username: username.trim(),
      password: password.trim(),
      apiUrl: apiUrl.trim(),
    });
  };

  const handleClose = () => {
    if (!loading) {
      setUsername('');
      setPassword('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Lock size={24} color="#3b82f6" />
                <Text style={styles.title}>SAP Credentials</Text>
              </View>
              {!loading && (
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.subtitle}>
              Enter your SAP S/4HANA credentials to access sales orders
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>API URL</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={apiUrl}
                    onChangeText={setApiUrl}
                    placeholder="https://your-sap-system.com/..."
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your SAP username"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your SAP password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={loading}>
                    {showPassword ? (
                      <EyeOff size={20} color="#64748b" />
                    ) : (
                      <Eye size={20} color="#64748b" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}>
                <Text style={[styles.submitButtonText, loading && styles.submitButtonTextDisabled]}>
                  {loading ? 'Connecting...' : 'Connect'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityNote}>
              <Text style={styles.securityText}>
                🔒 Your credentials are used only for this session and are not stored
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoid: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#fff',
    fontFamily: 'Inter-Regular',
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
  passwordInput: {
    paddingRight: 44,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
  submitButtonTextDisabled: {
    color: '#e2e8f0',
  },
  securityNote: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  securityText: {
    fontSize: 12,
    color: '#1e40af',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});