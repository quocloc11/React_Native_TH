import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet } from 'react-native';

const DATA = Array.from({ length: 20 }, (_, i) => ({ id: i.toString(), name: `Sản phẩm ${i + 1}`, price: (i + 1) * 100 }));

const ProductRow = React.memo(({ item }: any) => (
  <View style={styles.row}>
    <Image source={{ uri: 'https://picsum.photos/100' }} style={styles.img} />
    <View><Text style={{ fontWeight: 'bold' }}>{item.name}</Text><Text>{item.price}.000đ</Text></View>
  </View>
));

export const ProductScreen = () => {
  const [search, setSearch] = useState('');
  const [dbSearch, setDbSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDbSearch(search), 500); // Debounce
    return () => clearTimeout(t);
  }, [search]);

  const filteredData = useMemo(() => DATA.filter(p => p.name.toLowerCase().includes(dbSearch.toLowerCase())), [dbSearch]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TextInput placeholder="Tìm kiếm..." style={styles.search} onChangeText={setSearch} />
      <FlatList data={filteredData} keyExtractor={item => item.id} renderItem={({ item }) => <ProductRow item={item} />} getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })} />
    </View>
  );
};
const styles = StyleSheet.create({
  search: { margin: 10, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 25 },
  row: { flexDirection: 'row', padding: 10, height: 80, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  img: { width: 60, height: 60, borderRadius: 8, marginRight: 15 }
});