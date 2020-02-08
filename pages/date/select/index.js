

const systemModel = require("../../../utils/systemModel.js");
const userModel = require("../../../utils/userModel.js");
const utils = require("../../../utils/util.js");
const pinyinUtil = require("../../../utils/pinyinUtil.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    isSearch: false,
    list: [],
    value:'',
    allCitys:[], //全部城市
    from:'index',
    no_college:false
  },

  
  // 先判断cookie中有没有大学名字，如果有，直接前往该大学首页
  // 获取用户所在城市，显示城市里的大学
  onLoad: function() {

     // var self = this;

        wx.redirectTo({
          url: '/pages/date/city/index'
        }) 
     // var college = wx.getStorageSync('college');
     // if (college) {
     //    const url = '../index/index?college='+college;
     //    wx.redirectTo({
     //      url: url
     //    })       
     // }else{
     //   utils.getLocationDesc(function(res){
     //      console.log(res)
     //      if(res.nation!='中国'){
     //          res.city = res.locality;
     //      }
     //      // wx.setNavigationBarTitle({
     //      //    title: '选择'+res.city+'的大学'
     //      // }) 
     //      systemModel.getCollegesByCity(res.city,function(res){
     //        console.log(res)
     //        if(res.length){
     //            self.setData({
     //              list:res
     //            })              
     //          }else{
     //             console.log('城市没有大学')
     //             self.setData({
     //                no_college:true
     //             })
     //          }

     //      },false)
     //   },false)      
     // }
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  onShow: function() {

  },
  
  // 点击一个大学 
  // 将被选中的大学信息写入用户表
  // 将大学名字保存在cookie中
  // 下次进入小程序，直接读取cookie中的大学名字，显示该大学的二手信息列表
  clickCollege(e){
    var college = e.currentTarget.dataset.college;
    wx.setStorageSync('college',college )
    const url = '../index/index?college='+college;
    wx.redirectTo({
      url: url
    })
    console.log(app.userInfo);
    app.userInfo.college = college;
    userModel.updateUser(app.userInfo,function(res){
      console.log(res)
    },false)    
  },











  



});
