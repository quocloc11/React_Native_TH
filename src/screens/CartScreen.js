import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react-native';
import useStore from '../store/useStore';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

export default function CartScreen({ navigation }) {
  // Lấy data và actions từ Global Store
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useStore();

  // Tính toán tiền bạc (Tự động cập nhật khi cart thay đổi)
  const { subTotal, discount, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const disc = sub > 5000000 ? sub * 0.1 : 0; // Giảm 10% nếu đơn > 5 triệu
    return { subTotal: sub, discount: disc, total: sub - disc };
  }, [cart]);

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <ShoppingBag size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
      <Text style={styles.emptySub}>Hãy thêm vài món đồ yêu thích nhé!</Text>
      <CustomButton
        title="Khám phá ngay"
        onPress={() => navigation.navigate('Home')}
        style={{ marginTop: 20 }}
      />
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.img }} style={styles.itemImg} />
      <View style={styles.itemInfo}>
        <Text numberOfLines={1} style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>

        {/* Bộ điều khiển số lượng */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQuantity(item.id)}>
            <Minus size={16} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQuantity(item.id)}>
            <Plus size={16} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) return <SafeAreaView style={styles.container}>{renderEmptyCart()}</SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>

      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Box Thanh Toán */}
      <View style={styles.checkoutBox}>
        <View style={styles.promoRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <CustomInput placeholder="Mã giảm giá..." />
          </View>
          <CustomButton title="Áp dụng" variant="outline" size="small" />
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính:</Text>
          <Text style={styles.summaryValue}>{subTotal.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Giảm giá:</Text>
          <Text style={styles.summaryDiscount}>-{discount.toLocaleString('vi-VN')}đ</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#e2e8f0' }]}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')}đ</Text>
        </View>

        <CustomButton
          title="Thanh toán ngay"
          icon={<ArrowRight size={20} color="#fff" />}
          onPress={() => navigation.navigate('Checkout', { total })}
          style={{ marginTop: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

// ... (Bạn tự thêm CSS phần này vào nhé, tập trung layout Flexbox: row, space-between)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', margin: 16, color: '#0f172a' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, color: '#1e293b' },
  emptySub: { fontSize: 14, color: '#64748b', marginTop: 8 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 16, marginBottom: 12, alignItems: 'center' },
  itemImg: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#f1f5f9' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#f1f5f9', alignSelf: 'flex-start', borderRadius: 8 },
  qtyBtn: { padding: 6 },
  qtyText: { paddingHorizontal: 12, fontWeight: 'bold' },
  removeBtn: { padding: 8 },
  checkoutBox: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, elevation: 10 },
  promoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#64748b', fontSize: 14 },
  summaryValue: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
  summaryDiscount: { color: '#10b981', fontSize: 14, fontWeight: '600' },
  totalLabel: { color: '#0f172a', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#3b82f6', fontSize: 20, fontWeight: '900' },
});