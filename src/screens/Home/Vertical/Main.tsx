import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Search from '../Views/Search'
import SongList from '../Views/SongList'
import Mylist from '../Views/Mylist'
import Leaderboard from '../Views/Leaderboard'
import Setting from '../Views/Setting'
import commonState from '@/store/common/state'
import { createStyle } from '@/utils/tools'
import { type NAV_ID_Type } from '@/config/constant'

const Main = () => {
  const [activeId, setActiveId] = useState(commonState.navActiveId)

  useEffect(() => {
    const handleUpdate = (id: NAV_ID_Type) => {
      setActiveId(id)
    }
    global.state_event.on('navActiveIdUpdated', handleUpdate)
    return () => {
      global.state_event.off('navActiveIdUpdated', handleUpdate)
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={{ ...styles.content, display: activeId === 'nav_search' ? 'flex' : 'none' }}>
        <Search />
      </View>
      <View style={{ ...styles.content, display: activeId === 'nav_songlist' ? 'flex' : 'none' }}>
        <SongList />
      </View>
      <View style={{ ...styles.content, display: activeId === 'nav_top' ? 'flex' : 'none' }}>
        <Leaderboard />
      </View>
      <View style={{ ...styles.content, display: activeId === 'nav_love' ? 'flex' : 'none' }}>
        <Mylist />
      </View>
      <View style={{ ...styles.content, display: activeId === 'nav_setting' ? 'flex' : 'none' }}>
        <Setting />
      </View>
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

export default Main

