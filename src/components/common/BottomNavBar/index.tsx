import { memo, useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import commonState from '@/store/common/state'
import { setNavActiveId } from '@/core/common'
import { type NAV_ID_Type } from '@/config/constant'
import { HeroIcon } from '../HeroIcon'
import {
  HeartIcon,
  MusicalNoteIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from 'react-native-heroicons/outline'
import {
  HeartIcon as HeartIconSolid,
  MusicalNoteIcon as MusicalNoteIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from 'react-native-heroicons/solid'

const NAV_ICONS: Record<NAV_ID_Type, (props: any) => JSX.Element> = {
  nav_love: HeartIcon,
  nav_songlist: MusicalNoteIcon,
  nav_top: ChartBarIcon,
  nav_search: MagnifyingGlassIcon,
  nav_setting: Cog6ToothIcon,
}
const NAV_ICONS_SOLID: Record<NAV_ID_Type, (props: any) => JSX.Element> = {
  nav_love: HeartIconSolid,
  nav_songlist: MusicalNoteIconSolid,
  nav_top: ChartBarIconSolid,
  nav_search: MagnifyingGlassIconSolid,
  nav_setting: Cog6ToothIconSolid,
}

const NAV_IDS: NAV_ID_Type[] = [
  'nav_love',
  'nav_songlist',
  'nav_top',
  'nav_search',
  'nav_setting',
]

const NavButton = ({ id, activeId, onNavChange }: {
  id: NAV_ID_Type
  activeId: NAV_ID_Type
  onNavChange: (id: NAV_ID_Type) => void
}) => {
  const theme = useTheme()
  const isActive = activeId == id
  return (
    <TouchableOpacity style={styles.navItem} onPress={() => { onNavChange(id) }} activeOpacity={0.6}>
      <HeroIcon icon={isActive ? NAV_ICONS_SOLID[id] : NAV_ICONS[id]} color={isActive ? theme['c-primary'] : theme['c-font']} size={24} />
    </TouchableOpacity>
  )
}


export default memo(() => {
  const [activeId, setActiveId] = useState(commonState.navActiveId)
  const theme = useTheme()

  useEffect(() => {
    const handleUpdate = (id: NAV_ID_Type) => {
      setActiveId(id)
    }
    global.state_event.on('navActiveIdUpdated', handleUpdate)
    return () => {
      global.state_event.off('navActiveIdUpdated', handleUpdate)
    }
  }, [])

  const handleNavChange = useCallback((id: NAV_ID_Type) => {
    if (activeId == id) return
    setActiveId(id)
    setNavActiveId(id)
  }, [activeId])

  return (
    <View style={{ ...styles.container, backgroundColor: theme['c-content-background'], borderTopColor: 'rgba(0,0,0,0.1)' }}>
      {
        NAV_IDS.map(id => (
          <NavButton
            key={id}
            id={id}
            activeId={activeId}
            onNavChange={handleNavChange}
          />
        ))
      }
    </View>
  )
})

const styles = createStyle({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 2,
    height: 56,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    paddingTop: 10,
    paddingBottom: 10,
  },
})