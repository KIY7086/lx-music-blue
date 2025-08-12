import { memo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { useTheme } from '@/store/theme/hook'
import { scaleSizeW } from '@/utils/pixelRatio'

interface IconProps extends SvgProps {
  size?: number
  rawSize?: number
  style?: StyleProp<ViewStyle>
  icon: (props: SvgProps) => JSX.Element
}

export const HeroIcon = memo(({ size = 20, rawSize, color, icon: IconComponent, ...props }: IconProps) => {
  const theme = useTheme()
  const iconSize = rawSize ?? scaleSizeW(size)
  const iconColor = color ?? theme['c-font']

  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      color={iconColor}
      {...props}
    />
  )
})
