import { useMessage } from '@/components/message'
import type { ResultVO } from '@/types'
import axios from 'axios'

axios.defaults.baseURL = '/api/'
const message = useMessage()

// Axios请求配置：注入token
axios.interceptors.request.use(
  req => {
    const token = sessionStorage.getItem('token')
    if (token && req.headers) {
      req.headers.token = token
    }
    return req
  },
  error => {
    message.error(error)
    return Promise.reject(error)
  }
)

// Axios响应配置
axios.interceptors.response.use(
  resp => {
    const data: ResultVO = resp.data
    if (data.code == 200) {
      return resp
    }

    if (data.code != 200) {
      return Promise.reject(data.message)
    }
    return resp
  },
  error => {
    return Promise.reject(error.message)
  }
)

// 封装axios请求方法
export const useGet = async (url: string) => {
  const resp = await axios.get<ResultVO>(url)
  return resp.data.data
}

export const usePost = async (url: string, data: unknown) => {
  const resp = await axios.post<ResultVO>(url, data)
  return resp.data.data
}

export const usePut = async (url: string) => {
  const resp = await axios.put<ResultVO>(url)
  return resp.data.data
}

export const usePatch = async (url: string, data: unknown) => {
  const resp = await axios.patch<ResultVO>(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return resp.data.data
}

export const useDelete = async (url: string) => {
  const resp = await axios.delete<ResultVO>(url)
  return resp.data.data
}

export default axios
