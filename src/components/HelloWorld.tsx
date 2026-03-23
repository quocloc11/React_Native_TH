import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Định nghĩa props với TypeScript
interface HelloWorldProps {
  name?: string;
  message?: string;
}
// Component với TypeScript
export const HelloWorld: React.FC<HelloWorldProps> = ({
  name = 'React Native',
  message = 'Hello',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {message}, {name}!
      </Text>
    </View>
  );
};

// Style với StyleSheet
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
