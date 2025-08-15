import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { View } from 'react-native'
import type { InitState as SearchState } from '@/store/search/state'
import type { Source as MusicSource } from '@/store/search/music/state'
import type { Source as SongListSource } from '@/store/search/songlist/state'
import MusicList, { type MusicListType } from './MusicList'
import BlankView, { type BlankViewType } from './BlankView'
import SonglistList from './SonglistList'
import { createStyle } from '@/utils/tools'

interface ListProps {
  onSearch: (keyword: string) => void
}
export interface ListType {
  loadList: (text: string, source: MusicSource | SongListSource, type: SearchState['searchType']) => void
}

export default forwardRef<ListType, ListProps>(({ onSearch }, ref) => {
  const [listType, setListType] = useState<SearchState['searchType']>('music')
  const [showBlankView, setShowListView] = useState(true)
  const listRef = useRef<MusicListType>(null)
  const blankViewRef = useRef<BlankViewType>(null)

  useImperativeHandle(ref, () => ({
    loadList(text, source, type) {
      if (text) {
        setShowListView(false)
        setListType(type)
        // const listDetailInfo = searchMusicState.listDetailInfo
        requestAnimationFrame(() => {
          listRef.current?.loadList(text, source)
        })
      } else {
        setShowListView(true)
        requestAnimationFrame(() => {
          blankViewRef.current?.show(source)
        })
      }
    },
  }), [])

  return (
    <>
      <View style={{ ...styles.content, display: showBlankView ? 'flex' : 'none' }}>
        <BlankView ref={blankViewRef} onSearch={onSearch} />
      </View>
      <View style={{ ...styles.content, display: !showBlankView && listType == 'songlist' ? 'flex' : 'none' }}>
        <SonglistList ref={listRef} />
      </View>
      <View style={{ ...styles.content, display: !showBlankView && listType == 'music' ? 'flex' : 'none' }}>
        <MusicList ref={listRef} />
      </View>
    </>
  )
})

const styles = createStyle({
  content: {
    flex: 1,
  },
})
