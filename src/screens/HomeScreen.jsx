import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, StatusBar, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  Home, Search, ShoppingCart, Heart, User, Bell, MapPin, Clock,
  ChevronLeft, Star, Plus, Minus, Trash2, Share2, Filter,
  LayoutGrid, List, LogOut, CheckCircle2, ShoppingBag, CreditCard,
  Truck, Package, ChevronRight, X, Menu
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// --- COLORS (Design System) ---
const COLORS = {
  primary: '#2563eb', // blue-600
  primaryLight: '#dbeafe', // blue-100
  dark: '#0f172a', // slate-900
  danger: '#ef4444', // red-500
  dangerLight: '#fef2f2', // red-50
  success: '#22c55e', // green-500
  successLight: '#dcfce7',
  warning: '#fbbf24', // amber-400
  background: '#f8fafc', // slate-50
  white: '#ffffff',
  textMain: '#1e293b', // slate-800
  textMuted: '#64748b', // slate-500
  textLight: '#94a3b8', // slate-400
  border: '#e2e8f0', // slate-200
  surface: '#f1f5f9', // slate-100
};

// --- MOCK DATA ---
const CATEGORIES = [
  { id: '1', name: 'Giày', icon: '👟', color: '#dbeafe' },
  { id: '2', name: 'Áo quần', icon: '👕', color: '#fce7f3' },
  { id: '3', name: 'Đồng hồ', icon: '⌚', color: '#dcfce7' },
  { id: '4', name: 'Công nghệ', icon: '📱', color: '#ffedd5' },
  { id: '5', name: 'Mỹ phẩm', icon: '🧴', color: '#f3e8ff' },
];

const PRODUCTS = [
  { id: '1', name: 'Nike Air Max 270 Premium', price: 2450000, category: 'Giày', brand: 'Nike', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.8, reviews: 120, isFlashSale: true, description: 'Thiết kế hiện đại với đệm khí 270 độ mang lại sự êm ái tối đa cho cả ngày dài vận động. Thích hợp cho cả chạy bộ và đi chơi.' },
  { id: '2', name: 'Adidas Ultraboost 22', price: 3100000, category: 'Giày', brand: 'Adidas', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', rating: 4.9, reviews: 85, isFlashSale: true, description: 'Dòng giày chạy bộ huyền thoại với công nghệ hoàn trả năng lượng đỉnh cao.' },
  { id: '3', name: 'iPhone 15 Pro Max', price: 34990000, category: 'Công nghệ', brand: 'Apple', img: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', rating: 5.0, reviews: 1200, description: 'Chip A17 Pro mạnh mẽ nhất cùng hệ thống camera chuyên nghiệp.' },
  { id: '4', name: 'Sony WH-1000XM5', price: 6500000, category: 'Công nghệ', brand: 'Sony', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.9, reviews: 560, description: 'Chống ồn chủ động hàng đầu thế giới.' },
  { id: '5', name: 'Rolex Submariner', price: 250000000, category: 'Đồng hồ', brand: 'Rolex', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', rating: 4.9, reviews: 30, description: 'Biểu tượng của sự sang trọng và đẳng cấp.' },
  { id: '6', name: 'Áo Hoodie Essentials', price: 1200000, category: 'Áo quần', brand: 'Fear of God', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', rating: 4.5, reviews: 200, description: 'Áo hoodie chất liệu cotton cao cấp, form oversize.' },
];

// --- ADVANCED COMPONENTS ---
const CustomButton = ({ title, onPress, variant = 'primary', size = 'md', icon: Icon, fullWidth, disabled, style }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: COLORS.primaryLight };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border };
      default: return { backgroundColor: disabled ? COLORS.textLight : COLORS.dark };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary': return { color: COLORS.primary };
      case 'outline': return { color: COLORS.textMain };
      default: return { color: COLORS.white };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return { height: 36, paddingHorizontal: 16 };
      case 'lg': return { height: 56, paddingHorizontal: 32 };
      default: return { height: 48, paddingHorizontal: 24 };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.btnBase, getVariantStyle(), getSizeStyle(), fullWidth && { width: '100%' }, style]}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} color={getTextStyle().color} style={{ marginRight: 8 }} />}
      <Text style={[styles.btnText, getTextStyle(), size === 'sm' && { fontSize: 12 }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const CustomBadge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

// --- MAIN APP COMPONENT ---
export default function HomeScreen() {
  // Global State (Simulated)
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState('HOME');
  const [stack, setStack] = useState([]); // [{ screen: 'DETAIL', params: {...} }]

  // Local UI State
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Computed Values
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);
  const currentScreen = stack[stack.length - 1];

  // Actions
  const pushScreen = (screenName, params = {}) => setStack([...stack, { screen: screenName, params }]);
  const popScreen = () => setStack(stack.slice(0, -1));
  const resetToTab = (tab) => { setStack([]); setActiveTab(tab); };

  const toggleFav = (product) => {
    setFavorites(prev => prev.some(p => p.id === product.id)
      ? prev.filter(p => p.id !== product.id)
      : [...prev, product]
    );
  };

  const updateCart = (product, qtyChange) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        const newQty = existing.qty + qtyChange;
        if (newQty <= 0) return prev.filter(p => p.id !== product.id);
        return prev.map(p => p.id === product.id ? { ...p, qty: newQty } : p);
      }
      if (qtyChange > 0) return [...prev, { ...product, qty: qtyChange }];
      return prev;
    });
  };

  const handleCheckout = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      items: [...cart],
      total: cartTotal,
      status: 'Đang xử lý'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCheckoutStep(1);
    pushScreen('SUCCESS', { orderId: newOrder.id });
  };

  // --- RENDERERS FOR SCREENS ---

  const renderHome = () => (
    <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pb100}>
      {/* Header */}
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
          <Bell size={20} color={COLORS.textMain} />
          <View style={styles.notiDot} />
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800' }} style={styles.bannerImg} />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTag}>SIÊU SALE 2026</Text>
          <Text style={styles.bannerTitle}>Sneaker World{'\n'}Sale up to 50%</Text>
          <CustomButton title="Mua ngay" size="sm" style={{ width: 120 }} onPress={() => resetToTab('SEARCH')} />
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <Text style={styles.seeAll}>Tất cả</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catItem}
              onPress={() => { setSearchQuery(cat.name); resetToTab('SEARCH'); }}
            >
              <View style={[styles.catIconBox, { backgroundColor: cat.color }]}>
                <Text style={styles.catIconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List Header */}
      <View style={[styles.sectionHeader, { paddingHorizontal: 20, marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Hàng mới về</Text>
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            onPress={() => setIsListView(false)}
            style={[styles.viewToggleBtn, !isListView && styles.viewToggleActive]}
          >
            <LayoutGrid size={16} color={!isListView ? COLORS.textMain : COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsListView(true)}
            style={[styles.viewToggleBtn, isListView && styles.viewToggleActive]}
          >
            <List size={16} color={isListView ? COLORS.textMain : COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Grid/List */}
      <View style={[styles.productContainer, isListView ? styles.listContainer : styles.gridContainer]}>
        {PRODUCTS.map(p => (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.9}
            style={[styles.productCard, isListView ? styles.productCardList : styles.productCardGrid]}
            onPress={() => pushScreen('DETAIL', { product: p })}
          >
            <View style={[styles.productImgBox, isListView ? styles.productImgBoxList : styles.productImgBoxGrid]}>
              <Image source={{ uri: p.img }} style={styles.fullImg} />
              <TouchableOpacity
                style={styles.favBtn}
                onPress={(e) => { e.stopPropagation(); toggleFav(p); }}
              >
                <Heart size={14} color={favorites.some(f => f.id === p.id) ? COLORS.danger : COLORS.textLight} fill={favorites.some(f => f.id === p.id) ? COLORS.danger : 'transparent'} />
              </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{p.category}</Text>
              <Text style={styles.productName} numberOfLines={isListView ? 2 : 1}>{p.name}</Text>
              <View style={styles.productBottomRow}>
                <Text style={styles.productPrice}>{p.price.toLocaleString()}đ</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                  <Text style={styles.ratingText}>{p.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderSearch = () => {
    const filteredProducts = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilter === 'Tất cả' || p.category === activeFilter)
    );

    return (
      <View style={styles.flex1}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <Text style={styles.screenTitle}>Tìm kiếm</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputBox}>
              <Search size={20} color={COLORS.textLight} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm giày, áo, điện thoại..."
                placeholderTextColor={COLORS.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={COLORS.textLight} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtnMain}>
              <Filter size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 15, paddingRight: 20 }}>
            {['Tất cả', ...new Set(PRODUCTS.map(p => p.category))].map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveFilter(cat)}
                style={[styles.filterTag, activeFilter === cat ? styles.filterTagActive : styles.filterTagInactive]}
              >
                <Text style={[styles.filterTagText, activeFilter === cat ? styles.filterTextActive : styles.filterTextInactive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={styles.searchBody}>
          <Text style={styles.resultText}>Tìm thấy {filteredProducts.length} kết quả</Text>
          <View style={styles.gridContainer}>
            {filteredProducts.map(p => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.9}
                style={[styles.productCard, styles.productCardGrid]}
                onPress={() => pushScreen('DETAIL', { product: p })}
              >
                <View style={styles.productImgBoxGrid}>
                  <Image source={{ uri: p.img }} style={styles.fullImg} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.productPrice, { marginTop: 4 }]}>{p.price.toLocaleString()}đ</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredProducts.length === 0 && (
              <View style={styles.emptyState}>
                <Search size={48} color={COLORS.border} style={{ marginBottom: 16 }} />
                <Text style={styles.emptyTextTitle}>Không tìm thấy sản phẩm nào.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderCart = () => (
    <View style={styles.flex1}>
      <View style={styles.cartHeader}>
        <Text style={styles.screenTitleCentered}>Giỏ hàng của bạn</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={() => setCart([])} style={styles.clearCartBtn}>
            <Text style={styles.clearCartText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={40} color={COLORS.border} />
          </View>
          <Text style={styles.emptyTextTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptyTextSub}>Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi nhé!</Text>
          <CustomButton title="Mua sắm ngay" onPress={() => resetToTab('HOME')} />
        </View>
      ) : (
        <View style={styles.flex1}>
          <ScrollView style={styles.flex1} contentContainerStyle={styles.cartList}>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.img }} style={styles.cartItemImg} />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>{item.price.toLocaleString()}đ</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => updateCart(item, -1)} style={styles.qtyBtn}>
                      <Minus size={14} color={COLORS.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity onPress={() => updateCart(item, 1)} style={[styles.qtyBtn, styles.qtyBtnActive]}>
                      <Plus size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => updateCart(item, -item.qty)} style={styles.trashBtn}>
                  <Trash2 size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.cartBottomPanel}>
            <View style={styles.cartTotalRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalValue}>{cartTotal.toLocaleString()}đ</Text>
            </View>
            <CustomButton title="Tiến hành thanh toán" fullWidth size="lg" onPress={() => pushScreen('CHECKOUT')} />
          </View>
        </View>
      )}
    </View>
  );

  const renderProfile = () => (
    <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.profileTopBg}>
        <Text style={styles.profileScreenTitle}>Tài khoản</Text>
        <View style={styles.profileUserInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.avatar} />
          <View>
            <Text style={styles.profileName}>Nguyễn Văn A</Text>
            <Text style={styles.profileLevel}>Thành viên Vàng</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContent}>
        <View style={styles.profileStatsBox}>
          {[
            { label: 'Chờ xác nhận', icon: Package },
            { label: 'Đang giao', icon: Truck },
            { label: 'Đánh giá', icon: Star }
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.statItem}>
              <item.icon size={24} color={COLORS.textMuted} />
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.profileMenuBox}>
          <TouchableOpacity style={styles.menuItem} onPress={() => pushScreen('HISTORY')}>
            <View style={styles.menuItemLeft}>
              <ShoppingBag size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Lịch sử đơn hàng</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <CreditCard size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Phương thức thanh toán</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MapPin size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Sổ địa chỉ</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <LogOut size={20} color={COLORS.danger} />
              <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Đăng xuất</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // --- STACK SCREENS RENDERERS ---

  const renderDetail = () => {
    const product = currentScreen.params.product;
    const isFav = favorites.some(p => p.id === product.id);

    return (
      <View style={[styles.stackScreen, { backgroundColor: COLORS.white }]}>
        <View style={styles.detailImgSection}>
          <Image source={{ uri: product.img }} style={styles.fullImg} />
          <View style={styles.detailTopNav}>
            <TouchableOpacity onPress={popScreen} style={styles.circleBtnBlur}><ChevronLeft size={24} color={COLORS.textMain} /></TouchableOpacity>
            <TouchableOpacity style={styles.circleBtnBlur}><Share2 size={20} color={COLORS.textMain} /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContent}>
          <View style={styles.detailTitleRow}>
            <View style={styles.flex1}>
              <Text style={styles.detailBrand}>{product.brand}</Text>
              <Text style={styles.detailName}>{product.name}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFav(product)} style={[styles.detailFavBtn, isFav && { borderColor: COLORS.dangerLight, backgroundColor: COLORS.dangerLight }]}>
              <Heart size={20} color={isFav ? COLORS.danger : COLORS.textLight} fill={isFav ? COLORS.danger : 'transparent'} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRatingRow}>
            <View style={styles.detailRatingBadge}>
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.detailRatingText}>{product.rating}</Text>
            </View>
            <Text style={styles.detailReviewsText}>{product.reviews} đánh giá</Text>
          </View>

          <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false}>
            <Text style={styles.descTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </ScrollView>

          <View style={styles.detailBottomBar}>
            <View style={styles.detailPriceCol}>
              <Text style={styles.detailPriceLabel}>Giá bán</Text>
              <Text style={styles.detailPriceValue}>{product.price.toLocaleString()}đ</Text>
            </View>
            <View style={styles.flex1}>
              <CustomButton title="Thêm vào giỏ" size="lg" onPress={() => { updateCart(product, 1); popScreen(); resetToTab('CART'); }} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCheckout = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.stackScreen}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity onPress={popScreen} style={styles.headerBackBtn}><ChevronLeft size={24} color={COLORS.textMain} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán ({checkoutStep}/3)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.flex1} contentContainerStyle={styles.checkoutBody}>
        {checkoutStep === 1 && (
          <View>
            <Text style={styles.checkoutStepTitle}>Địa chỉ nhận hàng</Text>
            <View style={styles.addressBox}>
              <View style={styles.addressBoxHeader}>
                <Text style={styles.addressName}>Nguyễn Văn A - 0987654321</Text>
                <CheckCircle2 size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.addressText}>Toà nhà Bitexco, Số 2 Hải Triều, Q.1, TP.HCM</Text>
            </View>
            <TouchableOpacity style={styles.addAddressBtn}>
              <Plus size={18} color={COLORS.textMuted} />
              <Text style={styles.addAddressText}>Thêm địa chỉ mới</Text>
            </TouchableOpacity>
          </View>
        )}

        {checkoutStep === 2 && (
          <View>
            <Text style={styles.checkoutStepTitle}>Phương thức thanh toán</Text>
            {[
              { id: 1, name: 'Thẻ Tín Dụng / Ghi Nợ', icon: CreditCard, color: COLORS.primary },
              { id: 2, name: 'Ví MoMo', icon: MapPin, color: '#e81cff' },
              { id: 3, name: 'Thanh toán khi nhận hàng (COD)', icon: Package, color: COLORS.success }
            ].map((method, idx) => {
              const isActive = idx === 2; // Simulate selection
              return (
                <TouchableOpacity key={idx} style={[styles.methodBox, isActive && styles.methodBoxActive]}>
                  <View style={styles.methodIconBox}>
                    <method.icon size={20} color={method.color} />
                  </View>
                  <Text style={styles.methodText}>{method.name}</Text>
                  <View style={[styles.radioCircle, isActive && styles.radioCircleActive]}>
                    {isActive && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {checkoutStep === 3 && (
          <View>
            <Text style={styles.checkoutStepTitle}>Xác nhận đơn hàng</Text>
            <View style={styles.summaryBox}>
              {cart.map(item => (
                <View key={item.id} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemText}>{item.qty}x {item.name}</Text>
                  <Text style={styles.summaryItemPrice}>{(item.price * item.qty).toLocaleString()}đ</Text>
                </View>
              ))}
            </View>
            <View style={styles.summaryBox}>
              <View style={styles.summaryCalcRow}>
                <Text style={styles.summaryCalcLabel}>Tạm tính</Text>
                <Text style={styles.summaryCalcLabel}>{cartTotal.toLocaleString()}đ</Text>
              </View>
              <View style={styles.summaryCalcRow}>
                <Text style={styles.summaryCalcLabel}>Phí vận chuyển</Text>
                <Text style={styles.summaryFreeShipping}>Miễn phí</Text>
              </View>
              <View style={styles.summaryTotalDivider} />
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
                <Text style={styles.summaryTotalValue}>{cartTotal.toLocaleString()}đ</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.checkoutBottomBar}>
        <CustomButton
          title={checkoutStep < 3 ? "Tiếp tục" : "Đặt hàng ngay"}
          fullWidth size="lg"
          onPress={() => checkoutStep < 3 ? setCheckoutStep(prev => prev + 1) : handleCheckout()}
        />
      </View>
    </KeyboardAvoidingView>
  );

  const renderSuccess = () => (
    <View style={[styles.stackScreen, styles.centerAll, { backgroundColor: COLORS.white }]}>
      <View style={styles.successIconBox}>
        <CheckCircle2 size={48} color={COLORS.success} />
      </View>
      <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
      <Text style={styles.successSub}>Mã đơn hàng của bạn là:</Text>
      <View style={styles.orderIdBox}>
        <Text style={styles.orderIdText}>{currentScreen.params.orderId}</Text>
      </View>
      <CustomButton title="Theo dõi đơn hàng" fullWidth variant="secondary" style={{ marginBottom: 12 }} onPress={() => { popScreen(); pushScreen('HISTORY'); }} />
      <CustomButton title="Về trang chủ" fullWidth variant="primary" onPress={() => resetToTab('HOME')} />
    </View>
  );

  const renderHistory = () => (
    <View style={styles.stackScreen}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity onPress={popScreen} style={styles.headerBackBtn}><ChevronLeft size={24} color={COLORS.textMain} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.historyBody}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingBag size={48} color={COLORS.textLight} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTextTitle}>Chưa có đơn hàng nào.</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={styles.orderIdLabel}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.orderStatusBadge}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderCardBody}>
                <View style={styles.orderImagesRow}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <Image key={i} source={{ uri: item.img }} style={[styles.orderItemImg, { left: i * -10 }]} />
                  ))}
                </View>
                <Text style={styles.orderItemCount}>{order.items.length} sản phẩm</Text>
                <Text style={styles.orderTotalValue}>{order.total.toLocaleString()}đ</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  // --- TAB BAR UI ---
  const tabs = [
    { id: 'HOME', icon: Home, label: 'Trang chủ' },
    { id: 'SEARCH', icon: Search, label: 'Khám phá' },
    { id: 'CART', icon: ShoppingCart, label: 'Giỏ hàng', badge: cart.length },
    { id: 'PROFILE', icon: User, label: 'Cá nhân' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.flex1}>
        {/* Main Tabs */}
        {activeTab === 'HOME' && renderHome()}
        {activeTab === 'SEARCH' && renderSearch()}
        {activeTab === 'CART' && renderCart()}
        {activeTab === 'PROFILE' && renderProfile()}

        {/* Stack Overlays */}
        {currentScreen?.screen === 'DETAIL' && renderDetail()}
        {currentScreen?.screen === 'CHECKOUT' && renderCheckout()}
        {currentScreen?.screen === 'SUCCESS' && renderSuccess()}
        {currentScreen?.screen === 'HISTORY' && renderHistory()}

        {/* Bottom Tab Bar (Only show if no stack screen is active) */}
        {!currentScreen && (
          <View style={styles.tabBar}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.8}
                  onPress={() => resetToTab(tab.id)}
                  style={styles.tabItem}
                >
                  <View style={[styles.tabIconBox, isActive && styles.tabIconBoxActive]}>
                    <tab.icon size={22} color={isActive ? COLORS.primary : COLORS.textLight} />
                    <CustomBadge count={tab.badge} />
                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex1: { flex: 1 },
  pb100: { paddingBottom: 100 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  centerAll: { justifyContent: 'center', alignItems: 'center', padding: 20 },

  // Custom Components
  btnBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  btnText: { fontWeight: 'bold' },
  badgeContainer: { position: 'absolute', top: -4, right: -8, backgroundColor: COLORS.danger, minWidth: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },

  // Home Screen
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.9)' },
  iconBtnRound: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  headerLocation: { alignItems: 'center' },
  locLabel: { fontSize: 10, color: COLORS.textLight, fontWeight: 'bold', letterSpacing: 1 },
  locText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 4 },
  notiDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: COLORS.danger, borderRadius: 4, borderWidth: 2, borderColor: COLORS.white },

  bannerContainer: { marginHorizontal: 20, height: 176, borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.dark },
  bannerImg: { width: '100%', height: '100%', opacity: 0.8 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  bannerTag: { color: COLORS.primaryLight, fontWeight: 'bold', fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  bannerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '900', marginBottom: 16, lineHeight: 30 },

  sectionContainer: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  catItem: { alignItems: 'center', marginRight: 16 },
  catIconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catIconText: { fontSize: 24 },
  catName: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted },

  viewToggleGroup: { flexDirection: 'row', backgroundColor: COLORS.border, padding: 4, borderRadius: 8 },
  viewToggleBtn: { padding: 6, borderRadius: 6 },
  viewToggleActive: { backgroundColor: COLORS.white, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },

  productContainer: { paddingHorizontal: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  listContainer: { flexDirection: 'column' },

  productCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16 },
  productCardGrid: { width: (width - 56) / 2 }, // 2 columns minus paddings
  productCardList: { flexDirection: 'row', alignItems: 'center' },

  productImgBox: { backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden' },
  productImgBoxGrid: { width: '100%', aspectRatio: 1, marginBottom: 12 },
  productImgBoxList: { width: 96, height: 96, marginRight: 16 },
  fullImg: { width: '100%', height: '100%' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  productInfo: { flex: 1 },
  productCategory: { fontSize: 10, fontWeight: 'bold', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginTop: 4, lineHeight: 20 },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { fontSize: 14, fontWeight: '900', color: COLORS.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, marginLeft: 4 },

  // Search Screen
  searchHeader: { padding: 20, paddingTop: 32, backgroundColor: COLORS.white },
  screenTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInputBox: { flex: 1, height: 48, backgroundColor: COLORS.surface, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '500', color: COLORS.textMain, height: '100%' },
  filterBtnMain: { width: 48, height: 48, backgroundColor: COLORS.dark, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  filterTag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
  filterTagActive: { backgroundColor: COLORS.primary },
  filterTagInactive: { backgroundColor: COLORS.surface },
  filterTagText: { fontSize: 14, fontWeight: 'bold' },
  filterTextActive: { color: COLORS.white },
  filterTextInactive: { color: COLORS.textMuted },

  searchBody: { padding: 20, paddingBottom: 100 },
  resultText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, opacity: 0.5, width: '100%' },
  emptyTextTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  emptyTextSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 32 },

  // Cart Screen
  cartHeader: { padding: 20, paddingTop: 32, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  screenTitleCentered: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  clearCartBtn: { position: 'absolute', right: 20 },
  clearCartText: { fontSize: 14, fontWeight: 'bold', color: COLORS.danger },

  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },

  cartList: { padding: 20, paddingBottom: 160 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 12, borderRadius: 16, marginBottom: 16 },
  cartItemImg: { width: 80, height: 80, borderRadius: 12, backgroundColor: COLORS.surface },
  cartItemInfo: { flex: 1, marginLeft: 16 },
  cartItemName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
  cartItemPrice: { fontSize: 14, fontWeight: '900', color: COLORS.primary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyBtn: { width: 28, height: 28, backgroundColor: COLORS.surface, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qtyBtnActive: { backgroundColor: COLORS.primaryLight },
  qtyText: { width: 32, textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  trashBtn: { padding: 8 },

  cartBottomPanel: { position: 'absolute', bottom: 80, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '500', color: COLORS.textMuted },
  totalValue: { fontSize: 24, fontWeight: '900', color: COLORS.textMain },

  // Profile Screen
  profileTopBg: { backgroundColor: COLORS.dark, paddingTop: 48, paddingBottom: 80, paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  profileScreenTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 24 },
  profileUserInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: COLORS.textMuted, marginRight: 16 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  profileLevel: { fontSize: 14, fontWeight: '500', color: COLORS.primaryLight, marginTop: 4 },

  profileContent: { paddingHorizontal: 20, marginTop: -40 },
  profileStatsBox: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center', padding: 12 },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, marginTop: 8 },

  profileMenuBox: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surface },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 12 },

  // Stack Screens (Detail, Checkout, etc.)
  stackScreen: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.background, zIndex: 100 },

  // Detail
  detailImgSection: { height: height * 0.45, backgroundColor: COLORS.surface },
  detailTopNav: { position: 'absolute', top: 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  circleBtnBlur: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center' },

  detailContent: { flex: 1, backgroundColor: COLORS.white, marginTop: -24, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  detailTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  detailBrand: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1 },
  detailName: { fontSize: 24, fontWeight: '900', color: COLORS.textMain, marginTop: 4, lineHeight: 32 },
  detailFavBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginLeft: 16 },

  detailRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  detailRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  detailRatingText: { fontSize: 14, fontWeight: 'bold', color: '#b45309', marginLeft: 4 }, // dark amber
  detailReviewsText: { fontSize: 14, fontWeight: '500', color: COLORS.textMuted },

  descTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 8 },
  descText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 24 },

  detailBottomBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 16 },
  detailPriceCol: { marginRight: 24 },
  detailPriceLabel: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  detailPriceValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary },

  // Simple Header for sub-screens
  simpleHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBackBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },

  // Checkout
  checkoutBody: { padding: 20, paddingBottom: 100 },
  checkoutStepTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 16 },
  addressBox: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: COLORS.primary, marginBottom: 16 },
  addressBoxHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  addressName: { fontWeight: 'bold', color: COLORS.textMain },
  addressText: { fontSize: 14, color: COLORS.textMuted },
  addAddressBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.border, borderRadius: 16 },
  addAddressText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMuted, marginLeft: 8 },

  methodBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', marginBottom: 12 },
  methodBoxActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '50' },
  methodIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  methodText: { flex: 1, marginLeft: 12, fontWeight: 'bold', color: COLORS.textMain },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioCircleActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  summaryBox: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, marginBottom: 16 },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.surface },
  summaryItemText: { fontSize: 14, color: COLORS.textMuted },
  summaryItemPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  summaryCalcRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryCalcLabel: { fontSize: 14, color: COLORS.textMuted },
  summaryFreeShipping: { fontSize: 14, color: COLORS.success, fontWeight: 'bold' },
  summaryTotalDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  summaryTotalValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },

  checkoutBottomBar: { padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },

  // Success
  successIconBox: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.successLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: COLORS.textMain, marginBottom: 8 },
  successSub: { fontSize: 14, color: COLORS.textMuted, marginBottom: 4 },
  orderIdBox: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginBottom: 40 },
  orderIdText: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1, color: COLORS.textMain },

  // History
  historyBody: { padding: 20 },
  orderCard: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, marginBottom: 16 },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  orderIdLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  orderDate: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  orderStatusBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  orderStatusText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  orderCardBody: { flexDirection: 'row', alignItems: 'center' },
  orderImagesRow: { flexDirection: 'row', paddingLeft: 10 },
  orderItemImg: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: COLORS.white, backgroundColor: COLORS.surface },
  orderItemCount: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, marginLeft: 12, flex: 1 },
  orderTotalValue: { fontSize: 16, fontWeight: '900', color: COLORS.textMain },

  // Tab Bar
  tabBar: { flexDirection: 'row', height: 80, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 20 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabIconBox: { alignItems: 'center', justifyContent: 'center' },
  tabIconBoxActive: { transform: [{ translateY: -2 }] },
  tabLabel: { fontSize: 10, fontWeight: 'bold', color: COLORS.textLight, marginTop: 4 },
  tabLabelActive: { color: COLORS.primary },
});