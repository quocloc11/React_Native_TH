import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';

const ProfileScreen = ({ navigation }) => {
  // 1. Quản lý trạng thái hồ sơ
  const [profile, setProfile] = useState({
    name: 'Nguyễn Văn A',
    email: 'nva@example.com',
    phone: '0987654321',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    bio: "Lập trình viên React Native yêu thích công nghệ và thiết kế giao diện người dùng.",
    notifications: true,
    publicEmail: false,
  });

  // Các trạng thái UI
  const [isSaving, setIsSaving] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [errors, setErrors] = useState({});

  // 2. Hàm kiểm tra tính hợp lệ (Validation)
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!profile.name.trim()) newErrors.name = 'Tên không được để trống';
    if (!emailRegex.test(profile.email)) newErrors.email = 'Email không hợp lệ';
    if (profile.phone.length < 10) newErrors.phone = 'Số điện thoại không hợp lệ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Xử lý lưu thông tin
  const handleSave = () => {
    if (validate()) {
      setIsSaving(true);
      // Giả lập gọi API
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert('Thành công', 'Thông tin hồ sơ đã được cập nhật!');
      }, 1500);
    }
  };

  // 4. Xác nhận xóa tài khoản (Alert đặc thù theo nền tảng)
  const confirmDeleteAccount = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: () => console.log('Deleted') }
      ]
    );
  };

  // Thành phần phụ cho mỗi dòng cài đặt
  const SettingRow = ({ icon, title, desc }) => (
    <TouchableOpacity style={styles.settingRow}>
      <View style={styles.settingIconBox}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitleText}>{title}</Text>
        <Text style={styles.settingDescText}>{desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?u=reactnative' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Sửa</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userEmailText}>{profile.email}</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Loading Indicator */}
          {isSaving && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Đang lưu thay đổi...</Text>
            </View>
          )}

          {/* Profile Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Thông tin cơ bản</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={[styles.textInput, errors.name && styles.errorInput]}
                value={profile.name}
                onChangeText={(val) => setProfile({ ...profile, name: val })}
              />
              {errors.name && <Text style={styles.errorLabel}>{errors.name}</Text>}
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={[styles.textInput, errors.phone && styles.errorInput]}
                value={profile.phone}
                keyboardType="phone-pad"
                onChangeText={(val) => setProfile({ ...profile, phone: val })}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Nhận thông báo qua ứng dụng</Text>
              <Switch
                value={profile.notifications}
                onValueChange={(val) => setProfile({ ...profile, notifications: val })}
                trackColor={{ false: '#d1d1d1', true: '#34C759' }}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnText}>Lưu thay đổi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutTrigger}
                onPress={() => setLogoutModalVisible(true)}
              >
                <Text style={styles.logoutTriggerText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Cài đặt tài khoản</Text>
            <SettingRow icon="🔐" title="Bảo mật" desc="Mật khẩu và 2FA" />
            <SettingRow icon="🌐" title="Ngôn ngữ" desc="Tiếng Việt" />
            <SettingRow icon="🌙" title="Chủ đề" desc="Chế độ sáng" />
            <SettingRow icon="❓" title="Trợ giúp" desc="Trung tâm khách hàng" />

            <TouchableOpacity style={styles.dangerZone} onPress={confirmDeleteAccount}>
              <Text style={styles.dangerZoneText}>Xóa tài khoản vĩnh viễn</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Logout Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeading}>Đăng xuất?</Text>
            <Text style={styles.modalSubText}>Bạn sẽ cần đăng nhập lại để sử dụng các tính năng cá nhân của mình.</Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#f0f0f0' }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ color: '#333' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#FF3B30' }]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  Alert.alert('Đăng xuất thành công');
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  userEmailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#3A3A3C',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 15,
    letterSpacing: 1,
  },
  inputBox: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorLabel: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionButtons: {
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutTrigger: {
    marginTop: 15,
    alignItems: 'center',
  },
  logoutTriggerText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitleText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  settingDescText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  chevron: {
    fontSize: 24,
    color: '#C7C7CC',
  },
  dangerZone: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dangerZoneText: {
    color: '#FF3B30',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubText: {
    textAlign: 'center',
    color: '#3A3A3C',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  }
});

export default ProfileScreen;