const userModel = require("../../../utils/userModel.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    form:app.userInfo
  },


  onLoad: function() {
  
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {
     var form = app.userInfo;
     if(form.ad =='点击这里,介绍你要卖的宝贝们'){
         form.ad ='';
     }
     this.setData({
      form:form
     })
  },



  onShow: function() {

  },
  
  getUserInfo(e) {
    var data = e.detail.userInfo;
    data.openid = wx.getStorageSync('openid');
    data.college = wx.getStorageSync('college');
    data.ad = this.data.form.ad;
    userModel.updateUser(data,function(res){
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
    }) 
  },

    // 保存用户编辑的个人主页介绍
  bindTextAreaBlur(e){
     this.data.form.ad = e.detail.value;

  }


});
