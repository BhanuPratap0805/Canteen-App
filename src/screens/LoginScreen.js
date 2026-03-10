import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginStudent, loginStaff, getErrorMessage } from '../services/authService';

const COLORS = {
  primary: '#FF6B35',
  navy: '#1A1A2E',
  bg: '#F5F5F5',
  white: '#FFFFFF',
};

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('student'); // 'student' | 'staff'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isStudent = mode === 'student';
  const title = useMemo(() => (isStudent ? 'Student Login' : 'Staff Login'), [isStudent]);

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isStudent) {
        await loginStudent(email, password);
      } else {
        await loginStaff(email, password);
      }
    } catch (e) {
      const msg = e?.code ? getErrorMessage(e.code) : e?.message || 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>{title}</Text>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => setMode('student')}
            style={[styles.tab, isStudent ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.tabText, isStudent ? styles.tabTextActive : styles.tabTextInactive]}>
              Student
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('staff')}
            style={[styles.tab, !isStudent ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.tabText, !isStudent ? styles.tabTextActive : styles.tabTextInactive]}>
              Canteen Staff
            </Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={18} color="#B00020" style={{ marginTop: 1 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@gmail.com"
            placeholderTextColor="#7A7A7A"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            editable={!loading}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <Pressable
            onPress={onSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              (pressed && !loading) ? { opacity: 0.92 } : null,
              loading ? { opacity: 0.85 } : null,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </Pressable>

          {isStudent ? (
            <Pressable
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
              style={styles.linkWrap}
            >
              <Text style={styles.linkText}>
                Create an account
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 14,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabInactive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontWeight: '800',
    fontSize: 13,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabTextInactive: {
    color: COLORS.navy,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FDE7EA',
    borderColor: '#F8B4BD',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    color: '#B00020',
    fontWeight: '700',
    lineHeight: 18,
  },
  form: {
    backgroundColor: 'transparent',
  },
  label: {
    color: COLORS.navy,
    fontWeight: '800',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    color: COLORS.navy,
  },
  button: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  linkWrap: {
    alignSelf: 'center',
    paddingVertical: 14,
  },
  linkText: {
    color: COLORS.navy,
    fontWeight: '800',
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.navy,
  },
});

