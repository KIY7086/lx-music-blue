import React, { useState, useEffect } from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import Text from './common/Text'
import Button from './common/Button'
import { useTheme } from '@/store/theme/hook'
import { exitApp } from '@/utils/nativeModules/utils'
import { createStyle, openUrl } from '@/utils/tools'
import { saveData } from '@/plugins/storage'

interface UserAgreementProps {
  children: React.ReactNode
}

const USER_AGREEMENT_KEY = 'user_agreement_accepted'

export const UserAgreement: React.FC<UserAgreementProps> = ({ children }) => {
  const theme = useTheme()
  const [isAccepting, setIsAccepting] = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAccept = async () => {
    if (isAccepting || countdown > 0) return
    
    setIsAccepting(true)
    try {
      await saveData(USER_AGREEMENT_KEY, true)
      // 触发全局事件通知ThemeProvider
      if (global.state_event) {
        global.state_event.emit('userAgreementAccepted', true)
      }
    } catch (error) {
      console.error('Save user agreement error:', error)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleReject = () => {
    exitApp()
  }

  const openHomePage = () => {
    void openUrl('https://github.com/lyswhut/lx-music-mobile#readme')
  }
  
  const openLicensePage = () => {
    void openUrl('http://www.apache.org/licenses/LICENSE-2.0')
  }

  const textLinkStyle = {
    textDecorationLine: 'underline' as const,
    color: theme['c-primary-font'],
  }

  return (
    <View style={[styles.container, { backgroundColor: theme['c-primary-background'] }]}>
      <StatusBar backgroundColor={theme['c-primary-background']} barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme['c-primary-font'] }]}>
          许可协议
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <Text style={[styles.warningText, { color: '#d11a0aff', borderColor: theme['c-primary'] }]}>
          在使用本软件前，你（使用者）需签署本协议才可继续使用！
        </Text>

        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          本项目基于 <Text onPress={openLicensePage} style={textLinkStyle}>Apache License 2.0</Text> 许可证发行，以下协议是对于 Apache License 2.0 的补充，如有冲突，以以下协议为准。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          一、数据来源
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          1.1 本项目的数据来源原理是从各官方音乐平台的公开服务器中拉取数据（与未登录状态在官方平台 APP 获取的数据相同），经过对数据简单地筛选与合并后进行展示，因此本项目不对数据的准确性负责。{'\n'}
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          1.2 本项目本身没有获取某个音频数据的能力，本项目使用的在线音频数据来源来自软件设置内"自定义源"设置所选择的"源"返回的在线链接。例如播放某首歌，本项目所做的只是将希望播放的歌曲名、艺术家等信息传递给"源"，若"源"返回了一个链接，则本项目将认为这就是该歌曲的音频数据而进行使用，至于这是不是正确的音频数据本项目无法校验其准确性，所以使用本项目的过程中可能会出现希望播放的音频与实际播放的音频不对应或者无法播放的问题。{'\n'}
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          1.3 本项目的非官方平台数据（例如"我的列表"内列表）来自使用者本地系统或者使用者连接的同步服务，本项目不对这些数据的合法性、准确性负责。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          二、版权数据
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          2.1 使用本项目的过程中可能会产生版权数据。对于这些版权数据，本项目不拥有它们的所有权。为了避免侵权，使用者务必在 <Text style={[styles.boldText, { color: theme['c-primary-font'] }]}>24 小时内</Text> 清除使用本项目的过程中所产生的版权数据。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          三、音乐平台别名
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          3.1 本项目内的官方音乐平台别名为本项目内对官方音乐平台的一个称呼，不包含恶意。如果官方音乐平台觉得不妥，可联系本项目更改或移除。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          四、资源使用
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          4.1 本项目内使用的部分包括但不限于字体、图片等资源来源于互联网。如果出现侵权可联系本项目移除。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          五、免责声明
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          5.1 由于使用本项目产生的包括由于本协议或由于使用或无法使用本项目而引起的任何性质的任何直接、间接、特殊、偶然或结果性损害（包括但不限于因商誉损失、停工、计算机故障或故障引起的损害赔偿，或任何及所有其他商业损害或损失）由使用者负责。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          六、使用限制
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          6.1 本项目完全免费，且开源发布于 <Text onPress={openHomePage} style={textLinkStyle}>GitHub</Text> 面向全世界人用作对技术的学习交流，本项目不对项目内的技术可能存在违反当地法律法规的行为作保证。{'\n'}
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          6.2 <Text style={[styles.boldText, { color: theme['c-primary-font'] }]}>禁止在违反当地法律法规的情况下使用本项目</Text>，对于使用者在明知或不知当地法律法规不允许的情况下使用本项目所造成的任何违法违规行为由使用者承担，本项目不承担由此造成的任何直接、间接、特殊、偶然或结果性责任。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          七、版权保护
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          7.1 音乐平台不易，请尊重版权，支持正版。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          八、非商业性质
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          8.1 本项目仅用于对技术可行性的探索及研究，不接受任何商业（包括但不限于广告等）合作及捐赠。{'\n'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme['c-primary-font'] }]}>
          九、接受协议
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          9.1 若你使用了本项目，将代表你接受本协议。{'\n'}
        </Text>
        <Text style={[styles.sectionContent, { color: theme['c-font-label'] }]}>
          * 若协议更新，恕不另行通知，可到开源地址查看。
        </Text>

        <Text style={[styles.finalTip, { color: theme['c-primary-font'] }]}>
          若你（使用者）接受以上协议，请点击下面的"接受"按钮签署本协议；若不接受，请点击"不接受"后退出软件并清除本软件的所有数据。
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Button
            style={[styles.rejectButton, { backgroundColor: theme['c-button-background'] }]}
            onPress={handleReject}
          >
            <Text style={[styles.rejectButtonText, { color: theme['c-primary-font'] }]}>
              不接受
            </Text>
          </Button>
          
          <Button
            style={[styles.acceptButton, {
              backgroundColor: countdown > 0 ? theme['c-button-background'] : theme['c-primary']
            }]}
            onPress={handleAccept}
            disabled={isAccepting || countdown > 0}
          >
            <Text style={[styles.acceptButtonText, {
              color: countdown > 0 ? theme['c-font-label'] : '#ffffff'
            }]}>
              {isAccepting ? '处理中...' : countdown > 0 ? `接受（${countdown}）` : '接受'}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  warningText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  finalTip: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
})