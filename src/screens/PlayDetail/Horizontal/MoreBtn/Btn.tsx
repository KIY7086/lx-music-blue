import { TouchableOpacity } from 'react-native'
import { HeroIcon } from '@/components/common/HeroIcon'
import type { SvgProps } from 'react-native-svg'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { scaleSizeW } from '@/utils/pixelRatio'

export const BTN_WIDTH = scaleSizeW(32)
export const BTN_ICON_SIZE = 22

export default ({ icon, color, onPress }: {
  icon: (props: SvgProps) => JSX.Element
  color?: string
  onPress: () => void
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity style={{ ...styles.cotrolBtn, width: BTN_WIDTH, height: BTN_WIDTH }} activeOpacity={0.5} onPress={onPress}>
      <HeroIcon icon={icon} color={color ?? theme['c-font-label']} size={BTN_ICON_SIZE} />
    </TouchableOpacity>
  )
}

const styles = createStyle({
  cotrolBtn: {
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor: '#ccc',
    shadowOpacity: 1,
    textShadowRadius: 1,
  },
})
