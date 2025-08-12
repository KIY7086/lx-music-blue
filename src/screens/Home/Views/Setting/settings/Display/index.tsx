import { memo } from 'react'

import Section from '../../components/Section'
import IsShowHotSearch from '../Search/IsShowHotSearch'
import IsShowHistorySearch from '../Search/IsShowHistorySearch'
import AddMusicLocationType from '../List/AddMusicLocationType'
import IsClickPlayList from '../List/IsClickPlayList'
import IsShowAlbumName from '../List/IsShowAlbumName'
import IsShowInterval from '../List/IsShowInterval'

import { useI18n } from '@/lang'

export default memo(() => {
  const t = useI18n()

  return (
    <>
      <Section title={t('setting_search')}>
        <IsShowHotSearch />
        <IsShowHistorySearch />
      </Section>
      <Section title={t('setting_display')}>
        <IsClickPlayList />
        <IsShowAlbumName />
        <IsShowInterval />
        <AddMusicLocationType />
      </Section>
    </>
  )
})