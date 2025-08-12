import { View, TouchableOpacity } from 'react-native'
// import Button from '@/components/common/Button'
// import { navigations } from '@/navigation'
// import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { useSettingValue } from '@/store/setting/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT } from '@/config/constant'
import { type InitState as CommonState } from '@/store/common/state'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'

const headerComponents: Partial<Record<CommonState['navActiveId'], React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}


// const LeftTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.leftTitle} size={18}>{t(id)}</Text>
// }


// const RightTitle = () => {
//   const id = useNavActiveId()
//   const t = useI18n()

//   return <Text style={styles.rightTitle} size={18}>{t(id)}</Text>
// }

const Header = () => {
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  return (
    <>
      <StatusBar />
      <View style={{
        ...styles.container,
        height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
        paddingTop: statusBarHeight,
      }}>
        <View style={styles.left}>
          <Text style={styles.leftTitle} size={18}>{t(id)}</Text>
        </View>
        {headerComponents[id] ?? null}
      </View>
    </>
  )
}


const styles = createStyle({
  container: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
    height: '100%',
  },
  btn: {
    // flex: 1,
    width: HEADER_HEIGHT,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  titleBtn: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    justifyContent: 'center',
  },
  leftTitle: {
    paddingLeft: 14,
    paddingRight: 16,
  },
  rightTitle: {
    paddingLeft: 16,
    paddingRight: 16,
  },
})

export default Header
