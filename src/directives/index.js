/**
 * 全局注册指令
 */
export default {
  install(app) {
    // eager: true 同步加载所有指令模块（指令必须在组件渲染前完成注册）
    const directives = import.meta.glob('./modules/*.js', { eager: true })
    for (const [key, value] of Object.entries(directives)) {
      // 拼接指令注册的 name（文件名）
      const arr = key.split('/')
      const directiveName = arr[arr.length - 1].replace('.js', '')
      // 完成注册
      app.directive(directiveName, value.default)
    }
  }
}