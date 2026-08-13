import { loginUser,getProfile,registerUser } from '@/api/sys'
import md5 from 'md5'
import { message } from '@/libs'

export default {
  namespaced: true,
  state: () => ({
    // 登录之后的 token
    token: '',
    // 获取用户信息（预置默认字段，避免页面渲染时字段为 undefined 触发告警/崩溃）
    userInfo: {
      nickname: '',
      avatar: '',
      vipLevel: 0,
      title: '',
      company: '',
      homePage: '',
      introduction: ''
    }
  }),
  mutations: {
    /**
     * 保存 token
     */
    setToken(state, newToken) {
      state.token = newToken
    },
    // 保存用户信息
    setUserInfo(state,newInfo){
      state.userInfo = newInfo
    }
  },
  actions: {
     /**
     * 注册
     */
    async register(context, payload) {
      const { password } = payload
      // 注册
      return await registerUser({
        ...payload,
        password: password ? md5(password) : ''
      })
    },
    /**
     * 登录
     */
    async login(context, payload) {
      const { password } = payload
      const data = await loginUser({
        ...payload,
        password: password ? md5(password) : ''
      })
      context.commit('setToken', data.token)
      context.dispatch('profile')
    },
     /**
     * 获取用户信息
     */
    async profile(context) {
      const data = await getProfile()
      context.commit('setUserInfo', data)
      // 欢迎
      message(
        'success',
        `欢迎您 ${
          data.vipLevel
            ? '尊贵的 VIP' + data.vipLevel + ' 用户 ' + data.nickname
            : data.nickname
        } `,
        6000
      )
    },
    /**
     * 退出登录
     */
    logout(context) {
      context.commit('setToken', '')
      context.commit('setUserInfo', {})
      // 退出登录之后，重新刷新下页面，因为对于前台项目而言，用户是否登录（是否为 VIP）看到的数据可能不同
      location.reload()
    },

  }
}

