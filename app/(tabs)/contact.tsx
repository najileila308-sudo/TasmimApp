import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
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
import { contactDetails, contactServiceOptions, ctaLinks } from '@/data/site-content';
import { isSupabaseConfigured, saveContactMessage } from '@/lib/supabase';

type ContactCard = {
  key: string;
  icon: string;
  title: string;
  value: string;
  action?: string;
};

type ContactServiceOption = (typeof contactServiceOptions)[number];

const contactCards: readonly ContactCard[] = [
  {
    key: 'phone',
    icon: 'call-outline',
    title: 'Telephone',
    value: contactDetails.phone,
    action: ctaLinks.phone,
  },
  {
    key: 'email',
    icon: 'mail-outline',
    title: 'Email',
    value: contactDetails.email,
    action: ctaLinks.email,
  },
  {
    key: 'address',
    icon: 'location-outline',
    title: 'Adresse',
    value: contactDetails.address,
  },
] as const;

type FeedbackState =
  | {
      type: 'success' | 'error';
      message: string;
    }
  | null;

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<ContactServiceOption>(contactServiceOptions[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(12)).current;

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }

    return 'Erreur inconnue';
  };

  useEffect(() => {
    if (!feedback) {
      Animated.parallel([
        Animated.timing(feedbackOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackTranslateY, {
          toValue: 12,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 2600);

    return () => clearTimeout(timeout);
  }, [feedback, feedbackOpacity, feedbackTranslateY]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setService(contactServiceOptions[0]);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      showFeedback('error', 'Merci de remplir votre nom, email et description du besoin.');
      return;
    }

    if (!isSupabaseConfigured) {
      showFeedback(
        'error',
        'Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY dans votre fichier .env.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);

      await saveContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        service_type: service,
        message: message.trim(),
      });

      resetForm();
      showFeedback('success', 'Message envoye avec succes.');
    } catch (error) {
      const details = getErrorMessage(error);
      showFeedback('error', details);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer
      eyebrow="Contact"
      title="Contactez nous"
      description="Une page contact plus complete avec formulaire, type de prestation et acces direct aux reseaux sociaux de Tasmim Web."
      heroBackgroundSource={require('@/assets/images/contact.png')}>
      <AnimatedReveal delay={40}>
        <SectionHeader
          title="Coordonnees"
          subtitle="Telephone, email, adresse et reseaux sociaux accessibles depuis l app."
        />
      </AnimatedReveal>

      <View style={styles.stack}>
        {contactCards.map((item, index) => {
          return (
            <AnimatedReveal key={item.key} delay={100 + index * 80}>
              <Pressable
                style={styles.card}
                onPress={item.action ? () => Linking.openURL(item.action!) : undefined}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon as never} size={20} color={AppColors.accent} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.label}>{item.title}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </Pressable>
            </AnimatedReveal>
          );
        })}
      </View>

      <AnimatedReveal delay={320} style={styles.socialCard}>
        <Text style={styles.socialTitle}>Suivez Tasmim Web</Text>
        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton} onPress={() => Linking.openURL(ctaLinks.linkedin)}>
            <Ionicons name="logo-linkedin" size={18} color={AppColors.accent} />
            <Text style={styles.socialText}>LinkedIn</Text>
          </Pressable>
          <Pressable style={styles.socialButton} onPress={() => Linking.openURL(ctaLinks.instagram)}>
            <Ionicons name="logo-instagram" size={18} color={AppColors.accent} />
            <Text style={styles.socialText}>Instagram</Text>
          </Pressable>
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={420} style={styles.formCard}>
        <Text style={styles.formTitle}>Envoyez nous un message</Text>
        <Text style={styles.formSubtitle}>
          Vous cherchez un partenaire pour developper votre projet ? Vous etes au bon endroit.
        </Text>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.feedbackWrap,
            {
              opacity: feedbackOpacity,
              transform: [{ translateY: feedbackTranslateY }],
            },
          ]}>
          {feedback ? (
            <View
              style={[
                styles.feedbackCard,
                feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
              ]}>
              <Ionicons
                name={feedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={feedback.type === 'success' ? '#8FE3B0' : '#FFB4B4'}
              />
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.formRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Votre nom*"
            placeholderTextColor={AppColors.textMuted}
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email*"
            placeholderTextColor={AppColors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.formRow}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Telephone"
            placeholderTextColor={AppColors.textMuted}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <Text style={styles.selectorLabel}>Type de prestation</Text>
        <View style={styles.optionList}>
          {contactServiceOptions.map((option) => {
            const selected = service === option;

            return (
              <Pressable
                key={option}
                style={[styles.optionChip, selected && styles.optionChipActive]}
                onPress={() => setService(option)}>
                <Text style={[styles.optionText, selected && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Description du besoin*"
          placeholderTextColor={AppColors.textMuted}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textarea]}
        />

        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <View style={styles.submitButtonContent}>
            {isSubmitting ? <ActivityIndicator size="small" color={AppColors.white} /> : null}
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}</Text>
          </View>
        </Pressable>

        <Pressable style={styles.adminLink} onPress={() => router.push('/admin')}>
          <Ionicons name="shield-checkmark-outline" size={15} color={AppColors.textMuted} />
          <Text style={styles.adminLinkText}>Espace responsable</Text>
        </Pressable>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AppColors.accentSoft,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  label: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    color: AppColors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  socialCard: {
    marginTop: 24,
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  socialTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 13,
    backgroundColor: AppColors.surfaceAlt,
  },
  socialText: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    marginTop: 24,
    backgroundColor: AppColors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 20,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  formTitle: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  formSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  feedbackWrap: {
    marginBottom: 12,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(53, 133, 86, 0.16)',
    borderColor: 'rgba(143, 227, 176, 0.28)',
  },
  feedbackError: {
    backgroundColor: 'rgba(145, 52, 52, 0.16)',
    borderColor: 'rgba(255, 180, 180, 0.28)',
  },
  feedbackText: {
    flex: 1,
    color: AppColors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: AppColors.textPrimary,
    fontSize: 15,
    backgroundColor: AppColors.bgSoft,
  },
  selectorLabel: {
    color: AppColors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  optionList: {
    gap: 8,
    marginBottom: 14,
  },
  optionChip: {
    backgroundColor: AppColors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionChipActive: {
    backgroundColor: AppColors.mintSoft,
    borderColor: AppColors.mint,
  },
  optionText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  optionTextActive: {
    color: AppColors.mintStrong,
    fontWeight: '700',
  },
  textarea: {
    minHeight: 110,
    marginBottom: 18,
  },
  submitButton: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentStrong,
    borderRadius: 18,
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  adminLink: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: AppColors.surfaceAlt,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  adminLinkText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
