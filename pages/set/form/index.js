const userModel = require("../../../utils/userModel.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    userInfo: {}
  },


  onLoad: function() {
    console.log('ok')
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {

  },



  onShow: function() {
     let userInfo = wx.getStorageSync('userInfo');
     this.setData({
       userInfo: userInfo
     })
  },

  editInput (e) {
    console.log(e)
    let key = e.currentTarget.dataset.name
    let userInfo = this.data.userInfo
    userInfo[key] = e.detail.value
    this.setData({
      userInfo: userInfo
    })
  },

  formSubmit (e) {

    userModel.updateUser(this.data.userInfo,function(r){
      if (r.res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'success',
          duration: 2000
        })        
      }
    },false)
  },
  
  getUserInfo(e) {
    var data = e.detail.userInfo;
    // data.openid = wx.getStorageSync('openid');
    // data.college = wx.getStorageSync('college');
    // data.ad = this.data.form.ad;
    // userModel.updateUser(data,function(res){
    //   wx.showToast({
    //     title: '保存成功',
    //     icon: 'success',
    //     duration: 2000
    //   })
    // }) 
  }
});
