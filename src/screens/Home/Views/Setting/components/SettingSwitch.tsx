import { memo, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

/**
 * 一个模仿 iOS 原生外观和感觉的自定义动画开关组件。
 */
const AppleStyleSwitch = memo(({ value }: { value: boolean }) => {
  const theme = useTheme()
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current

  // 动态测量 track 和 thumb 的尺寸，用于计算 absolute 定位
  const [trackWidth, setTrackWidth] = useState<number | null>(null)
  const [trackHeight, setTrackHeight] = useState<number | null>(null)
  const [thumbWidth, setThumbWidth] = useState<number | null>(null)
  const [thumbHeight, setThumbHeight] = useState<number | null>(null)

  const paddingHorizontal = 2 // 与样式中的 paddingHorizontal 保持一致
  const initializedRef = useRef(false)

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // left/top 和 backgroundColor 不能用 native driver
    }).start()
  }, [value, animatedValue])

  // 当 track/thumb 的尺寸首次测量完成后，将 animatedValue 同步到当前 value（只执行一次），避免测量抖动
  useEffect(() => {
    if (!initializedRef.current && trackWidth != null && thumbWidth != null) {
      // 使用 setValue 直接设置状态，避免触发短时动画引起视觉抖动
      animatedValue.setValue(value ? 1 : 0)
      initializedRef.current = true
    }
  }, [trackWidth, thumbWidth, value, animatedValue])


  // 背景颜色插值
  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme['c-primary-alpha-500'], theme['c-primary']],
  })

  // 计算 left 的范围：从 padding 到 (trackWidth - thumbWidth - padding)
  const maxLeft =
    trackWidth != null && thumbWidth != null
      ? Math.max(paddingHorizontal, trackWidth - thumbWidth - paddingHorizontal)
      : 20 // fallback

  const minLeft = paddingHorizontal

  // 使用 translateX 动画（基于静态 left），避免频繁布局和抖动
  const translateRange =
    trackWidth != null && thumbWidth != null ? Math.max(0, maxLeft - minLeft) : 18

  const thumbTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, translateRange],
  })

  // 计算垂直居中 top 偏移（如果已测量到高度）
  const topOffset =
    trackHeight != null && thumbHeight != null
      ? Math.max(0, (trackHeight - thumbHeight) / 2)
      : 2

  return (
    <Animated.View
      style={[styles.switchTrack, { backgroundColor: trackColor }]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout
        // 仅在未初始化且尺寸首次测量或变化超过阈值时更新，避免动画过程中由于字体缩放带来的微小抖动
        if (width && !initializedRef.current && (trackWidth == null || Math.abs(width - trackWidth) > 1.5)) {
          setTrackWidth(width)
        }
        if (height && !initializedRef.current && (trackHeight == null || Math.abs(height - trackHeight) > 1.5)) {
          setTrackHeight(height)
        }
      }}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          {
            backgroundColor: '#ffffff',
            position: 'absolute',
            left: minLeft, // 固定基础 left，由 translateX 处理移动
            top: topOffset,
            transform: [{ translateX: thumbTranslate }],
          },
        ]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout
          // 仅在未初始化且尺寸首次测量或差异较大时更新，避免在动画位移过程中误触发更新
          if (width && !initializedRef.current && (thumbWidth == null || Math.abs(width - thumbWidth) > 1.5)) {
            setThumbWidth(width)
          }
          if (height && !initializedRef.current && (thumbHeight == null || Math.abs(height - thumbHeight) > 1.5)) {
            setThumbHeight(height)
          }
        }}
      />
    </Animated.View>
  )
})

/**
 * 苹果设计风格的设置项 - 开关类型
 */
export interface SettingSwitchProps {
  label: string
  description?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

export default memo(({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: SettingSwitchProps) => {
  const theme = useTheme()

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TouchableOpacity
        style={[styles.content]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.label, { color: theme['c-font'] }]}>{label}</Text>
        <AppleStyleSwitch value={value} />
      </TouchableOpacity>
      {description && (
        <Text style={[styles.description, { color: theme['c-font-label'] }]}>
          {description}
        </Text>
      )}
    </View>
  )
})

const styles = createStyle({
  container: {
    paddingHorizontal: 8,
    marginVertical: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 10,
    minHeight: 40, // 垂直方向不变，只恢复左右内边距
  },
  label: {
    fontSize: 17,
    flexShrink: 1, // 确保长文本不会将开关推出视图
    paddingRight: 8,
  },
  description: {
    paddingTop: 2,
    fontSize: 13,
    marginTop: 0,
    paddingHorizontal: 8,
    lineHeight: 14,
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  // AppleStyleSwitch 的样式
  switchTrack: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    justifyContent: 'center',
    paddingHorizontal: 2, // 保持与滑块起始偏移一致，方便通过 translateX 计算
  },
  switchThumb: {
    position: 'absolute',
    width: 27,
    height: 27,
    borderRadius: 13.5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
})