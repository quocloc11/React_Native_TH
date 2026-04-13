// src/screens/ProductListScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, SafeAreaView, Text } from 'react-native';
import { generateProducts } from '../utils/mockData';
import { ProductItem, ITEM_HEIGHT } from '../components/ProductItem';

export const ProductListScreen = () => {
  // Bọc data trong useMemo để không bị tạo lại mỗi lần render
  const products = useMemo(() => generateProducts(1000), []);

  // Bọc hàm onPress trong useCallback (Yêu cầu số 9)
  const handlePressItem = useCallback((id: string) => {
    console.log('Clicked item:', id);
  }, []);

  // Hàm render được bọc trong useCallback
  const renderItem = useCallback(({ item }: any) => (
    <ProductItem item={item} onPress={handlePressItem} />
  ), [handlePressItem]);

  // Cực kỳ quan trọng: Báo cho FlatList biết trước chiều cao để khỏi phải tính toán động
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white shadow-sm z-10">
        <Text className="text-2xl font-bold text-center text-gray-800">Danh sách Sản phẩm</Text>
        <Text className="text-center text-gray-500">Tối ưu hóa FlatList</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // --- CÁC THÔNG SỐ TỐI ƯU FLATLIST (Yêu cầu số 1) ---
        getItemLayout={getItemLayout}
        removeClippedSubviews={true} // Unmount các item nằm ngoài màn hình
        maxToRenderPerBatch={10}     // Số item render mỗi frame
        windowSize={5}               // Số lượng màn hình ảo được giữ trong bộ nhớ (mặc định 21, giảm xuống để nhẹ RAM)
        initialNumToRender={8}       // Số item render lần đầu tiên
      // ----------------------------------------------------
      />
    </SafeAreaView>
  );
};