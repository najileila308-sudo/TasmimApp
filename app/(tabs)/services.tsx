import { Image, ImageBackground, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedReveal } from '@/components/animated-reveal';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { ServiceCard } from '@/components/service-card';
import { AppColors } from '@/constants/theme';
import {
  contactDetails,
  ctaLinks,
  processSteps,
  serviceShowcase,
  services,
  technologies,
  valuePoints,
} from '@/data/site-content';

export default function ServicesScreen() {
  return (
    <ScreenContainer
      eyebrow="Services"
      title="Des services digitaux penses pour convertir"
      description="Une offre claire pour lancer une presence web solide, une application mobile utile ou une experience visuelle plus professionnelle."
      heroBackgroundSource={require('@/assets/images/servicedigi.png')}>
      <AnimatedReveal delay={40}>
        <SectionHeader
          title="Expertises"
          subtitle="Une selection des services mis en avant dans l univers Tasmim Web."
        />
      </AnimatedReveal>

      <View style={styles.stack}>
        {services.map((service, index) => (
          <AnimatedReveal key={service.id} delay={100 + index * 90}>
            <ServiceCard service={service} />
          </AnimatedReveal>
        ))}
      </View>

      <AnimatedReveal delay={320} style={styles.section}>
        <SectionHeader
          title="Pourquoi nous choisir"
          subtitle="Une approche simple, sur mesure et adaptee a des besoins PME, marque ou PFE."
        />
        <View style={styles.pointsList}>
          {valuePoints.map((point) => (
            <View key={point} style={styles.pointItem}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={390} style={styles.section}>
        <SectionHeader
          title="Technologies"
          subtitle="Les technologies robustes que nous utilisons pour concevoir des experiences fiables."
        />
        <View style={styles.techRow}>
          {technologies.map((tech) => (
            <View key={tech} style={styles.techCard}>
              <ImageBackground
                source={
                  tech === 'Figma'
                    ? require('@/assets/images/figma.png')
                    : tech === 'Django'
                      ? require('@/assets/images/django.png')
                      : tech === 'WordPress'
                        ? require('@/assets/images/wordpress.png')
                        : tech === 'WooCommerce'
                          ? require('@/assets/images/woocommerce.png')
                          : require('@/assets/images/github.png')
                }
                style={styles.techLogo}
                imageStyle={styles.techLogoImage}
              />
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={450} style={styles.section}>
        <SectionHeader
          title="Pret a digitaliser votre entreprise ?"
          subtitle="Quelques prestations detaillees inspirees de la presentation du site."
        />
        <View style={styles.showcaseStack}>
          {serviceShowcase.map((item, index) => (
            <AnimatedReveal key={item.id} delay={520 + index * 100}>
              <View style={styles.showcaseCard}>
                <ImageBackground
                  source={
                    item.image === 'branding'
                      ? require('@/assets/images/branding.png')
                      : item.image === 'site'
                        ? require('@/assets/images/site.png')
                        : require('@/assets/images/devlweb.png')
                  }
                  style={styles.showcaseMedia}
                  imageStyle={styles.showcaseMediaImage}
                />
                <View style={styles.showcaseCopy}>
                  <Text style={styles.showcaseTitle}>{item.title}</Text>
                  <Text style={styles.showcaseDescription}>{item.description}</Text>
                  <Pressable style={styles.showcaseButton} onPress={() => Linking.openURL(ctaLinks.email)}>
                    <Text style={styles.showcaseButtonText}>Savoir plus</Text>
                  </Pressable>
                </View>
              </View>
            </AnimatedReveal>
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={620} style={styles.section}>
        <SectionHeader
          title="Notre processus"
          subtitle="Une progression en 5 etapes pour passer du besoin a la maintenance."
        />
        {processSteps.map((step, index) => (
          <View key={step.id} style={styles.processCard}>
            <View style={styles.processIconWrap}>
              <Image
                source={
                  step.id === 'planning'
                    ? require('@/assets/images/plan.png')
                    : step.id === 'conception'
                      ? require('@/assets/images/concep.png')
                      : step.id === 'development'
                        ? require('@/assets/images/devlop.png')
                        : step.id === 'launch'
                          ? require('@/assets/images/lanc.png')
                          : require('@/assets/images/mantenaince.png')
                }
                style={styles.processIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.processCopy}>
              <Text style={styles.processTitle}>{step.title}</Text>
              <Text style={styles.processText}>{step.text}</Text>
            </View>
          </View>
        ))}
      </AnimatedReveal>

      <AnimatedReveal delay={760} style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Parlons de votre projet</Text>
        <Text style={styles.ctaText}>
          Contact rapide par telephone ou email pour demander un devis, cadrer un besoin ou
          presenter votre idee.
        </Text>

        <View style={styles.ctaButtons}>
          <Pressable style={styles.primaryButton} onPress={() => Linking.openURL(ctaLinks.phone)}>
            <Text style={styles.primaryButtonText}>Appeler</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => Linking.openURL(ctaLinks.email)}>
            <Text style={styles.secondaryButtonText}>Envoyer un email</Text>
          </Pressable>
        </View>

        <Text style={styles.contactHint}>{contactDetails.phone}</Text>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
  },
  section: {
    marginTop: 24,
  },
  pointsList: {
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    gap: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: AppColors.accent,
  },
  pointText: {
    flex: 1,
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  techCard: {
    minWidth: '30%',
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techLogo: {
    width: 90,
    height: 38,
    marginBottom: 10,
  },
  techLogoImage: {
    resizeMode: 'contain',
  },
  techText: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  showcaseStack: {
    gap: 14,
  },
  showcaseCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  showcaseMedia: {
    height: 180,
    backgroundColor: AppColors.surfaceAlt,
  },
  showcaseMediaImage: {
    resizeMode: 'cover',
  },
  showcaseCopy: {
    padding: 18,
  },
  showcaseTitle: {
    color: AppColors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  showcaseDescription: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 25,
    marginBottom: 16,
  },
  showcaseButton: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accent,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  showcaseButtonText: {
    color: '#03131F',
    fontSize: 13,
    fontWeight: '800',
  },
  processCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    marginBottom: 10,
  },
  processIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 20,
    backgroundColor: AppColors.surfaceAlt,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processIcon: {
    width: 42,
    height: 42,
  },
  processCopy: {
    flex: 1,
  },
  processTitle: {
    color: AppColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  processText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  ctaCard: {
    marginTop: 24,
    backgroundColor: AppColors.surfaceAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
  },
  ctaTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  ctaText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: AppColors.accent,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#03131F',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: AppColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  contactHint: {
    color: AppColors.textMuted,
    fontSize: 12,
  },
});
