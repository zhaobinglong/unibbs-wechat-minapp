
const ershouModel = require("../../utils/ershouModel.js");
const userModel = require("../../utils/userModel.js");
const systemModel = require("../../utils/systemModel.js");
const util = require("../../utils/util.js");
const config = require("../../config/index.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    all:[],//列表原始数据
    list:[],
    types:[],
    imgbase:app.imgbase,
    loading:true,//加载中
    city:'',
    wxLocation:{},
    location:{}, //顶部显示的位置信息
    page:0, //默认第0页
    
    college:{},
    is_loading:false, //数据正在请求中，不要重复请求
    no_page:false, //最后一页数据获取后，为true
    is_first_loading:true,
  },

  onShareAppMessage: function() {
    // var title = this.data.college.uName+'校内二手主页';
    // return {
    //   title: title,
    //   path: app.shareUrl
    // };
  },

  // 下啦刷新
  onPullDownRefresh:function(e){


    this.data.page = 0;
    this.getList();
    this.setData({
       no_page:false,
       list:[]
    })
  },

  /**
  * 如果from不存在，则来自首页
  * from = share,来自微信消息。前往详情页面
  **/
  onLoad: function(e) {


     this.getList();      

  },

  // 每次切出页面，刷新数据，因为其他页面可能有删除和添加操作
  onShow: function() {},





  

  // 滚动到最底部
  lower(){
    if(this.data.is_loading){
       return false;
    }else{
       
       this.getList();
    }
    
  },

  upper(){
     this.data.page=0;
     this.data.no_page = false;
     this.data.list=[];
     this.getList();
  },


  // 获取二手列表
  getList(){

      const  openid = wx.getStorageSync('openid');
  
      if(this.data.no_page){
         return false;
      }


      const self = this;
      
      const page = this.data.page;
      this.data.is_loading = true;
      ershouModel.getMyList(openid,this.data.page,function(res){
         self.data.is_loading = false;
         const list =  self.data.list.concat(res);
          self.setData({
            list:list,
            is_first_loading:false
          })
         wx.hideLoading();
         
         // 如果返回小于十条，表示后面没有了
         if(res.length<10){
           self.setData({
              no_page:true
           })
         }

         wx.stopPullDownRefresh();
         self.data.page++;
      },false)       


  },

  // 获取位置描述
  // 用户当前地理位置只请求一次
  // 将用户当前的地理位置保存进入userInfo
  getLocation(){
      console.log('进入getLocation')
      var self = this;
      util.getLocationDesc(function(res,other){
         console.log('定位服务返回：')
         console.log(res)
         if(res.city){
           app.city = res.city
           // console.log('city不存在，使用locality：'+res.locality)
           // res.city = res.locality
         }else{
           app.city = res.locality
         }
         app.nation  = res.nation;
         app.userInfo.nation = res.nation;
         app.userInfo.address = res.street;
         app.userInfo.city = res.city?res.city:res.locality;
         self.getList();
         var location = {
           nation:app.nation,
           city:app.city
         }
         self.setData({
            location
         })

      // 用户拒绝地理位置授权
      },function(res){

         if(res.status == 1000){
           wx.showModal({
              title: '提示',
              content: '拒绝获取位置将无法使用小程序，重新去授权吗?',
              cancelText:'不用了',
              confirmText:'去授权',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                      success: (res) => {}
                  })
                }else{
                  wx.reLaunch({
                    url: '../error/index'
                  })
                } 
              }
            })
         }
      })
  }, 

  // 数据过滤 哥怒type展示
  filterList(type){
    var list=[];
    if(type == '广场'){
       list = this.data.all;
    }else{
       for (var i = 0; i < this.data.all.length; i++) {
          if(this.data.all[i].type == type){
              list.push(this.data.all[i])
          }
       }
    }

    this.setData({
      list
    })
  },




  

  // 如果没有这个函数，请求无法发送出去
  onReady: function() {},








});
