import { memo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import Section from '../../components/Section'
import AutoThemeToggle from './AutoThemeToggle'
import LightThemeSelector from './LightThemeSelector'
import DarkThemeSelector from './DarkThemeSelector'
import AllThemeSelector from './AllThemeSelector'

const styles = createStyle({
  container: {
    paddingBottom: 16,
  },
})

export default memo(() => {
  const t = useI18n()

  return (
    <Section title={t('setting_basic_theme')}>
      <View style={styles.container}>
        <AutoThemeToggle />
        <AllThemeSelector />
        <LightThemeSelector />
        <DarkThemeSelector />
      </View>
    </Section>
  )
})