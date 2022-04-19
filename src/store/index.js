import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  // data
  state: {
    BannerHeight: 0,
    headerShadowActive: false,
    headerShow: false,
    headerLogoShow: true,
    navDarkActive: false,

    dialogLoginVisible: false,
    dialogRegisterVisible: false,

    articlePath: ''
  },
  mutations: {
    setBannerHeight (state, value) {
      state.BannerHeight = value.bannerHeight
    },
    setDialogLoginVisible (state, value) {
      state.dialogLoginVisible = value.dialogLoginVisible
    },
    setDialogRegisterVisible (state, value) {
      state.dialogRegisterVisible = value.dialogRegisterVisible
    },
    setShadowActive (state, value) {
      state.headerShadowActive = value.headerShadowActive
    },
    setHeaderShow (state, value) {
      state.headerShow = value.headerShow
    },
    setHeaderLogo (state, value) {
      state.headerLogoShow = value.headerLogoShow
    },
    setNavDarkActive (state, value) {
      state.navDarkActive = value.navDarkActive
    },
    SET_ARTICLE_PATH: (state, value) => {
      state.article_path = value.path
    }
  },
  actions: {
    setArticlePath ({ commit }, path) {
      return new Promise(resolve =>
        commit('SET_ARTICLE_PATH'), path)
    }
  },
  modules: {
    user
  }
})
