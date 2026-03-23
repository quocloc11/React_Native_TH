import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { HelloWorld } from '@components/HelloWorld';

import ProfileScreen from '@screens/ProfileScreen';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import HomeScreen from '@screens/HomeScreen';

// import AppNavigator from 'src/navigation/AppNavigator';
function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <HelloWorld name="ShopAI" message="Chào mừng đến với" />
          <HelloWorld name="Developer" message="Xin chào" />
          <ProfileScreen />
          <ProductDetailScreen />
          <HomeScreen />
          {/* <AppNavigator />; */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default App;


// File: App.js
// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AppNavigator from 'src/navigation/AppNavigator';

// // Import AppNavigator bạn vừa tạo


// function App() {
//   return (
//     <SafeAreaProvider>
//       <AppNavigator />
//     </SafeAreaProvider>
//   );
// }

// export default App;