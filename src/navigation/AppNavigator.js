import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  const cartCount = useStore(state => state.cart.length);
  const favoritesCount = useStore(state => state.favorites.length);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { height: 65, paddingBottom: 10 },
      }}
    >
      <Tab.Screen name="HOME" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} size={22} />, tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="SEARCH" component={SearchScreen} options={{ tabBarIcon: ({ color }) => <Search color={color} size={22} />, tabBarLabel: 'Tìm kiếm' }} />
      <Tab.Screen
        name="CART"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => <ShoppingCart color={color} size={22} />,
          tabBarLabel: 'Giỏ hàng',
          tabBarBadge: cartCount > 0 ? cartCount : null
        }}
      />
      <Tab.Screen
        name="FAVORITES"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => <Heart color={color} size={22} />,
          tabBarLabel: 'Yêu thích',
          tabBarBadge: favoritesCount > 0 ? favoritesCount : null // THÊM DÒNG NÀY: Hiển thị số lượng yêu thích
        }}
      />
      <Tab.Screen name="PROFILE" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <User color={color} size={22} />, tabBarLabel: 'Tôi' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="DETAIL" component={ProductDetailScreen} />
        <Stack.Screen name="CHECKOUT" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}