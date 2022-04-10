const state = {
  token: localStorage.getItem('token')
}
const mutations = {
  // RESET_STATE: (state) => {
  //   // Object.assign(state, getDefaultState())
  // },
  SET_TOKEN: (state, token) => {
    state.token = token
    localStorage.setItem('token', token)
  }
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

const actions = {
  setToken ({ commit }, token) {
    return new Promise(resolve =>
      commit('SET_TOKEN', token))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
