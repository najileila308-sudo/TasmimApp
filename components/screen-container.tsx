import { PropsWithChildren, ReactNode } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppColors } from '@/constants/theme';

type ScreenContainerProps = PropsWithChildren<{
  title: string;
  eyebrow?: string;
  description?: string;
  headerRight?: ReactNode;
  heroBackgroundSource?: ImageSourcePropType;
}>;

export function ScreenContainer({
  title,
  eyebrow,
  description,
  headerRight,
  heroBackgroundSource,
  children,
}: ScreenContainerProps) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.backGlowLarge} />
        <View style={styles.backGlowSmall} />
        <View style={styles.hero}>
          {heroBackgroundSource ? (
            <ImageBackground
              source={heroBackgroundSource}
              style={styles.heroBackground}
              imageStyle={styles.heroBackgroundImage}>
              <View style={styles.heroOverlay} />
            </ImageBackground>
          ) : null}
          <View style={styles.heroTop}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{eyebrow ?? 'Tasmim Web'}</Text>
            </View>
            {headerRight}
          </View>

          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },
  hero: {
    backgroundColor: 'rgba(14, 44, 102, 0.92)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  heroBackgroundImage: {
    borderRadius: 24,
    opacity: 0.58,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 58, 136, 0.34)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  badgeText: {
    color: AppColors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.7,
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  backGlowLarge: {
    position: 'absolute',
    top: 12,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(105, 168, 255, 0.14)',
  },
  backGlowSmall: {
    position: 'absolute',
    top: 220,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(76, 163, 255, 0.12)',
  },
});
