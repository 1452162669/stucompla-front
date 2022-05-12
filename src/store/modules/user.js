import { getToken, removeToken, setToken, getAvatar, removeAvatar, setAvatar, getUserId, removeUserId, setUserId } from '../../utils/auth'

import { getUnReadTotal, removeUnReadTotal, setUnReadTotal } from '../../utils/letter'

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

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
