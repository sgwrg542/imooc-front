import { createApp } from 'vue'
// 引入 Tailwind 样式（全局唯一样式入口）
import './styles/index.scss'
import App from './App.vue'
import router from './router'
import { useREM } from '@/utils/flexible'
import mLibs from './libs'
import mDirectives from './directives'
import 'virtual:svg-icons-register'
import store from './store'
import useTheme from './utils/theme'
import './permission'

const app = createApp(App)
useREM()
useTheme()
// 注册路由（必须在 mount 之前）
app.use(router)
app.use(store)
app.use(mLibs)
app.use(mDirectives)
app.mount('#app')
