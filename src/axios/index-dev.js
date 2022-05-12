import axios from 'axios'
import store from '../store'

const instance = axios.create({

  baseURL: '/dev_api', // 要对应后端端口

  // 请求超时时间
  timeout: 50000
})

instance.interceptors.request.use(config => {
  if (store.state.user.jwt !== undefined) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers.Authorization = store.state.user.jwt
  }
  // console.log(config)
  // 记得处理
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
