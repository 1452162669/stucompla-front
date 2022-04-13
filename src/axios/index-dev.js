import axios from 'axios'
import store from '../store'

const instance = axios.create({
  // baseURL: '/api/v1', // 开发模式下
  // baseURL: 'https://xanadu.aerowang.cn/api/v1', // 线上模式
  // baseURL: 'http://localhost:3000/api/v1',
  baseURL: '/dev_api', // 要对应后端端口
  // baseURL: 'http://123.56.124.33:3000/api/',
  // baseURL: 'https://www.fastmock.site/mock/c189d5ce3b7cb372ce6f287aa8bc6238/api',
  // 请求超时时间
  timeout: 10000
})

instance.interceptors.request.use(config => {
  if (store.state.user.jwt) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers.Authorization = store.state.user.jwt
  }
  // console.log(config)
  // 记得处理
  // config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})
instance.interceptors.response.use(
  response => {
    console.log(response)
    // console.log(response.headers.authorization)
    if (response.headers.authorization !== undefined) {
      store.dispatch('user/setJwt', response.headers.authorization)
      console.log('刷新jwt了---------------------------------')
    }
    if (response.headers.error !== undefined) {
      store.dispatch('user/resetState')

      console.log('jwt过期了，请重新登录---------------------------------')
    }
    return response
  }
)
export default instance
