import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  Switch,
  ActivityIndicator,
  Modal,
  Alert,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

const ProfileExamScreen = () => {
  // --- STATE QUẢN LÝ FORM VÀ UI ---
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('nva@example.com');
  const [phone, setPhone] = useState('0123456789');
  const [address, setAddress] = useState('Hồ Chí Minh');

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // State quản lý lỗi validation
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // --- HÀM XỬ LÝ VALIDATION VÀ LƯU ---
  const handleSave = () => {
    // 1. Reset lỗi
    let isValid = true;
    let newErrors = { name: '', email: '', phone: '', address: '' };

    // 2. Validate Tên (Không được trống)
    if (!name.trim()) {
      newErrors.name = 'Tên không được để trống';
      isValid = false;
    }

    // 3. Validate Email (Có @ và ., không trống)
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    // 4. Validate Số điện thoại (Chỉ số, dài 9-11 ký tự)
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'SĐT phải là số và có từ 9-11 ký tự';
      isValid = false;
    }

    // 5. Validate Địa chỉ (Không được trống)
    if (!address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
      isValid = false;
    }

    setErrors(newErrors);

    // Nếu qua được validate thì gọi API (giả lập)
    if (isValid) {
      setIsLoading(true);
      // Giả lập delay 1.5 giây
      setTimeout(() => {
        setIsLoading(false);
        // Hiển thị Alert khi lưu thành công (Yêu cầu 7)
        Alert.alert('Thành công', 'Thông tin của bạn đã được lưu thành công!');
      }, 1500);
    }
  };

  const handleCancel = () => {
    // Giả lập reset lại form hoặc quay về màn hình trước
    Alert.alert('Đã hủy', 'Các thay đổi chưa được lưu.');
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(false);
    Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công.');
  };

  return (
    // Yêu cầu 1: Layout SafeAreaView
    <SafeAreaView style={styles.safeArea}>
      {/* Yêu cầu 8: StatusBar */}
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Yêu cầu 1: KeyboardAvoidingView bọc ScrollView */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Yêu cầu 2: Profile header */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.avatar}
            />
            <Text style={styles.headerName}>{name || 'Tên người dùng'}</Text>
            <Text style={styles.headerEmail}>{email || 'email@example.com'}</Text>
            <Text style={styles.headerBio}>Học viên lập trình React Native</Text>
          </View>

          {/* Yêu cầu 3: Form TextInput & Validation */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              style={[styles.input, errors.address ? styles.inputError : null]}
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ"
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

            {/* Yêu cầu 4: Switch */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Nhận thông báo ứng dụng</Text>
              <Switch
                value={isNotificationEnabled}
                onValueChange={setIsNotificationEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isNotificationEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>

            {/* Yêu cầu 5: ActivityIndicator & Buttons */}
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={[styles.buttonText, { color: '#fff' }]}>Lưu</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Nút mở Modal Đăng xuất */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setIsLogoutModalVisible(true)}
              disabled={isLoading} // Disable khi đang loading
            >
              <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
            </TouchableOpacity>
          </View>

          {/* Yêu cầu 6: Modal xác nhận Đăng xuất */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isLogoutModalVisible}
            onRequestClose={() => setIsLogoutModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
                <Text style={styles.modalMessage}>Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?</Text>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setIsLogoutModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton, { backgroundColor: '#ff4444' }]}
                    onPress={handleLogout}
                  >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  headerBio: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3, // Bóng cho Android
    shadowColor: '#000', // Bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  logoutBtn: {
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default ProfileExamScreen;