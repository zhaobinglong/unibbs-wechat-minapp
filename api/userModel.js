// 引入 HTTP 类 路径是相对路径
import http  from '../lib/http.js'

const  requestSubscribeMessage = (ids) => {
  return new Promise((resolve, reject) => {
  	wx.requestSubscribeMessage({
	  tmplIds: ids,
	  success: (res) => { 
        resolve(res)
	  },
	  fail: (res) => {
	  	reject(res)
	  }
	})
  })
}

export default {
  requestSubscribeMessage
}