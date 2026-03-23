import React, { useState, useMemo } from 'react';
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

// Danh sách sản phẩm đầy đủ thuộc tính để Filter/Sort
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
  { label: 'Phổ biến nhất', value: 'popularity' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá: Thấp đến Cao', value: 'price_low' },
  { label: 'Giá: Cao đến Thấp', value: 'price_high' },
  { label: 'Đánh giá cao', value: 'rating' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(["Giày chạy bộ", "iPhone"]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListView, setIsListView] = useState(false);

  // States cho Filter & Sort
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [tempFilters, setTempFilters] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 50000000,
    rating: 0,
    onlyInStock: false
  });
  const [appliedFilters, setAppliedFilters] = useState(tempFilters);

  const { favorites, toggleFavorite, addToCart } = useStore();

  // Logic lọc và sắp xếp sản phẩm
  const filteredResults = useMemo(() => {
    let results = PRODUCTS.filter(p => {
      const matchQuery = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase());
      const matchBrand = appliedFilters.brands.length === 0 || appliedFilters.brands.includes(p.brand);
      const matchPrice = p.price >= appliedFilters.minPrice && p.price <= appliedFilters.maxPrice;
      const matchRating = p.rating >= appliedFilters.rating;
      const matchStock = !appliedFilters.onlyInStock || p.inStock;

      return matchQuery && matchBrand && matchPrice && matchRating && matchStock;
    });

    // Sort logic
    switch (sortBy) {
      case 'price_low': return results.sort((a, b) => a.price - b.price);
      case 'price_high': return results.sort((a, b) => b.price - a.price);
      case 'newest': return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'rating': return results.sort((a, b) => b.rating - a.rating);
      default: return results.sort((a, b) => b.popularity - a.popularity);
    }
  }, [query, appliedFilters, sortBy]);

  const handleSearch = () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setIsSearching(true);
    setTimeout(() => {
      if (!history.includes(query)) setHistory([query, ...history].slice(0, 5));
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
  };

  const toggleBrandFilter = (brand) => {
    setTempFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setShowFilter(false);
    setHasSearched(true);
  };

  const renderProduct = ({ item }) => {
    const isFav = favorites.some(f => f.id === item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, isListView ? styles.cardList : styles.cardGrid]}
        onPress={() => navigation.navigate('DETAIL', { product: item })}
      >
        <View style={[styles.imgWrapper, isListView ? styles.imgWrapperList : styles.imgWrapperGrid]}>
          <Image source={{ uri: item.img }} style={styles.fullImg} />
          {!item.inStock && (
            <View style={styles.outOfStockBadge}><Text style={styles.outOfStockText}>Hết hàng</Text></View>
          )}
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(item)}>
            <Heart size={16} color={isFav ? COLORS.danger : COLORS.textLight} fill={isFav ? COLORS.danger : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.brandName}>{item.brand}</Text>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.cardPrice}>{item.price.toLocaleString()}đ</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.quickViewBtn}
              onPress={() => alert(`Xem nhanh: ${item.name}`)}
            >
              <Eye size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!item.inStock}
              style={[styles.addToCartBtn, !item.inStock && styles.disabledBtn]}
              onPress={() => { addToCart(item); alert("Đã thêm vào giỏ!"); }}
            >
              <ShoppingCart size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tìm kiếm */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <CustomInput
            placeholder="Bạn đang tìm gì?"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (!text) setHasSearched(false);
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            icon={Search}
          />
          {query.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setQuery(""); setHasSearched(false); }}>
              <X size={16} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Filter size={20} color={COLORS.textMain} />
          {appliedFilters.brands.length > 0 && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Thanh Sắp xếp & Chế độ xem */}
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
          <View style={styles.viewToggle}>
            <TouchableOpacity onPress={() => setIsListView(!isListView)} style={styles.viewToggleBtn}>
              {isListView ? <LayoutGrid size={20} color={COLORS.textMain} /> : <List size={20} color={COLORS.textMain} />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Trạng thái Loading */}
      {isSearching ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : !hasSearched ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Tìm kiếm phổ biến</Text>
          <View style={styles.chipRow}>
            {TRENDING.map((t, i) => (
              <TouchableOpacity key={i} style={styles.chipTrend} onPress={() => { setQuery(t); handleSearch(); }}>
                <TrendingUp size={14} color={COLORS.primary} />
                <Text style={styles.chipTrendText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.flex1}>
          <FlatList
            data={filteredResults}
            keyExtractor={item => item.id}
            renderItem={renderProduct}
            numColumns={isListView ? 1 : 2}
            key={isListView ? 'list' : 'grid'}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            columnWrapperStyle={!isListView && { justifyContent: 'space-between' }}
            ListEmptyComponent={() => (
              <View style={styles.center}>
                <Search size={64} color={COLORS.border} />
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* FILTER MODAL */}
      <Modal visible={showFilter} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Bộ lọc sản phẩm</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}><X size={24} color={COLORS.textMain} /></TouchableOpacity>
            </View>

            <ScrollView style={styles.filterBody}>
              {/* Brand Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Thương hiệu</Text>
                <View style={styles.brandGrid}>
                  {BRANDS.map(brand => (
                    <TouchableOpacity
                      key={brand}
                      onPress={() => toggleBrandFilter(brand)}
                      style={[styles.brandChip, tempFilters.brands.includes(brand) && styles.activeBrandChip]}
                    >
                      <Text style={[styles.brandChipText, tempFilters.brands.includes(brand) && styles.activeBrandChipText]}>{brand}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Đánh giá (Từ)</Text>
                <View style={styles.chipRow}>
                  {[4, 3, 2, 1].map(star => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setTempFilters({ ...tempFilters, rating: star })}
                      style={[styles.chip, tempFilters.rating === star && styles.activeChip]}
                    >
                      <Star size={14} color={tempFilters.rating === star ? COLORS.white : COLORS.warning} fill={COLORS.warning} />
                      <Text style={[styles.chipText, tempFilters.rating === star && styles.activeChipText]}>{star}+ sao</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* In Stock Toggle */}
              <View style={[styles.filterSection, styles.rowBetween]}>
                <Text style={styles.filterLabel}>Chỉ hiện sản phẩm còn hàng</Text>
                <Switch
                  value={tempFilters.onlyInStock}
                  onValueChange={(val) => setTempFilters({ ...tempFilters, onlyInStock: val })}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                />
              </View>
            </ScrollView>

            <View style={styles.filterFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => setTempFilters({ brands: [], minPrice: 0, maxPrice: 50000000, rating: 0, onlyInStock: false })}
              >
                <Text style={styles.resetText}>Thiết lập lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  flex1: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  header: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, alignItems: 'flex-start', gap: 12 },
  searchBox: { flex: 1, position: 'relative' },
  clearBtn: { position: 'absolute', right: 12, top: 16, backgroundColor: COLORS.textLight, borderRadius: 10, padding: 2 },
  filterBtn: { width: 52, height: 52, borderRadius: 12, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  filterDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, borderWeight: 2, borderColor: COLORS.white },

  toolbar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sortScroll: { flex: 1, paddingLeft: 16 },
  sortTab: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.surface },
  activeSortTab: { backgroundColor: COLORS.primaryLight },
  sortTabText: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold' },
  activeSortTabText: { color: COLORS.primary },
  viewToggle: { paddingHorizontal: 16 },

  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chipTrend: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipTrendText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },

  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 16 },
  cardGrid: { width: (width - 48) / 2 },
  cardList: { flexDirection: 'row', marginHorizontal: 16 },
  imgWrapper: { backgroundColor: COLORS.surface, borderRadius: 15, overflow: 'hidden' },
  imgWrapperGrid: { width: '100%', aspectRatio: 1, marginBottom: 10 },
  imgWrapperList: { width: 100, height: 100, marginRight: 15 },
  fullImg: { width: '100%', height: '100%' },
  outOfStockBadge: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },
  outOfStockText: { color: COLORS.danger, fontWeight: '900', fontSize: 10, textTransform: 'uppercase' },
  favBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', padding: 6, borderRadius: 15 },

  cardContent: { flex: 1 },
  brandName: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase' },
  cardName: { fontWeight: 'bold', color: COLORS.textMain, fontSize: 14, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardPrice: { color: COLORS.textMain, fontWeight: '900', fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: COLORS.textMuted, fontWeight: 'bold' },

  cardActions: { flexDirection: 'row', marginTop: 10, gap: 8 },
  quickViewBtn: { flex: 1, height: 36, borderRadius: 10, borderWeight: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', borderStyle: 'solid', borderWidth: 1 },
  addToCartBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.dark, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: COLORS.textLight, opacity: 0.5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterPanel: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.75, padding: 24 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textMain },
  filterBody: { flex: 1 },
  filterSection: { marginBottom: 32 },
  filterLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 },
  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  brandChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.surface },
  activeBrandChip: { backgroundColor: COLORS.primary },
  brandChipText: { fontSize: 13, color: COLORS.textMuted, fontWeight: 'bold' },
  activeBrandChipText: { color: COLORS.white },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.surface },
  activeChip: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textMuted, fontWeight: 'bold' },
  activeChipText: { color: COLORS.white },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterFooter: { flexDirection: 'row', gap: 16, paddingTop: 16 },
  resetBtn: { flex: 1, height: 56, borderRadius: 16, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  resetText: { fontWeight: 'bold', color: COLORS.textMuted },
  applyBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: COLORS.dark, justifyContent: 'center', alignItems: 'center' },
  applyText: { fontWeight: 'bold', color: COLORS.white },
  emptyText: { marginTop: 16, color: COLORS.textLight, fontWeight: 'bold' }
});