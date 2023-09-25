import { reqOrdersList } from '@/api'
export default {
  state: {
    ordersList: [],
  },
  actions: {
    async getOrdersList({ commit }, pagedata) {
      let reslut = await reqOrdersList(pagedata)
      if (reslut.meta.status == 200) {
        commit('GETORDERSLIST', reslut.data)
      }
    },
  },
  mutations: {
    GETORDERSLIST(state, ordreslist) {
      state.ordersList = ordreslist
    },
  },
}
