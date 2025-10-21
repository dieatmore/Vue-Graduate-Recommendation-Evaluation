import { ElNotification } from 'element-plus'
export const useMessage = () => {
  return {
    // 消息提示
    info(content: string) {
      ElNotification({
        title: '消息！',
        message: content,
        type: 'info'
      })
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
      ElNotification({
        title: '成功！',
        message: content,
        type: 'success'
      })
    },
    // 警告消息
    warning(content: string) {
      ElNotification({
        title: '警告！',
        message: content,
        type: 'warning'
      })
    }
  }
}
