import { memo, useMemo, useState, useCallback } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useKeyboard } from '@/utils/hooks'
import { COMPONENT_IDS } from '@/config/constant'
import { usePageVisible } from '@/store/common/hook'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'

import Pic from './components/Pic'
import Title from './components/Title'
import Status from './components/Status'
import ControlBtn from './components/ControlBtn'
import Progress from '@/components/player/Progress'
import { useProgress } from '@/store/player/hook'
import { useBufferProgress } from '@/plugins/player'
import { createStyle } from '@/utils/tools'
import { setProgress } from '@/core/player/progress'
// import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'
import { useSettingValue } from '@/store/setting/hook'


export default memo(({ isHome = false }: { isHome?: boolean }) => {
  // const { onLayout, ...layout } = useLayout()
  const { keyboardShown } = useKeyboard()
  const theme = useTheme()
  const autoHidePlayBar = useSettingValue('common.autoHidePlayBar')
  const { progress, maxPlayTime } = useProgress()
  const buffered = useBufferProgress()
  const [autoUpdate, setAutoUpdate] = useState(true)
  usePageVisible([COMPONENT_IDS.home], useCallback((visible) => {
    if (isHome) setAutoUpdate(visible)
  }, [isHome]))

  const handleProgressChange = (time: number) => {
    setProgress(time, maxPlayTime)
  }

  const musicInfo = usePlayerMusicInfo()
  const handlePress = () => {
    if (!musicInfo.id) return
    navigations.pushPlayDetailScreen(commonState.componentIds.home!)
  }

  const playerComponent = useMemo(() => (
    <View style={{ ...styles.container, borderTopColor: theme['c-200'], backgroundColor: theme['c-primary-light-900'] }}>
      <View style={styles.progress}>
        <Progress progress={progress} duration={maxPlayTime} buffered={buffered} onSlidingComplete={handleProgressChange} />
      </View>
      <TouchableOpacity style={styles.left} onPress={handlePress} activeOpacity={0.7}>
        <Pic isHome={isHome} />
        <View style={styles.center}>
          <Title isHome={isHome} />
        </View>
      </TouchableOpacity>
      <View style={styles.right}>
        <ControlBtn />
      </View>
    </View>
  ), [theme, isHome, musicInfo, progress, maxPlayTime, buffered, handleProgressChange])

  // console.log('render pb')

  return autoHidePlayBar && keyboardShown ? null : playerComponent
})


const styles = createStyle({
  container: {
    width: '100%',
    height: 72,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  left: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
  },
  center: {
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
    // height: 48,
    // backgroundColor: 'rgba(0, 0, 0, .1)',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    paddingLeft: 10,
    paddingRight: 0,
  },
  // row: {
  //   flexDirection: 'row',
  //   flexGrow: 0,
  //   flexShrink: 0,
  // },
})
