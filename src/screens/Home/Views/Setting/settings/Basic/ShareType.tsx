import { memo, useMemo } from 'react'

import { StyleSheet, View } from 'react-native'

import { useSettingValue } from '@/store/setting/hook'
import { useI18n } from '@/lang'
import { updateSetting } from '@/core/common'
import SettingRadioGroup from '../../components/SettingRadioGroup'

type ShareType = LX.AppSetting['common.shareType']

const setShareType = (type: ShareType) => {
  updateSetting({ 'common.shareType': type })
}

export default memo(() => {
  const t = useI18n()
  const shareType = useSettingValue('common.shareType')
  const list = useMemo(() => {
    return [
      {
        value: 'system',
        label: t('setting_basic_share_type_system'),
      },
      {
        value: 'clipboard',
        label: t('setting_basic_share_type_clipboard'),
      },
    ]
  }, [t])

  const handleSet = (type: string) => {
    setShareType(type as ShareType)
  }

  return (
    <SettingRadioGroup
      label={t('setting_basic_share_type')}
      options={list}
      value={shareType}
      onValueChange={handleSet}
    />
  )
})
