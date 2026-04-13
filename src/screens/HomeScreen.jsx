import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  FlatList, SafeAreaView, Dimensions, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MapPin, Bell, LayoutGrid, List, ShoppingCart, Star, Zap } from 'lucide-react-native';
import useStore from '../store/useStore';
import { COLORS } from '../theme/colors';

// IMPORT các linh kiện nâng cao từ file AdvancedComponents.js
import { HeartButton, SuccessToast } from '../components/AdvancedComponents';

const { width } = Dimensions.get('window');

// const CATEGORIES = [
//   { id: '1', name: 'Giày', icon: '👟', color: '#dbeafe' },
//   { id: '2', name: 'Áo quần', icon: '👕', color: '#fce7f3' },
//   { id: '3', name: 'Đồng hồ', icon: '⌚', color: '#dcfce7' },
//   { id: '4', name: 'Công nghệ', icon: '📱', color: '#ffedd5' },
// ];

// const PRODUCTS = [
//   { id: '1', name: 'Nike Air Max 270 Premium', price: 2450000, category: 'Giày', brand: 'Nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.8, reviews: 120 },
//   { id: '2', name: 'Adidas Ultraboost 22', price: 3100000, category: 'Giày', brand: 'Adidas', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', rating: 4.9, reviews: 85 },
//   { id: '3', name: 'iPhone 15 Pro Max', price: 34990000, category: 'Công nghệ', brand: 'Apple', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', rating: 5.0, reviews: 1200 },
//   { id: '4', name: 'Sony WH-1000XM5', price: 6500000, category: 'Công nghệ', brand: 'Sony', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.9, reviews: 560 },
// ];
export const CATEGORIES = [
  { id: '1', name: 'Giày', icon: '👟', color: '#dbeafe' },
  { id: '2', name: 'Áo quần', icon: '👕', color: '#fce7f3' },
  { id: '3', name: 'Đồng hồ', icon: '⌚', color: '#dcfce7' },
  { id: '4', name: 'Công nghệ', icon: '📱', color: '#ffedd5' },
];

export const PRODUCTS = [
  {
    id: '1',
    name: 'Nike Air Max 270 Premium',
    price: 2450000,
    category: 'Giày',
    brand: 'Nike',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
    rating: 4.8,
    reviews: 120
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    price: 3100000,
    category: 'Giày',
    brand: 'Adidas',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600',
    rating: 4.9,
    reviews: 85
  },
  {
    id: '3',
    name: 'iPhone 15 Pro Max',
    price: 34990000,
    category: 'Công nghệ',
    brand: 'Apple',
    img: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=600',
    rating: 5.0,
    reviews: 1200
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 6500000,
    category: 'Công nghệ',
    brand: 'Sony',
    img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
    rating: 4.9,
    reviews: 560
  },
];
export default function HomeScreen() {
  const navigation = useNavigation();
  const [isListView, setIsListView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [productList, setProductList] = useState(PRODUCTS);
  const [timeLeft, setTimeLeft] = useState(7200);

  // States cho thông báo Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const { favorites, toggleFavorite, addToCart } = useStore();

  const showNotification = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setProductList(PRODUCTS);
      setRefreshing(false);
    }, 1500);
  };

  const loadMore = () => {
    const more = PRODUCTS.map(item => ({
      ...item,
      id: Math.random().toString()
    }));
    setProductList(prev => [...prev, ...more]);
  };

  const renderProduct = ({ item }) => {
    const isFav = favorites.some(f => f.id === item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.productCard, isListView ? styles.productCardList : styles.productCardGrid]}
        onPress={() => navigation.navigate('DETAIL', { product: item })}
      >
        <View style={[styles.productImgBox, isListView ? styles.productImgBoxList : styles.productImgBoxGrid]}>
          <Image source={{ uri: item.img }} style={styles.fullImg} />

          {/* SỬ DỤNG HEART BUTTON CÓ ANIMATION */}
          <View style={styles.favBtnPosition}>
            <HeartButton
              isFav={isFav}
              onPress={() => {
                toggleFavorite(item);
                showNotification(isFav ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích ❤️");
              }}
            />
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>

          <View style={styles.productBottomRow}>
            <View>
              <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
              <View style={styles.ratingRow}>
                <Star size={10} color={COLORS.warning} fill={COLORS.warning} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            {/* NÚT MUA NHANH */}
            <TouchableOpacity
              style={styles.quickBuyBtn}
              onPress={() => {
                addToCart(item);
                showNotification(`Đã thêm ${item.name} vào giỏ hàng! 🛒`);
              }}
            >
              <ShoppingCart size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
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

      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <FlatList
          data={['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=800']}
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.bannerImg} />}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTag}>SIÊU SALE 2026</Text>
          <Text style={styles.bannerTitle}>Sneaker World{'\n'}Sale up to 50%</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Danh mục</Text><Text style={styles.seeAll}>Tất cả</Text></View>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.catItem} onPress={() => navigation.navigate('SEARCH')}>
              <View style={[styles.catIconBox, { backgroundColor: item.color }]}><Text style={{ fontSize: 24 }}>{item.icon}</Text></View>
              <Text style={styles.catName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Flash Sale */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.rowCenter}>
            <Zap size={18} color={COLORS.danger} fill={COLORS.danger} />
            <Text style={[styles.sectionTitle, { color: COLORS.danger, marginLeft: 5 }]}>Flash Sale</Text>
          </View>
          <View style={styles.timerBox}><Text style={styles.timerText}>{formatTime(timeLeft)}</Text></View>
        </View>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={PRODUCTS}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={renderProduct} // Dùng chung renderProduct để có đủ tính năng
        />
      </View>

      <View style={[styles.sectionHeader, { paddingHorizontal: 20, marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
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
      {/* COMPONENT THÔNG BÁO TỔNG QUÁT */}
      <SuccessToast
        visible={toastVisible}
        message={toastMsg}
        onHide={() => setToastVisible(false)}
      />

      <FlatList
        data={productList}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        numColumns={isListView ? 1 : 2}
        key={isListView ? 'list' : 'grid'}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.pb100}
        columnWrapperStyle={!isListView && { justifyContent: 'space-between', paddingHorizontal: 20 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  locLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: 'bold' },
  locText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  notiDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: COLORS.danger, borderRadius: 4, borderWidth: 2, borderColor: COLORS.white },

  bannerContainer: { marginHorizontal: 20, height: 176, borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.dark },
  bannerImg: { width: width - 40, height: 176, opacity: 0.8 },
  bannerOverlay: { position: 'absolute', inset: 0, padding: 24, justifyContent: 'center' },
  bannerTag: { color: COLORS.primaryLight, fontWeight: 'bold', fontSize: 12 },
  bannerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '900' },

  sectionContainer: { marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  timerBox: { backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timerText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  catItem: { alignItems: 'center', marginRight: 16 },
  catIconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted },

  viewToggleGroup: { flexDirection: 'row', backgroundColor: COLORS.border, padding: 4, borderRadius: 8 },
  viewToggleBtn: { padding: 6, borderRadius: 6 },
  viewToggleActive: { backgroundColor: COLORS.white },

  productCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 12, elevation: 3, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  productCardGrid: { width: (width - 56) / 2 },
  productCardList: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 },
  productImgBox: { backgroundColor: COLORS.surface, borderRadius: 15, overflow: 'hidden' },
  productImgBoxGrid: { width: '100%', aspectRatio: 1, marginBottom: 12 },
  productImgBoxList: { width: 90, height: 90, marginRight: 16 },
  fullImg: { width: '100%', height: '100%' },

  favBtnPosition: { position: 'absolute', top: 8, right: 8 }, // Vị trí cho HeartButton nảy

  productInfo: { flex: 1 },
  productCategory: { fontSize: 9, fontWeight: 'bold', color: COLORS.textLight, textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginTop: 2 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 },
  productPrice: { fontSize: 15, fontWeight: '900', color: COLORS.textMain },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textMuted, marginLeft: 4 },

  quickBuyBtn: { backgroundColor: COLORS.dark, width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});