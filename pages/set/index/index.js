const network = require("../../../utils/network.js");
const userModel = require("../../../utils/userModel.js");
const ershouModel = require("../../../utils/ershouModel.js");
const systemModel = require("../../../utils/systemModel.js");
const config = require("../../../config/index.js");
const util = require("../../../utils/util.js");

//获取应用实例
var app = getApp();
Page({
  data: {
     userInfo:{
      avatarUrl:'',
      nickName:'点击绑定微信'
     },
     college:'',
     num:{},
     openid:'', //当前正在查看的这个页面的用户openid
     list:[], //全部二手
     goods:[], //商品
     show_edit:false,//显示编辑的铅笔图标
     show_ad:false, //显示广告
     params:{},
     is_me:false,
     is_loading:false, //数据正在请求中
     load_over:false,
     page:0, //第0页
     no_page:false, //没有数据了
     load_over:false,
     is_oauth:true,
     current_type: 'timeline', // 当前分类
     goods:[],
     extraData: {
       id: "65362"
     }
  },
  // onShareAppMessage: function(res) {
  //   console.log(res)
  //   let college = wx.getStorageSync('college')
  //   let user = wx.getStorageSync('userInfo').nickName
  //   let title = college+'：' + user + '的个人主页';
  //   let imageUrl = '/img/v2/default.jpg'
  //   path = "pages/set/index/index?openid=" + wx.getStorageSync('openid');
  
    
  //   return {
  //     title: title,
  //     path: path,
  //     imageUrl: imageUrl
  //   }
  // },

  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  },


  // bar适应phonex
  adapt_bar:function () {
    let self=this;
    wx.getSystemInfo({
      success(res) {
        var model=res.model || '';
        if (model.match(/iPhone X/ig)) {
          self.setData({
            is_x:true
          })
        }
      }
    })
  },
  
  
  // 个人主页load，需要请求当前用户的openid（因为个人主页有可能是分享出去的，新用户打开）
  // 在load中载入一次个人主页
  onLoad: function(e) {

    const self = this;
    if (e.openid) {
      this.getInfo(e.openid)
      this.data.openid = e.openid;
      this.data.params = e;
    } else {
      this.getInfo(wx.getStorageSync('openid'))
      this.data.openid = wx.getStorageSync('openid')
    }
    

    if (wx.getStorageSync('classify')) {
      this.getList()
    } else {
     systemModel.getTypeList((res)=>{
        wx.setStorageSync('classify',res)
        this.getList()
     },false)
    }
  },

  /**
   * 每次show，重新请求消息列表，更新未读消息数量
   * 每次show，更新用户主页的介绍
   * 每次show，不要你刷新列表
   **/
  onShow: function() {

     var self = this;
     let openid = wx.getStorageSync('openid');
     let college = wx.getStorageSync('college');
     if (this.data.openid == openid) {
       userModel.getMyMessage(openid,function(res){
         var num = 0;
         for (var i = 0; i < res.length; i++) {
            if(res[i].status == '0'){
              num++;
            }
         }
         self.setData({
            num,
         })
         app.unread = num;
         self.setData({
          is_me: true
         })

       },false)      
     }
     this.setData({
       college:college
     })

     this.getInfo(this.data.openid)
  },

  // 卡片点击事件
  onClickEvent (e) {
    console.log(e)
    const path = '/pages/date/detail/index?id=' + e.detail.obj.id
    wx.navigateTo({
      url:path
    })
  },
  
  // 用户点赞事件
  // 点赞之前需要判断当前storage中有没有用户openid，
  // 如果没有，表示用户还没有授权
  onUserLike (e) {
    
    const self = this;
    userModel.userLike(e.detail.id,function(res){
      console.log(res)
      self.updateLiked(e.detail.id,res.status)
    },false)
  },
  // 局部更新列表上的点赞数
  updateLiked (id,status) {
    for (var i = 0; i < this.data.list.length; i++) {
      if (id === this.data.list[i].id) {
        let obj = this.data.list[i];
        if (status == '1') {
          obj.liked = parseInt(obj.liked) + 1
        } else {
          if (parseInt(obj.liked) >= 1) {
            obj.liked = parseInt(obj.liked) - 1
          }
        }
        
        this.setData({
          ["list[" + i + "]"]:obj
        })
      }
    }
  },

  onClickType (e) {
    let item = e.currentTarget.dataset.type
    this.setData({
      current_type: item
    })
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {
    // this.getList();
  },
  
  // 前往消息页面
  clickMessage(){
    wx.navigateTo({
      url:'../message/index'
    })
  },

  clickEdit () {
    wx.navigateTo({
      url:'../form/index'
    })
  },

  // 获取后台用户信息
  getInfo(openid){
     const self = this;
     userModel.getUserInfo(openid,function(res){
         console.log(res)
         var is_me = false;
         if(self.data.openid == wx.getStorageSync('openid')){
            is_me = true;
         }
         
         // 没有头像，给一个默认头像
         if(!res.avatarUrl){
            res.avatarUrl = '../../../img/logo.png'
         }
         
         self.setData({
           userInfo:res,
           is_me:is_me
         }) 

         wx.setStorage({
            key: 'userInfo',
            data: res
          })
         
         wx.setStorageSync('wechat', res.wechat)

         wx.setNavigationBarTitle({
          title: res.nickName
         })       
     },false)  
  },


  // 分页默认为20条
  getList(){
    var self = this;
    let params = {
      openid: this.data.openid,
      page: this.data.page,
      college: '',
      classify: '',
      category: ''
    }
    ershouModel.getList(params,function(r){
       let goods = self.data.goods
       console.log(r)
       for (var i = 0; i < r.res.length; i++) {
          let is_goods = util.is_goods(r.res[i].category)
          if (is_goods) {
            goods.push(r.res[i])
          }
       }
       console.log(goods)
       const list =  self.data.list.concat(r.res);
        self.setData({
          list:list,
          goods:goods,
          is_first_loading:false,
          load_over:true,
          is_loading:false
        })

       wx.hideLoading();
       
       // 如果返回小于十条，表示后面没有了
       if(r.res.length<20){
         self.setData({
            no_page:true
         })
       }

       // wx.stopPullDownRefresh();
       self.data.page++;
    },false)      
  },
  
  // 滚动到底部，请求下一个页面的数据
  lower(){
    if(this.data.is_loading || this.data.no_page){
       return false;
    }else{
       this.getList();
    }    
  },
  
  // 点击文字，显示编辑框
  // 自己自己的主页，点击有效
  // showEdit(){
  //    if(this.data.params.openid == wx.getStorageSync('openid')){
  //       const path = '../textArea/index'
  //       wx.navigateTo({
  //         url:path
  //       })
  //    }
  // },
  
   // 通过用户点击发送按钮，绑定用户信息
   // 判断用户有没有头像和昵称
   getUserInfoByButton (e) {
      let self = this;
      let userInfo = wx.getStorageSync('userInfo')
      if(e.detail.errMsg == 'getUserInfo:ok'){
        const data = e.detail.userInfo;
        userInfo.nickName = data.nickName;
        userInfo.avatarUrl = data.avatarUrl;
        this.setData({
          userInfo: e.detail.userInfo
        })
        userModel.updateUser(userInfo,function(res){
          wx.setStorageSync('userInfo',userInfo)
          self.getInfo(userInfo.openid)
        },false)     
      } else {
        console.log(e)
      }
   }

  





});
