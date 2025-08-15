import { memo } from 'react'
import { View } from 'react-native'
import { useI18n, langList } from '@/lang'
import { setLanguage } from '@/core/common'
import { useSettingValue } from '@/store/setting/hook'
import SettingRadioGroup from '../../components/SettingRadioGroup'

export default memo(() => {
  const t = useI18n()
  const activeLangId = useSettingValue('common.langId') || 'zh_cn'

  const options = langList.map(({ locale, name }) => ({
    label: name,
    value: locale
  }))

  return (
    <SettingRadioGroup
      label={t('setting_basic_lang')}
      options={options}
      value={activeLangId}
      onValueChange={(value) => setLanguage(value as any)}
    />
  )
})
