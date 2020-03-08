
//获取应用实例
var app = getApp();
Page({
  data: {
    form:{}
  },
  onShareAppMessage: function() {
    return {
      title: app.shareTitle,
      path: app.shareUrl
    };
  },

  onLoad: function() {
    app.new_school = true;
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {

  },



  onShow: function() {

  },

  clickAddWechat:function(){

      var itemList = ['guoboce','复制微信号到剪贴板']
      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          console.log(res.tapIndex)
          if(res.tapIndex == 0 || res.tapIndex == 1){
              wx.setClipboardData({
                data:'guoboce' ,
                success: function(res) {
                   console.log(res)
                   if(res.errMsg == 'setClipboardData:ok'){
                        wx.showToast({
                          title: '复制成功',
                          icon: 'success',
                          duration: 2000
                        })                      
                   }
                }
              })             
          }
        }
      })     
  },    



});
