import { memo, useImperativeHandle, forwardRef, useState, useRef } from 'react'
import { View } from 'react-native'
import Modal, { type ModalType } from '@/components/common/Modal'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'

export interface ImportProgressModalType {
  show: (total: number) => void
  hide: () => void
  updateProgress: (current: number, message?: string) => void
}

export default forwardRef<ImportProgressModalType, {}>((props, ref) => {
  const theme = useTheme()
  const modalRef = useRef<ModalType>(null)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')

  const show = (totalFiles: number) => {
    setTotal(totalFiles)
    setCurrent(0)
    setMessage('准备导入...')
    modalRef.current?.setVisible(true)
  }

  const hide = () => {
    modalRef.current?.setVisible(false)
  }

  const updateProgress = (currentFile: number, msg?: string) => {
    setCurrent(currentFile)
    if (msg) setMessage(msg)
  }

  useImperativeHandle(ref, () => ({
    show,
    hide,
    updateProgress,
  }))

  const progress = total > 0 ? (current / total) * 100 : 0
  const animatedWidth = `${progress}%`

  return (
    <Modal
      ref={modalRef}
      bgHide={false}
      keyHide={false}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.container, { backgroundColor: theme['c-primary-background'] }]}>
          <Text size={18} style={[styles.title, { color: theme['c-font'] }]}>导入进度</Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme['c-border-background'] }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: progress,
                    backgroundColor: theme['c-primary-font']
                  }
                ]}
              />
            </View>
            <Text size={14} style={[styles.progressText, { color: theme['c-font'] }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          
          <Text size={14} style={[styles.fileCount, { color: theme['c-font-label'] }]}>
            {current} / {total} 文件
          </Text>
          
          <Text size={13} style={[styles.message, { color: theme['c-500'] }]} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  )
})

const styles = createStyle({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    padding: 25,
    minWidth: 300,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  fileCount: {
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
  },
})