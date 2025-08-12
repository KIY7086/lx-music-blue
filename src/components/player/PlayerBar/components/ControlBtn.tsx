import { TouchableOpacity } from 'react-native'
import { HeroIcon } from '@/components/common/HeroIcon'
import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from 'react-native-heroicons/outline'
import { useIsPlay } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { createStyle } from '@/utils/tools'
import { useHorizontalMode } from '@/utils/hooks'

const BTN_SIZE = 24
const handlePlayPrev = () => {
  void playPrev()
}
const handlePlayNext = () => {
  void playNext()
}

const PlayPrevBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.cotrolBtn} activeOpacity={0.5} onPress={handlePlayPrev}>
      <HeroIcon icon={BackwardIcon} color={theme['c-button-font']} size={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const PlayNextBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.cotrolBtn} activeOpacity={0.5} onPress={handlePlayNext}>
      <HeroIcon icon={ForwardIcon} color={theme['c-button-font']} size={BTN_SIZE} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = () => {
  const isPlay = useIsPlay()
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.cotrolBtn} activeOpacity={0.5} onPress={togglePlay}>
      <HeroIcon icon={isPlay ? PauseIcon : PlayIcon} color={theme['c-button-font']} size={BTN_SIZE} />
    </TouchableOpacity>
  )
}

export default () => {
  const isHorizontalMode = useHorizontalMode()
  return (
    <>
      {/* {btnPrev} */}
      { isHorizontalMode ? <PlayPrevBtn /> : null }
      <TogglePlayBtn />
      <PlayNextBtn />
    </>
  )
}


const styles = createStyle({
  cotrolBtn: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',

    // backgroundColor: '#ccc',
    shadowOpacity: 1,
    textShadowRadius: 1,
  },
})
