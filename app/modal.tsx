import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppColors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Tasmim Web
      </ThemedText>
      <ThemedText style={styles.text}>
        Cette base Expo Router a ete transformee en application de presentation pour une agence
        digitale, avec un accueil, des services, des projets et une page contact.
      </ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Retour a l accueil</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: AppColors.bg,
  },
  title: {
    color: AppColors.textPrimary,
    marginBottom: 12,
  },
  text: {
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
