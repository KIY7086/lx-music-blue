import { unzip } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import { log } from './log'

export interface ZipFileInfo {
  path: string
  name: string
  size: number
}

/**
 * 解压ZIP文件到指定目录
 * @param zipPath ZIP文件路径
 * @param targetDir 解压目标目录
 * @returns 解压后的目录路径
 */
export const unzipFile = async (zipPath: string, targetDir?: string): Promise<string> => {
  try {
    const targetDirectory = targetDir || `${RNFS.TemporaryDirectoryPath}/unzip_${Date.now()}`
    
    // 确保目标目录存在
    await RNFS.mkdir(targetDirectory)
    
    // 解压文件
    const unzipPath = await unzip(zipPath, targetDirectory)
    log.info(`ZIP文件解压成功: ${zipPath} -> ${unzipPath}`)
    
    return unzipPath
  } catch (error) {
    log.error(`解压ZIP文件失败: ${zipPath}`, error)
    throw new Error(`解压失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 递归查找目录中的所有JS文件
 * @param directory 要搜索的目录
 * @returns JS文件路径数组
 */
export const findAllJsFiles = async (directory: string): Promise<string[]> => {
  const jsFiles: string[] = []
  
  try {
    const items = await RNFS.readDir(directory)
    
    for (const item of items) {
      if (item.isFile() && item.name.toLowerCase().endsWith('.js')) {
        jsFiles.push(item.path)
      } else if (item.isDirectory()) {
        // 递归查找子目录
        const subFiles = await findAllJsFiles(item.path)
        jsFiles.push(...subFiles)
      }
    }
  } catch (error) {
    log.error(`读取目录失败: ${directory}`, error)
  }
  
  return jsFiles
}

/**
 * 清理临时解压目录
 * @param directory 要清理的目录
 */
export const cleanupDirectory = async (directory: string): Promise<void> => {
  try {
    const exists = await RNFS.exists(directory)
    if (exists) {
      await RNFS.unlink(directory)
      log.info(`清理临时目录: ${directory}`)
    }
  } catch (error) {
    log.error(`清理目录失败: ${directory}`, error)
  }
}

/**
 * 获取文件信息
 * @param filePath 文件路径
 * @returns 文件信息
 */
export const getFileInfo = async (filePath: string): Promise<ZipFileInfo | null> => {
  try {
    const stats = await RNFS.stat(filePath)
    return {
      path: filePath,
      name: stats.name || filePath.split('/').pop() || 'unknown',
      size: stats.size,
    }
  } catch (error) {
    log.error(`获取文件信息失败: ${filePath}`, error)
    return null
  }
}

/**
 * 检查文件是否存在
 * @param filePath 文件路径
 * @returns 是否存在
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    return await RNFS.exists(filePath)
  } catch {
    return false
  }
}