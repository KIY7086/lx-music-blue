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

  const renderContent = () => {
    switch (activeId) {
      case 'nav_search':
        return <Search />
      case 'nav_songlist':
        return <SongList />
      case 'nav_top':
        return <Leaderboard />
      case 'nav_love':
        return <Mylist />
      case 'nav_setting':
        return <Setting />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
})

export default Main

