import { useEffect } from 'react'
import { AppState } from 'react-native'
import { screenkeepAwake, screenUnkeepAwake } from '@/utils/nativeModules/utils'
import commonState, { type InitState as CommonState } from '@/store/common/state'

export const useScreenKeepAwake = (isKeepAwake: boolean) => {
  useEffect(() => {
    if (isKeepAwake) {
      screenkeepAwake()
    } else {
      screenUnkeepAwake()
    }
  }, [isKeepAwake])

  useEffect(() => {
    const appstateListener = AppState.addEventListener('change', (state) => {
      switch (state) {
        case 'active':
          if (isKeepAwake && !commonState.componentIds.comment) screenkeepAwake()
          break
        case 'background':
          screenUnkeepAwake()
          break
      }
    })

    const handleComponentIdsChange = (ids: CommonState['componentIds']) => {
      if (ids.comment) {
        screenUnkeepAwake()
      } else if (AppState.currentState === 'active' && isKeepAwake) {
        screenkeepAwake()
      }
    }

    global.state_event.on('componentIdsUpdated', handleComponentIdsChange)

    return () => {
      global.state_event.off('componentIdsUpdated', handleComponentIdsChange)
      appstateListener.remove()
      screenUnkeepAwake()
    }
  }, [isKeepAwake])
}