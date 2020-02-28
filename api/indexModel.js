// 引入 HTTP 类 路径是相对路径
import http  from '../lib/http.js'

// 定义一个类，来继承 HTTP 直接拥有 HTTP 的方法
// class indexModel extends HTTP {
//   // 获取首页banner
//   indexBanner(){
//     // 直接使用 this 的方法
//     return this.request({
//       // 传入 接口的url
//       url: config.index.banner
//       // 此接口无需传递参数 所以data 不传
//     })
//   }
  
//   // 设置语言 传入参数
//   setLangs(lang){
//     return HTTP.request({
//       url: 'getInfo',
//       // 需要传递的参数 放入data
//       data:{
//         // 参数赋值 发送给后台
//         type: lang
//       }
//     })
//   }
// }

const  setLangs = (lang) => {
  return http.request({
    url: 'getInfo',
    // 需要传递的参数 放入data
    data:{
      // 参数赋值 发送给后台
      type: lang
    }
  })
}

// 抛出 此类 供页面使用
// export {
//   indexModel
// }
export default {
  setLangs
}