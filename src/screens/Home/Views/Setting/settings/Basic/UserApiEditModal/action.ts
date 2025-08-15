import { importUserApi } from '@/core/userApi'
import { readFile } from '@/utils/fs'
import { log } from '@/utils/log'
import { toast } from '@/utils/tools'
import { unzipFile, findAllJsFiles, cleanupDirectory, fileExists } from '@/utils/zip'

// 全局进度状态管理
let progressCallback: ((progress: { visible: boolean; current: number; total: number; message: string }) => void) | null = null

export const setProgressCallback = (callback: (progress: { visible: boolean; current: number; total: number; message: string }) => void) => {
  progressCallback = callback
}

// 检查文件是否为ZIP格式
const isZipFile = (path: string): boolean => {
  return path.toLowerCase().endsWith('.zip')
}

// 检查文件是否为JS格式
const isJsFile = (path: string): boolean => {
  return path.toLowerCase().endsWith('.js')
}

const updateProgress = (visible: boolean, current: number = 0, total: number = 0, message: string = '') => {
  if (progressCallback) {
    progressCallback({ visible, current, total, message })
  }
}

export const handleImportScript = async(script: string, fileName?: string) => {
  await importUserApi(script).catch((error: any) => {
    log.error(error.stack)
    throw error
  })
}

export const handleImportLocalFile = async (path: string) => {
  let tempDir = ''
  
  try {
    updateProgress(true, 0, 0, '正在检查文件...')
    
    if (!(await fileExists(path))) {
      throw new Error('文件不存在')
    }
    
    let jsFiles: string[] = []
    
    if (isZipFile(path)) {
      updateProgress(true, 0, 0, '正在解压ZIP文件...')
      tempDir = await unzipFile(path)
      jsFiles = await findAllJsFiles(tempDir)
    } else if (isJsFile(path)) {
      jsFiles = [path]
    } else {
      jsFiles = await findAllJsFiles(path)
    }
    
    if (jsFiles.length === 0) {
      updateProgress(false)
      return
    }
    
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    
    for (let i = 0; i < jsFiles.length; i++) {
      const filePath = jsFiles[i]
      const fileName = filePath.split('/').pop() || '未知文件'
      
      updateProgress(true, i + 1, jsFiles.length, `正在导入: ${fileName}`)
      
      try {
        const script = await readFile(filePath)
        if (script != null) {
          await handleImportScript(script, fileName)
          successCount++
        }
      } catch (error: any) {
        if (error.message === '该脚本已存在，跳过导入') {
          skipCount++
          log.info(`跳过重复脚本: ${fileName}`)
        } else {
          log.error(`导入文件失败: ${fileName}`, error)
          failCount++
        }
      }
    }
    
    updateProgress(false)
    
    if (tempDir) {
      await cleanupDirectory(tempDir).catch(log.error)
    }
    
    let message = ''
    if (successCount > 0) message += `成功导入 ${successCount} 个脚本`
    if (skipCount > 0) message += (message ? '，' : '') + `跳过 ${skipCount} 个重复脚本`
    if (failCount > 0) message += (message ? '，' : '') + `${failCount} 个文件导入失败`
    
    if (message) toast(message || '导入完成')
    
  } catch (error: any) {
    updateProgress(false)
    if (tempDir) {
      await cleanupDirectory(tempDir).catch(log.error)
    }
    toast(`导入失败: ${error.message}`)
  }
}
