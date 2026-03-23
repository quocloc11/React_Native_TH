import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';

const TRENDING = ["Sneaker Nike", "iPhone 15", "Tai nghe chống ồn", "Balo chống nước"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(["Giày chạy bộ", "Bàn phím cơ"]);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!query.trim()) return;

    // Lưu lịch sử
    if (!history.includes(query)) {
      setHistory([query, ...history].slice(0, 5));
    }

    setHasSearched(true);
    // Giả lập tìm kiếm: Cố tình trả về mảng rỗng nếu gõ chữ "lỗi" để test Empty State
    if (query.toLowerCase() === 'lỗi') {
      setResults([]);
    } else {
      setResults([{ id: '1', name: `Kết quả cho: ${query}` }]); // Mock data
    }
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Search size={48} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
      <Text style={styles.emptySub}>Vui lòng thử lại với từ khóa khác</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <CustomInput
            placeholder="Bạn đang tìm gì?"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            icon={<Search size={20} color="#94a3b8" />}
          />
          {query.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearSearch}>
              <X size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {!hasSearched ? (
        <View style={styles.content}>
          {/* Lịch sử tìm kiếm */}
          {history.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Lịch sử tìm kiếm</Text>
                <TouchableOpacity onPress={() => setHistory([])}>
                  <Text style={styles.clearText}>Xóa</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipRow}>
                {history.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.chip} onPress={() => { setQuery(item); handleSearch(); }}>
                    <Clock size={14} color="#64748b" style={{ marginRight: 6 }} />
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Xu hướng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tìm kiếm phổ biến</Text>
            <View style={styles.chipRow}>
              {TRENDING.map((item, index) => (
                <TouchableOpacity key={index} style={styles.chipTrend}>
                  <TrendingUp size={14} color="#3b82f6" style={{ marginRight: 6 }} />
                  <Text style={styles.chipTrendText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        /* Kết quả tìm kiếm */
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, alignItems: 'flex-start', gap: 12 },
  searchWrapper: { flex: 1, position: 'relative' },
  clearBtn: { position: 'absolute', right: 12, top: 18, backgroundColor: '#cbd5e1', borderRadius: 10, padding: 2 },
  filterBtn: { height: 52, width: 52, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 16, paddingTop: 10 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  clearText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  chipText: { fontSize: 13, color: '#475569' },
  chipTrend: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipTrendText: { fontSize: 13, color: '#1d4ed8', fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#64748b', marginTop: 8 },
  resultItem: { padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 12 },
});