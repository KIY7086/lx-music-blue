import { memo, ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'

export interface SettingCardProps {
  title: string
  description?: string
  children: ReactNode
  icon?: string
}

export default memo(({
  title,
  description,
  children,
  icon
}: SettingCardProps) => {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme['c-content-background'] }]}>
      <View style={[styles.header, { borderBottomColor: theme['c-border-background'] }]}>
        <Text style={[styles.title, { color: theme['c-font'] }]}>{title}</Text>
        {description && (
          <Text style={[styles.description, { color: theme['c-font-label'] }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  )
})

const styles = createStyle({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  content: {
    paddingVertical: 8,
  },
})