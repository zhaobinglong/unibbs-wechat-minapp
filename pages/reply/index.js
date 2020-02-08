
const ershouModel = require("../../utils/ershouModel.js");
const userModel = require("../../utils/userModel.js");
const systemModel = require("../../utils/systemModel.js");
const util = require("../../utils/util.js");
const config = require("../../config/index.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    imgbase:app.imgbase,
    form: {},
    current_img:'',
    message:'',
    list:[],
    reBack:'',
    show_qrcode:false,
    canvas:{
      img:false,
      qrcode:false
    },
    Hei:'300px',
    openid:'' //url中的openid，这个openid是被回复的openid
  },
  // 在详情页面的分享，要带上来源信息
  // 每个页面都要写这个函数，不科学呀
  onShareAppMessage: function() {

    var title = "出个二手：" +this.data.form.price+'元,'+this.data.form.cont;

    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    var imageUrl = this.data.form.imgs[0];
    return {
      title: title,
      path: path,
      imageUrl:imageUrl
    };
  },

  // 下拉刷新
  onPullDownRefresh:function(e){
     wx.stopPullDownRefresh();
  },

  /**
  * 详情页面逻辑
  * 获取小程序码接口
  * 
  **/
  onLoad: function(e) {

    var self = this;
    ershouModel.getDetail(e.id,function(res){

       self.setData({
           form:res
       })
       self.getMessage();
       
    },false)

    

    this.data.id = e.id;
    this.data.openid = e.openid
    

  },

  // 获取消息
  // 匿名用户，直接给一个默认头像
  getMessage(){
    var self = this;
    var json = {
      id:this.data.id,
      openid:this.data.openid,
      owner:this.data.form.openid
    };
    userModel.getMessageByDetail(json,function(res){
       for (var i = 0; i < res.length; i++) {
         var time = parseInt(res[i].createtime)*1000;
         res[i].createtime = new Date(time).toLocaleDateString()

       }
       self.setData({
          list:res
       })
       
    },false)    
  },

  onShow: function() {
     
  },

  swiperChange:function(e){
     console.log(e)
  },

  // 点击编辑按钮
  editClick:function(){
    var url="../create/index?id="+this.data.form.id+"&type=edit"
    wx.navigateTo({
        url: url
    })    
  },

  // 
  imgLoad:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth; 
    var imgh=e.detail.height;　　　
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw;
    if(swiperH>=500){
       swiperH = '500px';
    }else{
       swiperH = swiperH+'px';
    }
    console.log(swiperH)　　　　　　　　　
    this.setData({
        Hei:swiperH　
    })
  },

  formSubmit: function(e) {
    console.log(e)
    userModel.collectFormId(e);
  },

  bindInput:function(e){
    // console.log(e)
    var form = this.data.form;
    form.message = e.detail.value;
    this.setData({
      form
    })
  },



  // 开始回复
  pushMessage:function(){
     var len = this.data.reBack.length;
     var data = {
      tag:'',
      cont:this.data.form.message,
      toopenid:this.data.openid,
      name:app.userInfo.nickName || '匿名用户',
      fromopenid:wx.getStorageSync('openid'),
      id:this.data.form.id
     }
     
     // var data = {
     //  tag:'',
     //  cont:this.data.form.message,
     //  toopenid:wx.getStorageSync('openid'),
     //  name:app.userInfo.nickName || '匿名用户',
     //  fromopenid: this.data.openid,
     //  id:this.data.form.id
     // }

     wx.showLoading({
      title:'发送中'
     });
     var self = this;
     userModel.pushMessage(data,function(res){
       wx.showToast('发送成功');
       self.sendWXNotice(data);
       var form = self.data.form;
       form.message = '';
       self.setData({
          form
       })
       self.getMessage();
     },false)
  },

  // 发送微信通知给宝贝的主人
  // 如果宝贝的主人就是自己，自己给自己留言，就不要通知自己了

  sendWXNotice(data){

     systemModel.sendWXNotice(data,function(res){
       console.log(res)
     },false)
  },


  
  // 获取用户信息
  getUserInfo:function(e){

    if(e.detail.errMsg == 'getUserInfo:ok'){
      const self = this;
      const data = e.detail.userInfo;
      var userInfo = app.userInfo;
      userInfo.nickName = data.nickName;
      userInfo.avatarUrl = data.avatarUrl;
      userModel.updateUser(userInfo,function(res){

      },false)

      // 推送消息
      this.pushMessage()
     
    }else{
      return false;
    }


  },











  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},
  






});
