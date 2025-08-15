import { memo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { ChevronRightIcon, XMarkIcon, CheckIcon } from 'react-native-heroicons/outline'

export interface SettingSelectProps<T extends string> {
  label: string
  description?: string
  options: Array<{
    label: string
    value: T
  }>
  value: T
  onValueChange: (value: T) => void
  disabled?: boolean
}

export default memo(<T extends string>({
  label,
  description,
  options,
  value,
  onValueChange,
  disabled = false
}: SettingSelectProps<T>) => {
  const theme = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  
  const selectedOption = options.find(opt => opt.value === value)
  const selectedLabel = selectedOption?.label || ''

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            backgroundColor: theme['c-content-background'],
          },
          disabled && styles.disabled
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme['c-font'] }]}>{label}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.selectText, { color: theme['c-font-label'] }]}>
            {selectedLabel}
          </Text>
          <ChevronRightIcon
            size={20}
            color={theme['c-font-label']}
          />
        </View>
      </TouchableOpacity>
      {description && (
        <Text style={[styles.description, { color: theme['c-font-label'] }]}>
          {description}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme['c-content-background'] }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme['c-border-background'] }]}>
              <Text style={[styles.modalTitle, { color: theme['c-font'] }]}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <XMarkIcon size={24} color={theme['c-font']} />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    {
                      borderBottomColor: theme['c-border-background'],
                    }
                  ]}
                  onPress={() => {
                    onValueChange(option.value)
                    setModalVisible(false)
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    { color: theme['c-font'] },
                    option.value === value && { color: theme['c-primary-font'] }
                  ]}>
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <CheckIcon size={20} color={theme['c-primary-font']} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
})

const styles = createStyle({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
  },
  labelContainer: {
    flexShrink: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 17,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 17,
    marginRight: 6,
  },
  description: {
    fontSize: 13,
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    maxHeight: '80%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 17,
  },
})