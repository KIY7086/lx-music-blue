import { memo, useState, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import Text from '@/components/common/Text'
import SubTitle from '../../components/SubTitle'
import SettingRadioGroup from '../../components/SettingRadioGroup'

const darkThemes = [
  { id: 'libadwaita_dark', name: 'theme_libadwaita_dark' },
  { id: 'black', name: 'theme_black' },
]

export default memo(() => {
  const t = useI18n()
  const darkId = useSettingValue('theme.darkId')
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

  const options = useMemo(() => darkThemes.map(({ id, name }) => ({
    label: t(name as any),
    value: id,
  })), [t])

  const handleSelect = (id: string) => {
    import('@/core/theme').then(({ setDarkTheme }) => {
      setDarkTheme(id)
    })
  }

  if (!isReady) return null
  if (!autoTheme) return null

  return (
      <View>
        <SettingRadioGroup
          label={t('setting_theme_dark_theme' as any)}
          options={options}
          value={darkId}
          onValueChange={handleSelect}
        />
      </View>
  )
})