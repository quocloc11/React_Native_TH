import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  FlatList, Keyboard, Dimensions, Image, ActivityIndicator,
  Modal, ScrollView, Switch
} from 'react-native';
import {
  Search, X, Filter, Clock, TrendingUp, Mic,
  LayoutGrid, List, Heart, Star, ChevronDown,
  Check, ShoppingCart, Eye
} from 'lucide-react-native';
import CustomInput from '../components/CustomInput';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';

const { width, height } = Dimensions.get('window');

// Dữ liệu mẫu (Giữ nguyên)
const PRODUCTS = [
  { id: '1', name: 'Nike Air Max 270 Premium', price: 2450000, category: 'Giày', brand: 'Nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.8, popularity: 95, createdAt: '2024-03-01', inStock: true },
  { id: '2', name: 'Adidas Ultraboost 22', price: 3100000, category: 'Giày', brand: 'Adidas', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', rating: 4.9, popularity: 88, createdAt: '2024-03-10', inStock: true },
  { id: '3', name: 'iPhone 15 Pro Max', price: 34990000, category: 'Công nghệ', brand: 'Apple', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', rating: 5.0, popularity: 100, createdAt: '2024-03-15', inStock: true },
  { id: '4', name: 'Sony WH-1000XM5', price: 6500000, category: 'Công nghệ', brand: 'Sony', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.9, popularity: 75, createdAt: '2024-02-20', inStock: false },
  { id: '5', name: 'Rolex Submariner', price: 250000000, category: 'Đồng hồ', brand: 'Rolex', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', rating: 4.9, popularity: 60, createdAt: '2024-01-10', inStock: true },
  { id: '6', name: 'Hoodie Essentials', price: 1200000, category: 'Áo quần', brand: 'Fear of God', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', rating: 4.5, popularity: 82, createdAt: '2024-03-05', inStock: true },
];

const TRENDING = ["Nike Air Max", "iPhone 15", "Tai nghe Sony", "Áo hoodie"];
const BRANDS = ["Nike", "Adidas", "Apple", "Sony", "Rolex", "Fear of God"];
const SORT_OPTIONS = [
  { label: 'Phổ biến', value: 'popularity' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá thấp', value: 'price_low' },
  { label: 'Giá cao', value: 'price_high' },
];

// TỐI ƯU 1: Memoize Product Card để tránh re-render không cần thiết
const ProductItem = memo(({ item, isListView, isFav, onToggleFav, onAddToCart, onNavigate }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[styles.card, isListView ? styles.cardList : styles.cardGrid]}
    onPress={() => onNavigate(item)}
  >
    <View style={[styles.imgWrapper, isListView ? styles.imgWrapperList : styles.imgWrapperGrid]}>
      <Image source={{ uri: item.img }} style={styles.fullImg} resizeMode="cover" />
      {!item.inStock && (
        <View style={styles.outOfStockBadge}><Text style={styles.outOfStockText}>Hết hàng</Text></View>
      )}
      <TouchableOpacity style={styles.favBtn} onPress={() => onToggleFav(item)}>
        <Heart size={16} color={isFav ? COLORS.danger : COLORS.textLight} fill={isFav ? COLORS.danger : 'transparent'} />
      </TouchableOpacity>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.brandName}>{item.brand}</Text>
      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.cardPrice}>{item.price.toLocaleString()}đ</Text>
        <View style={styles.ratingRow}>
          <Star size={10} color={COLORS.warning} fill={COLORS.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.quickViewBtn} onPress={() => { }}>
          <Eye size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!item.inStock}
          style={[styles.addToCartBtn, !item.inStock && styles.disabledBtn]}
          onPress={() => onAddToCart(item)}
        >
          <ShoppingCart size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
));

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState(""); // TỐI ƯU 2: Chỉ search khi nhấn Enter hoặc sau khi ngừng gõ
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const { favorites, toggleFavorite, addToCart } = useStore();

  const [appliedFilters, setAppliedFilters] = useState({
    brands: [],
    rating: 0,
    onlyInStock: false
  });

  // TỐI ƯU 3: Gom logic filter vào useMemo và tách khỏi query gõ phím
  const filteredResults = useMemo(() => {
    let results = PRODUCTS.filter(p => {
      const matchQuery = !deferredQuery.trim() || p.name.toLowerCase().includes(deferredQuery.toLowerCase());
      const matchBrand = appliedFilters.brands.length === 0 || appliedFilters.brands.includes(p.brand);
      const matchRating = p.rating >= appliedFilters.rating;
      const matchStock = !appliedFilters.onlyInStock || p.inStock;
      return matchQuery && matchBrand && matchRating && matchStock;
    });

    switch (sortBy) {
      case 'price_low': return results.sort((a, b) => a.price - b.price);
      case 'price_high': return results.sort((a, b) => b.price - a.price);
      case 'newest': return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default: return results.sort((a, b) => b.popularity - a.popularity);
    }
  }, [deferredQuery, appliedFilters, sortBy]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setIsSearching(true);
    // Tốn 300ms giả lập API và cập nhật deferredQuery để tránh lag khi đang gõ
    setTimeout(() => {
      setDeferredQuery(query);
      setHasSearched(true);
      setIsSearching(false);
    }, 300);
  }, [query]);

  // TỐI ƯU 4: Memoize các hàm render để không khởi tạo lại
  const renderItem = useCallback(({ item }) => {
    const isFav = favorites.some(f => f.id === item.id);
    return (
      <ProductItem
        item={item}
        isListView={isListView}
        isFav={isFav}
        onToggleFav={toggleFavorite}
        onAddToCart={(i) => { addToCart(i); }}
        onNavigate={(i) => navigation.navigate('DETAIL', { product: i })}
      />
    );
  }, [isListView, favorites, toggleFavorite, addToCart, navigation]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Giữ nguyên giao diện nhưng tối ưu logic) */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <CustomInput
            placeholder="Bạn đang tìm gì?"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            icon={Search}
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => { setQuery(""); setDeferredQuery(""); setHasSearched(false); }}
            >
              <X size={16} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Filter size={20} color={COLORS.textMain} />
          {appliedFilters.brands.length > 0 && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {hasSearched && (
        <View style={styles.toolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setSortBy(opt.value)}
                style={[styles.sortTab, sortBy === opt.value && styles.activeSortTab]}
              >
                <Text style={[styles.sortTabText, sortBy === opt.value && styles.activeSortTabText]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setIsListView(!isListView)} style={styles.viewToggleBtn}>
            {isListView ? <LayoutGrid size={20} color={COLORS.textMain} /> : <List size={20} color={COLORS.textMain} />}
          </TouchableOpacity>
        </View>
      )}

      {isSearching ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : !hasSearched ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Tìm kiếm phổ biến</Text>
          <View style={styles.chipRow}>
            {TRENDING.map((t, i) => (
              <TouchableOpacity key={i} style={styles.chipTrend} onPress={() => { setQuery(t); setDeferredQuery(t); setHasSearched(true); }}>
                <TrendingUp size={14} color={COLORS.primary} />
                <Text style={styles.chipTrendText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={isListView ? 1 : 2}
          key={isListView ? 'list' : 'grid'}
          contentContainerStyle={styles.listPadding}
          columnWrapperStyle={!isListView && styles.columnWrapper}
          // TỐI ƯU 5: Các thuộc tính cải thiện tốc độ mượt của danh sách
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Search size={64} color={COLORS.border} />
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
            </View>
          )}
        />
      )}

      {/* FILTER MODAL - Rút gọn để tối ưu */}
      <Modal visible={showFilter} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Bộ lọc</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}><X size={24} color={COLORS.textMain} /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.filterLabel}>Chế độ hiển thị</Text>
              <View style={[styles.rowBetween, { marginBottom: 20 }]}>
                <Text>Chỉ hiện sản phẩm còn hàng</Text>
                <Switch
                  value={appliedFilters.onlyInStock}
                  onValueChange={(val) => setAppliedFilters({ ...appliedFilters, onlyInStock: val })}
                />
              </View>
              {/* Các bộ lọc khác có thể thêm ở đây */}
            </ScrollView>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
              <Text style={styles.applyText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  header: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, gap: 12 },
  searchBox: { flex: 1, position: 'relative' },
  clearBtn: { position: 'absolute', right: 12, top: 16, backgroundColor: COLORS.textLight, borderRadius: 10, padding: 2 },
  filterBtn: { width: 52, height: 52, borderRadius: 12, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  filterDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.white },
  toolbar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sortScroll: { flex: 1, paddingLeft: 16 },
  sortTab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.surface },
  activeSortTab: { backgroundColor: COLORS.primaryLight },
  sortTabText: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold' },
  activeSortTabText: { color: COLORS.primary },
  viewToggleBtn: { paddingHorizontal: 16 },
  listPadding: { padding: 16, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chipTrend: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipTrendText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 16 },
  cardGrid: { width: (width - 48) / 2 },
  cardList: { flexDirection: 'row', marginHorizontal: 0 },
  imgWrapper: { backgroundColor: COLORS.surface, borderRadius: 15, overflow: 'hidden' },
  imgWrapperGrid: { width: '100%', aspectRatio: 1, marginBottom: 10 },
  imgWrapperList: { width: 100, height: 100, marginRight: 15 },
  fullImg: { width: '100%', height: '100%' },
  outOfStockBadge: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },
  outOfStockText: { color: COLORS.danger, fontWeight: '900', fontSize: 10 },
  favBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', padding: 6, borderRadius: 15 },
  cardContent: { flex: 1 },
  brandName: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase' },
  cardName: { fontWeight: 'bold', color: COLORS.textMain, fontSize: 14, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardPrice: { color: COLORS.textMain, fontWeight: '900', fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', marginTop: 10, gap: 8 },
  quickViewBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  addToCartBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.dark, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: COLORS.textLight, opacity: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterPanel: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.4, padding: 24 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle: { fontSize: 20, fontWeight: '900' },
  filterLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applyBtn: { height: 56, borderRadius: 16, backgroundColor: COLORS.dark, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  applyText: { fontWeight: 'bold', color: COLORS.white },
  emptyText: { marginTop: 16, color: COLORS.textLight, fontWeight: 'bold' }
});