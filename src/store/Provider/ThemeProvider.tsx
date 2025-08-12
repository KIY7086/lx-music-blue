import { memo, useEffect, useState } from 'react'

import themeState, { ThemeContext } from '../theme/state'
import { PermissionGuard } from '@/components/PermissionGuard'
import { UserAgreement } from '@/components/UserAgreement'
import { getData } from '@/plugins/storage'
import { checkStoragePermissions } from '@/utils/tools'
import { isNotificationsEnabled, isIgnoringBatteryOptimization } from '@/utils/nativeModules/utils'

const DONT_ASK_AGAIN_KEY = 'permission_dont_ask_again'
const USER_AGREEMENT_KEY = 'user_agreement_accepted'

export default memo(({ children }: {
  children: React.ReactNode
}) => {
  const [theme, setTheme] = useState(themeState.theme)
  const [userAgreementAccepted, setUserAgreementAccepted] = useState<boolean | null>(null)
  const [dontAskAgain, setDontAskAgain] = useState<boolean | null>(null)
  const [permissions, setPermissions] = useState<{
    storage: boolean | null
    notification: boolean | null
    batteryOptimization: boolean | null
  }>({
    storage: null,
    notification: null,
    batteryOptimization: null,
  })

  useEffect(() => {
    const handleUpdateTheme = (theme: LX.ActiveTheme) => {
      requestAnimationFrame(() => {
        setTheme(theme)
      })
    }
    global.state_event.on('themeUpdated', handleUpdateTheme)
    return () => {
      global.state_event.off('themeUpdated', handleUpdateTheme)
    }
  }, [])

  useEffect(() => {
    const checkUserAgreement = async () => {
      try {
        const accepted = await getData<boolean>(USER_AGREEMENT_KEY)
        setUserAgreementAccepted(accepted || false)
      } catch (error) {
        setUserAgreementAccepted(false)
      }
    }
    
    const checkDontAskAgain = async () => {
      try {
        const setting = await getData<boolean>(DONT_ASK_AGAIN_KEY)
        setDontAskAgain(setting || false)
      } catch (error) {
        setDontAskAgain(false)
      }
    }
    
    const checkAllPermissions = async () => {
      try {
        const [storageGranted, notificationEnabled, batteryOptimized] = await Promise.all([
          checkStoragePermissions(),
          isNotificationsEnabled(),
          isIgnoringBatteryOptimization(),
        ])
        
        setPermissions({
          storage: storageGranted,
          notification: notificationEnabled,
          batteryOptimization: batteryOptimized,
        })
      } catch (error) {
        setPermissions({
          storage: false,
          notification: false,
          batteryOptimization: false,
        })
      }
    }
    
    const handleUserAgreementChange = (accepted: boolean) => {
      setUserAgreementAccepted(accepted)
    }
    
    const handlePermissionChange = (value: boolean) => {
      setDontAskAgain(value)
    }
    
    const handleAllPermissionsChange = (permissions: any) => {
      setPermissions(permissions)
    }
    
    checkUserAgreement()
    checkDontAskAgain()
    checkAllPermissions()
    
    // 监听各种状态变化事件
    if (global.state_event) {
      global.state_event.on('userAgreementAccepted', handleUserAgreementChange)
      global.state_event.on('permissionDontAskAgainChanged', handlePermissionChange)
      global.state_event.on('permissionsChanged', handleAllPermissionsChange)
    }
    
    return () => {
      if (global.state_event) {
        global.state_event.off('userAgreementAccepted', handleUserAgreementChange)
        global.state_event.off('permissionDontAskAgainChanged', handlePermissionChange)
        global.state_event.off('permissionsChanged', handleAllPermissionsChange)
      }
    }
  }, [])

  // 如果还在检查状态，显示children（避免闪烁）
  if (userAgreementAccepted === null || dontAskAgain === null || 
      permissions.storage === null || permissions.notification === null || permissions.batteryOptimization === null) {
    return (
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    )
  }

  // 1. 如果用户协议未接受，显示用户协议页面
  if (!userAgreementAccepted) {
    return (
      <ThemeContext.Provider value={theme}>
        <UserAgreement>
          {children}
        </UserAgreement>
      </ThemeContext.Provider>
    )
  }

  // 2. 检查是否需要显示权限页面
  const allPermissionsGranted = permissions.storage && permissions.notification && permissions.batteryOptimization
  const shouldShowPermissionScreen = !dontAskAgain && !allPermissionsGranted

  if (shouldShowPermissionScreen) {
    return (
      <ThemeContext.Provider value={theme}>
        <PermissionGuard>
          {children}
        </PermissionGuard>
      </ThemeContext.Provider>
    )
  }

  // 3. 显示应用内容
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
})
