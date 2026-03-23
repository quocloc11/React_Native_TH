// File: App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // <-- BẮT BUỘC PHẢI CÓ CÁI NÀY
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // Bọc toàn bộ App bằng SafeAreaProvider
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}