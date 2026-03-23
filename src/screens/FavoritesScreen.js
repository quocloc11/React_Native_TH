import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react-native';
import useStore from '../store/useStore';
import { COLORS } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, addToCart } = useStore();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnIcon}
            onPress={() => { addToCart(item); alert("Đã thêm vào giỏ!"); }}
          >
            <ShoppingCart size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Trash2 size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Yêu thích ({favorites.length})</Text>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={60} color={COLORS.border} />
          <Text style={styles.emptyText}>Danh sách trống</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: 'bold', padding: 20, color: COLORS.textMain },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 12, marginBottom: 15, elevation: 2 },
  img: { width: 80, height: 80, borderRadius: 12 },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: 'bold' },
  price: { color: COLORS.primary, fontWeight: '900', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 15, marginTop: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, color: COLORS.textLight, fontWeight: 'bold' }
});