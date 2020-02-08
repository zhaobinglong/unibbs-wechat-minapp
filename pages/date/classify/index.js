

const systemModel = require("../../../utils/systemModel.js");
const userModel = require("../../../utils/userModel.js");
const utils = require("../../../utils/util.js");
const pinyinUtil = require("../../../utils/pinyinUtil.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    classify: []
  },

  
  // 先判断cookie中有没有大学名字，如果有，直接前往该大学首页
  // 获取用户所在城市，显示城市里的大学
  onLoad: function() {

     let userInfo = wx.getStorageSync('userInfo')
     if (!userInfo.college) {
      wx.navigateTo({'url':'../city/index?from=firstChoose'})
      return false
     }
     
     if (wx.getStorageSync('classiyf')) {
        let classiyf = wx.getStorageSync('classiyf')
        this.setData({
          classiyf: classiyf
        })
     } else {
       systemModel.getTypeList((res)=>{
          console.log(res)
          this.setData({
            classiyf:res
          })
          // 将分类信息写在缓存中
          wx.setStorageSync('classify',res)

       },false)       
     }
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  onShow: function() {

  },
  clickType: function(e) {
    let type = e.detail
    let path = '../create/index?type=add&category=' + type;

    try {
      var create_store_act=wx.getStorageSync('create_store_act')
      if (create_store_act && create_store_act=='showCategory') {
        // Do something with return value
        wx.setStorageSync('create_store_type',type);
        wx.removeStorageSync('create_store_act')
        wx.navigateBack({
          delta:1
        }) 
      }else{
        wx.navigateTo({
          url:path
        })    
      }
    } catch (e) {
      // Do something when catch error
    }
    
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
