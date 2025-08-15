import { memo } from 'react'
import { ScrollView } from 'react-native'
import Language from './Language'
import FontSize from './FontSize'
import ShareType from './ShareType'
import IsStartupAutoPlay from './IsStartupAutoPlay'
import IsStartupPushPlayDetailScreen from './IsStartupPushPlayDetailScreen'
import IsAutoHidePlayBar from './IsAutoHidePlayBar'
import IsHomePageScroll from './IsHomePageScroll'
import IsUseSystemFileSelector from './IsUseSystemFileSelector'
import IsAlwaysKeepStatusbarHeight from './IsAlwaysKeepStatusbarHeight'
import DrawerLayoutPosition from './DrawerLayoutPosition'
import ThemeSettings from '../Theme'
import { useI18n } from '@/lang'

export default memo(() => {
  const t = useI18n()

  return (
    <ScrollView>
        <IsStartupAutoPlay />
        <IsStartupPushPlayDetailScreen />
        <IsAutoHidePlayBar />
        <IsHomePageScroll />
        <IsUseSystemFileSelector />
        <IsAlwaysKeepStatusbarHeight />
        <DrawerLayoutPosition />
        <Language />
        <FontSize />
        <ShareType />
        <ThemeSettings />
    </ScrollView>
  )
})
