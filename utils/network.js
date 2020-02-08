// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
const config = require("../config/index")
const api=config.api;

var  reCallBack = {} ;// 401错误的时候，保存当前请求信息

var  timeout = 0; //超次 最多重发三次

function getCode(){
    var self =this;
    wx.login({
      success: function (res) {
        console.log('在network中请求code')
        console.log(res.code)
        self.getToken(res.code)
      },
      fail:function(res){
        console.log('wx login 失败')
      }
    })
}

function getToken(code){
    var self = this;
    wx.request({
      url: api+'/api/v1/session/authorize', 
      method:'POST',
      data: { 'code':code},
      header: {'content-type': 'application/json' },
      success: function(res) {
        var obj = self.reCallBack;
        try {
            console.log(res)
            wx.setStorageSync('token',res.data.token );
            // self.timeout++;
            // if(self.timeout>3){
            //    console.log('已经重发三次了');
            //    self.timeout = 0;
            // }else{
               self.requestLoading(obj.type,obj.url, obj.data, obj.success,obj.fail) 
            // }
            
        } catch (e) {  
            console.log(e)
        }
      },
      fail:function(res){
        console.log(res);
        console.log('在network中请求token失败')
      }
    })

  }





// get请求
function get(url,success,fail){
  this.requestLoading('get',url, '', success,fail)
}

//post
function post(url,data,success,fail){
  // console.log('post')
  this.requestLoading('post',url, data,success, fail)
}

// put
function put(url,data,success,fail){
  this.requestLoading('put',url,data,success,fail);
}

// delete
function del(url,success,fail){
  this.requestLoading('delete',url, '', success,fail)
}


/**
* 请求第一次封装
* 如果头部已经有协议，就表示是第三方api
**/
function requestLoading(type,url, data, success,fail) {

  // 给url加头
  const isThirdApi = /http/i.test(url);
  if(!isThirdApi){
     url = api+url;
  }
  
  // 前端在网页授权时，会把用户的openid保存自爱storage中
  // 每次发送请求，都需要携带该openid
  // 如果没有找到openid，则重新让用户授权
  // const myopenid = wx.getStorageSync('openid');

  // if (!myopenid) {

  // } else {
  //   data.openid = myopenid
  // }

  wx.request({
    url: url,
    data: data,
    header: {
      'Content-Type': 'application/json',
    },
    method: type,
    success: function (res) {

      // 请求返回正常
      if (res.statusCode == 200 ) {
        success(res.data)

      } else {

        // 有时候前端需要错误回掉，有时候不需要
        if(fail){
           fail();
        }else{
          wx.showToast({
             title: res.errMsg,
             image:'../common/img/icon/error.png',
             duration: 1000
          })          
        }
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()

        if(fail){
           fail();
        }else{
            wx.showToast({
               title: res.errMsg,
               image:'../common/img/icon/error.png',
               duration: 2000
            })
        }
      console.log(res)

    },
    complete: function (res) {
      // console.log(res)
    },
  })
}

/**
* 第二层封装
**/
function wxrequest(type,url, data, success,fail) {

  var self=this;

  const isThirdApi = /http/i.test(url);
  if(!isThirdApi){
     url = api+url;
  }
  
  // 前端在网页授权时，会把用户的openid保存自爱storage中
  // 每次发送请求，都需要携带该openid
  // 如果没有找到openid，则重新让用户授权
  const myopenid = wx.getStorageSync('openid');
  data.openid = myopenid


  wx.request({
    url: url,
    data: data,
    header: {
      'Content-Type': 'application/json',
    },
    method: type,
    success: function (res) {

      // 请求返回正常
      if (res.statusCode == 200 ) {
        success(res.data)

      } else {

        // 有时候前端需要错误回掉，有时候不需要
        if(fail){
           fail();
        }else{
          wx.showToast({
             title: res.errMsg,
             image:'../common/img/icon/error.png',
             duration: 1000
          })          
        }
      }

    },
    fail: function (res) {
      wx.hideNavigationBarLoading()

        if(fail){
           fail();
        }else{
            wx.showToast({
               title: res.errMsg,
               image:'../common/img/icon/error.png',
               duration: 2000
            })
        }
      console.log(res)

    },
    complete: function (res) {
      // console.log(res)
    },
  })
}
module.exports = {
  post:post,
  get:get,
  put:put,
  del:del,
  getToken:getToken,
  getCode:getCode,
  requestLoading:requestLoading
}

