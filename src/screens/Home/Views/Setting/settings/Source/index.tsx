import { memo } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import Section from '../../components/Section'
import SourceList from './SourceList'
import ImportSection from './ImportSection'

const styles = createStyle({
  container: {
    paddingVertical: 8,
  },
})

export default memo(() => {
  const t = useI18n()

  return (
    <Section title={t('setting_basic_source')}>
      <View style={styles.container}>
        <SourceList />
        <ImportSection />
      </View>
    </Section>
  )
})