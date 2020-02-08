
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");
const systemModel = require("../../../utils/systemModel.js");
const util = require("../../../utils/util.js");
const config = require("../../../config/index.js");


//获取应用实例
var app = getApp();
Page({
  data: {
     id:'',
     form:{}
  },
  // 在详情页面的分享，要带上来源信息
  // 每个页面都要写这个函数，不科学呀
  onShareAppMessage: function() {
    console.log(this.data.form)
    let is_goods = util.is_goods(this.data.form.category)
    var title = '' 
    var imageUrl = ''
    let price  = '' 
    if (this.data.form.price) {
      price = this.data.form.price + this.data.form.symbol + ','
    } else {
      price = ''
    } 
    if (is_goods){
      title = this.data.form.college+'：'+ price +this.data.form.cont;
    } else {
      title = this.data.form.college+'：'+ this.data.form.cont;
    }
    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    if (this.data.form.imgs.length) {
      imageUrl = this.data.form.imgs[0];
    } else {
      imageUrl = '/img/v2/default.jpg'
    }
    return {
      title: title,
      path: path,
      imageUrl:imageUrl
    };
  },

  /**
  * 详情页面逻辑
  * from说明
  * from = find 来自发现，按钮分两个情况，如果是系统日程，直接显示【加入】按钮，如果是好友日程，显示【申请加入】按钮，同时弹出申请提示框
  * from = app 来自首页日程链接 ，拥有creater字段，
  * from = share
  **/
  onLoad: function(e) {
      this.data.id = e.id;
      var self = this;
      ershouModel.getDetail(e.id,function(res){
        self.setData({
          form:res.res
        })
      },false)
      app.need_update = true;
  },

  onShow: function() {
  },
  
  // 分享到朋友圈
  shareTimeLine:function(){
      var url = '../share/index?id='+this.data.id;
      wx.navigateTo({
          url: url
      })
  },
   



  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},
  
  // 返回主页
  back:function(){
    var url = '../index/index?college='+this.data.form.college;
    wx.redirectTo({
      url: url
    })    
  },

  // 再发一条 
  pushAgain(){
     wx.redirectTo({
       url: '../classify/index'
     })     
  },

});
