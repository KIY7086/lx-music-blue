import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import SubTitle from '../../components/SubTitle'
import SettingRadioGroup from '../../components/SettingRadioGroup'
import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'

const setAddMusicLocationType = (type: LX.AddMusicLocationType) => {
  updateSetting({ 'list.addMusicLocationType': type })
}

export default memo(() => {
  const t = useI18n()
  const value = useSettingValue('list.addMusicLocationType') as LX.AddMusicLocationType

  const options = useMemo(() => ([
    { label: t('setting_list_add_music_location_type_top'), value: 'top' as LX.AddMusicLocationType },
    { label: t('setting_list_add_music_location_type_bottom'), value: 'bottom' as LX.AddMusicLocationType },
  ]), [t])

  return (
      <View style={styles.container}>
        <SettingRadioGroup
          label={t('setting_list_add_music_location_type')}
          options={options}
          value={value}
          onValueChange={(v) => setAddMusicLocationType(v as LX.AddMusicLocationType)}
        />
      </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
})
