import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { memo } from 'react'
import { View } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'

import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const startupAutoPlay = useSettingValue('player.startupAutoPlay')
  const setStartupAutoPlay = (startupAutoPlay: boolean) => {
    updateSetting({ 'player.startupAutoPlay': startupAutoPlay })
  }

  return (
    <View style={styles.content}>
      <SettingSwitch
        label={t('setting_basic_startup_auto_play')}
        value={startupAutoPlay}
        onValueChange={setStartupAutoPlay}
      />
    </View>
  )
})

const styles = createStyle({
  content: {
    marginTop: 5,
  },
})
