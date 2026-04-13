import React, { useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import {
  X, AlertCircle, ChevronRight, User,
  CheckCircle2, Info, Heart, Loader2
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Màu sắc mặc định cho hệ thống linh kiện
const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  dark: '#0f172a',
  textMain: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  white: '#ffffff',
  background: '#f8fafc',
  blueLight: '#eff6ff',
};

// --- 1. SKELETON LOADING ANIMATION ---
// Hiệu ứng nhấp nháy giả lập đang tải dữ liệu
export const SkeletonItem = ({ style }) => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.skeleton, style, { opacity: animatedValue }]} />;
};

// --- 2. CUSTOM BUTTON VỚI MICRO-INTERACTION (Scale) ---
// Hỗ trợ: Variants, Sizes, Loading, Disabled, Icons, Scale Animation
export const CustomButton = memo(({
  title, onPress, variant = 'primary', size = 'md',
  icon: Icon, loading, disabled, fullWidth, style
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const getStyles = () => {
    let bgColor = COLORS.dark;
    let textColor = COLORS.white;
    let borderWidth = 0;
    let borderColor = 'transparent';

    if (variant === 'secondary') { bgColor = COLORS.primary; }
    if (variant === 'outline') {
      bgColor = 'transparent';
      textColor = COLORS.dark;
      borderWidth = 1.5;
      borderColor = COLORS.border;
    }
    if (variant === 'ghost') { bgColor = 'transparent'; textColor = COLORS.textMuted; }

    return { bgColor, textColor, borderWidth, borderColor };
  };

  const config = getStyles();
  const heightSize = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: fullWidth ? '100%' : 'auto' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.btnBase,
          {
            backgroundColor: config.bgColor,
            height: heightSize,
            borderWidth: config.borderWidth,
            borderColor: config.borderColor,
          },
          disabled && styles.btnDisabled,
          style
        ]}
      >
        {loading ? (
          <ActivityIndicator color={config.textColor} />
        ) : (
          <View style={styles.rowCenter}>
            {Icon && <Icon size={size === 'sm' ? 16 : 20} color={config.textColor} style={{ marginRight: 8 }} />}
            <Text style={[styles.btnText, { color: config.textColor, fontSize: size === 'sm' ? 12 : 14 }]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- 3. CUSTOM INPUT COMPONENT ---
// Hỗ trợ: Label, Error, Helper text, Icons, Validation UI
export const CustomInput = memo(({
  label, error, helperText, icon: Icon, style, ...props
}) => (
  <View style={[styles.inputContainer, style]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={[styles.inputWrapper, error && styles.inputErrorBorder]}>
      {Icon && <Icon size={20} color={error ? COLORS.danger : COLORS.textLight} style={{ marginRight: 10 }} />}
      <TextInput
        style={styles.textInput}
        placeholderTextColor={COLORS.textLight}
        {...props}
      />
      {error && <AlertCircle size={18} color={COLORS.danger} />}
    </View>
    {error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : helperText ? (
      <Text style={styles.helperText}>{helperText}</Text>
    ) : null}
  </View>
));

// --- 4. ANIMATED MODAL (Slide up & Fade) ---
// Hỗ trợ: Backdrop, Animations, Close button, Custom content
export const CustomModal = ({ visible, onClose, title, children, footer }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: height, duration: 200, useNativeDriver: true })
      ]).start();
    }
  }, [visible]);

  if (!visible && opacityAnim._value === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalBackdrop, { opacity: opacityAnim }]}>
          <TouchableOpacity activeOpacity={1} style={styles.flex1} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>{children}</View>
          {footer && <View style={styles.modalFooter}>{footer}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
};

// --- 5. HEART BOUNCE INTERACTION ---
// Hiệu ứng trái tim nảy lên khi tương tác yêu thích
export const HeartButton = memo(({ isFav, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.favBtn}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Heart
          size={20}
          color={isFav ? COLORS.danger : COLORS.textLight}
          fill={isFav ? COLORS.danger : 'transparent'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

// --- 6. SUCCESS NOTIFICATION (Slide down) ---
// Thông báo phản hồi thành công trượt từ đỉnh màn hình
export const SuccessToast = memo(({ visible, message, onHide }) => {
  const posAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(posAnim, { toValue: 50, useNativeDriver: true, bounciness: 10 }).start();
      const timer = setTimeout(() => {
        Animated.timing(posAnim, { toValue: -100, duration: 300, useNativeDriver: true }).start(() => {
          if (onHide) onHide();
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY: posAnim }] }]}>
      <CheckCircle2 size={20} color={COLORS.white} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
});

// --- 7. CUSTOM BADGE COMPONENT ---
export const CustomBadge = ({ count, variant = 'danger' }) => {
  if (count <= 0) return null;
  const bg = variant === 'success' ? COLORS.success : variant === 'warning' ? COLORS.warning : COLORS.danger;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

// --- 8. CUSTOM AVATAR COMPONENT ---
export const CustomAvatar = ({ src, size = 'md', status = 'online' }) => {
  const dim = size === 'sm' ? 32 : size === 'lg' ? 80 : 48;
  return (
    <View style={{ width: dim, height: dim }}>
      <View style={[styles.avatarContainer, { borderRadius: dim / 2 }]}>
        {src ? (
          <Image source={{ uri: src }} style={styles.fullImg} />
        ) : (
          <User color={COLORS.textLight} size={dim * 0.5} />
        )}
      </View>
      {status && (
        <View style={[
          styles.statusDot,
          { backgroundColor: status === 'online' ? COLORS.success : COLORS.textLight }
        ]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  fullImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  skeleton: { backgroundColor: '#e2e8f0', borderRadius: 8 },

  // Button Styles
  btnBase: { borderRadius: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontWeight: 'bold' },

  // Input Styles
  inputContainer: { marginBottom: 16, width: '100%' },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    paddingHorizontal: 15,
    height: 52
  },
  inputErrorBorder: { borderColor: COLORS.danger, backgroundColor: '#fef2f2' },
  textInput: { flex: 1, color: COLORS.textMain, fontSize: 15 },
  errorText: { color: COLORS.danger, fontSize: 11, fontWeight: 'bold', marginTop: 6, marginLeft: 4 },
  helperText: { color: COLORS.textLight, fontSize: 11, marginTop: 6, marginLeft: 4 },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.6)' },
  modalContent: { backgroundColor: COLORS.white, width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textMain },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  modalBody: { padding: 20 },
  modalFooter: { padding: 20, backgroundColor: COLORS.background, flexDirection: 'row', gap: 12 },

  // Heart Style
  favBtn: { backgroundColor: COLORS.white, padding: 8, borderRadius: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },

  // Toast Styles
  toast: { position: 'absolute', top: 0, left: 20, right: 20, backgroundColor: COLORS.success, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 9999, elevation: 10 },
  toastText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },

  // Badge Styles
  badge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, position: 'absolute', top: -5, right: -5, borderWidth: 2, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },

  // Avatar Styles
  avatarContainer: { backgroundColor: '#f1f5f9', overflow: 'hidden', borderWidth: 2, borderColor: COLORS.white, elevation: 2, justifyContent: 'center', alignItems: 'center' },
  statusDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: COLORS.white, position: 'absolute', bottom: 0, right: 0 }
});