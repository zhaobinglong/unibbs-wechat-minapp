const userModel = require("../../../utils/userModel.js");

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

  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {

  },



  onShow: function() {

  },


});
