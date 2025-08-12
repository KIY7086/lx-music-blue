import { memo, forwardRef, useImperativeHandle, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'
import Button from '../components/Button'
import { NAV_MENUS } from '../setting'
import type { SettingScreenIds } from '../Main'
import { useI18n } from '@/lang'

export interface NavType {
  setActiveId: (id: SettingScreenIds) => void
}

interface NavProps {
  onSetActiveId: (id: SettingScreenIds) => void
}

export default memo(forwardRef<NavType, NavProps>(({ onSetActiveId }, ref) => {
  const theme = useTheme()
  const t = useI18n()
  const [activeId, setActiveId] = useState<SettingScreenIds>('basic')

  useImperativeHandle(ref, () => ({
    setActiveId(id) {
      setActiveId(id)
    },
  }))

  const handlePress = (id: SettingScreenIds) => {
    onSetActiveId(id)
  }

  return (
    <View style={{ ...styles.container, borderBottomColor: theme['c-border-background'] }}>
      <ScrollView horizontal keyboardShouldPersistTaps={'always'} style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {
          NAV_MENUS.map((menu: { id: SettingScreenIds, key: any }) => (
            <Button key={menu.id} style={styles.button} onPress={() => handlePress(menu.id)}>
              <Text style={{ ...styles.buttonText, color: activeId == menu.id ? theme['c-primary-font'] : theme['c-font'] }}>{t(menu.key)}</Text>
            </Button>
          ))
        }
      </ScrollView>
    </View>
  )
}))

const styles = createStyle({
  container: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: BorderWidths.normal,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
})