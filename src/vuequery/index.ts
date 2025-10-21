import { useMessage } from '@/components/message'
import { QueryClient } from '@tanstack/vue-query'

const message = useMessage()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      throwOnError: (error, query) => {
        // 查询操作错误处理函数
        console.log(error, query)
        message.error(error as unknown as string)
        return true
      },
      staleTime: Infinity
    },
    mutations: {
      onError: error => {
        // 变更操作错误处理
        message.error(error as unknown as string)
      }
    }
  }
})

export default queryClient
