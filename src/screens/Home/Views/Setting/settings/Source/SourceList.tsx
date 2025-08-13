import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useI18n } from '@/lang'
import { useSettingValue } from '@/store/setting/hook'
import { useStatus, useUserApiList } from '@/store/userApi'
import CheckBox from '@/components/common/CheckBox'
import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { setApiSource } from '@/core/apiSource'
import apiSourceInfo from '@/utils/musicSdk/api-source-info'
import { setProgressCallback } from '../Basic/UserApiEditModal/action'

const apiSourceList = apiSourceInfo.map(api => ({
  id: api.id,
  name: api.name,
  disabled: api.disabled,
}))

const useActive = (id: string) => {
  const activeLangId = useSettingValue('common.apiSource')
  const isActive = useMemo(() => activeLangId == id, [activeLangId, id])
  return isActive
}

const Item = ({ id, name, desc, statusLabel, change }: {
  id: string
  name: string
  desc?: string
  statusLabel?: string
  change: (id: string) => void
}) => {
  const isActive = useActive(id)
  const theme = useTheme()
  
  return (
    <CheckBox marginBottom={5} check={isActive} onChange={() => { change(id) }} need>
      <Text style={styles.sourceLabel}>
        {name}
        {
          desc ? <Text style={styles.sourceDesc} color={theme['c-500']} size={13}>  {desc}</Text> : null
        }
        {
          statusLabel ? <Text style={styles.sourceStatus} size={13}>  {statusLabel}</Text> : null
        }
      </Text>
    </CheckBox>
  )
}

export default memo(() => {
  const t = useI18n()
  const userApiListRaw = useUserApiList()
  const apiStatus = useStatus()
  const apiSourceSetting = useSettingValue('common.apiSource')
  const [importProgress, setImportProgress] = useState({ visible: false, current: 0, total: 0, message: '' })

  useEffect(() => {
    setProgressCallback(setImportProgress)
  }, [])

  const list = useMemo(() => apiSourceList.map(s => ({
    // @ts-expect-error
    name: t(`setting_basic_source_${s.id}`) || s.name,
    id: s.id,
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
      const statusLabel = api.id == apiSourceSetting ? `[${getApiStatus()}]` : ''
      return {
        id: api.id,
        name: api.name,
        label: `${api.name}${statusLabel}`,
        desc: [/^\d/.test(api.version) ? `v${api.version}` : api.version].filter(Boolean).join(', '),
        statusLabel,
      }
    })
  }, [userApiListRaw, apiStatus, apiSourceSetting, t])

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
              style={[styles.progressFill, { width: `${progress}%` }]} 
            />
          </View>
          <Text size={12} style={styles.progressMessage} numberOfLines={1}>
            {importProgress.message}
          </Text>
        </View>
      )}
      
      {list.map(({ id, name }) => <Item name={name} id={id} key={id} change={setApiSourceId} />)}
      {userApiList.map(({ id, name, desc, statusLabel }) => 
        <Item name={name} desc={desc} statusLabel={statusLabel} id={id} key={id} change={setApiSourceId} />
      )}
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