import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { useStatus, useUserApiList } from '@/store/userApi'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { setApiSource } from '@/core/apiSource'
import apiSourceInfo from '@/utils/musicSdk/api-source-info'
import { setProgressCallback } from '../Basic/UserApiEditModal/action'
import SettingRadioGroup from '../../components/SettingRadioGroup'

const apiSourceList = apiSourceInfo.map(api => ({
  id: api.id,
  name: api.name,
  disabled: api.disabled,
}))

export default memo(() => {
  const t = useI18n()
  const userApiListRaw = useUserApiList()
  const apiStatus = useStatus()
  const apiSourceSetting = useSettingValue('common.apiSource')
  const [importProgress, setImportProgress] = useState({ visible: false, current: 0, total: 0, message: '' })
  const theme = useTheme()

  useEffect(() => {
    setProgressCallback(setImportProgress)
  }, [])

  const list = useMemo(() => apiSourceList.map(s => ({
    // @ts-expect-error
    label: t(`setting_basic_source_${s.id}`) || s.name,
    value: s.id,
  })), [t])

  const userApiList = useMemo(() => {
    const getApiStatus = () => {
      let status
      if (apiStatus.status) status = t('setting_basic_source_status_success')
      else if (apiStatus.message == 'initing') status = t('setting_basic_source_status_initing')
      else status = t('setting_basic_source_status_failed')

      return status
    }
    return userApiListRaw.map(api => {
      const statusLabel = api.id == apiSourceSetting ? ` [${getApiStatus()}]` : ''
      return {
        value: api.id,
        label: `${api.name}${statusLabel}`,
      }
    })
  }, [userApiListRaw, apiStatus, apiSourceSetting, t])

  const options = useMemo(() => [...list, ...userApiList], [list, userApiList])

  const setApiSourceId = useCallback((id: string) => {
    setApiSource(id)
  }, [])

  const progress = importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0

  return (
    <View style={styles.list}>
      {importProgress.visible && (
        <View style={styles.progressContainer}>
          <Text size={14} style={styles.progressText}>
            导入进度: {importProgress.current}/{importProgress.total}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme['c-primary'] }]}
            />
          </View>
          <Text size={12} style={styles.progressMessage} numberOfLines={1}>
            {importProgress.message}
          </Text>
        </View>
      )}
      
      <SettingRadioGroup
        label={t('setting_basic_source')}
        options={options}
        value={apiSourceSetting}
        onValueChange={setApiSourceId}
      />
    </View>
  )
})

const styles = createStyle({
  list: {
    flexGrow: 0,
    flexShrink: 1,
  },
  progressContainer: {
    paddingVertical: 8,
    marginBottom: 10,
  },
  progressText: {
    marginBottom: 4,
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressMessage: {
    fontSize: 12,
  },
  sourceLabel: {
    fontSize: 14,
  },
  sourceDesc: {
    fontSize: 13,
  },
  sourceStatus: {
    fontSize: 13,
  },
})