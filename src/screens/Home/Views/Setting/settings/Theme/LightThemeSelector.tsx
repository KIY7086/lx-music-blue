import { memo, useState, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import Text from '@/components/common/Text'
import SubTitle from '../../components/SubTitle'
import SettingRadioGroup from '../../components/SettingRadioGroup'

const lightThemes = [
  { id: 'libadwaita_light', name: 'theme_libadwaita_light' },
  { id: 'green', name: 'theme_green' },
  { id: 'blue', name: 'theme_blue' },
  { id: 'blue_plus', name: 'theme_blue_plus' },
  { id: 'orange', name: 'theme_orange' },
  { id: 'brown', name: 'theme_brown' },
  { id: 'red', name: 'theme_red' },
  { id: 'pink', name: 'theme_pink' },
  { id: 'purple', name: 'theme_purple' },
  { id: 'grey', name: 'theme_grey' },
  { id: 'ming', name: 'theme_ming' },
  { id: 'blue2', name: 'theme_blue2' },
  { id: 'china_ink', name: 'theme_china_ink' },
  { id: 'mid_autumn', name: 'theme_mid_autumn' },
  { id: 'naruto', name: 'theme_naruto' },
  { id: 'happy_new_year', name: 'theme_happy_new_year' },
]

export default memo(() => {
  const t = useI18n()
  const lightId = useSettingValue('theme.lightId')
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

  const options = useMemo(() => lightThemes.map(({ id, name }) => ({
    label: t(name as any),
    value: id,
  })), [t])

  const handleSelect = (id: string) => {
    import('@/core/theme').then(({ setLightTheme }) => {
      setLightTheme(id)
    })
  }

  if (!isReady) return null
  if (!autoTheme) return null

  return (
      <View>
        <SettingRadioGroup
          label={t('setting_theme_light_theme' as any)}
          options={options}
          value={lightId}
          onValueChange={handleSelect}
        />
      </View>
  )
})