import { memo, useState, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import Text from '@/components/common/Text'
import SubTitle from '../../components/SubTitle'
import SettingRadioGroup from '../../components/SettingRadioGroup'

const allThemes = [
  { id: 'libadwaita_light', name: 'theme_libadwaita_light', isDark: false },
  { id: 'libadwaita_dark', name: 'theme_libadwaita_dark', isDark: true },
  { id: 'green', name: 'theme_green', isDark: false },
  { id: 'blue', name: 'theme_blue', isDark: false },
  { id: 'blue_plus', name: 'theme_blue_plus', isDark: false },
  { id: 'orange', name: 'theme_orange', isDark: false },
  { id: 'brown', name: 'theme_brown', isDark: false },
  { id: 'red', name: 'theme_red', isDark: false },
  { id: 'pink', name: 'theme_pink', isDark: false },
  { id: 'purple', name: 'theme_purple', isDark: false },
  { id: 'grey', name: 'theme_grey', isDark: false },
  { id: 'ming', name: 'theme_ming', isDark: false },
  { id: 'blue2', name: 'theme_blue2', isDark: false },
  { id: 'black', name: 'theme_black', isDark: true },
  { id: 'china_ink', name: 'theme_china_ink', isDark: false },
  { id: 'mid_autumn', name: 'theme_mid_autumn', isDark: false },
  { id: 'naruto', name: 'theme_naruto', isDark: false },
  { id: 'happy_new_year', name: 'theme_happy_new_year', isDark: false },
]

export default memo(() => {
  const t = useI18n()
  const themeId = useSettingValue('theme.id')
  const autoTheme = useSettingValue('theme.autoTheme')
  const [isReady, setIsReady] = useState(false)

  // 修复：确保设置状态完全加载后再进行渲染判断
  useEffect(() => {
    // 延迟一帧渲染，确保状态同步完成
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const options = useMemo(() => allThemes.map(({ id, name }) => ({
    label: t(name as any),
    value: id,
  })), [t])

  const handleSelect = (id: string) => {
    // 使用setTheme来同时更新设置和应用主题
    import('@/core/theme').then(({ setTheme }) => {
      setTheme(id)
    })
  }

  if (!isReady) return null
  if (autoTheme) return null

  return (
      <View>
        <SettingRadioGroup
          label={t('setting_basic_theme')}
          options={options}
          value={themeId}
          onValueChange={handleSelect}
        />
      </View>
  )
})