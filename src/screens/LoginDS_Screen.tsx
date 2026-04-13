import React, { useState } from 'react';
import { View } from 'react-native';

// Import trỏ trực tiếp vào từng file để không bị lỗi
import { Text } from '../components/design-system/base/Text';
import { Button } from '../components/design-system/base/Button';
import { Input } from '../components/design-system/base/Input';
import { Card } from '../components/design-system/base/Card';
import { Badge } from '../components/design-system/base/Badge';
import { Container } from '../components/design-system/layout/Container';
import { Stack } from '../components/design-system/layout/Stack';

export const LoginDS_Screen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container className="justify-center">
      <Card variant="elevated" className="py-8 px-6">
        <Stack spacing={6}>
          <View className="items-center">
            <Badge label="NativeWind v4" variant="info" />
            <Text variant="heading" weight="bold" className="mt-4 mb-2">Đăng Nhập</Text>
            <Text variant="body" className="text-neutral-500 text-center">
              Test Design System Components
            </Text>
          </View>

          <Stack spacing={4}>
            <Input label="Email" placeholder="nhap@email.com" value={email} onChangeText={setEmail} />
            <Input label="Mật khẩu" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
          </Stack>

          <Stack spacing={3}>
            <Button title="Đăng nhập ngay" size="large" onPress={() => console.log('Login')} />
            <Button title="Quên mật khẩu?" variant="ghost" onPress={() => console.log('Forgot')} />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};