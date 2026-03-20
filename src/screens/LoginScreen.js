import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  getPasswordValidationMessage,
} from '../utils/validators';

const LoginScreen = () => {
  const {
    loginUserWithPassword,
    signupUserWithPassword,
    loginAdminWithPassword,
    adminLoginInfo,
  } = useAuth();
  const [authMode, setAuthMode] = useState('selection'); // 'selection', 'user', 'admin', 'verifyEmail'
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationPopupTitle, setVerificationPopupTitle] = useState('Verification Link Sent');
  const [verificationPopupMessage, setVerificationPopupMessage] = useState('');
  const [signupName, setSignupName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_EMAIL = adminLoginInfo.email;

  const getAuthErrorMessage = (error, fallbackMessage) => {
    const code = error?.code || '';

    if (code.includes('email-already-in-use')) {
      return 'This email already has an account. If not verified yet, use the same signup password to resend the verification link.';
    }
    if (code.includes('email-already-verified')) {
      return 'This email is already verified. Please login instead of signing up.';
    }
    if (code.includes('unverified-account-password-required')) {
      return 'Account exists. To resend verification link, enter the same password used when you first signed up.';
    }
    if (code.includes('invalid-email')) return 'Invalid email.';
    if (code.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.';
    if (code.includes('invalid-credential') || code.includes('wrong-password')) {
      return 'Invalid email or password.';
    }
    if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.';

    return error?.message || fallbackMessage;
  };

  const openVerificationPopup = (title, message) => {
    setVerificationPopupTitle(title);
    setVerificationPopupMessage(message);
    setShowVerificationPopup(true);
  };

  const handleUserLogin = async () => {
    const normalizedEmail = userEmail.trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      Alert.alert('Error', 'Invalid email');
      return;
    }

    if (!validatePassword(userPassword)) {
      Alert.alert('Error', getPasswordValidationMessage());
      return;
    }

    setIsLoading(true);
    try {
      await loginUserWithPassword({ email: normalizedEmail, password: userPassword });
    } catch (error) {
      Alert.alert('Login Failed', getAuthErrorMessage(error, 'Invalid user credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSignup = async () => {
    const trimmedName = signupName.trim();
    const normalizedEmail = userEmail.trim().toLowerCase();

    if (!trimmedName) {
      openVerificationPopup('Error', 'Please enter your name.');
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      openVerificationPopup('Error', 'Invalid email.');
      return;
    }

    if (!validatePassword(userPassword)) {
      openVerificationPopup('Error', getPasswordValidationMessage());
      return;
    }

    setIsLoading(true);
    openVerificationPopup('Please wait', 'Creating your account and sending verification link...');

    try {
      const result = await signupUserWithPassword({
        name: trimmedName,
        email: normalizedEmail,
        password: userPassword,
      });

      if (result?.requiresEmailVerification) {
        const targetEmail = result.email || normalizedEmail;
        const isResent = result.verificationAction === 'resent';

        setVerificationEmail(targetEmail);
        openVerificationPopup(
          'Verification Link Sent',
          isResent
            ? `This email is already registered but not verified yet. We resent the verification link to ${targetEmail}. Please check your Gmail inbox.`
            : `Verification link has been sent to ${targetEmail}. Please check your Gmail inbox and verify your account.`
        );
        return;
      }

      setShowVerificationPopup(false);
      Alert.alert('Success', 'Account created successfully.');
    } catch (error) {
      openVerificationPopup('Signup Failed', getAuthErrorMessage(error, 'Unable to create account.'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerificationSent = () => (
    <View style={styles.authContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => setAuthMode('user')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.authTitle}>Verify Your Email</Text>
      <Text style={styles.authSubtitle}>
        We sent a verification link to {verificationEmail || 'your email address'}.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📧 Next Steps</Text>
        <Text style={styles.infoText}>
          1. Open your inbox and click the verification link.{"\n"}
          2. Return to this app.{"\n"}
          3. Login using your email and password.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.authButton}
        onPress={() => {
          setAuthMode('user');
          setIsSignupMode(false);
        }}
      >
        <Text style={styles.authButtonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAdminLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', getPasswordValidationMessage());
      return;
    }

    setIsLoading(true);
    try {
      await loginAdminWithPassword({ email: normalizedEmail, password });
    } catch (error) {
      Alert.alert('Login Failed', getAuthErrorMessage(error, 'Invalid credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserAuth = () => (
    <View style={styles.authContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setAuthMode('selection')}
      >
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.authTitle}>Customer Login</Text>
      <Text style={styles.authSubtitle}>
        {isSignupMode
          ? 'Create your customer account'
          : 'Enter your email and password to continue'}
      </Text>

      {isSignupMode && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={signupName}
            onChangeText={setSignupName}
            placeholder="Enter your full name"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={userEmail}
          onChangeText={setUserEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={userPassword}
          onChangeText={setUserPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.authButton, isLoading && styles.disabledButton]}
        onPress={isSignupMode ? handleUserSignup : handleUserLogin}
        disabled={isLoading}
      >
        <Text style={styles.authButtonText}>
          {isLoading
            ? 'Please wait...'
            : isSignupMode
              ? 'Sign Up as Customer'
              : 'Login as Customer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => {
          setIsSignupMode((prev) => !prev);
          setUserPassword('');
        }}
        disabled={isLoading}
      >
        <Text style={styles.secondaryActionText}>
          {isSignupMode ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Customer Access</Text>
        <Text style={styles.infoText}>
          Use Firebase Email/Password. After sign up, verify your email using the link sent to your inbox before logging in.
        </Text>
      </View>
    </View>
  );

  const renderAdminAuth = () => (
    <View style={styles.authContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setAuthMode('selection')}
      >
        <Text style={styles.backButtonText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.authTitle}>Admin Login</Text>
      <Text style={styles.authSubtitle}>Enter your credentials to access admin panel</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.authButton, isLoading && styles.disabledButton]}
        onPress={handleAdminLogin}
        disabled={isLoading}
      >
        <Text style={styles.authButtonText}>
          {isLoading ? 'Please wait...' : 'Login as Admin'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔐 Admin Access</Text>
        <Text style={styles.infoText}>
          Admin account email:
          {'\n'}Email: {ADMIN_EMAIL}
          {'\n'}Password: (configured in Firebase console)
        </Text>
      </View>
    </View>
  );

  const renderRoleSelection = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Choose Your Role</Text>

      <TouchableOpacity
        style={[styles.roleCard, { borderLeftColor: '#FF6B35' }]}
        onPress={() => {
          setAuthMode('user');
          setIsSignupMode(false);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.roleCardLeft}>
          <Text style={styles.roleIcon}>👤</Text>
          <View style={styles.roleText}>
            <Text style={styles.roleTitle}>Customer</Text>
            <Text style={styles.roleSubtitle}>Login with email and password to place orders</Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, { borderLeftColor: '#1A1A2E' }]}
        onPress={() => setAuthMode('admin')}
        activeOpacity={0.8}
      >
        <View style={styles.roleCardLeft}>
          <Text style={styles.roleIcon}>⚙️</Text>
          <View style={styles.roleText}>
            <Text style={styles.roleTitle}>Administrator</Text>
            <Text style={styles.roleSubtitle}>Login with email to manage canteen</Text>
          </View>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔒 Secure Authentication</Text>
        <Text style={styles.infoText}>
          Customers and Admins use Firebase Email/Password authentication.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />

      <KeyboardAvoidingView
        behavior={'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to</Text>
          <Text style={styles.headerSubtitle}>Campus Canteen 🍽️</Text>
          {authMode === 'selection' && (
            <Text style={styles.headerDescription}>Select your role to continue</Text>
          )}
          {authMode === 'verifyEmail' && (
            <Text style={styles.headerDescription}>Email verification required</Text>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {authMode === 'selection' && renderRoleSelection()}
          {authMode === 'user' && renderUserAuth()}
          {authMode === 'admin' && renderAdminAuth()}
          {authMode === 'verifyEmail' && renderVerificationSent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {showVerificationPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>{verificationPopupTitle}</Text>
            <Text style={styles.popupText}>
              {verificationPopupMessage ||
                `Verification link has been sent to ${verificationEmail || 'your email address'}. Please check your Gmail inbox and verify your account.`}
            </Text>

            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => {
                setShowVerificationPopup(false);
                if (verificationPopupTitle === 'Verification Link Sent') {
                  setIsSignupMode(false);
                  setUserPassword('');
                  setAuthMode('verifyEmail');
                }
              }}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  roleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 20,
    color: '#B0B0B0',
    fontWeight: 'bold',
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: 'bold',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1A1A2E',
  },
  authButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryAction: {
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryActionText: {
    color: '#1A1A2E',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#E65100',
    lineHeight: 18,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    elevation: 99,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  popupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 10,
  },
  popupText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 18,
  },
  popupButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  popupButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
