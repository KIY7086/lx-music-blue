import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import Basic from './settings/Basic'
import Player from './settings/Player'
import LyricDesktop from './settings/LyricDesktop'
import Display from './settings/Display'
import Backup from './settings/Backup'
import Other from './settings/Other'
import About from './settings/About'

export const SETTING_SCREENS = [
  'basic',
  'display',
  'player',
  'lyric_desktop',
  'backup',
  'other',
  'about',
] as const

export type SettingScreenIds = typeof SETTING_SCREENS[number]

// interface MainProps {
//   onUpdateActiveId: (id: string) => void
// }
export interface MainType {
  setActiveId: (id: SettingScreenIds) => void
}

const Main = forwardRef<MainType, {}>((props, ref) => {
  const [id, setId] = useState(global.lx.settingActiveId)

  useImperativeHandle(ref, () => ({
    setActiveId(id) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setId(id)
        })
      })
    },
  }))

  const component = useMemo(() => {
    switch (id) {
      case 'display': return <Display />
      case 'player': return <Player />
      case 'lyric_desktop': return <LyricDesktop />
      case 'backup': return <Backup />
      case 'other': return <Other />
      case 'about': return <About />
      case 'basic':
      default: return <Basic />
    }
  }, [id])

  return component
})


export default Main

