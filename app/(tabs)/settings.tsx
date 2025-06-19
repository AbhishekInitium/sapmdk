import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { User, Bell, Shield, Globe, Palette, Database, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Smartphone, Lock, Mail, Download } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Settings',
          subtitle: 'Update your personal information',
          icon: <User size={20} color="#3b82f6" />,
          type: 'navigation',
          onPress: () => console.log('Profile settings'),
        },
        {
          id: 'security',
          title: 'Security & Privacy',
          subtitle: 'Manage your account security',
          icon: <Shield size={20} color="#10b981" />,
          type: 'navigation',
          onPress: () => console.log('Security settings'),
        },
        {
          id: 'biometrics',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID',
          icon: <Lock size={20} color="#f59e0b" />,
          type: 'toggle',
          value: biometrics,
          onToggle: setBiometrics,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive alerts and updates',
          icon: <Bell size={20} color="#8b5cf6" />,
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: <Moon size={20} color="#64748b" />,
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'language',
          title: 'Language & Region',
          subtitle: 'English (US)',
          icon: <Globe size={20} color="#06b6d4" />,
          type: 'navigation',
          onPress: () => console.log('Language settings'),
        },
        {
          id: 'theme',
          title: 'App Theme',
          subtitle: 'Customize app appearance',
          icon: <Palette size={20} color="#ec4899" />,
          type: 'navigation',
          onPress: () => console.log('Theme settings'),
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          id: 'sync',
          title: 'Auto Sync',
          subtitle: 'Automatically sync data',
          icon: <Database size={20} color="#10b981" />,
          type: 'toggle',
          value: autoSync,
          onToggle: setAutoSync,
        },
        {
          id: 'storage',
          title: 'Storage Management',
          subtitle: 'Manage app data and cache',
          icon: <Smartphone size={20} color="#f59e0b" />,
          type: 'navigation',
          onPress: () => console.log('Storage settings'),
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Download your data',
          icon: <Download size={20} color="#3b82f6" />,
          type: 'navigation',
          onPress: () => console.log('Export data'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: <HelpCircle size={20} color="#06b6d4" />,
          type: 'navigation',
          onPress: () => console.log('Help & Support'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: <Mail size={20} color="#8b5cf6" />,
          type: 'navigation',
          onPress: () => console.log('Send feedback'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}>
        <View style={styles.settingItemLeft}>
          <View style={styles.settingIcon}>
            {item.icon}
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.settingItemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
              thumbColor={item.value ? '#fff' : '#f4f4f5'}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color="#94a3b8" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@company.com</Text>
          <Text style={styles.profileRole}>Senior Manager</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Sections */}
      <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0 (Build 100)</Text>
          <Text style={styles.versionSubtext}>© 2024 Your Company Name</Text>
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
  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  profileRole: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  editProfileButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  settingItemRight: {
    marginLeft: 12,
  },
  logoutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    fontFamily: 'Inter-Medium',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 100,
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#cbd5e1',
    fontFamily: 'Inter-Regular',
  },
});