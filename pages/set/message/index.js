const userModel = require("../../../utils/userModel.js");


//获取应用实例
var app = getApp();
Page({
  data: {
     message:[],
     load_over:false
  },

  onLoad: function() {
    
     var self = this;
     let openid = wx.getStorageSync('openid')
     userModel.getMyMessage(openid,function(res){
       self.setData({
          message: res,
          load_over: true
       })

     },false)
    
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},
  // // 下拉刷新
  // onPullDownRefresh:function(e){
  //    wx.stopPullDownRefresh();
  // },
  onShow: function() {

  },

  // 点击一条消息，点击之后，将状态重置
  clickMessage(e){
      var id = e.currentTarget.dataset.id;
      var ershou = e.currentTarget.dataset.ershou;
      var data={
        id:id
      }
      var url = '../../date/detail/index?id='+ershou;
      wx.navigateTo({
         url: url
      })

      //  异步设置消息状态
      userModel.updateMessageStatus(data,function(res){
          
      },false)
      
      var message = this.data.message;
      for (var i = 0; i < message.length; i++) {
          if(message[i].id == id){
              message[i].status = '1';
          }
      }

      this.setData({
         message:message
      })
 

 
  },

  // 获取有申请的日程
  getApply() {
     var self = this;
     dateModel.getDateApply(function(res){
         // console.log(res)
         self.buildData(res)
     },false)
  },
  
  //加工数据
  buildData(res){
     var timezone = app.userInfo.timezone;
     for (var i = 0; i < res.length; i++) {
         res[i].date = moment(res[i].activity.startDate).tz(timezone).format('YYYY.MM.DD');
         // res[i].week = new Date(res[i].date).getDay();
         res[i].activity.startDate = moment(res[i].activity.startDate).tz(timezone).format('hh:mm');
         res[i].activity.endDate = moment(res[i].activity.endDate).tz(timezone).format('hh:mm');
     }
     this.mergeDate(res)
  },

  // 合并相同日期的日程
  mergeDate(arr){
     var activities=this.data.activities;
     for (var i = 0; i < arr.length; i++) {
        var flag = true;
        for (var j = 0; j < activities.length; j++) {
           if(activities[j].date == arr[i].date){
              activities[j].list.push({
                  activitiy:arr[i].activity,
                  applies:arr[i].applies,                    
              })
              flag = false;
           }
        }
       
       // list是同一个日期下面的日程
       if(flag){
          var list = [];
          list.push({
             activitiy:arr[i].activity,
             applies:arr[i].applies,
          })
         activities.push({
           date:arr[i].date,
           week:new Date(arr[i].date).getDay(),
           list:list
         })         
       }


     };
     
     activities = this.buildApplyCount(activities);
     this.setData({
        activities
     })
  },

  // 等待审核的申请，才进入计数器
  buildApplyCount(arr){
     for (var i = 0; i < arr.length; i++) {
         for (var j = 0; j < arr[i].list.length; j++) {
             var num = 0;
             for (var m = 0; m < arr[i].list[j].applies.length; m++) {
                 var apply = arr[i].list[j].applies[m];
                 if(apply.state == 'pending'){
                    num = num+1;
                 }
             }
             arr[i].list[j].num = num;
         }
     }
     return arr;
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

  // clickDateItem(e){
  //   var item = e.currentTarget.dataset.item;
  //   var index = e.currentTarget.dataset.index;
  //   var applies = this.data.activities[item].list[index].applies;
  //   this.setData({
  //      applies
  //   })
  // }
});
