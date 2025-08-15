import { updateSetting } from '@/core/common'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { memo } from 'react'
import { View } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'

import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const homePageScroll = useSettingValue('common.homePageScroll')
  const setHomePageScroll = (homePageScroll: boolean) => {
    updateSetting({ 'common.homePageScroll': homePageScroll })
  }

  return (
    <View style={styles.content}>
      <SettingSwitch
        label={t('setting_basic_home_page_scroll')}
        value={homePageScroll}
        onValueChange={setHomePageScroll}
      />
    </View>
  )
})

const styles = createStyle({
  content: {
    marginTop: 5,
  },
})
