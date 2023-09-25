import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import menus from './menus'
import users from './user'
import rights from './rights'
import roles from './roles'
import goods from './goods'
import cates from './cates'
import orders from './orders'

export default new Vuex.Store({
  modules: { menus, users, rights, roles, goods, cates, orders },
})
