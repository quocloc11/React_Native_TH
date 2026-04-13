// src/screens/NumberListDemo.tsx
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

// Tạo mảng 100 phần tử
const data = Array.from({ length: 100 }, (_, index) => ({
  id: index.toString(),
  title: `Item ${index + 1}`,
}));

const NumberListDemo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách 100 Items</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm không gian còn lại để cuộn được
    width: '100%',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default NumberListDemo;