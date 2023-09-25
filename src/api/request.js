// 导入axios
import axios from 'axios'

// 创建axios实例对象
const requests = axios.create({
  // 设置配置对象
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 5000,
})
// 请求拦截器
requests.interceptors.request.use((config) => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
// 响应拦截器
requests.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    return Promise.reject(new Error('faile'))
  }
)

// 对外暴露
export default requests
