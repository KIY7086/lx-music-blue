import { memo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { updateSetting } from '@/core/common'
import Text from '@/components/common/Text'
import CheckBox from '@/components/common/CheckBox'
import SubTitle from '../../components/SubTitle'

const styles = createStyle({
  container: {
    paddingVertical: 8,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  item: {
    marginRight: 12,
    marginBottom: 8,
  },
})

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

const ThemeItem = ({ id, name, isActive, onSelect }: {
  id: string
  name: string
  isActive: boolean
  onSelect: (id: string) => void
}) => {
  return (
    <CheckBox
      marginRight={8}
      check={isActive}
      label={name}
      onChange={() => onSelect(id)}
      need
    />
  )
}

export default memo(() => {
  const t = useI18n()
  const themeId = useSettingValue('theme.id')
  const autoTheme = useSettingValue('theme.autoTheme')

  const handleSelect = (id: string) => {
    // 使用setTheme来同时更新设置和应用主题
    import('@/core/theme').then(({ setTheme }) => {
      setTheme(id)
    })
  }

  if (autoTheme) return null

  return (
    <SubTitle title={t('setting_basic_theme')}>
      <View style={styles.list}>
        {allThemes.map(({ id, name }) => (
          <ThemeItem
            key={id}
            id={id}
            name={t(name as any)}
            isActive={themeId === id}
            onSelect={handleSelect}
          />
        ))}
      </View>
    </SubTitle>
  )
})