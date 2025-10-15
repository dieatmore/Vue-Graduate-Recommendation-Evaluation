import { ElMessage, ElNotification } from 'element-plus'
export const useMessage = () => {
  return {
    // 消息提示
    info(content: string) {
      ElMessage.info(content)
    },
    // 错误消息
    error(content: string) {
      ElNotification({
        title: '失败！',
        message: content,
        type: 'error'
      })
    },
    // 成功消息
    success(content: string) {
      ElMessage.success(content)
    },
    // 警告消息
    warning(content: string) {
      ElMessage.warning(content)
    }
  }
}
