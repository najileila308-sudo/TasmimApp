import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Services() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Nos Services</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌐 Développement Web</Text>
        <Text style={styles.desc}>
          Création de sites web modernes, rapides et optimisés SEO.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Applications Mobile</Text>
        <Text style={styles.desc}>
          Applications Android et iOS performantes avec React Native.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎨 UI/UX Design</Text>
        <Text style={styles.desc}>
          Interfaces modernes et expérience utilisateur optimale.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0D1520',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    color: '#94a3b8',
    marginTop: 5,
  },
});