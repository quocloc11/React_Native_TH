// src/screens/ProductDetailExamScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Share,
  Alert,
  SafeAreaView,
} from 'react-native';

// Import hàm formatPrice (nếu chưa có, bạn có thể tự viết: const formatPrice = (price) => price.toLocaleString('vi-VN') + ' đ')
import { formatPrice } from '@utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- MOCK DATA ---
const product = {
  name: 'Áo Thun React Native Cao Cấp',
  price: 250000,
  description:
    'Áo thun cotton 100% thoáng mát, thấm hút mồ hôi tốt. Thiết kế logo React Native nổi bật.',
  images: [
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  ],
  sizes: ['S', 'M', 'L', 'XL'],
};

const ProductDetailExamScreen = () => {
  // --- STATE ---
  // [YÊU CẦU: Lưu trữ vị trí (index) của ảnh đang được hiển thị trên slider]
  const [currentIndex, setCurrentIndex] = useState(0);

  // [YÊU CẦU: Quản lý kích cỡ (size) người dùng đang chọn, mặc định chọn 'M']
  const [selectedSize, setSelectedSize] = useState('M');

  // [YÊU CẦU: Quản lý số lượng sản phẩm muốn mua, mặc định là 1]
  const [quantity, setQuantity] = useState(1);

  // [YÊU CẦU: Quản lý trạng thái loading khi ấn nút "Thêm vào giỏ hàng"]
  const [isAdding, setIsAdding] = useState(false);

  // [YÊU CẦU: Quản lý trạng thái nhấn (press) để tạo hiệu ứng UI cho nút bấm]
  const [isPressed, setIsPressed] = useState(false);

  // --- HANDLERS ---

  // [YÊU CẦU: Xử lý sự kiện khi người dùng vuốt xong slider ảnh để cập nhật lại dot pagination]
  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  // [YÊU CẦU: Hàm giảm số lượng mua, đảm bảo không thể giảm xuống dưới 1]
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // [YÊU CẦU: Hàm tăng số lượng mua, giới hạn tối đa có thể mua là 99]
  const increaseQty = () => {
    if (quantity < 99) setQuantity(quantity + 1);
  };

  // [YÊU CẦU: Tính năng chia sẻ thông tin sản phẩm (sử dụng Native Share API)]
  const handleShare = async () => {
    try {
      await Share.share({
        title: product.name,
        message: `${product.name} chỉ với ${formatPrice(product.price)}. Mua ngay!`,
      });
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể chia sẻ sản phẩm');
    }
  };

  // [YÊU CẦU: Xử lý logic Thêm vào giỏ hàng, giả lập gọi API mất thời gian 1.5 giây]
  const handleAddToCart = () => {
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
      Alert.alert(
        'Thành công',
        `Đã thêm ${quantity} sản phẩm size ${selectedSize}`
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* [YÊU CẦU: Nút bấm chia sẻ sản phẩm, có hỗ trợ Accessibility cho người khiếm thị] */}
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareBtn}
          accessibilityLabel="Nút chia sẻ sản phẩm"
          accessibilityRole="button"
        >
          <Text style={styles.shareText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* GALLERY */}
        {/* [YÊU CẦU: ScrollView cuộn ngang, có tính năng snap (pagingEnabled) để xem ảnh sản phẩm] */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {product.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="contain"
            />
          ))}
        </ScrollView>

        {/* DOT + INDEX */}
        {/* [YÊU CẦU: Hiển thị thanh tiến trình (Dots) và text cho biết đang ở ảnh số mấy] */}
        <View style={styles.pagination}>
          <View style={styles.dots}>
            {product.images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentIndex === i && styles.activeDot,
                ]}
              />
            ))}
          </View>
          <Text style={styles.pageText}>
            {currentIndex + 1} / {product.images.length}
          </Text>
        </View>

        {/* INFO */}
        {/* [YÊU CẦU: Hiển thị các thông tin cơ bản: Tên, Giá bán và Mô tả sản phẩm] */}
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* SIZE */}
          {/* [YÊU CẦU: Render danh sách các nút chọn Size, làm nổi bật (active) size đang được chọn] */}
          <Text style={styles.title}>Chọn size</Text>
          <View style={styles.sizeWrap}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && styles.sizeActive,
                ]}
                accessibilityLabel={`Chọn size ${size}`}
                accessibilityRole="button"
                accessibilityState={{
                  selected: selectedSize === size,
                }}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* QUANTITY */}
          {/* [YÊU CẦU: Component Stepper (Tăng/Giảm) số lượng muốn mua] */}
          <Text style={styles.title}>Số lượng</Text>
          <View style={styles.qtyWrap}>
            <TouchableOpacity
              onPress={decreaseQty}
              style={styles.qtyBtn}
              accessibilityLabel="Giảm số lượng"
              accessibilityRole="button"
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{quantity}</Text>

            <TouchableOpacity
              onPress={increaseQty}
              style={styles.qtyBtn}
              accessibilityLabel="Tăng số lượng"
              accessibilityRole="button"
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      {/* [YÊU CẦU: Nút thêm vào giỏ hàng cố định ở dưới cùng (Absolute/Fixed)] */}
      {/* [YÊU CẦU: Hiển thị ActivityIndicator khi đang xử lý (loading) và làm mờ nút (disabled)] */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleAddToCart}
          disabled={isAdding}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          accessibilityLabel="Thêm vào giỏ hàng"
          accessibilityRole="button"
          style={[
            styles.addBtn,
            isPressed && styles.addBtnPressed,
            isAdding && styles.addBtnDisabled,
          ]}
        >
          {isAdding ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.addText}> Đang thêm...</Text>
            </View>
          ) : (
            <Text style={styles.addText}>THÊM VÀO GIỎ</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// ... (Phần StyleSheet giữ nguyên, mình không comment vào style để code đỡ rối nhé) ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, alignItems: 'flex-end' },
  shareBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 20 },
  shareText: { fontWeight: 'bold' },
  image: { width: SCREEN_WIDTH, height: 300, backgroundColor: '#f5f5f5' },
  pagination: { alignItems: 'center', marginTop: 10 },
  dots: { flexDirection: 'row', marginBottom: 5 },
  dot: { width: 8, height: 8, backgroundColor: '#ccc', borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#000', width: 12 },
  pageText: { fontSize: 12, color: '#666' },
  info: { padding: 15, paddingBottom: 100 },
  name: { fontSize: 22, fontWeight: 'bold' },
  price: { fontSize: 20, color: 'red', marginVertical: 10, fontWeight: 'bold' },
  desc: { color: '#555', marginBottom: 20 },
  title: { fontWeight: 'bold', marginBottom: 10 },
  sizeWrap: { flexDirection: 'row', marginBottom: 20 },
  sizeBtn: { borderWidth: 1, borderColor: '#ccc', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  sizeActive: { backgroundColor: '#000' },
  sizeText: { color: '#000' },
  sizeTextActive: { color: '#fff', fontWeight: 'bold' },
  qtyWrap: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 40, height: 40, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 20, fontWeight: 'bold' },
  qtyValue: { marginHorizontal: 20, fontSize: 18, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#000', padding: 15, alignItems: 'center', borderRadius: 8 },
  addBtnPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  addBtnDisabled: { backgroundColor: '#777' },
  addText: { color: '#fff', fontWeight: 'bold' },
});

export default ProductDetailExamScreen;