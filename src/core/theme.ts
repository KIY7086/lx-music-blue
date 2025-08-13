import themeActions from '@/store/theme/action'
import { getTheme } from '@/theme/themes'
import { updateSetting } from './common'
import themeState from '@/store/theme/state'
import settingState from '@/store/setting/state'

export const setShouldUseDarkColors = (shouldUseDarkColors: boolean) => {
  themeActions.setShouldUseDarkColors(shouldUseDarkColors)
}

export const applyTheme = (theme: LX.Theme) => {
  themeActions.setTheme(theme)
}

export const setTheme = (id: string) => {
  updateSetting({ 'theme.id': id })
  void getTheme().then(theme => {
    if (theme.id == themeState.theme.id) return
    applyTheme(theme)
  })
}

export const setLightTheme = (id: string) => {
  updateSetting({ 'theme.lightId': id })
  // 修复：在自动模式下且当前是亮色时，或者非自动模式下，都应该实时应用
  if (settingState.setting['theme.autoTheme'] && !themeState.shouldUseDarkColors) {
    void getTheme().then(theme => {
      if (theme.id == themeState.theme.id) return
      applyTheme(theme)
    })
  }
}

export const setDarkTheme = (id: string) => {
  updateSetting({ 'theme.darkId': id })
  if (settingState.setting['theme.autoTheme'] && themeState.shouldUseDarkColors) {
    void getTheme().then(theme => {
      if (theme.id == themeState.theme.id) return
      applyTheme(theme)
    })
  }
}
