import { reqMenus } from '@/api/index'
export default {
  state: {
    menusData: [],
  },
  getters: {},
  mutations: {
    GETMENUSDATA(state, menusdata) {
      state.menusData = menusdata
    },
  },
  actions: {
    async getMenusdata({ commit }) {
      let reslut = await reqMenus()
      if (reslut.meta.status == 200) {
        commit('GETMENUSDATA', reslut.data)
      }
    },
  },
}
