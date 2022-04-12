import { getToken, setToken } from '../../utils/auth'

const state = {
  jwt: getToken()
}
const mutations = {
  RESET_STATE: (state) => {
    state.jwt = undefined
  },
  SET_JWT: (state, jwt) => {
    state.jwt = jwt
    setToken(jwt)
    console.log(state.jwt)
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
