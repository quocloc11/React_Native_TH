// import React from 'react';
// import { StatusBar, LogBox, View, Switch, Text } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AppNavigator from './src/navigation/AppNavigator';

// // 1. IMPORT THƯ VIỆN NATIVEWIND (BẮT BUỘC)
// import { useColorScheme } from 'nativewind';
// import './global.css';

// // 2. Import màn hình Design System vừa tạo ở Bước 5
// import { LoginDS_Screen } from './src/screens/LoginDS_Screen';
// import { ProductListScreen } from '@screens/ProductListScreen';
// import { ProductScreen } from '@screens/ProductScreen';
// import { RegisterExamScreen } from '@screens/RegisterExamScreen';

// // Bỏ qua các cảnh báo log không quan trọng
// LogBox.ignoreAllLogs();

// export default function App() {
//   // 3. Sử dụng hook của NativeWind để lấy và đổi trạng thái giao diện (Light/Dark)
//   const { colorScheme, toggleColorScheme } = useColorScheme();

//   return (
//     <SafeAreaProvider>
//       {/* 4. Cấu hình StatusBar tự động đổi màu theo Theme */}
//       <StatusBar
//         barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
//         backgroundColor={colorScheme === 'dark' ? '#111827' : '#ffffff'}
//         translucent={false}
//       />

//       {/* --- NÚT TOGGLE THEME MẶC ĐỊNH (Góc trên bên phải) --- */}
//       {/* Bạn có thể xóa cục View này đi khi đưa app vào thực tế */}
//       <View className="absolute top-12 right-4 z-50 flex-row items-center gap-2 bg-neutral-200/80 dark:bg-neutral-800/80 px-3 py-1.5 rounded-full">
//         <Text className="text-xs font-bold text-neutral-900 dark:text-white">
//           {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
//         </Text>
//         <Switch
//           value={colorScheme === 'dark'}
//           onValueChange={toggleColorScheme}
//           thumbColor={colorScheme === 'dark' ? '#3b82f6' : '#f3f4f6'}
//         />
//       </View>

//       {/* ========================================================
//           CHỌN 1 TRONG 2 CÁCH HIỂN THỊ DƯỚI ĐÂY (Đóng/Mở Comment)
//           ======================================================== */}

//       {/* CÁCH 1: TEST MÀN HÌNH DESIGN SYSTEM (Đang bật) */}
//       {/* <LoginDS_Screen /> */}

//       {/* CÁCH 2: CHẠY APP CHÍNH CỦA BẠN (Đang tắt) */}
//       {/* Mở comment dòng dưới và đóng comment dòng LoginDS_Screen ở trên khi bạn code xong Design System */}
//       {/* <AppNavigator /> */}
//       {/* <ProductListScreen /> */}
//       {/* <ProductScreen /> */}
//       <RegisterExamScreen />
//     </SafeAreaProvider>
//   );
// }


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Button, View, Text } from 'react-native';

// import { SplashExam } from './src/screens/SplashExam';
// import { LoginExam } from './src/screens/LoginExam';
// import { RegisterExam } from '@screens/RegisterExamScreen';
// import { ProductScreen } from './src/screens/ProductScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const MainTabs = ({ navigation }: any) => (
//   <Tab.Navigator>
//     <Tab.Screen name="Products" component={ProductScreen} options={{ title: 'Sản phẩm' }} />
//     <Tab.Screen name="Profile" component={() => (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Button title="Đăng xuất" onPress={async () => {
//           await AsyncStorage.removeItem('userToken');
//           navigation.reset({ index: 0, routes: [{ name: 'LoginExam' }] });
//         }} />
//       </View>
//     )} />
//   </Tab.Navigator>
// );

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="SplashExam" component={SplashExam} />
//         <Stack.Screen name="LoginExam" component={LoginExam} />
//         <Stack.Screen name="RegisterExam" component={RegisterExam} options={{ headerShown: true, title: 'Đăng ký' }} />
//         <Stack.Screen name="MainTabs" component={MainTabs} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Cấu hình QueryClient (Yêu cầu 3)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // Dữ liệu được coi là "mới" trong 30 giây
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Giữ nguyên phần NavigationContainer của bạn ở đây */}
    </QueryClientProvider>
  );
}
//BAI 1 A CAU 5

// // App.tsx
// import React from 'react';
// import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

// // 1. Import bằng alias theo yêu cầu đề bài
// import { formatPrice } from '@utils/helpers';
// import { User } from '@types/index';

// const App = () => {
//   // 2. Tạo một đối tượng User để test type
//   const testUser: User = {
//     id: 'U01',
//     name: 'Nguyễn Văn A',
//     email: 'nva@example.com',
//   };

//   // 3. Gọi thử formatPrice với một số
//   const testPrice = 1000000;
//   const formattedPrice = formatPrice(testPrice);

//   // 4. Console.log kèm comment demo theo yêu cầu
//   console.log('--- ĐANG DEMO ---');
//   console.log('User info:', testUser);
//   console.log('Giá tiền sau khi format:', formattedPrice);

//   // 5. Hiển thị kết quả trên UI
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Xin chào, {testUser.name}!</Text>
//         <Text style={styles.text}>Mức giá sản phẩm là: {formattedPrice}</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 18,
//     color: '#333',
//   }
// });

// export default App;

// BAI 1 B CAU KICH BAN B
// // App.tsx (Đoạn code cố tình tạo lỗi)
// import React from 'react';
// import { SafeAreaView, Text, View } from 'react-native';

// const App = () => {
//   // Cố tình gán user là null
//   const user: any = null;

//   return (
//     <SafeAreaView>
//       <View>
//         {/* LỖI RUNTIME Ở ĐÂY: Không thể đọc thuộc tính 'name' của null */}
//         <Text>Xin chào, {user?.name || 'Khách'}!</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;

// BAI 1 B CAU 2
// App.tsx (Code hoàn chỉnh cho phần debug)
// import React, { useState } from 'react';
// import { SafeAreaView, Text, View, Button } from 'react-native';

// const App = () => {
//   const [count, setCount] = useState(0);

//   // Dùng console.log để debug khi component render
//   console.log('App render. Count hiện tại:', count);

//   const handlePress = () => {
//     const newCount = count + 1;
//     setCount(newCount);
//     // Dùng console.log để debug khi bấm nút
//     console.log('Nút đã được bấm! Count tăng lên:', newCount);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <View>
//         <Text style={{ fontSize: 20, marginBottom: 20 }}>Số lần bấm: {count}</Text>
//         <Button title="Bấm vào đây" onPress={handlePress} />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default App;


// App.tsx
// import React, { useState } from 'react';
// import { SafeAreaView, StyleSheet, View, Button, Text } from 'react-native';

// // Import các component vừa tạo
// import PlatformBadge from '@components/PlatformBadge';
// import NumberListDemo from './src/screens/NumberListDemo';
// import ErrorBoundary from '@components/ErrorBoundary';
// import ProfileExamScreen from '@screens/ProfileExamScreen';

// // ----------------------------------------------------
// // Component con cố tình gây lỗi (dùng để test ErrorBoundary)
// // ----------------------------------------------------
// const BuggyComponent = () => {
//   const [shouldCrash, setShouldCrash] = useState(false);

//   if (shouldCrash) {
//     // Cố tình throw Error khi render
//     throw new Error('ĐÂY LÀ LỖI CỐ TÌNH ĐỂ TEST ERROR BOUNDARY!');
//   }

//   return (
//     <View style={{ marginVertical: 10, alignItems: 'center' }}>
//       <Text>Component này đang hoạt động bình thường</Text>
//       <Button
//         title="Gây lỗi render"
//         color="red"
//         onPress={() => setShouldCrash(true)}
//       />
//     </View>
//   );
// };

// // ----------------------------------------------------
// // Component App chính
// // ----------------------------------------------------
// const App = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ padding: 10 }}>
//         {/* Câu 2b: Badge hiển thị OS */}
//         <PlatformBadge />

//         {/* Câu 3b: Demo Error Boundary */}
//         <Text style={styles.sectionTitle}>Demo Error Boundary:</Text>
//         <ErrorBoundary>
//           <BuggyComponent />
//         </ErrorBoundary>
//       </View>

//       {/* Câu 3a: Danh sách 100 items (Cho chiếm phần diện tích dưới cùng) */}
//       <View style={{ flex: 1, paddingHorizontal: 10 }}>
//         <Text style={styles.sectionTitle}>Demo FlatList:</Text>
//         <NumberListDemo />
//       </View>
//       <ProfileExamScreen />
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 15,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//     paddingTop: 10,
//   }
// });

// export default App;





// App.tsx
// import React from 'react';
// import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

// // 1. Import bằng alias theo yêu cầu đề bài
// import { formatPrice } from '@utils/helpers';
// import { User } from '@types/index';
// import ProductDetailExamScreen from '@screens/ProductDetailExamScreen';
// // import ProfileExamScreen from '@screens/ProfileExamScreen';

// const App = () => {

//   // 5. Hiển thị kết quả trên UI
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         {/* <ProfileExamScreen /> */}
//         < ProductDetailExamScreen />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 18,
//     color: '#333',
//   }
// });

// export default App;