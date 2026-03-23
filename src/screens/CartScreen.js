import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import CustomButton from '../components/CustomButton';

export default function CartScreen({ navigation }) {
  // Mock data tạm thời để màn hình chạy được
  const [cart, setCart] = useState([
    { id: '1', name: 'Nike Air Max', price: 2450000, qty: 1, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }
  ]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);

  const updateCart = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(0, item.qty + delta) };
      return item;
    }).filter(item => item.qty > 0));
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconCircle}>
          <ShoppingBag size={40} color={COLORS.border} />
        </View>
        <Text style={styles.emptyTextTitle}>Giỏ hàng trống</Text>
        <Text style={styles.emptyTextSub}>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</Text>
        <CustomButton title="Mua sắm ngay" onPress={() => navigation.navigate('HOME')} />
      </View>
    );
  }

  return (
    <View style={styles.flex1}>
      <View style={styles.cartHeader}>
        <Text style={styles.screenTitleCentered}>Giỏ hàng của bạn</Text>
        <TouchableOpacity onPress={() => setCart([])} style={styles.clearCartBtn}>
          <Text style={styles.clearCartText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flex1}>
        <ScrollView style={styles.flex1} contentContainerStyle={styles.cartList}>
          {cart.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.img }} style={styles.cartItemImg} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>{item.price.toLocaleString()}đ</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => updateCart(item.id, -1)} style={styles.qtyBtn}>
                    <Minus size={14} color={COLORS.textMain} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => updateCart(item.id, 1)} style={[styles.qtyBtn, styles.qtyBtnActive]}>
                    <Plus size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => updateCart(item.id, -item.qty)} style={styles.trashBtn}>
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
          {/* CHÚ Ý: Chuyển trang sang CHECKOUT bằng react-navigation */}
          <CustomButton title="Tiến hành thanh toán" fullWidth size="lg" onPress={() => navigation.navigate('CHECKOUT')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: COLORS.background },
  cartHeader: { padding: 20, paddingTop: 40, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  screenTitleCentered: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  clearCartBtn: { position: 'absolute', right: 20, bottom: 20 },
  clearCartText: { fontSize: 14, fontWeight: 'bold', color: COLORS.danger },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTextTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  emptyTextSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 32 },
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
  cartBottomPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '500', color: COLORS.textMuted },
  totalValue: { fontSize: 24, fontWeight: '900', color: COLORS.textMain },
});