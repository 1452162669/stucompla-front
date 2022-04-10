import { getToken, setToken } from '../../utils/auth'

const state = {
  jwt: getToken()
}
const mutations = {
  // RESET_STATE: (state) => {
  //   // Object.assign(state, getDefaultState())
  // },
  SET_JWT: (state, jwt) => {
    state.jwt = jwt
    setToken(jwt)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
