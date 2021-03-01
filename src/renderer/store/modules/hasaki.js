import api from '@/api'

const state = {
  hasakiConfig: {}
}

const mutations = {
  UPDATE_HASAKI_PREFERENCE_DATA (state, config) {
    state.hasakiConfig = { ...state.hasakiConfig, ...config }
  }
}

const actions = {
  fetchPreference ({ commit }) {
    return new Promise((resolve) => {
      api.fetchHasakiPreference()
        .then((config) => {
          commit('UPDATE_HASAKI_PREFERENCE_DATA', config)
          resolve(config)
        })
    })
  },
  save ({ commit, dispatch }, config) {
    commit('UPDATE_HASAKI_PREFERENCE_DATA', config)
    return api.saveHasakiPreference(config)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
