// File: src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, User } from 'lucide-react-native';

// Import 3 file bài tập của bạn vào đây
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Tạo thanh Tab bên dưới (Chứa Home và Profile)
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007AFF' }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} />, tabBarLabel: 'Trang chủ' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} />, tabBarLabel: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
}

// 2. Tạo Stack tổng quản lý toàn bộ App
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Màn hình mặc định hiện lên là thanh Tab (Home/Profile) */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Màn hình Detail không có Tab bar, nó sẽ đè lên trên khi được gọi */}
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}