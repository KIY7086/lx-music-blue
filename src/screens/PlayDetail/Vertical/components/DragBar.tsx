import { memo } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

export default memo(({ visible = true, onPress }: { visible?: boolean, onPress?: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.dragBar} disabled={!visible}>
      <View style={{ flex: 1, opacity: visible ? 1 : 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  dragBar: {
    width: '20%',
    height: 4,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 7,
    marginBottom: 10,
  },
})