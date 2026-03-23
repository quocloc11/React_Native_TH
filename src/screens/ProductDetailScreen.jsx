import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  Share,
  ActivityIndicator
} from "react-native";

import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  CheckCircle2,
  ChevronRight,
  X
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const PRODUCT_DATA = {
  id: "1",
  name: "Nike Air Max 270 Premium",
  price: 2450000,
  description: "Dòng giày chạy bộ huyền thoại với đệm khí 270 độ, mang lại sự êm ái tối đa và phong cách thời thượng. Phù hợp cho cả vận động thể thao và đi làm hàng ngày.",
  rating: 4.5,
  reviewCount: 128,
  tags: ["Giày chạy bộ", "Nike Air", "Bán chạy"],
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800"
  ],
  sizes: [38, 39, 40, 41, 42, 43],
  colors: [
    { name: "Đỏ", hex: "#dc2626" },
    { name: "Xanh", hex: "#2563eb" },
    { name: "Đen", hex: "#111827" }
  ],
  reviews: [
    { id: 'r1', user: 'Nguyễn Văn A', rating: 5, comment: 'Giày rất êm, giao hàng nhanh!', date: '01/03/2024', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'r2', user: 'Trần Thị B', rating: 4, comment: 'Màu sắc đẹp, đi rất tôn dáng.', date: '28/02/2024', avatar: 'https://i.pravatar.cc/150?u=2' }
  ],
  related: [
    { id: 'p2', name: 'Air Jordan 1', price: 3200000, img: 'https://images.unsplash.com/photo-1584735175315-9d5821760959?w=400' },
    { id: 'p3', name: 'Nike Zoom', price: 1850000, img: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=400' }
  ]
};

const ProductDetailScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(40);
  const [selectedColor, setSelectedColor] = useState(PRODUCT_DATA.colors[0]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation Refs
  const sheetAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Giả lập load dữ liệu
    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1500);
  }, []);

  const openSheet = () => {
    Animated.spring(sheetAnim, {
      toValue: height * 0.4,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Sản phẩm ${PRODUCT_DATA.name} tuyệt đẹp!` });
    } catch (e) { console.log(e); }
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      setAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1200);
  };

  const renderStars = (rating, size = 14) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} fill={s <= rating ? "#FBBF24" : "none"} color="#FBBF24" />
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.ScrollView style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}>
        {/* IMAGE GALLERY */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setActiveImg(Math.round(x / width));
            }}
            scrollEventThrottle={16}
          >
            {PRODUCT_DATA.images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.heroImage} />
            ))}
          </ScrollView>

          {/* OVERLAY ACTIONS */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={22} color="#000" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.iconCircle} onPress={handleShare}>
                <Share2 size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle} onPress={() => setIsFavorite(!isFavorite)}>
                <Heart size={22} color={isFavorite ? "#ef4444" : "#000"} fill={isFavorite ? "#ef4444" : "none"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* DOTS */}
          <View style={styles.dotsContainer}>
            {PRODUCT_DATA.images.map((_, i) => (
              <View key={i} style={[styles.dot, activeImg === i && styles.activeDot]} />
            ))}
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentCard}>
          <View style={styles.tagRow}>
            {PRODUCT_DATA.tags.map(t => <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>)}
          </View>

          <Text style={styles.title}>{PRODUCT_DATA.name}</Text>
          <Text style={styles.price}>{PRODUCT_DATA.price.toLocaleString('vi-VN')} đ</Text>

          <View style={styles.ratingSection}>
            {renderStars(PRODUCT_DATA.rating)}
            <Text style={styles.ratingText}>{PRODUCT_DATA.rating} ({PRODUCT_DATA.reviewCount} đánh giá)</Text>
          </View>

          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>{PRODUCT_DATA.description}</Text>

          {/* SELECTION PREVIEW */}
          <TouchableOpacity style={styles.selectorTrigger} onPress={openSheet}>
            <View>
              <Text style={styles.selectorLabel}>Tùy chọn</Text>
              <Text style={styles.selectorValue}>Size: {selectedSize}, Màu: {selectedColor.name}</Text>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>

          {/* REVIEWS */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Nhận xét</Text>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </View>
          {PRODUCT_DATA.reviews.map(rev => (
            <View key={rev.id} style={styles.reviewItem}>
              <Image source={{ uri: rev.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{rev.user}</Text>
                {renderStars(rev.rating, 10)}
                <Text style={styles.comment}>{rev.comment}</Text>
              </View>
              <Text style={styles.date}>{rev.date}</Text>
            </View>
          ))}

          {/* RELATED */}
          <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
          <FlatList
            horizontal
            data={PRODUCT_DATA.related}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.relatedCard}>
                <Image source={{ uri: item.img }} style={styles.relatedImg} />
                <Text numberOfLines={1} style={styles.relatedName}>{item.name}</Text>
                <Text style={styles.relatedPrice}>{item.price.toLocaleString('vi-VN')} đ</Text>
              </View>
            )}
            style={{ marginTop: 10, marginBottom: 100 }}
          />
        </View>
      </Animated.ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
            <Minus size={18} color="#000" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
            <Plus size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.buyBtn, showSuccess && { backgroundColor: '#22c55e' }]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : showSuccess ? (
            <View style={styles.rowCenter}>
              <CheckCircle2 size={20} color="#fff" />
              <Text style={styles.buyBtnText}> Đã thêm</Text>
            </View>
          ) : (
            <View style={styles.rowCenter}>
              <ShoppingCart size={20} color="#fff" />
              <Text style={styles.buyBtnText}> Mua ngay</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* CUSTOM BOTTOM SHEET (MODAL) */}
      <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetAnim }] }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.rowBetween}>
          <Text style={styles.sheetTitle}>Phân loại</Text>
          <TouchableOpacity onPress={closeSheet}><X size={24} color="#000" /></TouchableOpacity>
        </View>

        <Text style={styles.sheetSub}>Kích cỡ</Text>
        <View style={styles.variantRow}>
          {PRODUCT_DATA.sizes.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setSelectedSize(s)}
              style={[styles.sizeBox, selectedSize === s && styles.activeSizeBox]}
            >
              <Text style={[styles.sizeText, selectedSize === s && styles.activeSizeText]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sheetSub}>Màu sắc</Text>
        <View style={styles.variantRow}>
          {PRODUCT_DATA.colors.map(c => (
            <TouchableOpacity
              key={c.name}
              onPress={() => setSelectedColor(c)}
              style={[styles.colorCircle, { backgroundColor: c.hex }, selectedColor.name === c.name && styles.activeColorCircle]}
            >
              {selectedColor.name === c.name && <CheckCircle2 size={16} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={closeSheet}>
          <Text style={styles.buyBtnText}>Xác nhận</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroImage: { width: width, height: 380, resizeMode: 'cover' },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 30,
    left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between'
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }
  },
  dotsContainer: {
    position: 'absolute', bottom: 35, alignSelf: 'center',
    flexDirection: 'row', gap: 6
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { width: 18, backgroundColor: '#fff' },
  contentCard: {
    marginTop: -25, backgroundColor: '#fff',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 24
  },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tag: { backgroundColor: '#f0f9ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#0ea5e9', fontSize: 11, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  price: { fontSize: 22, fontWeight: '700', color: '#ef4444', marginVertical: 8 },
  ratingSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  starRow: { flexDirection: 'row', gap: 2 },
  ratingText: { color: '#64748b', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginTop: 15, marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  selectorTrigger: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f8fafc', padding: 16, borderRadius: 15, marginVertical: 20,
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  selectorLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  selectorValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { color: '#3b82f6', fontWeight: 'bold', fontSize: 12 },
  reviewItem: { flexDirection: 'row', gap: 12, marginVertical: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontWeight: '700', fontSize: 14 },
  comment: { fontSize: 13, color: '#475569', marginTop: 4 },
  date: { fontSize: 10, color: '#94a3b8' },
  relatedCard: { width: 140, marginRight: 16 },
  relatedImg: { width: 140, height: 140, borderRadius: 15, marginBottom: 8 },
  relatedName: { fontSize: 13, fontWeight: '600' },
  relatedPrice: { fontSize: 13, color: '#ef4444', fontWeight: '700' },
  bottomBar: {
    position: 'absolute', bottom: 0, width: '100%',
    flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', gap: 15
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 5 },
  qtyBtn: { padding: 10 },
  qtyText: { fontWeight: 'bold', fontSize: 16, paddingHorizontal: 5 },
  buyBtn: { flex: 1, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  sheetContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.6,
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 25, elevation: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10
  },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
  sheetTitle: { fontSize: 20, fontWeight: '800' },
  sheetSub: { fontSize: 14, fontWeight: '700', marginTop: 15, marginBottom: 10 },
  variantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeBox: { width: 50, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  activeSizeBox: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  sizeText: { fontWeight: 'bold', color: '#64748b' },
  activeSizeText: { color: '#fff' },
  colorCircle: { width: 35, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  activeColorCircle: { borderWidth: 3, borderColor: '#e2e8f0' },
  confirmBtn: { backgroundColor: '#3b82f6', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 30 }
});

export default ProductDetailScreen;