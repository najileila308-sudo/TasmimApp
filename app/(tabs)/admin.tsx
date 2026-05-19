import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppColors } from '@/constants/theme';
import {
  adminEmail,
  deleteContactMessage,
  fetchContactMessages,
  getCurrentSession,
  isAdminConfigured,
  isAllowedAdminSession,
  isSupabaseConfigured,
  markContactMessageAsRead,
  signInAdmin,
  signOutAdmin,
  supabase,
  type ContactMessageRecord,
} from '@/lib/supabase';

export default function AdminScreen() {
  const [email, setEmail] = useState(adminEmail ?? '');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const unreadCount = messages.filter((item) => !item.is_read).length;

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      if (!isSupabaseConfigured || !isAdminConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const session = await getCurrentSession();
        const allowed = isAllowedAdminSession(session);

        if (active) {
          setIsAuthorized(allowed);
        }

        if (allowed) {
          await loadMessages(active);
        } else if (active) {
          setIsLoading(false);
        }
      } catch (error) {
        if (active) {
          setIsLoading(false);
          Alert.alert('Erreur session', error instanceof Error ? error.message : 'Erreur inconnue');
        }
      }
    };

    loadSession();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      const allowed = isAllowedAdminSession(session);
      setIsAuthorized(allowed);
      if (!allowed) {
        setMessages([]);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const loadMessages = async (active = true) => {
    try {
      if (active) {
        setIsLoading(true);
      }
      const data = await fetchContactMessages();
      if (active) {
        setMessages(data);
      }
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

  const handleSignIn = async () => {
    if (!isSupabaseConfigured || !isAdminConfigured) {
      Alert.alert(
        'Configuration manquante',
        'Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans .env.'
      );
      return;
    }

    if (email.trim() !== adminEmail) {
      Alert.alert('Acces refuse', "Utilisez uniquement l'email du responsable configure.");
      return;
    }

    if (!password.trim()) {
      Alert.alert('Mot de passe requis', 'Entrez le mot de passe du responsable.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInAdmin(email.trim(), password);
      setIsAuthorized(true);
      await loadMessages();
      setPassword('');
    } catch (error) {
      Alert.alert('Connexion impossible', error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      setIsAuthorized(false);
      setMessages([]);
    } catch (error) {
      Alert.alert('Deconnexion impossible', error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  const handleMarkAsRead = async (message: ContactMessageRecord) => {
    if (message.is_read) {
      return;
    }

    try {
      await markContactMessageAsRead(message.id);
      setMessages((current) =>
        current.map((item) => (item.id === message.id ? { ...item, is_read: true } : item))
      );
    } catch (error) {
      Alert.alert('Mise a jour impossible', error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  const handleDeleteMessage = (message: ContactMessageRecord) => {
    Alert.alert(
      'Supprimer le message',
      `Voulez-vous supprimer le message de ${message.name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContactMessage(message.id);
              setMessages((current) => current.filter((item) => item.id !== message.id));
            } catch (error) {
              Alert.alert(
                'Suppression impossible',
                error instanceof Error ? error.message : 'Erreur inconnue'
              );
            }
          },
        },
      ]
    );
  };

  if (!isSupabaseConfigured || !isAdminConfigured) {
    return (
      <View style={styles.root}>
        <View style={styles.centerCard}>
          <Text style={styles.centerTitle}>Admin</Text>
          <Text style={styles.centerSubtitle}>Configurez Supabase dans `.env` pour activer cet espace.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('@/assets/images/responsable.png')}
          imageStyle={styles.heroImage}
          style={styles.hero}>
          <View style={styles.heroOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Admin</Text>
            </View>
            <Text style={styles.title}>Espace responsable</Text>
            <Text style={styles.subtitle}>
              Consultez les messages envoyes depuis le formulaire de contact avec votre email
              autorise uniquement.
            </Text>
          </View>
        </ImageBackground>

        {!isAuthorized ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Connexion responsable</Text>
            <Text style={styles.panelHint}>{`Email autorise : ${adminEmail}`}</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email admin"
              placeholderTextColor={AppColors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor={AppColors.textMuted}
              secureTextEntry
              style={styles.input}
            />

            <Pressable
              style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={isSubmitting}>
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {unreadCount > 0 ? (
              <View style={styles.notificationBox}>
                <View style={styles.notificationDot} />
                <Text style={styles.notificationText}>
                  {unreadCount === 1
                    ? 'Nouveau message recu'
                    : `${unreadCount} nouveaux messages recus`}
                </Text>
              </View>
            ) : null}

            <View style={styles.toolbar}>
              <Pressable style={styles.secondaryButton} onPress={() => loadMessages()}>
                <Ionicons name="refresh-outline" size={16} color={AppColors.textPrimary} />
                <Text style={styles.secondaryButtonText}>Actualiser</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={16} color={AppColors.textPrimary} />
                <Text style={styles.secondaryButtonText}>Deconnexion</Text>
              </Pressable>
            </View>

            {isLoading ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator color={AppColors.accent} />
                <Text style={styles.loaderText}>Chargement des messages...</Text>
              </View>
            ) : messages.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Aucun message</Text>
                <Text style={styles.emptyText}>
                  Les messages envoyes depuis le formulaire apparaitront ici.
                </Text>
              </View>
            ) : (
              <View style={styles.messageList}>
                {messages.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[styles.messageCard, !item.is_read && styles.messageCardUnread]}
                    onPress={() => handleMarkAsRead(item)}>
                    <View style={styles.messageHeader}>
                      <View style={styles.messageTitleWrap}>
                        <Text style={styles.messageName}>{item.name}</Text>
                        {!item.is_read ? (
                          <View style={styles.newBadge}>
                            <View style={styles.newBadgeDot} />
                            <Text style={styles.newBadgeText}>Nouveau</Text>
                          </View>
                        ) : (
                          <View style={styles.readBadge}>
                            <Text style={styles.readBadgeText}>Lu</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.messageDate}>
                        {new Date(item.created_at).toLocaleString('fr-MA')}
                      </Text>
                    </View>
                    <Text style={styles.messageMeta}>{item.email}</Text>
                    <Text style={styles.messageMeta}>{item.phone || 'Telephone non renseigne'}</Text>
                    <Text style={styles.messageService}>{item.service_type}</Text>
                    <Text style={styles.messageBody}>{item.message}</Text>

                    <View style={styles.messageActions}>
                      {!item.is_read ? (
                        <Pressable
                          style={styles.messageActionButton}
                          onPress={() => handleMarkAsRead(item)}>
                          <Ionicons name="mail-open-outline" size={15} color={AppColors.textPrimary} />
                          <Text style={styles.messageActionText}>Marquer comme lu</Text>
                        </Pressable>
                      ) : null}

                      <Pressable
                        style={[styles.messageActionButton, styles.deleteButton]}
                        onPress={() => handleDeleteMessage(item)}>
                        <Ionicons name="trash-outline" size={15} color="#FFB4B4" />
                        <Text style={[styles.messageActionText, styles.deleteButtonText]}>
                          Supprimer
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  hero: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 30,
    marginBottom: 20,
    minHeight: 240,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroImage: {
    borderRadius: 30,
    opacity: 0.62,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
    backgroundColor: 'rgba(10, 52, 122, 0.24)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  badgeText: {
    color: AppColors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: AppColors.white,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: AppColors.white,
    fontSize: 14,
    lineHeight: 22,
  },
  centerCard: {
    margin: 16,
    marginTop: 80,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 28,
    padding: 22,
  },
  centerTitle: {
    color: AppColors.textPrimary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  centerSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 26,
    padding: 20,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  panelTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  panelHint: {
    color: AppColors.textMuted,
    fontSize: 13,
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
    marginBottom: 12,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: AppColors.accentStrong,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 15,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.surfaceAlt,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#FF5F5F',
  },
  notificationText: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  loaderBox: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: AppColors.textSecondary,
  },
  emptyBox: {
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
    lineHeight: 22,
  },
  messageList: {
    gap: 12,
  },
  messageCard: {
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
  messageCardUnread: {
    borderColor: AppColors.mint,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  messageTitleWrap: {
    flex: 1,
    gap: 8,
  },
  messageName: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  newBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.mintSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: AppColors.mintStrong,
  },
  newBadgeText: {
    color: AppColors.mintStrong,
    fontSize: 11,
    fontWeight: '800',
  },
  readBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  readBadgeText: {
    color: AppColors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  messageDate: {
    color: AppColors.textMuted,
    fontSize: 11,
  },
  messageMeta: {
    color: AppColors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  messageService: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    color: AppColors.accent,
    fontSize: 12,
    fontWeight: '700',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  messageBody: {
    color: AppColors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  messageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.surfaceAlt,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageActionText: {
    color: AppColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButton: {
    borderColor: 'rgba(255, 95, 95, 0.35)',
    backgroundColor: 'rgba(255, 95, 95, 0.08)',
  },
  deleteButtonText: {
    color: '#FFB4B4',
  },
});
