const network = require("./network.js")
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调

// 用户点赞
function userLike(id,callback,fail){
  network.post('wechat.php?ctrl=api&action=userLike',{id: id},callback,fail)
  // network.post('/user.php?code=takeNote',data,callback,fail)
}

function chooseCollege(obj,callback,fail){
  network.post('wechat.php?ctrl=api&action=chooseCollege',obj,callback,fail)
  // network.post('/user.php?code=takeNote',data,callback,fail)
}

// 访客统计
function  takeNote(data,callback,fail){
    network.post('wechat.php?ctrl=api&action=takeNote',data,callback,fail)
}

// 访客统计
function  getVisitior(date,college,callback,fail){
  if (!college) {
     callback([])
  } else {
    const url = '/user.php?code=getVisitior&date='+date+'&college='+college
    network.get(url,callback,fail)
  }

}
function test(callback,fail){
     var url = "/user.php?code=test";
     network.get(url,callback,fail)  
}

// 通过code换取用户的openid
function getOpenid(callback,fail){
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          var url = 'weixin.php?action=openid&jscode='+res.code;
          network.get(url,callback,fail)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });   
}



// 获取用户微信基础信息
function  getWXUserInfo(callback,fail){
    wx.getUserInfo({
      success: function(res) { 

        callback(res.userInfo);
      },
      fail:function(res){
        console.log(res)        
      }
    });
}


// 获取用户已经保存的信息
function  getUserInfo(openid,callback,fail){
     if(!openid){
       return false;
     }
     let url = "wechat.php?ctrl=api&action=getInfo";
     network.post(url,{openid: openid},callback,fail)  
}

// 更新用户信息
// status: 0删除 1正常 2官方
function  updateUser(data,callback,fail){
    network.post('wechat.php?ctrl=api&action=editUser',data,callback,fail)
}

// 更新消息状态
function  updateMessageStatus(data,callback,fail){
    network.post('/user.php?code=updateMessageStatus',data,callback,fail)
}

// 用户发表留言
function pushMessage(data,callback,fail){
  network.post('/user.php?code=message',data,callback,fail)
}

// 获取我的消息
function getMyMessage(openid,callback,fail){
  var url = '/user.php?code=getMyMessage&openid='+openid;
  network.get(url,callback,fail)
}

// 获取我和指定用户在二手详情中的咨询和回复
function getMessageByDetail(data,callback,fail){
   network.post('/user.php?code=getMessageByDetail',data,callback,fail)  
}

// 上传图片
function  uploadImg(data,callback,fail){
    network.post('/upload.php',data,callback,fail)
}



// 收集formid 不需要callback
function collectFormId(e){

    var openid = wx.getStorageSync('openid');
    if(!openid){
       return false;
    }
    var url = "user.php?code=formId";
    if( e.detail.formId == 'the formId is a mock one'){
      return false
    }
    var data = {
      openid:openid,
      formId:e.detail.formId
    }

    network.post(url, data, function(res) {
       console.log(res)
    }, false);
}




module.exports = {
  userLike: userLike,
  getVisitior:getVisitior,
  takeNote:takeNote,
  getWXUserInfo:getWXUserInfo,
  getUserInfo:getUserInfo,
  getOpenid:getOpenid,
  pushMessage:pushMessage,
  getMyMessage:getMyMessage,
  getMessageByDetail:getMessageByDetail,
  updateMessageStatus:updateMessageStatus,
  updateUser:updateUser,
  uploadImg:uploadImg,
  test:test,
  collectFormId:collectFormId,
  chooseCollege: chooseCollege
}

