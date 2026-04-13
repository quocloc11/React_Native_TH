import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';

// Hàm gọi API (queryFn)
const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
  if (!response.ok) throw new Error('Lỗi mạng, không thể tải dữ liệu');
  return response.json();
};

export const PostExamScreen = () => {
  // Sử dụng useQuery (Yêu cầu 2)
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['exam-posts'], // queryKey cố định
    queryFn: fetchPosts,      // Hàm gọi fetch
  });

  // Xử lý trạng thái đang tải (Loading)
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Xử lý trạng thái lỗi (Error)
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{(error as any).message}</Text>
        <Button title="Thử lại" onPress={() => refetch()} />
      </View>
    );
  }

  // Hiển thị danh sách khi có dữ liệu
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách bài viết (12 items)</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle} numberOfLines={1}>• {item.title}</Text>
          </View>
        )}
      />
      <Button title="Làm mới dữ liệu" onPress={() => refetch()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  postItem: { paddingVertical: 10, borderBottomWidth: 0.5, borderColor: '#ccc' },
  postTitle: { fontSize: 14, color: '#333' }
});