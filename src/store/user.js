import { reqUsers } from '@/api'
export default {
  state: {
    usersData: [],
  },
  getters: {},
  mutations: {
    GETUSERDATA(state, userdata) {
      state.usersData = userdata
    },
  },
  actions: {
    async getUserData({ commit }, pagedata) {
      //   console.log(pagedata)
      let reslut = await reqUsers(pagedata)
      if (reslut.meta.status == 200) {
        commit('GETUSERDATA', reslut.data)
      }
    },
  },
}
