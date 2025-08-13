import { TouchableOpacity } from 'react-native'
import { HeroIcon } from '@/components/common/HeroIcon'
import type { SvgProps } from 'react-native-svg'
import { createStyle } from '@/utils/tools'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT as _HEADER_HEIGHT } from '@/config/constant'

export const HEADER_HEIGHT = scaleSizeH(_HEADER_HEIGHT)

export default ({ icon, color, onPress }: {
  icon: (props: SvgProps) => JSX.Element
  color?: string
  onPress: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.button, width: HEADER_HEIGHT }}>
      <HeroIcon icon={icon} color={color} size={24} />
    </TouchableOpacity>
  )
}

const styles = createStyle({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 0,
  },
})
