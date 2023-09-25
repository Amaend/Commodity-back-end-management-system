import { reqRightsList } from '@/api'
export default {
  state: {
    rightsList: [],
  },
  actions: {
    async getRightsList({ commit }) {
      let reslut = await reqRightsList()
      if (reslut.meta.status == 200) {
        commit('GETRIGHTLIST', reslut.data)
      }
    },
  },
  mutations: {
    GETRIGHTLIST(state, rightslist) {
      state.rightsList = rightslist
    },
  },
}
