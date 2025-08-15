import { memo, useMemo } from 'react'

import { StyleSheet, View } from 'react-native'

import { useSettingValue, useSetting } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'
import SettingRadioGroup from '../../components/SettingRadioGroup'

const LIST = [
  {
    id: 'left',
    name: 'setting_basic_drawer_layout_position_left',
  },
  {
    id: 'right',
    name: 'setting_basic_drawer_layout_position_right',
  },
] as const

export default memo(() => {
  const t = useI18n()
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')
  const list = useMemo(() => {
    return LIST.map((item) => ({ value: item.id, label: t(item.name) }))
  }, [t])

  const handleSet = (position: string) => {
    updateSetting({ 'common.drawerLayoutPosition': position as LX.AppSetting['common.drawerLayoutPosition'] })
  }

  return (
    <SettingRadioGroup
      label={t('setting_basic_drawer_layout_position')}
      options={list}
      value={drawerLayoutPosition}
      onValueChange={handleSet}
    />
  )
})
