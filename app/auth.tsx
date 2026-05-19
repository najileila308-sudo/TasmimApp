import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  adminEmail,
  isSupabaseConfigured,
  signInUser,
  signInWithOAuthProvider,
  signUpUser,
} from '@/lib/supabase';

const C = {
  gradientTop: '#3B82F6',
  gradientMid: '#4D91F5',
  gradientBot: '#7FB7FF',
  accent: '#4D91F5',
  accentLight: '#7FB7FF',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  inputBg: '#F7FBFF',
  inputBorder: '#D6E8FB',
  tabInactive: '#EEF6FF',
  tabTextInactive: '#7E99B8',
  textDark: '#17314B',
  textMuted: '#7E99B8',
  textPlaceholder: '#A6BDD3',
  divider: '#D6E8FB',
  google: '#4285F4',
  facebook: '#1877F2',
  forgotColor: '#4D91F5',
} as const;

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState<'google' | 'facebook' | null>(null);

  const isLogin = mode === 'login';

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !confirmPassword.trim())) {
      Alert.alert('Champs requis', 'Merci de remplir tous les champs.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Mot de passe', 'Les mots de passe ne sont pas identiques.');
      return;
    }

    if (!isSupabaseConfigured) {
      Alert.alert(
        'Configuration manquante',
        'Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (isLogin) {
        await signInUser(email.trim(), password);
        router.replace(email.trim().toLowerCase() === adminEmail.toLowerCase() ? '/admin' : '/(tabs)');
        return;
      }

      const nextSession = await signUpUser(email.trim(), password);
      if (nextSession) {
        Alert.alert('Compte cree', 'Votre compte a ete cree avec succes.');
        router.replace(email.trim().toLowerCase() === adminEmail.toLowerCase() ? '/admin' : '/(tabs)');
        return;
      }

      Alert.alert(
        'Compte cree',
        'Votre compte a ete cree. Verifiez votre email si une confirmation est demandee, puis connectez-vous.'
      );
      setMode('login');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(
        'Authentification impossible',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialPress = async (provider: 'google' | 'facebook') => {
    if (!isSupabaseConfigured) {
      Alert.alert(
        'Configuration manquante',
        'Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.'
      );
      return;
    }

    try {
      setIsSocialSubmitting(provider);
      const result = await signInWithOAuthProvider(provider);
      const nextEmail = result.session?.user?.email?.trim().toLowerCase();

      router.replace(nextEmail === adminEmail.toLowerCase() ? '/admin' : '/(tabs)');
    } catch (error) {
      Alert.alert(
        `${provider === 'google' ? 'Google' : 'Facebook'} indisponible`,
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setIsSocialSubmitting(null);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.gradientTop} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.hero}>
          <View style={styles.circleTopRight} />
          <View style={styles.circleBottomLeft} />

          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color={C.white} />
          </Pressable>

          <View style={styles.logoRow}>
            <View style={styles.logoIconWrap}>
              <Image
                source={require('@/assets/images/logotasmim.png')}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.logoName}>Tasmim Web</Text>
              <Text style={styles.logoSub}>TASMIM.WEB</Text>
            </View>
          </View>

          <Text style={styles.heroPrompt}>
            Remplissez les informations ci-dessous pour vous connecter
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Mon Compte</Text>

          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
              onPress={() => setMode('login')}>
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Connexion</Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
              onPress={() => setMode('register')}>
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Inscription</Text>
            </Pressable>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>EMAIL OU NOM D&apos;UTILISATEUR</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor={C.textPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>MOT DE PASSE</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor={C.textPlaceholder}
              secureTextEntry
              style={styles.input}
            />
            {isLogin ? (
              <Pressable onPress={() => router.push('/reset-password')}>
                <Text style={styles.forgotLink}>Mot de passe oublie ?</Text>
              </Pressable>
            ) : null}
          </View>

          {!isLogin ? (
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>CONFIRMER LE MOT DE PASSE</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor={C.textPlaceholder}
                secureTextEntry
                style={styles.input}
              />
            </View>
          ) : null}

          <Pressable
            style={[styles.primaryBtn, isSubmitting && { opacity: 0.75 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={C.white} style={{ marginRight: 8 }} />
            ) : null}
            <Text style={styles.primaryBtnText}>
              {isLogin ? 'SE CONNECTER' : 'CREER MON COMPTE'}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              style={[styles.socialBtn, isSocialSubmitting === 'facebook' && styles.socialBtnDisabled]}
              onPress={() => handleSocialPress('facebook')}
              disabled={Boolean(isSocialSubmitting)}>
              {isSocialSubmitting === 'facebook' ? (
                <ActivityIndicator size="small" color={C.facebook} />
              ) : (
                <Ionicons name="logo-facebook" size={20} color={C.facebook} />
              )}
              <Text style={styles.socialBtnText}>Facebook</Text>
            </Pressable>
            <Pressable
              style={[styles.socialBtn, isSocialSubmitting === 'google' && styles.socialBtnDisabled]}
              onPress={() => handleSocialPress('google')}
              disabled={Boolean(isSocialSubmitting)}>
              {isSocialSubmitting === 'google' ? (
                <ActivityIndicator size="small" color={C.google} />
              ) : (
                <Ionicons name="logo-google" size={20} color={C.google} />
              )}
              <Text style={styles.socialBtnText}>Google</Text>
            </Pressable>
          </View>

          <View style={styles.bottomLinkRow}>
            <Text style={styles.bottomLinkText}>
              {isLogin ? 'Pas encore de compte ? ' : 'Deja un compte ? '}
            </Text>
            <Pressable onPress={() => setMode(isLogin ? 'register' : 'login')}>
              <Text style={styles.bottomLinkAction}>
                {isLogin ? "S'INSCRIRE" : 'SE CONNECTER'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.gradientTop,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 54,
    paddingBottom: 36,
    paddingHorizontal: 28,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.gradientMid,
  },
  circleTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  logoIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoImg: {
    width: 38,
    height: 38,
  },
  logoName: {
    color: C.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  logoSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  heroPrompt: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: C.cardBg,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    flex: 1,
    padding: 28,
    paddingTop: 30,
    shadowColor: '#1a1240',
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
  },
  formTitle: {
    color: C.textDark,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 22,
    letterSpacing: -0.3,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.tabInactive,
    borderRadius: 14,
    padding: 4,
    marginBottom: 22,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tabText: {
    color: C.tabTextInactive,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: C.white,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 7,
  },
  input: {
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: C.textDark,
  },
  forgotLink: {
    color: C.forgotColor,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 7,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 6,
    marginBottom: 18,
    shadowColor: C.accent,
    shadowOpacity: 0.38,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.divider,
  },
  dividerText: {
    color: C.textPlaceholder,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: C.white,
  },
  socialBtnDisabled: {
    opacity: 0.7,
  },
  socialBtnText: {
    color: C.textDark,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 2,
  },
  bottomLinkText: {
    color: C.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  bottomLinkAction: {
    color: C.accent,
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
