import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { isIOS, isAndroid } from '@utils/platform';
export const PlatformSpecific: React.FC = () => {
  return (
    <View style={styles.container}>
      {isIOS && (
        <Text style={styles.text}>
          🍎 Bạn đang chạy trên iOS
        </Text>
      )}
      {isAndroid && (
        <Text style={styles.text}>
          🤖 Bạn đang chạy trên Android
        </Text>
      )}
      <Text style={styles.text}>
        Platform: {Platform.OS}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : '#e0e0e0',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: Platform.OS === 'ios' ? '#000' : '#333',
    marginVertical: 5,
  },
});
