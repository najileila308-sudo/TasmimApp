import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedReveal } from '@/components/animated-reveal';
import { ProjectCard } from '@/components/project-card';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { AppColors } from '@/constants/theme';
import { ctaLinks, projects } from '@/data/site-content';

export default function ProjectsScreen() {
  return (
    <ScreenContainer
      eyebrow="Portfolio"
      title="Des projets qui melangent image, clarte et utilite"
      description="Une vitrine mobile de formats que Tasmim Web peut concevoir: site institutionnel, boutique e-commerce ou application de service."
      heroBackgroundSource={require('@/assets/images/projet.png')}>
      <AnimatedReveal delay={40}>
        <SectionHeader
          title="Selection de projets"
          subtitle="Des cas representatifs pour presenter les savoir-faire de l agence dans l app."
        />
      </AnimatedReveal>

      <View style={styles.grid}>
        {projects.map((project, index) => (
          <AnimatedReveal key={project.id} delay={120 + index * 100}>
            <ProjectCard project={project} index={index} />
          </AnimatedReveal>
        ))}
      </View>

      <AnimatedReveal delay={460} style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Ce que montrent ces projets</Text>
        <Text style={styles.summaryText}>
          Une meme logique revient sur chaque realisation: design lisible, contenu cible,
          experience mobile fluide et call-to-action clairs.
        </Text>

        <Pressable style={styles.button} onPress={() => Linking.openURL(ctaLinks.website)}>
          <Text style={styles.buttonText}>Voir le site vitrine</Text>
        </Pressable>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  summaryCard: {
    marginTop: 24,
    backgroundColor: AppColors.surfaceAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    padding: 18,
  },
  summaryTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryText: {
    color: AppColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: AppColors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
