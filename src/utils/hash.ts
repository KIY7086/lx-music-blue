import { hash128 } from 'react-native-xxhash'

/**
 * 计算字符串的xxHash128值
 * @param input 输入字符串
 * @returns xxHash128哈希值（十六进制字符串）
 */
export const calculateXXHash128 = async (input: string): Promise<string> => {
  try {
    const hash = await hash128(input)
    return hash
  } catch (error) {
    console.error('计算xxHash128失败:', error)
    throw new Error('哈希计算失败')
  }
}

/**
 * 计算用户API脚本的xxHash128值
 * @param script 用户API脚本内容
 * @returns 脚本的xxHash128哈希值
 */
export const calculateScriptHash = async (script: string): Promise<string> => {
  // 移除注释和空白字符，确保相同逻辑的脚本产生相同的哈希
  const normalizedScript = script
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
    .replace(/\/\/.*$/gm, '') // 移除行注释
    .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
    .trim()
  
  return calculateXXHash128(normalizedScript)
}