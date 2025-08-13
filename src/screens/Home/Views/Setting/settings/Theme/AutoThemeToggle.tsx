import { memo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import CheckBox from '@/components/common/CheckBox'
import Text from '@/components/common/Text'

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 14,
  },
})

export default memo(() => {
  const t = useI18n()
  const autoTheme = useSettingValue('theme.autoTheme')

  const handleToggle = () => {
    updateSetting({ 'theme.autoTheme': !autoTheme })
    // 切换自动主题时立即应用当前系统主题
    import('@/theme/themes').then(({ getTheme }) => {
      void getTheme().then(theme => {
        import('@/core/theme').then(({ applyTheme }) => {
          applyTheme(theme)
        })
      })
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('setting_basic_theme_auto_theme')}</Text>
      <CheckBox
        check={autoTheme}
        onChange={handleToggle}
      />
    </View>
  )
})