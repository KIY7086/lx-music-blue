import React, { useState, useEffect } from 'react'
import { View, StatusBar, ActivityIndicator, BackHandler } from 'react-native'
import Text from './common/Text'
import Button from './common/Button'
import { HeroIcon } from './common/HeroIcon'
import { useTheme } from '@/store/theme/hook'
import { checkStoragePermissions, requestStoragePermission } from '@/utils/tools'
import { exitApp, isNotificationsEnabled, requestNotificationPermission, isIgnoringBatteryOptimization, requestIgnoreBatteryOptimization } from '@/utils/nativeModules/utils'
import { createStyle } from '@/utils/tools'
import { getData, saveData } from '@/plugins/storage'
import { FolderIcon, BellIcon, Battery100Icon } from 'react-native-heroicons/solid'

interface PermissionGuardProps {
  children: React.ReactNode
}

interface PermissionState {
  storage: boolean
  notification: boolean
  batteryOptimization: boolean
}

interface PermissionItem {
  key: keyof PermissionState
  title: string
  description: string
  icon: 'folder' | 'bell' | 'battery'
  isRequired: boolean
  granted: boolean
  onRequest: () => Promise<void>
}

const DONT_ASK_AGAIN_KEY = 'permission_dont_ask_again'

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ children }) => {
  const theme = useTheme()
  const [permissions, setPermissions] = useState<PermissionState>({
    storage: false,
    notification: false,
    batteryOptimization: false,
  })
  const [isChecking, setIsChecking] = useState(true)
  const [requesting, setRequesting] = useState<keyof PermissionState | null>(null)

  useEffect(() => {
    checkAllPermissions()
  }, [])

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
      console.error('Permission check error:', error)
      setPermissions({
        storage: false,
        notification: false,
        batteryOptimization: false,
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleRequestPermission = async (key: keyof PermissionState) => {
    if (requesting) return
    
    setRequesting(key)
    try {
      let result = false
      
      switch (key) {
        case 'storage':
          result = (await requestStoragePermission()) ?? false
          break
        case 'notification':
          result = (await requestNotificationPermission()) ?? false
          break
        case 'batteryOptimization':
          result = (await requestIgnoreBatteryOptimization()) ?? false
          break
      }
      
      if (result) {
        const newPermissions = { ...permissions, [key]: true }
        setPermissions(newPermissions)
        
        // 通知ThemeProvider权限状态变更
        if ((global.state_event as any)?.emit) {
          (global.state_event as any).emit('permissionsChanged', newPermissions)
        }
      }
    } catch (error) {
      console.error('Permission request error:', error)
    } finally {
      setRequesting(null)
    }
  }

  const handleDontAskAgain = async () => {
    try {
      await saveData(DONT_ASK_AGAIN_KEY, true)
      // 触发全局事件通知ThemeProvider重新检查状态
      if ((global.state_event as any)?.emit) {
        (global.state_event as any).emit('permissionDontAskAgainChanged', true)
      }
    } catch (error) {
      console.error('Save dont ask again setting error:', error)
    }
  }

  const handleExit = () => {
    exitApp()
  }

  const permissionItems: PermissionItem[] = [
    {
      key: 'storage',
      title: '存储权限',
      description: '访问设备存储以播放本地音乐文件',
      icon: 'folder',
      isRequired: true,
      granted: permissions.storage,
      onRequest: () => handleRequestPermission('storage'),
    },
    {
      key: 'notification',
      title: '通知权限',
      description: '显示播放控制和下载进度通知',
      icon: 'bell',
      isRequired: false,
      granted: permissions.notification,
      onRequest: () => handleRequestPermission('notification'),
    },
    {
      key: 'batteryOptimization',
      title: '电池优化',
      description: '允许应用在后台持续播放音乐',
      icon: 'battery',
      isRequired: false,
      granted: permissions.batteryOptimization,
      onRequest: () => handleRequestPermission('batteryOptimization'),
    },
  ]

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      exitApp()
      return true
    })
    return () => backHandler.remove()
  }, [])

  if (isChecking) {
    return (
      <View style={[styles.container, { backgroundColor: theme['c-content-background'] }]}>
        <StatusBar backgroundColor={theme['c-content-background']} barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme['c-primary']} />
          <Text style={[styles.loadingText, { color: theme['c-primary-font'] }]}>
            正在检查权限...
          </Text>
        </View>
      </View>
    )
  }

  // 直接显示权限页面，不做额外判断，因为显示控制已经在ThemeProvider中处理
  return (
    <View style={[styles.container, { backgroundColor: theme['c-content-background'] }]}>
      <StatusBar backgroundColor={theme['c-content-background']} barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme['c-primary-font'] }]}>
          应用权限设置
        </Text>
        <Text style={[styles.subtitle, { color: theme['c-font-label'] }]}>
          为了更好的使用体验，建议开启以下权限
        </Text>
      </View>

      <View style={styles.permissionsList}>
        {permissionItems.map((item) => (
          <View key={item.key} style={[styles.permissionItem, { borderBottomColor: theme['c-border-background'] }]}>
            <View style={styles.permissionIcon}>
              {item.icon === 'folder' && <HeroIcon icon={FolderIcon} size={32} color={theme['c-primary-font']} />}
              {item.icon === 'bell' && <HeroIcon icon={BellIcon} size={32} color={theme['c-primary-font']} />}
              {item.icon === 'battery' && <HeroIcon icon={Battery100Icon} size={32} color={theme['c-primary-font']} />}
            </View>
            
            <View style={styles.permissionInfo}>
              <View style={styles.permissionHeader}>
                <Text style={[styles.permissionTitle, { color: theme['c-primary-font'] }]}>
                  {item.title}
                </Text>
                {item.isRequired && (
                  <Text style={[styles.requiredTag, { color: theme['c-primary'], borderColor: theme['c-primary'] }]}>
                    必需
                  </Text>
                )}
              </View>
              <Text style={[styles.permissionDesc, { color: theme['c-font-label'] }]}>
                {item.description}
              </Text>
              
              <View style={styles.permissionActions}>
                <Text style={[styles.statusText, {
                  color: item.granted ? theme['c-primary'] : theme['c-font-label']
                }]}>
                  {item.granted ? '已授权' : '未授权'}
                </Text>
                
                {!item.granted && (
                  <Button
                   style={[styles.requestButton, { backgroundColor: theme['c-primary'] }]}
                   onPress={() => item.onRequest()}
                   disabled={requesting === item.key}
                 >
                   {requesting === item.key ? (
                     <View style={styles.requestingContainer}>
                       <ActivityIndicator size="small" color={'#ffffff'} />
                       <Text style={[styles.requestingText, { color: '#ffffff' }]}>请求中...</Text>
                     </View>
                   ) : (
                     <Text style={[styles.requestButtonText, { color: '#ffffff' }]}>授权</Text>
                   )}
                 </Button>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        {!permissions.storage ? (
          <Text style={[styles.warningText, { color: theme['c-primary'] }]}>
            ⚠️ 存储权限是必需的，不授权将无法使用应用
          </Text>
        ) : (
          <Text style={[styles.infoText, { color: theme['c-font-label'] }]}>
            建议开启所有权限以获得最佳使用体验
          </Text>
        )}
        
        <View style={styles.footerButtons}>
          <Button
            style={[styles.dontAskButton, {
              backgroundColor: !permissions.storage
                ? theme['c-button-background']
                : theme['c-button-background']
            }]}
            onPress={handleDontAskAgain}
            disabled={!permissions.storage}
          >
            <Text style={[styles.dontAskButtonText, {
              color: !permissions.storage
                ? theme['c-font-label']
                : theme['c-primary']
            }]}>
              不再提示
            </Text>
          </Button>
          
          <Button
            style={[styles.exitButton, { backgroundColor: theme['c-button-background'] }]}
            onPress={handleExit}
          >
            <Text style={[styles.exitButtonText, { color: theme['c-primary-font'] }]}>
              退出应用
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = createStyle({
  container: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  permissionIcon: {
    position: 'relative',
    marginRight: 16,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  grantedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grantedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  requiredTag: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  permissionDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  permissionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  requestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  requestingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestingText: {
    fontSize: 14,
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  dontAskButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  dontAskButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  exitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
})