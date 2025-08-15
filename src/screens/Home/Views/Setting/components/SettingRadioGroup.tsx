import { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

export interface SettingRadioGroupProps<T extends string> {
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
}: SettingRadioGroupProps<T>) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme['c-font'] }]}>{label}</Text>
      {description && (
        <Text style={[styles.description, { color: theme['c-font-label'] }]}>
          {description}
        </Text>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: value === option.value 
                  ? theme['c-primary-background'] 
                  : theme['c-content-background'],
                borderColor: value === option.value 
                  ? theme['c-primary'] 
                  : theme['c-border-background'],
              }
            ]}
            onPress={() => !disabled && onValueChange(option.value)}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.optionText,
              {
                color: value === option.value 
                  ? theme['c-primary-font'] 
                  : theme['c-font'],
                fontWeight: value === option.value ? '600' : '400',
              }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
  },
})