import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedReveal } from '@/components/animated-reveal';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { AppColors } from '@/constants/theme';
import { agencyStats, contactDetails, ctaLinks } from '@/data/site-content';

const pillars = [
  {
    id: 'branding',
    title: 'Branding et e-marketing',
    text: 'Une image de marque plus forte avec des supports digitaux utiles et plus convaincants.',
    image: require('@/assets/images/branding.png'),
  },
  {
    id: 'web',
    title: 'Developpement web',
    text: 'Sites vitrines, boutiques e-commerce, refontes web et experiences orientees conversion.',
    image: require('@/assets/images/devlweb.png'),
  },
  {
    id: 'mobile',
    title: 'Applications et design',
    text: 'Applications mobiles, interfaces lisibles, logos et supports graphiques pour mieux presenter une activite.',
    image: require('@/assets/images/site.png'),
  },
] as const;

const webServices = [
  'Conception Boutique e-Commerce',
  "Conception d'Application Web",
  "Conception d'Application Mobile",
  'Refonte Site Internet',
] as const;

const designServices = [
  'Developpement Site Internet Vitrine',
  'Integration Web',
  'Creation Logo',
  'Creation Flyer & Brochure',
] as const;

export default function AgencyScreen() {
  return (
    <ScreenContainer
      eyebrow="L agence"
      title="Tasmim Web : agence web Casablanca, Maroc"
      description="Une version mobile plus claire de la page agence, avec presentation, chiffres cles, expertises et acces direct aux reseaux."
      heroBackgroundSource={require('@/assets/images/agency.png')}>
      <AnimatedReveal delay={40} style={styles.heroCard}>
        <ImageBackground
          source={require('@/assets/images/hero.png')}
          style={styles.heroMedia}
          imageStyle={styles.heroMediaImage}>
          <View style={styles.heroOverlay} />
          <Image
            source={require('@/assets/images/logotasmim.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heroMediaTitle}>Solutions digitales et securite</Text>
          <Text style={styles.heroMediaText}>
            Tasmim Web est une agence web e-marketing marocaine basee a Casablanca, specialisee dans
            le branding, les campagnes digitales et la conception de sites web et applications mobiles.
          </Text>
        </ImageBackground>
      </AnimatedReveal>

      <AnimatedReveal delay={120} style={styles.statsCard}>
        <View style={styles.statsGrid}>
          {agencyStats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={220}>
        <SectionHeader
          title="Positionnement"
          subtitle="Une lecture simple de ce que la page agence veut transmettre."
        />
      </AnimatedReveal>

      <AnimatedReveal delay={280} style={styles.infoCard}>
        <Text style={styles.infoText}>
          Une agence web d explorateurs ouverts sur le monde, avec des productions dans plusieurs
          secteurs d activite et une vraie exigence lorsqu il s agit d accomplir une mission.
        </Text>
      </AnimatedReveal>

      <AnimatedReveal delay={360} style={styles.section}>
        <SectionHeader
          title="Domaines d intervention"
          subtitle="Les grands axes de competence mis en avant par Tasmim Web."
        />
        <View style={styles.stack}>
          {pillars.map((item, index) => (
            <AnimatedReveal key={item.id} delay={420 + index * 90}>
              <View style={styles.pillarCard}>
                <Image source={item.image} style={styles.pillarImage} resizeMode="cover" />
                <View style={styles.pillarCopy}>
                  <Text style={styles.pillarTitle}>{item.title}</Text>
                  <Text style={styles.pillarText}>{item.text}</Text>
                </View>
              </View>
            </AnimatedReveal>
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={560} style={styles.footerBlock}>
        <View style={styles.footerBrand}>
          <Image
            source={require('@/assets/images/logotasmim.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerBrandText}>
            Tasmim Web est une agence web e-marketing marocaine basee a Casablanca.
          </Text>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton} onPress={() => Linking.openURL(ctaLinks.linkedin)}>
              <Ionicons name="logo-linkedin" size={18} color={AppColors.accent} />
            </Pressable>
            <Pressable style={styles.socialButton} onPress={() => Linking.openURL(ctaLinks.instagram)}>
              <Ionicons name="logo-instagram" size={18} color={AppColors.accent} />
            </Pressable>
          </View>
        </View>

        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Developpement Web</Text>
          {webServices.map((item) => (
            <Text key={item} style={styles.footerItem}>{`\u2022 ${item}`}</Text>
          ))}
        </View>

        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Conception Infographique</Text>
          {designServices.map((item) => (
            <Text key={item} style={styles.footerItem}>{`\u2022 ${item}`}</Text>
          ))}
        </View>

        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Contacts</Text>
          <Text style={styles.footerItem}>{contactDetails.phone}</Text>
          <Text style={styles.footerItem}>{contactDetails.email}</Text>
          <Text style={styles.footerItem}>{contactDetails.address}</Text>
        </View>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: 20,
  },
  heroMedia: {
    minHeight: 240,
    borderRadius: 30,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: AppColors.border,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroMediaImage: {
    borderRadius: 30,
    opacity: 0.62,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 52, 122, 0.22)',
  },
  logo: {
    width: 180,
    height: 52,
    marginBottom: 18,
  },
  heroMediaTitle: {
    color: AppColors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroMediaText: {
    color: AppColors.white,
    fontSize: 13,
    lineHeight: 21,
  },
  statsCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    marginBottom: 24,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
  },
  statValue: {
    color: AppColors.accentStrong,
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  infoText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
  },
  stack: {
    gap: 12,
  },
  pillarCard: {
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
  pillarCopy: {
    flex: 1,
  },
  pillarTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  pillarText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  footerBlock: {
    marginTop: 24,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 28,
    padding: 18,
    gap: 18,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  footerBrand: {
    gap: 12,
  },
  footerLogo: {
    width: 170,
    height: 48,
  },
  footerBrandText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 22,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: AppColors.surfaceAlt,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerColumn: {
    gap: 10,
  },
  footerTitle: {
    color: AppColors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  footerItem: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 22,
  },
  pillarImage: {
    width: 66,
    height: 66,
    borderRadius: 16,
  },
});
