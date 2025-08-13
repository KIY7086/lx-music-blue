import { memo, useRef } from 'react'

import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { pop } from '@/navigation'
import StatusBar from '@/components/common/StatusBar'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT as _HEADER_HEIGHT, NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import commonState from '@/store/common/state'
import SettingPopup, { type SettingPopupType } from '../../components/SettingPopup'
import { useStatusbarHeight } from '@/store/common/hook'
import Btn from './Btn'
import TimeoutExitBtn from './TimeoutExitBtn'
import { EllipsisVerticalIcon } from 'react-native-heroicons/outline'
import DownArrowIcon from '@/components/common/DownArrowIcon'
import { useTheme } from '@/store/theme/hook'

export const HEADER_HEIGHT = scaleSizeH(_HEADER_HEIGHT)

const Title = () => {
  const theme = useTheme()
  return (
    <View style={styles.titleContent}>
      <DownArrowIcon size={50} color={theme['c-primary-alpha-300']} />
    </View>
  )
}

export default memo(({ pageIndex, onClose }: { pageIndex: number, onClose: () => void }) => {
  const popupRef = useRef<SettingPopupType>(null)
  const statusBarHeight = useStatusbarHeight()

  const back = () => {
    void pop(commonState.componentIds.playDetail!)
  }
  const showSetting = () => {
    popupRef.current?.show()
  }

  return (
    <TouchableOpacity style={{ height: HEADER_HEIGHT + statusBarHeight, paddingTop: statusBarHeight }} onPress={onClose}>
      <View style={{ flex: 1 }} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_header}>
        <StatusBar />
        <View style={styles.container}>
          <TimeoutExitBtn />
          <Title />
          <Btn icon={EllipsisVerticalIcon} onPress={showSetting} />
        </View>
        <SettingPopup ref={popupRef} direction="vertical" />
      </View>
    </TouchableOpacity>
  )
})


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    alignItems: 'center',
    paddingHorizontal: 24, // 增加左右padding
    paddingTop: 10,
  },
  titleContent: {
    flex: 1,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  icon: {
    paddingLeft: 4,
    paddingRight: 4,
  },
})
