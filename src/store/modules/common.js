import { getConfig} from '@/api/config'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  roles: []
}

const mutations = {
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },  
}

const actions = {
  // get Total roles for admin add role
  getConfig({ commit }) {    
    return new Promise((resolve, reject) => {
        getConfig().then(response => {
            const { data } = response
            commit('SET_ROLES', response.roles)
            resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
