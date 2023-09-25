import { reqGoodsList } from '@/api'
export default {
  state: {
    goodsList: [],
  },
  actions: {
    async getGoodsList({ commit }, pagedata) {
      let reslut = await reqGoodsList(pagedata)
      if (reslut.meta.status == 200) {
        commit('GETGOODSLIST', reslut.data)
      }
    },
  },
  mutations: {
    GETGOODSLIST(state, goodslist) {
      state.goodsList = goodslist
    },
  },
}
