import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
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
  const lightId = useSettingValue('theme.lightId')
  const autoTheme = useSettingValue('theme.autoTheme')

  const handleSelect = (id: string) => {
    import('@/core/theme').then(({ setLightTheme }) => {
      setLightTheme(id)
    })
  }

  if (!autoTheme) return null

  return (
    <SubTitle title={t('setting_theme_light_theme' as any)}>
      <View style={styles.list}>
        {lightThemes.map(({ id, name }) => (
          <ThemeItem
            key={id}
            id={id}
            name={t(name as any)}
            isActive={lightId === id}
            onSelect={handleSelect}
          />
        ))}
      </View>
    </SubTitle>
  )
})