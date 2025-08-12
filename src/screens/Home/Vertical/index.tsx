import Content from './Content'
import PlayerBar from '@/components/player/PlayerBar'
import BottomNavBar from '@/components/common/BottomNavBar'

export default () => {
  return (
    <>
      <Content />
      <PlayerBar isHome />
      <BottomNavBar />
    </>
  )
}
