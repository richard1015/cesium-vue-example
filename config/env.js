/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * test
 */

let config = {}

switch (process.env.NODE_ENV) {
  case 'development':
    /*
    * 开发环境    => npm run dev
    */
    // config.baseUrl = 'http://127.0.0.1:7001'
    config.baseUrl = 'https://zhuzhida.vip'
    break
  case 'production':
    /*
     * 线上环境 => npm run build
     */
    config.baseUrl = 'https://zhuzhida.vip'
    break
}

export default config
