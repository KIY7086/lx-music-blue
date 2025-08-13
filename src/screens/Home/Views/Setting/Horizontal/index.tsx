import { useRef } from 'react'
import { ScrollView, View } from 'react-native'
import NavList from './NavList'
import Main, { type MainType } from '../Main'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'

const styles = createStyle({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  nav: {
    height: '100%',
    width: '22%',
  },
  main: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 100,
    flex: 0,
  },
})

export default () => {
  const theme = useTheme()
  const mainRef = useRef<MainType>(null)

  return (
    <View style={{ ...styles.container, borderTopColor: theme['c-border-background'] }}>
      <View style={{ ...styles.nav, borderRightColor: theme['c-border-background'] }}>
        <NavList onChangeId={(id) => mainRef.current?.setActiveId(id)} />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={styles.main}>
            <Main ref={mainRef} />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
