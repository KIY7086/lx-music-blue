import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface DownArrowIconProps {
  size?: number
  color?: string
}

export default function DownArrowIcon({ size = 50, color = '#000' }: DownArrowIconProps) {
  return (
    <Svg
      width={size}
      height={size * 0.25} // 保持原始宽高比
      viewBox="0 0 800 200"
      fill="none"
    >
      <Path
        d="M 50 50 L 400 150 L 750 50"
        fill="none"
        stroke={color}
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}