import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MapPin, Bell, LayoutGrid, List, Heart, Star } from 'lucide-react-native';
import useStore from '../store/useStore'; // 1. IMPORT KHO CHUNG
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Giày', icon: '👟', color: '#dbeafe' },
  { id: '2', name: 'Áo quần', icon: '👕', color: '#fce7f3' },
  { id: '3', name: 'Đồng hồ', icon: '⌚', color: '#dcfce7' },
  { id: '4', name: 'Công nghệ', icon: '📱', color: '#ffedd5' },
];

const PRODUCTS = [
  { id: '1', name: 'Nike Air Max 270 Premium', price: 2450000, category: 'Giày', brand: 'Nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.8, reviews: 120 },
  { id: '2', name: 'Adidas Ultraboost 22', price: 3100000, category: 'Giày', brand: 'Adidas', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', rating: 4.9, reviews: 85 },
  { id: '3', name: 'iPhone 15 Pro Max', price: 34990000, category: 'Công nghệ', brand: 'Apple', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', rating: 5.0, reviews: 1200 },
  { id: '4', name: 'Sony WH-1000XM5', price: 6500000, category: 'Công nghệ', brand: 'Sony', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.9, reviews: 560 },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isListView, setIsListView] = useState(false);

  // 2. LẤY DỮ LIỆU VÀ HÀM TỪ KHO CHUNG
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);

  // Hàm render từng thẻ sản phẩm
  const renderProduct = ({ item }) => {
    const isFav = favorites.some(f => f.id === item.id); // Kiểm tra xem đã thích chưa

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.productCard, isListView ? styles.productCardList : styles.productCardGrid]}
        onPress={() => navigation.navigate('DETAIL', { product: item })}
      >
        <View style={[styles.productImgBox, isListView ? styles.productImgBoxList : styles.productImgBoxGrid]}>
          <Image source={{ uri: item.img }} style={styles.fullImg} />
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(item)} // 3. GỌI HÀM CỦA KHO CHUNG
          >
            <Heart
              size={14}
              color={isFav ? COLORS.danger : COLORS.textLight}
              fill={isFav ? COLORS.danger : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.productBottomRow}>
            <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Header của danh sách (Banner + Categories)
  const ListHeader = () => (
    <View>
      {/* Header Top */}
      <View style={styles.homeHeader}>
        <TouchableOpacity style={styles.iconBtnRound}><Menu size={20} color={COLORS.textMain} /></TouchableOpacity>
        <View style={styles.headerLocation}>
          <Text style={styles.locLabel}>GIAO ĐẾN</Text>
          <View style={styles.rowCenter}>
            <MapPin size={14} color={COLORS.primary} />
            <Text style={styles.locText}>Q.1, TP. Hồ Chí Minh</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtnRound}>
          <Bell size={20} color={COLORS.textMain} /><View style={styles.notiDot} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800' }} style={styles.bannerImg} />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTag}>SIÊU SALE 2026</Text>
          <Text style={styles.bannerTitle}>Sneaker World{'\n'}Sale up to 50%</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Danh mục</Text><Text style={styles.seeAll}>Tất cả</Text></View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.catItem} onPress={() => navigation.navigate('SEARCH')}>
              <View style={[styles.catIconBox, { backgroundColor: item.color }]}><Text style={{ fontSize: 24 }}>{item.icon}</Text></View>
              <Text style={styles.catName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Toggle Grid/List */}
      <View style={[styles.sectionHeader, { paddingHorizontal: 20, marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Hàng mới về</Text>
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity onPress={() => setIsListView(false)} style={[styles.viewToggleBtn, !isListView && styles.viewToggleActive]}>
            <LayoutGrid size={16} color={!isListView ? COLORS.textMain : COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsListView(true)} style={[styles.viewToggleBtn, isListView && styles.viewToggleActive]}>
            <List size={16} color={isListView ? COLORS.textMain : COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        numColumns={isListView ? 1 : 2}
        key={isListView ? 'list' : 'grid'} // Force re-render khi đổi chế độ xem
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.pb100}
        columnWrapperStyle={!isListView && { justifyContent: 'space-between', paddingHorizontal: 20 }}
        // TỐI ƯU HIỆU NĂNG (Requirement 12)
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  pb100: { paddingBottom: 100 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  iconBtnRound: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  headerLocation: { alignItems: 'center' },
  locLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: 'bold', letterSpacing: 1 },
  locText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 4 },
  notiDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: COLORS.danger, borderRadius: 4, borderWidth: 2, borderColor: COLORS.white },
  bannerContainer: { marginHorizontal: 20, height: 176, borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.dark },
  bannerImg: { width: '100%', height: '100%', opacity: 0.8 },
  bannerOverlay: { position: 'absolute', inset: 0, padding: 24, justifyContent: 'center' },
  bannerTag: { color: COLORS.primaryLight, fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  bannerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '900', lineHeight: 30 },
  sectionContainer: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  catItem: { alignItems: 'center', marginRight: 16 },
  catIconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted },
  viewToggleGroup: { flexDirection: 'row', backgroundColor: COLORS.border, padding: 4, borderRadius: 8 },
  viewToggleBtn: { padding: 6, borderRadius: 6 },
  viewToggleActive: { backgroundColor: COLORS.white, elevation: 1 },
  productCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 12, elevation: 2, marginBottom: 16 },
  productCardGrid: { width: (width - 56) / 2 },
  productCardList: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 },
  productImgBox: { backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden' },
  productImgBoxGrid: { width: '100%', aspectRatio: 1, marginBottom: 12 },
  productImgBoxList: { width: 96, height: 96, marginRight: 16 },
  fullImg: { width: '100%', height: '100%' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  productInfo: { flex: 1 },
  productCategory: { fontSize: 10, fontWeight: 'bold', color: COLORS.textLight, textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginTop: 4 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { fontSize: 14, fontWeight: '900', color: COLORS.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, marginLeft: 4 },
});