// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
const config = require("../config/index")
const api=config.api;





// get请求
function get(url){
  this.requestLoading('get',url, '')
}

//post
function post(url,data){
  // console.log('post')
  this.requestLoading('post',url, data)
}



/**
* 开启请求
* 如果头部已经有协议，就表示是第三方api
**/
function requestLoading(type,url, data) {

  var self=this;
  url = api+url;
  return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        header: {
          'Content-Type': 'application/json',
        },
        method: type,
        success: function (res) {

            resolve( res.data );

        },
        fail: function (res) {
          reject(res);

        },
        complete: function (res) {
          // console.log(res)
        },
      })
  })

}
module.exports = {
  post:post,
  get:get,
  requestLoading:requestLoading
}

