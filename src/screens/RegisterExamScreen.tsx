import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. ĐỊNH NGHĨA SCHEMA (VALIDATION RULES)
const schema = z.object({
  fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
  email: z.string().min(1, 'Email là bắt buộc').email('Định dạng email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[a-zA-Z]/, 'Cần ít nhất 1 chữ cái')
    .regex(/[0-9]/, 'Cần ít nhất 1 chữ số'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

export const RegisterExamScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'all', // Hiện lỗi khi gõ (onChange) và khi thoát (onBlur)
    defaultValues: {
      fullName: '',      // THÊM DÒNG NÀY
      email: '',         // THÊM DÒNG NÀY
      password: '',      // THÊM DÒNG NÀY
      confirmPassword: '' // THÊM DÒNG NÀY
    }
  });

  const onSubmit = (data: any) => {
    console.log("Dữ liệu sạch:", data);
    Alert.alert('Thành công', 'Đăng ký dự thi hoàn tất!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng Ký Tài Khoản</Text>

      {/* FIELD: HỌ TÊN */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Họ và tên *</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.fullName && { borderColor: 'red' }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Nhập họ tên"
            />
          )}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
      </View>

      {/* FIELD: EMAIL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && { borderColor: 'red' }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="example@gmail.com"
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      {/* FIELD: MẬT KHẨU */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mật khẩu *</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && { borderColor: 'red' }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="********"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      {/* FIELD: XÁC NHẬN MẬT KHẨU */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Xác nhận mật khẩu *</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.confirmPassword && { borderColor: 'red' }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="********"
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>ĐĂNG KÝ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#333' },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: '600', marginBottom: 5 },
  input: { borderBottomWidth: 1.5, borderColor: '#ccc', padding: 10, fontSize: 16 },
  errorText: { color: 'red', fontSize: 12, marginTop: 5, fontWeight: '500' },
  btn: { backgroundColor: '#007BFF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 15 }
});