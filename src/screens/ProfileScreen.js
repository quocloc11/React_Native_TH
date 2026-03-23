import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Package, Truck, Star, ShoppingBag, CreditCard, MapPin, LogOut, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.flex1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.profileTopBg}>
        <Text style={styles.profileScreenTitle}>Tài khoản</Text>
        <View style={styles.profileUserInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.avatar} />
          <View>
            <Text style={styles.profileName}>Nguyễn Văn A</Text>
            <Text style={styles.profileLevel}>Thành viên Vàng</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContent}>
        <View style={styles.profileStatsBox}>
          {[
            { label: 'Chờ xác nhận', icon: Package },
            { label: 'Đang giao', icon: Truck },
            { label: 'Đánh giá', icon: Star }
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.statItem}>
              <item.icon size={24} color={COLORS.textMuted} />
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.profileMenuBox}>
          {/* Sửa chuyển trang HISTORY ở đây */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HISTORY')}>
            <View style={styles.menuItemLeft}>
              <ShoppingBag size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Lịch sử đơn hàng</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <CreditCard size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Phương thức thanh toán</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MapPin size={20} color={COLORS.textMuted} />
              <Text style={styles.menuItemText}>Sổ địa chỉ</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <LogOut size={20} color={COLORS.danger} />
              <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Đăng xuất</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: COLORS.background },
  profileTopBg: { backgroundColor: COLORS.dark, paddingTop: 60, paddingBottom: 80, paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  profileScreenTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 24 },
  profileUserInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: COLORS.textMuted, marginRight: 16 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  profileLevel: { fontSize: 14, fontWeight: '500', color: COLORS.primaryLight, marginTop: 4 },
  profileContent: { paddingHorizontal: 20, marginTop: -40 },
  profileStatsBox: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center', padding: 12 },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, marginTop: 8 },
  profileMenuBox: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.surface },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 12 },
});