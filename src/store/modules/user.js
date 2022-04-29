import { getToken, removeToken, setToken } from '../../utils/auth'
import { getUnReadTotal, removeUnReadTotal, setUnReadTotal } from '../../utils/letter'

const state = {
  jwt: getToken(),
  unReadTotal: getUnReadTotal()
}
const mutations = {
  RESET_STATE: (state) => {
    state.jwt = undefined
    state.unReadTotal = undefined
    removeToken()
    removeUnReadTotal()
  },
  SET_JWT: (state, jwt) => {
    state.jwt = jwt
    setToken(jwt)
    // console.log(state.jwt)
    // localStorage.setItem('jwt', jwt)
  },
  SET_UNREADTOTAL: (state, total) => {
    state.unReadTotal = total
    setUnReadTotal(total)
    // console.log(state.unReadTotal)
    // localStorage.setItem('jwt', jwt)
  }
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

const actions = {
  setJwt ({ commit }, jwt) {
    return new Promise(resolve =>
      commit('SET_JWT', jwt))
  },
  setUnReadTotal ({ commit }, total) {
    return new Promise(resolve =>
      commit('SET_UNREADTOTAL', total))
  },
  resetState ({ commit }) {
    return new Promise(resolve => commit('RESET_STATE'))
  },
  login ({ commit }, loginForm) {
    return new Promise(resolve => {
      this.$http.post('/user/login/', loginForm).then(res => {
        if (res.data.code !== 200) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        } else {
          commit('SET_JWT', res.data.data)
          this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: false })
          this.$message.success('登录成功')
          // this.$store.dispatch('user/setJwt', res.data.data)
          // this.dialogLoginVisible = false
          // this.$message({
          //   message: '登录成功',
          //   type: 'success'
          // })
          // this.$router.go(0)
          this.$router.replace({
            path: '/refresh',
            query: {
              t: Date.now()
            }
          })
        }
        // console.log('2访问完成。赋值完成。')
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
