import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { memo } from 'react'
import { View } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'


import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const val = useSettingValue('common.alwaysKeepStatusbarHeight')
  const update = (alwaysKeepStatusbarHeight: boolean) => {
    updateSetting({ 'common.alwaysKeepStatusbarHeight': alwaysKeepStatusbarHeight })
  }

  return (
    <View style={styles.content}>
      <SettingSwitch
        label={t('setting_basic_always_keep_statusbar_height')}
        description={t('setting_basic_always_keep_statusbar_height_tip')}
        value={val}
        onValueChange={update}
      />
    </View>
  )
})


const styles = createStyle({
  content: {
    marginTop: 5,
    marginBottom: 15,
  },
})
