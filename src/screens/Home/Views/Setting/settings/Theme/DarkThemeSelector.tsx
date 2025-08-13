import { memo } from 'react'
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

const darkThemes = [
  { id: 'libadwaita_dark', name: 'theme_libadwaita_dark' },
  { id: 'black', name: 'theme_black' },
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
  const darkId = useSettingValue('theme.darkId')
  const autoTheme = useSettingValue('theme.autoTheme')

  const handleSelect = (id: string) => {
    import('@/core/theme').then(({ setDarkTheme }) => {
      setDarkTheme(id)
    })
  }

  if (!autoTheme) return null

  return (
    <SubTitle title={t('setting_theme_dark_theme' as any)}>
      <View style={styles.list}>
        {darkThemes.map(({ id, name }) => (
          <ThemeItem
            key={id}
            id={id}
            name={t(name as any)}
            isActive={darkId === id}
            onSelect={handleSelect}
          />
        ))}
      </View>
    </SubTitle>
  )
})