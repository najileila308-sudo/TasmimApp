import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { ProjectItem, accentColors, accentSoftColors } from '@/data/site-content';

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const accentColor = accentColors[project.accent];
  const softColor = accentSoftColors[project.accent];

  return (
    <View style={styles.card}>
      <ImageBackground
        source={getProjectImage(project.image)}
        style={[
          styles.cover,
          styles.imageCover,
          { backgroundColor: softColor, borderColor: accentColor },
        ]}
        imageStyle={styles.coverImage}>
        <View style={styles.imageOverlay} />
        <Text style={[styles.coverNumber, { color: AppColors.white }]}>
          {(index + 1).toString().padStart(2, '0')}
        </Text>
        <Text style={[styles.category, styles.categoryOnImage]}>{project.category}</Text>
      </ImageBackground>

      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.summary}>{project.summary}</Text>

      <View style={styles.tags}>
        {project.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function getProjectImage(image: ProjectItem['image']) {
  switch (image) {
    case 'devweb':
      return require('@/assets/images/devweb.png');
    case 'commerce':
      return require('@/assets/images/commerce.png');
    case 'appService':
      return require('@/assets/images/appService.png');
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 16,
    shadowColor: AppColors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cover: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    minHeight: 132,
    justifyContent: 'space-between',
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageCover: {
    justifyContent: 'space-between',
  },
  coverImage: {
    borderRadius: 16,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 52, 122, 0.2)',
  },
  coverNumber: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  category: {
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryOnImage: {
    color: AppColors.white,
  },
  title: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  summary: {
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
