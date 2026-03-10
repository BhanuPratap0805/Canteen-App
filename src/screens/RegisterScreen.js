import React, { useState } from 'react';
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
import { getErrorMessage, registerStudent } from '../services/authService';

const COLORS = {
  primary: '#FF6B35',
  navy: '#1A1A2E',
  bg: '#F5F5F5',
  white: '#FFFFFF',
};

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedRoll = rollNumber.trim().toUpperCase();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) return 'Please enter your full name.';
    if (!trimmedRoll) return 'Please enter your CUET roll number.';
    if (!trimmedEmail) return 'Please enter your email.';
    if (!/^\d{10}$/.test(trimmedPhone)) return 'Phone number must be exactly 10 digits.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const onSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await registerStudent(name, rollNumber, email, phone, password);
      // Auth state will update automatically; keeping navigation simple.
    } catch (e) {
      const friendly = e?.code ? getErrorMessage(e.code) : e?.message || 'Registration failed.';
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  const onRollChange = (text) => setRollNumber(String(text || '').toUpperCase());

  const onPhoneChange = (text) => {
    const digitsOnly = String(text || '').replace(/[^\d]/g, '');
    setPhone(digitsOnly.slice(0, 10));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Create Student Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={18} color="#B00020" style={{ marginTop: 1 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#7A7A7A"
            style={styles.input}
            editable={!loading}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>CUET Roll No</Text>
          <TextInput
            value={rollNumber}
            onChangeText={onRollChange}
            placeholder="e.g. 2404XXXXXXXX"
            placeholderTextColor="#7A7A7A"
            autoCapitalize="characters"
            style={styles.input}
            editable={!loading}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
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

          <Text style={[styles.label, { marginTop: 12 }]}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={onPhoneChange}
            placeholder="10-digit number"
            placeholderTextColor="#7A7A7A"
            keyboardType="phone-pad"
            style={styles.input}
            editable={!loading}
            maxLength={10}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 6 characters"
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
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.linkWrap}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </Pressable>
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

