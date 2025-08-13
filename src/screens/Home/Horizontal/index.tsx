import { View, StyleSheet } from 'react-native'
import PlayerBar from '@/components/player/PlayerBar'
import SideNavBar from '@/components/common/SideNavBar'
import Content from '../Vertical/Content'

export default () => {
  return (
    <View style={styles.container}>
      <SideNavBar />
      <View style={styles.contentContainer}>
        <Content />
        <PlayerBar isHome />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
})