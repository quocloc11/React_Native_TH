import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { MapPin, CreditCard, CheckCircle2, ChevronLeft } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import useStore from '../store/useStore';

export default function CheckoutScreen({ navigation, route }) {
  const { total } = route.params; // Lấy tổng tiền truyền từ Cart
  const { clearCart } = useStore();

  // Quản lý Step và Data Form
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD hoặc CARD
  const [isLoading, setIsLoading] = useState(false);

  // Validate form trước khi qua bước 2
  const handleNextStep = () => {
    if (step === 1) {
      if (address.trim().length < 10) {
        setAddressError('Vui lòng nhập địa chỉ chi tiết (ít nhất 10 ký tự)');
        return;
      }
      setAddressError('');
      setStep(2);
    }
  };

  // Giả lập call API thanh toán
  const handlePlaceOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      clearCart(); // Mua xong thì xóa giỏ hàng
      setStep(3); // Chuyển sang màn hình Thành công
    }, 2000);
  };

  // --- RENDERS ---
  const renderStepIndicator = () => (
    <View style={styles.stepper}>
      <Text style={[styles.stepText, step >= 1 && styles.stepActive]}>1. Giao hàng</Text>
      <Text style={styles.stepLine}>—</Text>
      <Text style={[styles.stepText, step >= 2 && styles.stepActive]}>2. Thanh toán</Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
      <CustomInput
        label="Địa chỉ chi tiết"
        placeholder="Số nhà, Tên đường, Phường/Xã..."
        value={address}
        onChangeText={setAddress}
        error={addressError}
        icon={<MapPin size={20} color="#94a3b8" />}
      />
      <CustomButton title="Tiếp tục thanh toán" onPress={handleNextStep} style={{ marginTop: 20 }} />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

      {/* Nút chọn COD */}
      <CustomButton
        title="Thanh toán khi nhận hàng (COD)"
        variant={paymentMethod === 'COD' ? 'primary' : 'outline'}
        onPress={() => setPaymentMethod('COD')}
        style={{ marginBottom: 12 }}
      />

      {/* Nút chọn Thẻ */}
      <CustomButton
        title="Thẻ tín dụng / Ghi nợ"
        variant={paymentMethod === 'CARD' ? 'primary' : 'outline'}
        onPress={() => setPaymentMethod('CARD')}
        icon={<CreditCard size={20} color={paymentMethod === 'CARD' ? '#fff' : '#3b82f6'} />}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Tổng thanh toán:</Text>
        <Text style={styles.totalText}>{total.toLocaleString('vi-VN')}đ</Text>
      </View>

      <CustomButton
        title="Xác nhận Đặt hàng"
        isLoading={isLoading}
        onPress={handlePlaceOrder}
        style={{ marginTop: 24 }}
      />
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <CheckCircle2 size={80} color="#10b981" />
      <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
      <Text style={styles.successSub}>Mã đơn hàng của bạn là #VN{Math.floor(Math.random() * 100000)}</Text>
      <CustomButton
        title="Về trang chủ"
        onPress={() => navigation.navigate('Home')}
        style={{ marginTop: 30, width: '100%' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Ẩn khi ở bước 3) */}
      {step < 3 && (
        <View style={styles.header}>
          <ChevronLeft size={28} color="#0f172a" onPress={() => step === 2 ? setStep(1) : navigation.goBack()} />
          <Text style={styles.headerTitle}>Thanh toán</Text>
          <View style={{ width: 28 }} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {step < 3 && renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderSuccess()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  content: { padding: 20 },
  stepper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  stepText: { fontSize: 14, color: '#94a3b8', fontWeight: 'bold' },
  stepActive: { color: '#3b82f6' },
  stepLine: { marginHorizontal: 12, color: '#cbd5e1' },
  stepContainer: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1e293b' },
  summaryBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { fontSize: 16, color: '#64748b' },
  totalText: { fontSize: 20, fontWeight: '900', color: '#3b82f6' },
  successContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#10b981', marginTop: 20 },
  successSub: { fontSize: 14, color: '#64748b', marginTop: 10, textAlign: 'center' },
});