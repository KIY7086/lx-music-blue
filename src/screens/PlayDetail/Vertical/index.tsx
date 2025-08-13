import { memo, useState, useRef, useMemo } from 'react'
import { View, PanResponder, Animated } from 'react-native'

import Header from './components/Header'
// import Aside from './components/Aside'
// import Main from './components/Main'
import Player from './Player'
import PagerView, { type PagerViewOnPageSelectedEvent, type PagerViewOnPageScrollEvent } from 'react-native-pager-view'
import Pic from './Pic'
import Lyric from './Lyric'
import { useScreenKeepAwake } from '../hooks'
import { createStyle } from '@/utils/tools'
import { pop } from '@/navigation'
import commonState from '@/store/common/state'
// import { useTheme } from '@/store/theme/hook'

const LyricPage = ({ activeIndex }: { activeIndex: number }) => {
  const initedRef = useRef(false)
  const lyric = useMemo(() => <Lyric />, [])
  switch (activeIndex) {
    // case 3:
    case 1:
      if (!initedRef.current) initedRef.current = true
      return lyric
    default:
      return initedRef.current ? lyric : null
  }
  // return activeIndex == 0 || activeIndex == 1 ? setting : null
}

// global.iskeep = false
export default memo(({ componentId }: { componentId: string }) => {
  // const theme = useTheme()
  const [pageIndex, setPageIndex] = useState(0)
  const [isKeepAwake, setIsKeepAwake] = useState(false)
  const [pageScrollState, setPageScrollState] = useState<'idle' | 'dragging' | 'settling'>('idle')
  const pagerViewRef = useRef<PagerView>(null)
  useScreenKeepAwake(isKeepAwake)

  const close = () => {
    void pop(commonState.componentIds.playDetail!)
  }

  const onPageSelected = ({ nativeEvent }: PagerViewOnPageSelectedEvent) => {
    const index = nativeEvent.position
    setPageIndex(index)
    setIsKeepAwake(index === 1)
  }
  const onPageScroll = (event: PagerViewOnPageScrollEvent) => {
    if (event.nativeEvent.offset === 0) {
      setPageScrollState('idle')
    } else {
      setPageScrollState('dragging')
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <Header pageIndex={pageIndex} onClose={close} />
      <View style={styles.container}>
        <PagerView
          ref={pagerViewRef}
          onPageSelected={onPageSelected}
          // onPageScrollStateChanged={onPageScrollStateChanged}
          style={styles.pagerView}
        >
          <View collapsable={false}>
            <Pic componentId={componentId} />
          </View>
          <View collapsable={false}>
            <LyricPage activeIndex={pageIndex} />
          </View>
        </PagerView>
        <Player />
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20, // 增加水平内边距
    paddingBottom: 20, // 增加底部内边距
  },
  pagerView: {
    flex: 1,
  },
})
