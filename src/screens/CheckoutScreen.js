import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ChevronLeft, CheckCircle2, Plus, CreditCard, MapPin, Package } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import CustomButton from '../components/CustomButton';

export default function CheckoutScreen({ navigation }) {
  const [checkoutStep, setCheckoutStep] = useState(1);
  const cartTotal = 2450000; // Mock total

  const handleCheckout = () => {
    // Xử lý thanh toán xong, chuyển sang trang SUCCESS
    // navigation.navigate('SUCCESS'); 
    alert("Đặt hàng thành công!");
    navigation.navigate('MainTabs'); // Quay về trang chủ
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.stackScreen}>
      <View style={styles.simpleHeader}>
        {/* NÚT QUAY LẠI CHUẨN: navigation.goBack() */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <ChevronLeft size={24} color={COLORS.textMain} />
        </TouchableOpacity>
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
              const isActive = idx === 2; // Giả lập chọn COD
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
              <View style={styles.summaryItemRow}>
                <Text style={styles.summaryItemText}>1x Nike Air Max</Text>
                <Text style={styles.summaryItemPrice}>2.450.000đ</Text>
              </View>
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
}

const styles = StyleSheet.create({
  stackScreen: { flex: 1, backgroundColor: COLORS.background },
  flex1: { flex: 1 },
  simpleHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBackBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
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
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
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
});