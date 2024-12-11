import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { setupDatabase, getDb } from '@/lib/database';

export default function HomeScreen() {
  const [categories, setCategories] = useState<{ categoryid: number; name: string; description: string }[]>([]);

  useEffect(() => {
    const initializeDb = async () => {
      await setupDatabase(); // Datenbank einrichten
      await fetchCategories(); // Kategorien abrufen
    };

    initializeDb();
  }, []);

  // Kategorien aus der Datenbank abrufen
  const fetchCategories = async () => {
    try {
      const db = await getDb();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Category;',
          [],
          (_, { rows }) => {
            const results = rows._array as { category_id: number; name: string; description: string }[];
            setCategories(results);
          },
          (txObj, error) => console.error('Fehler beim Abrufen der Kategorien:', error)
        );
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Kategorien:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {categories.length > 0 ? (
          categories.map(category => (
            <Text key={category.category_id} style={styles.listItem}>
              {category.name}: {category.description}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>Keine Kategorien gefunden.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});