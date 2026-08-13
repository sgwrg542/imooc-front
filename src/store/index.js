import { createStore } from 'vuex'
import category from './modules/category'
import theme from './modules/theme'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
import search from './modules/search'

const store = createStore({
  getters,
  modules: {
    category,
    theme,
    app,
    user,
    search

  },
  plugins: [
  createPersistedState({
    // 指定保存到 localStorage 中的key
    key: 'imooc‑front',
    // 需要保存的模块
    paths: ['category', 'theme','search', 'user']
  })
]
})

export default store