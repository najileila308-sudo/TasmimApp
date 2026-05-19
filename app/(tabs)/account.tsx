import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AnimatedReveal } from '@/components/animated-reveal';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { AppColors } from '@/constants/theme';
import {
  AuthProvider,
  getCurrentSession,
  getCurrentUserProfile,
  signOutUser,
  updateUserPassword,
} from '@/lib/supabase';

type AccountData = {
  email: string;
  id: string;
  createdAt: string;
  provider: AuthProvider;
  providerLabel: string;
};

function getAuthProviderLabel(provider: AccountData['provider']) {
  switch (provider) {
    case 'facebook':
      return 'Inscription via Facebook';
    case 'google':
      return 'Inscription via Google';
    case 'email':
      return 'Inscription par email';
    default:
      return 'Methode non disponible';
  }
}

function normalizeProvider(provider: string | null | undefined): AuthProvider {
  if (provider === 'facebook' || provider === 'google' || provider === 'email') {
    return provider;
  }

  return 'unknown';
}

function getSessionProvider(session: Awaited<ReturnType<typeof getCurrentSession>>): AuthProvider {
  const provider =
    session?.user?.app_metadata?.provider ??
    session?.user?.identities?.[0]?.provider ??
    (session?.user?.email ? 'email' : null);

  return normalizeProvider(provider);
}

function renderProviderIcon(provider: AccountData['provider']) {
  if (provider === 'facebook') {
    return <Ionicons name="logo-facebook" size={28} color="#1877F2" />;
  }

  if (provider === 'google') {
    return <Ionicons name="logo-google" size={28} color="#4285F4" />;
  }

  if (provider === 'email') {
    return <Ionicons name="mail-outline" size={28} color={AppColors.accentStrong} />;
  }

  return <Ionicons name="person-outline" size={28} color={AppColors.accentStrong} />;
}

export default function AccountScreen() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      try {
        const session = await getCurrentSession();

        if (!active) {
          return;
        }

        if (!session?.user) {
          setAccount(null);
          return;
        }

        const profile = await getCurrentUserProfile();
        const provider = profile?.auth_provider
          ? normalizeProvider(profile.auth_provider)
          : getSessionProvider(session);
        const fallbackEmail =
          provider === 'facebook' ? 'Non fourni par Facebook' : 'Email non disponible';

        setAccount({
          email: profile?.email ?? session.user.email ?? fallbackEmail,
          id: session.user.id,
          createdAt: session.user.created_at
            ? new Date(session.user.created_at).toLocaleDateString('fr-MA')
            : 'Date non disponible',
          provider,
          providerLabel: getAuthProviderLabel(provider),
        });
      } catch (error) {
        if (active) {
          Alert.alert('Chargement impossible', error instanceof Error ? error.message : 'Erreur inconnue');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutUser();
      router.replace('/auth');
    } catch (error) {
      Alert.alert('Deconnexion impossible', error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Champs requis', 'Entrez le nouveau mot de passe et sa confirmation.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Mot de passe', 'Le mot de passe doit contenir au moins 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mot de passe', 'Les mots de passe ne sont pas identiques.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await updateUserPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Mot de passe modifie', 'Votre mot de passe a ete mis a jour avec succes.');
    } catch (error) {
      Alert.alert(
        'Modification impossible',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <ScreenContainer
      eyebrow="Compte"
      title="Votre espace utilisateur"
      description="Retrouvez ici les informations du compte connecte et deconnectez-vous facilement."
      heroBackgroundSource={require('@/assets/images/responsable.png')}>
      <AnimatedReveal delay={50}>
        <SectionHeader
          title="Informations du compte"
          subtitle="Ces informations viennent de votre session Supabase Auth."
        />
      </AnimatedReveal>

      {isLoading ? (
        <AnimatedReveal delay={120} style={styles.loaderCard}>
          <ActivityIndicator color={AppColors.accentStrong} />
          <Text style={styles.loaderText}>Chargement du compte...</Text>
        </AnimatedReveal>
      ) : account ? (
        <>
          <AnimatedReveal delay={120} style={styles.accountCard}>
            <View style={styles.avatarWrap}>
              {renderProviderIcon(account.provider)}
            </View>

            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Methode d inscription</Text>
                <Text style={styles.infoValue}>{account.providerLabel}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{account.email}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date d inscription</Text>
                <Text style={styles.infoValue}>{account.createdAt}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Identifiant</Text>
                <Text style={styles.infoValueSmall}>{account.id}</Text>
              </View>
            </View>
          </AnimatedReveal>

          <AnimatedReveal delay={200} style={styles.securityCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={AppColors.mintStrong} />
            <Text style={styles.securityText}>
              Votre compte utilisateur est stocke dans Supabase Auth, separe des messages clients.
            </Text>
          </AnimatedReveal>

          {account.provider === 'email' ? (
            <AnimatedReveal delay={240} style={styles.passwordCard}>
              <Text style={styles.passwordTitle}>Modifier mot de passe</Text>
              <Text style={styles.passwordSubtitle}>
                Entrez un nouveau mot de passe pour mettre a jour votre compte.
              </Text>

              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={AppColors.textMuted}
                secureTextEntry
                style={styles.input}
              />

              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmer mot de passe"
                placeholderTextColor={AppColors.textMuted}
                secureTextEntry
                style={styles.input}
              />

              <Pressable
                style={[styles.passwordButton, isUpdatingPassword && styles.logoutButtonDisabled]}
                onPress={handlePasswordUpdate}
                disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <ActivityIndicator size="small" color={AppColors.white} />
                ) : (
                  <Ionicons name="key-outline" size={18} color={AppColors.white} />
                )}
                <Text style={styles.passwordButtonText}>Modifier mot de passe</Text>
              </Pressable>
            </AnimatedReveal>
          ) : (
            <AnimatedReveal delay={240} style={styles.securityCard}>
              {renderProviderIcon(account.provider)}
              <Text style={styles.securityText}>
                Ce compte utilise une connexion sociale. La securite et le mot de passe sont geres
                par {account.provider === 'facebook' ? ' Facebook.' : ' le fournisseur connecte.'}
              </Text>
            </AnimatedReveal>
          )}

          <AnimatedReveal delay={280} style={styles.actionArea}>
            <Pressable
              style={[styles.logoutButton, isSigningOut && styles.logoutButtonDisabled]}
              onPress={handleSignOut}
              disabled={isSigningOut}>
              {isSigningOut ? (
                <ActivityIndicator size="small" color={AppColors.white} />
              ) : (
                <Ionicons name="log-out-outline" size={18} color={AppColors.white} />
              )}
              <Text style={styles.logoutButtonText}>Se deconnecter</Text>
            </Pressable>
          </AnimatedReveal>
        </>
      ) : (
        <AnimatedReveal delay={120} style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Aucun compte charge</Text>
          <Text style={styles.emptyText}>Reconnectez-vous pour afficher vos informations.</Text>
        </AnimatedReveal>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loaderCard: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  loaderText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  accountCard: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 28,
    padding: 20,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: AppColors.accentSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  infoList: {
    gap: 14,
  },
  infoItem: {
    backgroundColor: AppColors.bgSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoLabel: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  infoValue: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  infoValueSmall: {
    color: AppColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  securityCard: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: AppColors.mintSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  securityText: {
    flex: 1,
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  passwordCard: {
    marginTop: 18,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 24,
    padding: 18,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  passwordTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  passwordSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  input: {
    backgroundColor: AppColors.bgSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 18,
    color: AppColors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    marginBottom: 12,
  },
  passwordButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: AppColors.accentStrong,
    borderRadius: 18,
    paddingVertical: 15,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  passwordButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  actionArea: {
    marginTop: 18,
    marginBottom: 120,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: AppColors.danger,
    borderRadius: 20,
    paddingVertical: 16,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  logoutButtonDisabled: {
    opacity: 0.75,
  },
  logoutButtonText: {
    color: AppColors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 24,
    padding: 24,
  },
  emptyTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
