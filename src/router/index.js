import { createWebHashHistory } from "vue-router";
import { createRouter } from "vue-router";
import { isMobilephone } from "../utils/flexible";
import mobileTerminalRoutes from './modules/mobile-routes'
import pcTerminalRoutes from './modules/pc-routes'
import store from '../store'

// 创建路由实例
// 注意：isMobilephone 是 computed ref，需通过 .value 取值
const router = createRouter({
  history:createWebHashHistory(),
  routes:isMobilephone.value ? mobileTerminalRoutes : pcTerminalRoutes
})

// 全局前置守卫：根据导航方向设置路由跳转类型（用于移动端转场动画）
// 维护路由历史栈来判断前进/后退（beforeEach 中 history.state 尚未更新，无法用 forward 判断）
const routeHistory = []
router.beforeEach((to, from) => {
  // 首次进入应用：不播放动画
  if (!from.name) {
    routeHistory.push(to.fullPath)
    store.commit('app/changeRouterType', 'none')
    return
  }
  // 判断后退：目标路由在历史栈中已存在
  const historyIndex = routeHistory.lastIndexOf(to.fullPath)
  const isBack = historyIndex !== -1
  if (isBack) {
    // 后退操作：回退到该历史位置
    routeHistory.length = historyIndex + 1
  } else {
    // 前进操作
    routeHistory.push(to.fullPath)
  }
  // 进入首页：后退时有动画，前进时（如首次加载、点击跳首页）不播放滑入动画
  if (to.name === 'home') {
    routeHistory.length = 0
    routeHistory.push(to.fullPath)
    store.commit('app/changeRouterType', isBack ? 'back' : 'none')
    return
  }
  store.commit('app/changeRouterType', isBack ? 'back' : 'push')
})

export default router