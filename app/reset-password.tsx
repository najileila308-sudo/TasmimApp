import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

import * as Linking from 'expo-linking';

import {
  adminEmail,
  getSessionFromUrl,
  isSupabaseConfigured,
  sendPasswordResetEmail,
  updateUserPassword,
} from '@/lib/supabase';

const C = {
  gradientTop: '#3B82F6',
  gradientMid: '#4D91F5',
  accent: '#4D91F5',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  inputBg: '#F7FBFF',
  inputBorder: '#D6E8FB',
  textDark: '#17314B',
  textMuted: '#7E99B8',
  textPlaceholder: '#A6BDD3',
  success: '#0A7B63',
  successSoft: '#E8FFF9',
} as const;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'update'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);

  useEffect(() => {
    let active = true;

    const handleIncomingUrl = async (url: string | null) => {
      if (!active || !url || !url.includes('/reset-password')) {
        return;
      }

      try {
        const result = await getSessionFromUrl(url);

        if (!active) {
          return;
        }

        if (result.type === 'recovery' || result.session) {
          setStep('update');
          setIsRecoveryReady(true);

          const nextEmail = result.session?.user?.email;
          if (nextEmail) {
            setEmail(nextEmail);
          }
        }
      } catch (error) {
        if (!active) {
          return;
        }

        Alert.alert(
          'Lien invalide',
          error instanceof Error ? error.message : 'Le lien de reinitialisation est invalide.'
        );
      }
    };

    handleIncomingUrl(Linking.getLinkingURL());

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleIncomingUrl(url);
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const handleRequestReset = async () => {
    if (!email.trim()) {
      Alert.alert('Email requis', 'Entrez votre email pour recevoir le lien de reinitialisation.');
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
      await sendPasswordResetEmail(email.trim());

      Alert.alert(
        'Email envoye',
        'Un lien de reinitialisation a ete envoye a votre adresse email.'
      );
    } catch (error) {
      Alert.alert(
        'Envoi impossible',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!isRecoveryReady) {
      Alert.alert(
        'Lien requis',
        'Ouvrez le lien recu par email pour definir votre nouveau mot de passe.'
      );
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Champs requis', 'Entrez et confirmez votre nouveau mot de passe.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mot de passe', 'Les mots de passe ne sont pas identiques.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateUserPassword(password);

      Alert.alert('Mot de passe mis a jour', 'Votre nouveau mot de passe a ete enregistre.', [
        {
          text: 'OK',
          onPress: () =>
            router.replace(email.trim().toLowerCase() === adminEmail.toLowerCase() ? '/admin' : '/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Mise a jour impossible',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.gradientTop} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.hero}>
          <View style={styles.circleTopRight} />
          <View style={styles.circleBottomLeft} />

          <Pressable style={styles.backBtn} onPress={() => router.replace('/auth')}>
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
            {step === 'request'
              ? 'Entrez votre email pour recevoir un lien securise de reinitialisation.'
              : 'Definissez maintenant votre nouveau mot de passe dans le meme univers visuel de l application.'}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {step === 'request' ? 'Mot de passe oublie' : 'Nouveau mot de passe'}
          </Text>

          {step === 'request' ? (
            <>
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>EMAIL</Text>
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

              <Pressable
                style={[styles.primaryBtn, isSubmitting && styles.buttonDisabled]}
                onPress={handleRequestReset}
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={C.white} style={{ marginRight: 8 }} />
                ) : null}
                <Text style={styles.primaryBtnText}>ENVOYER LE LIEN</Text>
              </Pressable>

              <View style={styles.infoCard}>
                <Ionicons name="mail-open-outline" size={18} color={C.success} />
                <Text style={styles.infoText}>
                  Ouvrez ensuite le lien recu par email pour revenir ici et choisir un nouveau mot
                  de passe.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoCard}>
                <Ionicons name="shield-checkmark-outline" size={18} color={C.success} />
                <Text style={styles.infoText}>
                  {isRecoveryReady
                    ? `Lien valide pour ${email || 'votre compte'}.`
                    : 'Validation du lien de recuperation en cours.'}
                </Text>
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>NOUVEAU MOT DE PASSE</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Entrez votre nouveau mot de passe"
                  placeholderTextColor={C.textPlaceholder}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>CONFIRMER LE MOT DE PASSE</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmez votre nouveau mot de passe"
                  placeholderTextColor={C.textPlaceholder}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <Pressable
                style={[styles.primaryBtn, isSubmitting && styles.buttonDisabled]}
                onPress={handleUpdatePassword}
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={C.white} style={{ marginRight: 8 }} />
                ) : null}
                <Text style={styles.primaryBtnText}>ENREGISTRER</Text>
              </Pressable>
            </>
          )}
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
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: C.successSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    color: C.success,
    lineHeight: 20,
    fontSize: 13,
    fontWeight: '600',
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
  buttonDisabled: {
    opacity: 0.75,
  },
});
