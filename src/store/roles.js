import { reqRolesList } from '@/api'
export default {
  state: {
    rolesList: [],
  },
  actions: {
    async getRolesList({ commit }) {
      let reslut = await reqRolesList()
      if (reslut.meta.status == 200) {
        commit('GETROLESLIST', reslut.data)
      }
    },
  },
  mutations: {
    GETROLESLIST(state, roleslist) {
      state.rolesList = roleslist
    },
  },
}
