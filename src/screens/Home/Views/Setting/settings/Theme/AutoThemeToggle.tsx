import { memo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import SettingSwitch from '../../components/SettingSwitch'

export default memo(() => {
  const t = useI18n()
  const autoTheme = useSettingValue('theme.autoTheme')

  const handleToggle = (value: boolean) => {
    updateSetting({ 'theme.autoTheme': value })
    setTimeout(() => {
      // 切换自动主题时立即应用当前系统主题
      void import('@/theme/themes').then(({ getTheme }) => {
        void getTheme().then(theme => {
          void import('@/core/theme').then(({ applyTheme }) => {
            applyTheme(theme)
          })
        })
      })
    }, 250) // 延迟时间应与动画时间一致
  }

  return (
    <SettingSwitch
      label={t('setting_basic_theme_auto_theme')}
      value={autoTheme}
      onValueChange={handleToggle}
    />
  )
})