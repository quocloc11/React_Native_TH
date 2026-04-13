import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import useStore from '../store/useStore';
import { COLORS } from '../theme/colors';
// Import các component có logic animation từ thư mục components
import { HeartButton, SuccessToast } from '../components/AdvancedComponents';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, addToCart } = useStore();

  // State để điều khiển thông báo (Success Animation)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showFeedback = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.some(f => f.id === item.id);

    return (
      <Animated.View style={styles.card}>
        <Image source={{ uri: item.img }} style={styles.img} />

        <View style={styles.info}>
          <Text style={styles.brand}>{item.brand || 'Premium'}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>

          <View style={styles.actions}>
            {/* Component Animation: Nút bấm có độ nảy nhẹ */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.btnCart}
              onPress={() => {
                addToCart(item);
                showFeedback("Đã thêm vào giỏ hàng!");
              }}
            >
              <ShoppingCart size={16} color={COLORS.primary} />
              <Text style={styles.btnCartText}>Thêm vào giỏ</Text>
            </TouchableOpacity>

            {/* Micro-interaction: Heart Bounce Animation */}
            <HeartButton
              isFav={isFav}
              onPress={() => {
                toggleFavorite(item);
                if (isFav) showFeedback("Đã xóa khỏi yêu thích");
              }}
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Success Animation: Toast thông báo trượt */}
      <SuccessToast
        visible={toastVisible}
        message={toastMsg}
        onHide={() => setToastVisible(false)}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Yêu thích</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{favorites.length}</Text>
        </View>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5089/5089733.png' }}
            style={styles.emptyImg}
          />
          <Text style={styles.emptyText}>Danh sách yêu thích trống</Text>
          <TouchableOpacity
            style={styles.btnExplore}
            onPress={() => navigation.navigate('HOME')}
          >
            <Text style={styles.btnExploreText}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textMain, letterSpacing: -0.5 },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 10
  },
  badgeText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  listContent: { padding: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15
  },
  img: { width: 100, height: 100, borderRadius: 18, backgroundColor: COLORS.surface },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  brand: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 2 },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  price: { color: COLORS.textMain, fontWeight: '900', marginTop: 4, fontSize: 17 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  btnCart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  btnCartText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyImg: { width: 150, height: 150, opacity: 0.1 },
  emptyText: { marginTop: 20, color: COLORS.textLight, fontWeight: 'bold', fontSize: 16 },
  btnExplore: { marginTop: 20, backgroundColor: COLORS.dark, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  btnExploreText: { color: 'white', fontWeight: 'bold' }
});