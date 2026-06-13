import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { ServiceItem, accentColors, accentSoftColors } from '@/data/site-content';

type ServiceCardProps = {
  service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const accentColor = accentColors[service.accent];
  const softColor = accentSoftColors[service.accent];

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.mediaWrap}>
        <ImageBackground
          source={getServiceImage(service.image)}
          style={styles.heroMedia}
          imageStyle={styles.heroMediaImage}>
          <View style={styles.heroOverlay} />
          <Text style={styles.mediaLabel}>{service.subtitle}</Text>
        </ImageBackground>
      </View>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: softColor }]}>
          <Ionicons name={service.icon as never} size={20} color={accentColor} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.subtitle}>{service.subtitle}</Text>
        </View>
      </View>

      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.tags}>
        {service.highlights.map((item) => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function getServiceImage(image: ServiceItem['image']) {
  switch (image) {
    case 'prjdev':
      return require('@/assets/images/prjdev.png');
    case 'appmobile':
      return require('@/assets/images/appmobile.png');
    case 'designuiux':
      return require('@/assets/images/designuiux.png');
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
  mediaWrap: {
    marginBottom: 16,
  },
  heroMedia: {
    height: 146,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 14,
  },
  heroMediaImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 52, 122, 0.2)',
  },
  mediaLabel: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: AppColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  description: {
    color: AppColors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: AppColors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tagText: {
    color: AppColors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
});
