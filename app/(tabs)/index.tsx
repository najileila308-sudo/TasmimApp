import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AnimatedReveal } from '@/components/animated-reveal';
import { heroStats, projects, services } from '@/data/site-content';

const C = {
  bgDeep: '#071A3D',
  bgMid: '#0E2C66',
  gradTop: '#0F4FBC',
  gradMid: '#1967DE',
  gradBot: '#4CA3FF',
  accent: '#1967DE',
  accentLight: '#67B5FF',
  accentSoft: 'rgba(25,103,222,0.15)',
  white: '#FFFFFF',
  cardBg: 'rgba(255,255,255,0.07)',
  cardBorder: 'rgba(255,255,255,0.13)',
  cardSolid: 'rgba(7,26,61,0.85)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.38)',
  mintGreen: '#4ADE80',
  blue: '#60A5FA',
  amber: '#FBBF24',
  shadow: 'rgba(17,86,201,0.42)',
} as const;

export default function Home() {
  const router = useRouter();
  const heroFloat = useRef(new Animated.Value(0)).current;
  const pulseBadge = useRef(new Animated.Value(1)).current;
  const glowRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -7,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseBadge, {
          toValue: 1.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseBadge, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(glowRotate, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [glowRotate, heroFloat, pulseBadge]);

  const spin = glowRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const serviceIconColor = (id: string) =>
    id === 'web' ? C.accentLight : id === 'mobile' ? C.blue : C.amber;
  const serviceIconBg = (id: string) =>
    id === 'web'
      ? 'rgba(103,181,255,0.18)'
      : id === 'mobile'
        ? 'rgba(96,165,250,0.18)'
        : 'rgba(251,191,36,0.18)';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgDeep} />

      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />
      <Animated.View style={[styles.orbRotating, { transform: [{ rotate: spin }] }]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.heroWrapper, { transform: [{ translateY: heroFloat }] }]}>
          <ImageBackground
            source={require('@/assets/images/hero.png')}
            style={styles.heroGradient}
            imageStyle={styles.heroBackgroundImage}>
            <View style={styles.heroShadeTop} />
            <View style={styles.heroShadeBottom} />

            {[
              { top: 18, left: 30, size: 3 },
              { top: 40, right: 50, size: 2 },
              { top: 70, left: 90, size: 2 },
              { top: 25, right: 20, size: 4 },
            ].map((dot, i) => (
              <View
                key={i}
                style={[
                  styles.heroDot,
                  {
                    top: dot.top,
                    left: 'left' in dot ? dot.left : undefined,
                    right: 'right' in dot ? dot.right : undefined,
                    width: dot.size,
                    height: dot.size,
                    borderRadius: dot.size / 2,
                  },
                ]}
              />
            ))}

            <View style={styles.badge}>
              <Animated.View style={[styles.badgeDot, { transform: [{ scale: pulseBadge }] }]} />
              <Text style={styles.badgeText}>Agence Digitale</Text>
            </View>

            <View style={styles.logoCard}>
              <Image
                source={require('@/assets/images/logotasmim.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.heroTitle}>
              Tasmim{'\n'}
              <Text style={styles.heroTitleAccent}>Web</Text>
            </Text>

            <Text style={styles.heroDesc}>
              Creation de sites web, applications mobiles et experiences digitales sur mesure.
            </Text>

            <View style={styles.heroBottom}>
              <Pressable style={styles.ctaBtn} onPress={() => router.push('/services')}>
                <Text style={styles.ctaBtnText}>Nos services</Text>
                <View style={styles.ctaArrow}>
                  <Ionicons name="arrow-forward" size={11} color={C.white} />
                </View>
              </Pressable>

              <View style={styles.statsRow}>
                {heroStats.slice(0, 2).map((item, index) => (
                  <View key={item.label} style={[styles.stat, index === 1 && { minWidth: 84 }]}>
                    <Text style={styles.statNum}>{item.value}</Text>
                    <Text style={styles.statLbl}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>

        <AnimatedReveal delay={80} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nos Services</Text>
            <Pressable onPress={() => router.push('/services')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </Pressable>
          </View>

          {services.map((item, index) => (
            <AnimatedReveal key={item.id} delay={140 + index * 90}>
              <View style={styles.serviceCard}>
                <View
                  style={[styles.serviceAccentBar, { backgroundColor: serviceIconColor(item.id) }]}
                />

                <View
                  style={[styles.serviceIconBox, { backgroundColor: serviceIconBg(item.id) }]}>
                  <Ionicons
                    name={item.icon as never}
                    size={18}
                    color={serviceIconColor(item.id)}
                  />
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.title}</Text>
                  <Text style={styles.serviceSub}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
              </View>
            </AnimatedReveal>
          ))}
        </AnimatedReveal>

        <AnimatedReveal delay={220} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projets</Text>
            <Pressable onPress={() => router.push('/projects')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </Pressable>
          </View>

          <View style={styles.portfolioRow}>
            {projects.slice(0, 2).map((item, index) => (
              <AnimatedReveal key={item.id} delay={280 + index * 100} style={styles.portfolioItem}>
                <View style={styles.portfolioCard}>
                  <ImageBackground
                    source={
                      item.image === 'appService'
                        ? require('@/assets/images/appService.png')
                        : item.image === 'commerce'
                          ? require('@/assets/images/commerce.png')
                          : require('@/assets/images/devweb.png')
                    }
                    style={StyleSheet.absoluteFill}
                    imageStyle={styles.portfolioImage}>
                    <View style={styles.portfolioOverlay} />
                  </ImageBackground>

                  <Text style={styles.portfolioWatermark}>{`0${index + 1}`}</Text>
                  <Text style={styles.portfolioKicker}>{item.category}</Text>
                  <Text style={styles.portfolioLabel}>{item.title}</Text>
                </View>
              </AnimatedReveal>
            ))}
          </View>

          <AnimatedReveal delay={420}>
            <View style={styles.quickContact}>
              <View style={styles.quickContactLeft}>
                <View style={styles.quickContactIcon}>
                  <Ionicons name="mail-outline" size={18} color={C.accentLight} />
                </View>
                <Text style={styles.quickContactTitle}>Besoin d&apos;un devis rapide ?</Text>
              </View>
              <Pressable style={styles.quickContactBtn} onPress={() => router.push('/contact')}>
                <Text style={styles.quickContactBtnText}>Contacter</Text>
                <Ionicons name="arrow-forward" size={12} color={C.white} />
              </Pressable>
            </View>
          </AnimatedReveal>
        </AnimatedReveal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bgDeep,
  },
  orbTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(76,163,255,0.18)',
  },
  orbBottomLeft: {
    position: 'absolute',
    top: 500,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(103,181,255,0.12)',
  },
  orbRotating: {
    position: 'absolute',
    top: 200,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(103,181,255,0.2)',
    borderStyle: 'dashed',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  heroWrapper: {
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: C.shadow,
    shadowOpacity: 1,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  heroGradient: {
    padding: 26,
    paddingBottom: 28,
    minHeight: 340,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.gradMid,
  },
  heroBackgroundImage: {
    resizeMode: 'cover',
    opacity: 0.46,
  },
  heroShadeTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.gradTop,
    opacity: 0.6,
  },
  heroShadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: C.gradBot,
    opacity: 0.24,
    borderTopLeftRadius: 60,
  },
  heroDot: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.mintGreen,
  },
  badgeText: {
    fontSize: 11,
    color: C.white,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  logoCard: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoImage: {
    width: 150,
    height: 38,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: C.white,
    lineHeight: 48,
    letterSpacing: -1.2,
    marginBottom: 10,
  },
  heroTitleAccent: {
    color: 'rgba(255,255,255,0.55)',
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 24,
    maxWidth: '90%',
  },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 18,
  },
  ctaBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },
  ctaArrow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 1,
  },
  stat: {
    minWidth: 64,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '900',
    color: C.white,
    letterSpacing: -0.5,
  },
  statLbl: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  section: {
    paddingHorizontal: 14,
    paddingTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 12,
    color: C.accentLight,
    fontWeight: '700',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden',
    gap: 14,
  },
  serviceAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  serviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 3,
  },
  serviceSub: {
    fontSize: 11,
    color: C.textSecondary,
    lineHeight: 16,
  },
  portfolioRow: {
    flexDirection: 'row',
    gap: 10,
  },
  portfolioItem: {
    flex: 1,
  },
  portfolioCard: {
    flex: 1,
    minHeight: 140,
    borderRadius: 22,
    backgroundColor: C.cardSolid,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 14,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  portfolioImage: {
    opacity: 0.55,
    borderRadius: 22,
  },
  portfolioOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,11,61,0.45)',
  },
  portfolioWatermark: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: -1,
  },
  portfolioKicker: {
    fontSize: 10,
    color: C.accentLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  portfolioLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.white,
    lineHeight: 18,
  },
  quickContact: {
    marginTop: 14,
    backgroundColor: C.cardBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  quickContactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickContactIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(103,181,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickContactTitle: {
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  quickContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: C.accent,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  quickContactBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
