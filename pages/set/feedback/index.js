
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    form:{},
    id:'',
    week:app.week
  },

  
  // 进入详情页面，将当前页面的评论状态全部设置为1 已读
  onLoad: function(e) {


    
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  onShow: function() {},

  // 获取有申请的日程
  getApply() {
     var self = this;

     dateModel.getDateApplyDetail(this.data.id,function(res){
         self.buildData(res)
     },false)
  },
  
  //加工数据
  buildData(res){
     var timezone = app.userInfo.timezone;
     for (var i = 0; i < res.length; i++) {
         res[i].date = moment(res[i].activity.startDate).tz(timezone).format('YYYY.MM.DD');
         res[i].week = new Date(res[i].date).getDay(),
         res[i].activity.startDate = moment(res[i].activity.startDate).tz(timezone).format('hh:mm');
         res[i].activity.endDate = moment(res[i].activity.endDate).tz(timezone).format('hh:mm');
     }

     this.data.form = res[0];
     this.setData({
        form:res[0]
     })
     console.log(this.data.form)

  },


  agreeApply(e) {
     var self =this;
     var id = e.currentTarget.dataset.id;
     wx.showLoading();
     // wx.hideLoading();
     // app.showToast('已同意');
     // self.getApply();
     dateModel.approveApply(id,function(res){
       wx.hideLoading();
       app.showToast('已同意');
       self.getApply();
     },false)
  },
  regectApply(e){
     var self =this;
     var id = e.currentTarget.dataset.id;
     wx.showLoading();
     dateModel.rejectApply(id,function(res){
       wx.hideLoading();
       app.showToast('已忽略');
       self.getApply();
     },false)
  },


});
