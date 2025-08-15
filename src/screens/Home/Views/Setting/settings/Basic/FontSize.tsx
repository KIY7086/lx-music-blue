import { memo, useMemo, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import { useI18n } from '@/lang'
import { setFontSize } from '@/core/common'
import { useFontSize } from '@/store/common/hook'
import Text from '@/components/common/Text'
import { getTextSize } from '@/utils/pixelRatio'
import { useTheme } from '@/store/theme/hook'

const FONT_SIZES = [0.8, 0.9, 1.0, 1.1, 1.2] as const // 五段字体大小

type SIZE_TYPE = typeof FONT_SIZES[number]

const SizeText = () => {
  const size = getTextSize(14) * useFontSize()
  const t = useI18n()
  const theme = useTheme()

  return <Text style={{ fontSize: size }} color={theme['c-primary']}>{t('setting_basic_font_size_preview')}</Text>
}

export default memo(() => {
  const t = useI18n()
  const currentSize = useFontSize()
  const theme = useTheme()

  const handleSizeChange = (value: number) => {
    const index = Math.round(value * (FONT_SIZES.length - 1))
    setFontSize(FONT_SIZES[index] as SIZE_TYPE)
  }

  const sliderValue = useMemo(() => {
    const index = FONT_SIZES.indexOf(currentSize as SIZE_TYPE)
    return index === -1 ? 0 : index / (FONT_SIZES.length - 1)
  }, [currentSize])

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <SizeText />
      </View>
      <View style={styles.sliderContainer}>
        <Text style={[styles.label, { color: theme['c-font'] }]}>{t('setting_basic_font_size')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={1 / (FONT_SIZES.length - 1)} // 五段，所以步长为 1/4
          value={sliderValue}
          onSlidingComplete={handleSizeChange}
          minimumTrackTintColor={theme['c-primary']}
          maximumTrackTintColor={theme['c-border-background']}
          thumbTintColor={theme['c-primary']}
        />
        <View style={styles.sliderLabels}>
          {FONT_SIZES.map((size, index) => (
            <Text key={index} style={[styles.sliderLabel, { color: theme['c-font-label'] }]}>
              {`${Math.round(size * 100)}%`}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  preview: {
    justifyContent: 'center',
    paddingBottom: 10,
    height: 45,
  },
  sliderContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: -10,
  },
  sliderLabel: {
    fontSize: 12,
  },
})
