import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import {
  ChevronLeft,
  CheckCircle2,
  MapPin,
  CreditCard,
  Truck,
  LayoutList,
  Wallet,
  Landmark,
  Plus,
  ShieldCheck
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- THEME COLORS ---
const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  danger: '#ef4444',
  textMain: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  white: '#ffffff',
  background: '#f8fafc',
  blueLight: '#eff6ff',
};

// --- MOCK STORE ---
const useStore = () => ({
  cart: [
    { id: '1', name: 'Nike Air Max 270 Premium', price: 2450000, qty: 1, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { id: '2', name: 'Adidas Ultraboost 22', price: 3100000, qty: 1, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400' }
  ],
  addOrder: (order) => console.log("Order placed:", order),
});

export default function CheckoutScreen({ navigation }) {
  const [checkoutStep, setCheckoutStep] = useState(1);
  const { cart, addOrder } = useStore();

  // State cho Form Validation
  const [addressInfo, setAddressInfo] = useState({
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    address: 'Toà nhà Bitexco, Q.1, TP.HCM'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});

  // Tính toán dữ liệu
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subTotal; // Giả sử miễn phí vận chuyển

  const validateAndNext = () => {
    if (checkoutStep === 1) {
      let tempErrors = {};
      if (!addressInfo.name.trim()) tempErrors.name = "Vui lòng nhập họ tên";
      if (!addressInfo.phone.trim()) tempErrors.phone = "Vui lòng nhập số điện thoại";
      if (!addressInfo.address.trim()) tempErrors.address = "Vui lòng nhập địa chỉ";

      if (Object.keys(tempErrors).length > 0) {
        setErrors(tempErrors);
        return;
      }
    }
    setErrors({});
    setCheckoutStep(prev => prev + 1);
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      items: cart,
      total: total,
      address: addressInfo,
      payment: paymentMethod,
      status: 'Đang xử lý'
    };

    addOrder(newOrder);
    Alert.alert("Thành công", "Đơn hàng của bạn đã được tiếp nhận.", [
      { text: "OK", onPress: () => setCheckoutStep(1) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => checkoutStep > 1 ? setCheckoutStep(prev => prev - 1) : navigation?.goBack()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán ({checkoutStep}/3)</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent}>
          {checkoutStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Địa chỉ giao hàng</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={addressInfo.name}
                  onChangeText={t => setAddressInfo({ ...addressInfo, name: t })}
                  placeholder="Nhập tên người nhận"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={addressInfo.phone}
                  onChangeText={t => setAddressInfo({ ...addressInfo, phone: t })}
                  keyboardType="phone-pad"
                  placeholder="09xx xxx xxx"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Địa chỉ chi tiết</Text>
                <TextInput
                  style={[styles.input, styles.textArea, errors.address && styles.inputError]}
                  value={addressInfo.address}
                  onChangeText={t => setAddressInfo({ ...addressInfo, address: t })}
                  multiline
                  placeholder="Số nhà, tên đường, phường/xã..."
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
            </View>
          )}

          {checkoutStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Phương thức thanh toán</Text>
              {[
                { id: 'credit', name: 'Credit Card', icon: CreditCard, color: '#3b82f6' },
                { id: 'debit', name: 'Debit Card', icon: Landmark, color: '#8b5cf6' },
                { id: 'paypal', name: 'PayPal', icon: Wallet, color: '#6366f1' },
                { id: 'cod', name: 'Cash on Delivery (COD)', icon: Truck, color: COLORS.success },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setPaymentMethod(item.id)}
                  style={[styles.methodItem, paymentMethod === item.id && styles.methodItemActive]}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <Text style={styles.methodName}>{item.name}</Text>
                  <View style={[styles.radio, paymentMethod === item.id && styles.radioActive]}>
                    {paymentMethod === item.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {checkoutStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Xác nhận đơn hàng</Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <LayoutList size={18} color={COLORS.primary} />
                  <Text style={styles.summaryHeaderTitle}>Sản phẩm ({cart.length})</Text>
                </View>

                {cart.map((item, idx) => (
                  <View key={idx} style={styles.prodRow}>
                    <Text style={styles.prodName} numberOfLines={1}>{item.qty}x {item.name}</Text>
                    <Text style={styles.prodPrice}>{(item.price * item.qty).toLocaleString()}đ</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Tạm tính</Text>
                  <Text style={styles.calcVal}>{subTotal.toLocaleString()}đ</Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Phí vận chuyển</Text>
                  <Text style={styles.shippingFree}>Miễn phí</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalVal}>{total.toLocaleString()}đ</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MapPin size={16} color={COLORS.primary} />
                  <Text style={styles.infoText} numberOfLines={1}>{addressInfo.address}</Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 12 }]}>
                  <ShieldCheck size={16} color={COLORS.primary} />
                  <Text style={styles.infoText}>Thanh toán: {paymentMethod.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={checkoutStep < 3 ? validateAndNext : handlePlaceOrder}
          >
            <Text style={styles.mainBtnText}>
              {checkoutStep === 3 ? "ĐẶT HÀNG NGAY" : "TIẾP TỤC"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMain,
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textMain,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    marginLeft: 4,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  methodItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.blueLight,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.textMain,
  },
  prodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  prodName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMuted,
    marginRight: 10,
  },
  prodPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calcLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  shippingFree: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  totalVal: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: COLORS.blueLight,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  mainBtn: {
    backgroundColor: COLORS.textMain,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.textMain,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  mainBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});