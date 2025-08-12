import { memo, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import Nav, { type NavType } from './Nav'
import Main, { type MainType, type SettingScreenIds } from '../Main'
import { createStyle } from '@/utils/tools'
// import { BorderWidths } from '@/theme'
// import { useTheme } from '@/store/theme/hook'

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'column',
    // borderTopWidth: BorderWidths.normal,
  },
  main: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 100,
    flex: 1,
  },
})

export default memo(() => {
  // const theme = useTheme()
  const mainRef = useRef<MainType>(null)
  const navRef = useRef<NavType>(null)

  const handleSetActiveId = (id: SettingScreenIds) => {
    mainRef.current?.setActiveId(id)
    navRef.current?.setActiveId(id)
  }

  return (
    <View style={styles.container}>
      <Nav ref={navRef} onSetActiveId={handleSetActiveId} />
      <ScrollView style={styles.main} keyboardShouldPersistTaps={'always'}>
        <Main ref={mainRef} />
      </ScrollView>
    </View>
  )
})
