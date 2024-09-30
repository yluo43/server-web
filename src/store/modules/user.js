import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, setCName, getCName, removeCName, setUserID, getUserID, removeUserID } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    cName: getCName,
    avatar: getUserID,
    empId: '',
    isManager: false,
    deptId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_EMPID: (state, empId) => {
    state.empId = empId
  },
  SET_IS_MANAGER: (state, isManager) => {
    state.isManager = isManager
  },
  SET_DEPT_ID:  (state, deptId) => {
    state.deptId = deptId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          //const { data } = response
          commit('SET_TOKEN', response.token)
          setToken(response.token)
          setCName(response.name)
          setUserID(response.userID)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          // logout().then(() => {
          removeToken() // must remove  token  first
          removeCName()
          removeUserID()
          resetRouter()
          commit('RESET_STATE')
          commit('SET_PERMISSIONS', [])
          //登出后更新store中的router
          store.dispatch('GenerateNullRoutes').then((accessRoutes) => {
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
          })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          /*
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_PERMISSIONS', res.permissions)
        */
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
