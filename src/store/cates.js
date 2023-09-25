import { reqGetCateList } from '@/api'
export default {
  state: {
    cateList: [],
    total: null,
  },
  actions: {
    async getCateList({ commit }, queryinfo) {
      let res = await reqGetCateList(queryinfo)
      if (res.meta.status == 200) {
        commit('GETCATELIST', res.data)
      }
    },
  },
  mutations: {
    GETCATELIST(state, catelist) {
      state.cateList = catelist.result
      state.total = catelist.total
    },
  },
}
