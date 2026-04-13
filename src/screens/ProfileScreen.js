import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Sử dụng Hook để điều hướng ổn định hơn
import {
  Package, Truck, Star, ShoppingBag, CreditCard,
  MapPin, LogOut, ChevronRight, Settings, Heart,
  ShieldCheck, Headset, Wallet
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();

  // Mock User Data
  const user = {
    name: "Nguyễn Văn A",
    email: "vana.nguyen@example.com",
    level: "Thành viên Vàng",
    points: 1250,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  };

  // Hàm xử lý khi nhấn vào các mục chưa phát triển hoặc cần kiểm tra
  const handlePress = (screenName) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      // Nếu chưa có màn hình này trong Navigator, thông báo cho người dùng
      Alert.alert("Thông báo", `Màn hình ${screenName} đang được phát triển hoặc chưa đăng ký trong AppNavigator.`);
    }
  };

  const MenuOption = ({ icon: Icon, title, subTitle, onPress, color = COLORS.textMuted, isLast = false }) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.menuItemText}>{title}</Text>
          {subTitle && <Text style={styles.menuItemSubText}>{subTitle}</Text>}
        </View>
      </View>
      <ChevronRight size={16} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.flex1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Cá nhân</Text>
            {/* Nút Setting ở góc trên */}
            <TouchableOpacity onPress={() => handlePress('SETTINGS')}>
              <Settings size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.levelBadge}>
                <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                <Text style={styles.levelText}>{user.level}</Text>
              </View>
            </View>
          </View>

          {/* Points/Wallet Card */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>Xu tích lũy</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Voucher</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Order Status Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
              <TouchableOpacity onPress={() => handlePress('HISTORY')}>
                <Text style={styles.seeAll}>Xem lịch sử</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.orderStatusRow}>
              {[
                { label: 'Chờ xác nhận', icon: Wallet, color: '#f59e0b' },
                { label: 'Chờ giao hàng', icon: Package, color: '#3b82f6' },
                { label: 'Đang giao', icon: Truck, color: '#8b5cf6' },
                { label: 'Đánh giá', icon: Star, color: '#10b981' }
              ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.orderStatusItem}>
                  <item.icon size={24} color={item.color} />
                  <Text style={styles.orderStatusLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Settings Section */}
          <Text style={styles.groupLabel}>Quản lý tài khoản</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon={ShoppingBag}
              title="Lịch sử mua hàng"
              subTitle="Tất cả đơn hàng của bạn"
              color={COLORS.primary}
              onPress={() => handlePress('HISTORY')}
            />
            <MenuOption
              icon={Heart}
              title="Sản phẩm yêu thích"
              subTitle="Sản phẩm bạn đã thả tim"
              color={COLORS.danger}
              onPress={() => handlePress('FAVORITES')}
            />
            <MenuOption
              icon={MapPin}
              title="Sổ địa chỉ"
              subTitle="Quản lý địa chỉ giao hàng"
              color="#10b981"
            />
            <MenuOption
              icon={CreditCard}
              title="Thanh toán"
              subTitle="Thẻ và ví liên kết"
              color="#f59e0b"
              isLast={true}
            />
          </View>

          {/* Support Section */}
          <Text style={styles.groupLabel}>Hỗ trợ & Bảo mật</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon={ShieldCheck}
              title="Bảo mật tài khoản"
              color="#6366f1"
            />
            <MenuOption
              icon={Headset}
              title="Trung tâm hỗ trợ"
              color="#ec4899"
            />
            <MenuOption
              icon={Settings}
              title="Cài đặt ứng dụng"
              color={COLORS.textMuted}
              onPress={() => handlePress('SETTINGS')}
              isLast={true}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.dark,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    backgroundColor: '#10b981',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.dark
  },
  userMeta: { marginLeft: 20 },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6
  },
  levelText: { fontSize: 12, color: COLORS.warning, fontWeight: 'bold', marginLeft: 6 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 30,
    borderRadius: 20,
    paddingVertical: 15
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  dividerVertical: { width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },

  content: { paddingHorizontal: 20, marginTop: -30 },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    marginBottom: 25
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  seeAll: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' },
  orderStatusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orderStatusItem: { alignItems: 'center', flex: 1 },
  orderStatusLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },

  groupLabel: { fontSize: 13, fontWeight: '800', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 10, marginBottom: 15 },
  menuGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 2
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface
  },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
  menuItemSubText: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    marginBottom: 20
  },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: COLORS.danger, marginLeft: 10 }
});