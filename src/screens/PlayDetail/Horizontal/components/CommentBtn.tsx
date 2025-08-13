import Btn from './Btn'
import { navigations } from '@/navigation'
import commonState from '@/store/common/state'
import { ChatBubbleLeftEllipsisIcon } from 'react-native-heroicons/outline'

export default () => {
  const handleShowCommentScreen = () => {
    navigations.pushCommentScreen(commonState.componentIds.playDetail!)
  }

  return <Btn icon={ChatBubbleLeftEllipsisIcon} onPress={handleShowCommentScreen} />
}
