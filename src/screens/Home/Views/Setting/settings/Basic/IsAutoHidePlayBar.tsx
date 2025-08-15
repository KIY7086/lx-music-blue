import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { memo } from 'react'
import { View } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'

import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const autoHidePlayBar = useSettingValue('common.autoHidePlayBar')
  const setAutoHidePlayBar = (autoHidePlayBar: boolean) => {
    updateSetting({ 'common.autoHidePlayBar': autoHidePlayBar })
  }

  return (
    <View style={styles.content}>
      <SettingSwitch
        label={t('setting_basic_auto_hide_play_bar')}
        value={autoHidePlayBar}
        onValueChange={setAutoHidePlayBar}
      />
    </View>
  )
})

const styles = createStyle({
  content: {
    marginTop: 5,
  },
})
