// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // Bắt lỗi và cập nhật state để hiển thị UI Fallback
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Log lỗi (có thể gửi lên server)
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Lỗi bắt được bởi ErrorBoundary:", error, errorInfo);
  }

  // Hàm xử lý khi bấm nút "Thử lại"
  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // UI Fallback khi có lỗi
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.errorText}>Ôi hỏng! Đã xảy ra lỗi khi render.</Text>
          <Button title="Thử lại" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    padding: 20,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ErrorBoundary;