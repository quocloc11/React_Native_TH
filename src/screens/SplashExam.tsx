import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SplashExam = ({ navigation }: any) => {
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Chờ 2 giây
      const token = await AsyncStorage.getItem('userToken');
      navigation.replace(token === 'mock-jwt' ? 'MainTabs' : 'LoginExam');
    };
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MY APP</Text>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#007BFF', marginBottom: 20 }
});