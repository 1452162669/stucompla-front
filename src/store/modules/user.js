import { getToken, removeToken, setToken, getAvatar, removeAvatar, setAvatar, getUserId, removeUserId, setUserId } from '../../utils/auth'

import { getUnReadTotal, removeUnReadTotal, setUnReadTotal } from '../../utils/letter'
// import login from '../../views/web/login'

const state = {
  jwt: getToken(),
  userId: getUserId(),
  avatar: getAvatar(),
  unReadTotal: getUnReadTotal()
}
const mutations = {
  RESET_STATE: (state) => {
    state.jwt = undefined
    state.unReadTotal = undefined
    state.avatar = undefined
    state.userId = undefined
    removeToken()
    removeAvatar()
    removeUserId()
    removeUnReadTotal()
  },
  SET_JWT: (state, jwt) => {
    state.jwt = jwt
    setToken(jwt)
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
    setUserId(userId)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    setAvatar(avatar)
  },
  SET_UNREADTOTAL: (state, total) => {
    state.unReadTotal = total
    setUnReadTotal(total)
  }

}

const actions = {
  setJwt ({ commit }, jwt) {
    return new Promise(resolve =>
      commit('SET_JWT', jwt))
  },
  setUserId ({ commit }, userId) {
    return new Promise(resolve =>
      commit('SET_USERID', userId))
  },
  setAvatar ({ commit }, avatar) {
    return new Promise(resolve =>
      commit('SET_AVATAR', avatar))
  },
  setUnReadTotal ({ commit }, total) {
    return new Promise(resolve =>
      commit('SET_UNREADTOTAL', total))
  },
  resetState ({ commit }) {
    return new Promise(resolve => commit('RESET_STATE'))
  }
  // // 获取账户信息
  // getAccountInfo () {
  //   return new Promise(resolve => {
  //     this.$http.get('/user/info').then(res => {
  //       if (res.data.code !== 200) {
  //         this.$message.error('获取账户信息失败')
  //       } else {
  //         console.log(res.data.data)
  //         this.$store.commit('user/SET_AVATAR', { avatar: res.data.data.avatar })
  //         resolve(res.data.data)
  //       }
  //     })
  //   })
  // },
  // login ({ commit }, loginForm) {
  //   return new Promise(resolve => {
  //     this.$http.post('/user/login/', loginForm).then(res => {
  //       if (res.data.code !== 200) {
  //         this.$message({
  //           message: res.data.msg,
  //           type: 'error'
  //         })
  //       } else {
  //         commit('SET_JWT', res.data.data)
  //         this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: false })
  //         this.$message.success('登录成功')
  //         // this.$store.dispatch('user/setJwt', res.data.data)
  //         // this.dialogLoginVisible = false
  //         // this.$message({
  //         //   message: '登录成功',
  //         //   type: 'success'
  //         // })
  //         // this.$router.go(0)
  //         this.$router.replace({
  //           path: '/refresh',
  //           query: {
  //             t: Date.now()
  //           }
  //         })
  //       }
  //       // console.log('2访问完成。赋值完成。')
  //     })
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
