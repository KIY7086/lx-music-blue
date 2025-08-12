import { useI18n } from '@/lang'
import { memo, useState } from 'react'

import Section from '../../components/Section'
import Part from './Part'
import IsEnable from '../Sync/IsEnable'
import History from '../Sync/History'
// import MaxCache from './MaxCache'

export default memo(() => {
  const t = useI18n()
  const [host, setHost] = useState('')

  return (
    <>
      <Section title={t('setting_backup')}>
        <Part />
        {/* <MaxCache /> */}
      </Section>
      <Section title={t('setting_sync')}>
        <IsEnable host={host} setHost={setHost} />
        <History setHost={setHost} />
      </Section>
    </>
  )
})
