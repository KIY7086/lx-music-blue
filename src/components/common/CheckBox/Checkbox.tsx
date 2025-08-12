import * as React from 'react'
import {
  Animated,
  type GestureResponderEvent,
  StyleSheet,
  View,
  Pressable,
} from 'react-native'

import { HeroIcon } from '@/components/common/HeroIcon'
import { StopIcon, CheckIcon, MinusIcon } from 'react-native-heroicons/outline'
import { createStyle } from '@/utils/tools'
import { scaleSizeW } from '@/utils/pixelRatio'

export interface Props {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate'
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void

  size?: number

  /**
   * Custom color for checkbox.
   */
  tintColors: {
    true: string
    false: string
  }
}

const ANIMATION_DURATION = 200

/**
 * Checkboxes allow the selection of multiple options from a set.
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 */
const Checkbox = ({
  status,
  disabled,
  size = 1,
  onPress,
  tintColors,
  ...rest
}: Props) => {
  const checked = status === 'checked'
  const indeterminate = status === 'indeterminate'

  const { current: scaleAnim } = React.useRef<Animated.Value>(
    new Animated.Value(checked ? 1 : 0),
  )

  const isFirstRendering = React.useRef<boolean>(true)


  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false
      return
    }

    Animated.timing(scaleAnim, {
      toValue: checked ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start()
  }, [checked, scaleAnim])

  const outerSize = 26 * size

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked }}
      accessibilityLiveRegion="polite"
      style={styles.container}
    >
      <View style={{ width: outerSize, height: outerSize, alignItems: 'center', justifyContent: 'center' }}>
        <HeroIcon
          icon={StopIcon}
          size={outerSize}
          color={tintColors.false}
        />
        <Animated.View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', transform: [{ scale: scaleAnim }] }}>
          <View style={{
            width: outerSize * 0.6,
            height: outerSize * 0.6,
            backgroundColor: tintColors.true,
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {indeterminate ? (
              <HeroIcon icon={MinusIcon} size={outerSize * 0.6} color="#fff" />
            ) : (
              <HeroIcon icon={CheckIcon} size={outerSize * 0.6} color="#fff" />
            )}
          </View>
        </Animated.View>
      </View>
    </Pressable>
  )
}

Checkbox.displayName = 'Checkbox'

const styles = createStyle({
  container: {
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
})

export default Checkbox
