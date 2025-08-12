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
  const position = useRef(new Animated.Value(0)).current
  const transform = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 只在水平滑动距离大于垂直滑动距离时响应，避免拦截垂直滚动
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderMove: (evt, gestureState) => {
        // 移除垂直滑动动画逻辑
        // 只处理水平滑动，不进行任何操作，因为 PagerView 会处理
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 移除垂直滑动退出逻辑和动画
        if (Math.abs(gestureState.dx) > 50) { // 仅处理水平滑动
          if (gestureState.dx > 0) {
            pagerViewRef.current?.setPage(0)
          } else {
            pagerViewRef.current?.setPage(1)
          }
        }
      },
    }),
  ).current
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
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateY: transform }],
        opacity,
      }}
      {...panResponder.panHandlers}
    >
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
    </Animated.View>
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
