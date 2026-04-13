// src/components/ProductItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
}

interface Props {
  item: Product;
  onPress: (id: string) => void;
}

// Chiều cao cố định của item giúp FlatList tính toán mượt hơn
export const ITEM_HEIGHT = 100;

const ProductItemComponent = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      className="flex-row bg-white p-3 mx-4 my-2 rounded-xl shadow-sm border border-gray-100"
      style={{ height: ITEM_HEIGHT - 16 }} // Trừ hao margin
    >
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-lg bg-gray-200"
      />
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-sm text-blue-500 font-semibold mb-1">{item.category}</Text>
        <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-lg font-bold text-red-500 mt-1">${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Sử dụng React.memo để chặn re-render thừa
export const ProductItem = React.memo(ProductItemComponent, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});