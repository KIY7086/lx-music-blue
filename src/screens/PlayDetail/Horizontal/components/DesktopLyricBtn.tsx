import Btn from './Btn'
import { useSettingValue } from '@/store/setting/hook'
import DesktopLyricEnable, { type DesktopLyricEnableType } from '@/components/DesktopLyricEnable'
import { memo, useRef } from 'react'
import { toggleDesktopLyricLock } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'
import settingState from '@/store/setting/state'
import { MusicalNoteIcon, MusicalNoteIcon as MusicalNoteIconOutline } from 'react-native-heroicons/outline'
import { MusicalNoteIcon as MusicalNoteIconSolid } from 'react-native-heroicons/solid'

export default memo(() => {
  const enabledLyric = useSettingValue('desktopLyric.enable')
  const desktopLyricEnableRef = useRef<DesktopLyricEnableType>(null)
  const update = () => {
    desktopLyricEnableRef.current?.setEnabled(!enabledLyric)
  }
  const updateLock = () => {
    const isLock = !settingState.setting['desktopLyric.isLock']
    void toggleDesktopLyricLock(isLock).then(() => {
      updateSetting({ 'desktopLyric.isLock': isLock })
    })
  }

  const LyricIcon = enabledLyric ? MusicalNoteIconSolid : MusicalNoteIconOutline

  return (
    <>
      <Btn icon={LyricIcon} onPress={update} onLongPress={updateLock} />
      <DesktopLyricEnable ref={desktopLyricEnableRef} />
    </>
  )
})
