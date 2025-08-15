import { memo, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createStyle, openUrl } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import ScriptImportExport, { type ScriptImportExportType } from '../Basic/UserApiEditModal/ScriptImportExport'
import ScriptImportOnline, { type ScriptImportOnlineType } from '../Basic/UserApiEditModal/ScriptImportOnline'

export default memo(() => {
  const theme = useTheme()
  const t = useI18n()
  const scriptImportExportRef = useRef<ScriptImportExportType>(null)
  const scriptImportOnlineRef = useRef<ScriptImportOnlineType>(null)

  const openFAQPage = () => {
    void openUrl('https://lyswhut.github.io/lx-music-doc/mobile/custom-source')
  }

  const handleLocalImport = () => {
    scriptImportExportRef.current?.import()
  }

  const handleOnlineImport = () => {
    scriptImportOnlineRef.current?.show()
  }

  return (
    <View style={styles.container}>
      <View style={styles.tips}>
        <Text style={styles.tipsText} size={12}>
          {t('user_api_readme')}
        </Text>
        <Text
          style={{ ...styles.tipsText, textDecorationLine: 'underline', color: theme['c-primary-font'] }}
          size={12}
          onPress={openFAQPage}
        >
          FAQ
        </Text>
        <View>
          <Text style={styles.tipsText} size={12}>{t('user_api_note')}</Text>
        </View>
      </View>
      
      <View style={styles.btns}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme['c-button-background'], marginRight: 8 }]}
          onPress={handleLocalImport}
          activeOpacity={0.8}
        >
          <Text size={14} color={theme['c-font']}>{t('user_api_btn_import_local')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme['c-button-background'] }]}
          onPress={handleOnlineImport}
          activeOpacity={0.8}
        >
          <Text size={14} color={theme['c-font']}>{t('user_api_btn_import_online')}</Text>
        </TouchableOpacity>
      </View>
      
      <ScriptImportExport ref={scriptImportExportRef} />
      <ScriptImportOnline ref={scriptImportOnlineRef} />
    </View>
  )
})

const styles = createStyle({
  container: {
    marginTop: 15,
    paddingBottom: 30, // 防止播放条遮挡
  },
  tips: {
    paddingHorizontal: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tipsText: {
    marginTop: 8,
    textAlignVertical: 'bottom',
  },
  btns: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 8,
    gap: 6,
  },
  btn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
})