import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginExam = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim().toLowerCase() === 'admin' && password === '123456') {
      await AsyncStorage.setItem('userToken', 'mock-jwt'); // Lưu token giả
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ.'); // Bảo mật thông điệp lỗi
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput placeholder="Tài khoản (admin)" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Mật khẩu (123456)" style={styles.input} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.btnText}>Đăng Nhập</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterExam')}><Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text></TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007BFF', textAlign: 'center', marginTop: 20 }
});