import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { memo } from 'react'
import { View } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'


import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const val = useSettingValue('common.useSystemFileSelector')
  const update = (useSystemFileSelector: boolean) => {
    updateSetting({ 'common.useSystemFileSelector': useSystemFileSelector })
  }

  return (
    <View style={styles.content}>
      <SettingSwitch
        label={t('setting_basic_use_system_file_selector')}
        description={t('setting_basic_use_system_file_selector_tip')}
        value={val}
        onValueChange={update}
      />
    </View>
  )
})


const styles = createStyle({
  content: {
    marginTop: 5,
    // marginBottom: 15,
  },
})
