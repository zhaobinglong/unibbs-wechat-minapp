
const network = require("/utils/network.js");
const userModel = require("/utils/userModel.js");
const systemModel = require("/utils/userModel.js");
const util = require("/utils/util.js");
//app.js
// app通用方法  可以在其它页面的js中调用

App({
  userInfo: {
    college:"",
    openid:'',
    nickName:'',
    avatarUrl:''

  }, //小程序返回的用户信息
  apibase: "https://examlab.cn/ershouAPI",
  imgbase: "https://examlab.cn/img/",
  location:{}, //首页当前筛选条件（国家+城市）可以被修改
  shareTitle: "在微信上可以管理日程了",
  shareUrl: "pages/date/index/index?from=normal",
  form: {
      openid:'',
      title: "",
      address:'',
      cont: "",
      imgs: [],
      is_new:false,
      price:'',
      old_price:'',
      phone:'',
      level:'全新',
      type:'选择分类',
      naton:'',
      city:'',
      symbol:'yuan',//货币符号
      unit:'',//货币单位
      status: 0, //0 删除，1 正在卖 2 卖出了
    },//二手物品的属性
  nation:'', //首页请求数据使用的国家
  city:'',//首页请求数据使用的城市
  id:'',//临时保存的二手id
  myMessage:[], //缓存我的xiao xi


  week: [
    { index: 0, value: "星期天",name: '日', key: "0" },
    { index: 1, value: "星期一",name: "一", key: "1" },
    { index: 2, value: "星期二",name: "二", key: "2" },
    { index: 3, value: "星期三",name: "三", key: "3" },
    { index: 4, value: "星期四",name: "四", key: "4" },
    { index: 5, value: "星期五",name: "五", key: "5" },
    { index: 6, value: "星期六",name: "六", key: "6" }
  ],
  
  index:0,
  formIds: [], //每次收集到五个，就发送一次
  canvas:{
    img:'http://tmp/wx7dae92e36fcbfdf5.o6zAJs_gZ_z_8pIa-23ybe4fsH5A.H8gxSiCnN39W2b6a4971651234aa073eea22411f5b66.jpg',
    qrcode:'',
    width:300,
    height:300,
    sx:0,
    sy:0
  },
  tempFilePaths:[], //用户选择的手机中的图片，给发布页面使用
  test:0,
  need_update:false , // 标志位，判断返回首页的时候是否需要刷新
  new_school:false , //新的学校，还没有发布，不显示成员和发布数量
  unread:0, //未读消息
  /** 
  * 小程序每次启动，登陆逻辑如下
  * 先利用微信接口判断session是否有效
  * session无效，重新发起一次登陆
  * 小程序在使用的过程中不用判断，如果用户一直在使用小程序，则用户登录态一直保持有效
  * 小程序首页逻辑不要强制获取用户昵称和头像，官方反对这样处理
  **/
  onLaunch: function() {

    if(wx.getStorageSync('openid')){
      //本地已经保存有openid，说明用户进来过,已经是一个老用户了
      this.getUserInfo(wx.getStorageSync('openid'))
    }else{
      this.getOpenid()
    }
  },

  // 获取用户的openid，
  getOpenid: function() {
     var self = this;
     userModel.getOpenid(function(res){
        self.userInfo.openid = res.openid; 
        wx.setStorageSync('openid', res.openid)
        wx.setStorageSync('userInfo',res)
        // 获取用户信息，这个时候还不知道用户是否注册
        self.getUserInfo(res.openid)
     },false)       
  },
   
  // 获取服务器中用户信息
  // 如果服务器中没有用户信息，接口直接返回false
  // 有两种情况会让用户进入这个逻辑：1、全新的用户 2 、用户换了手机
  getUserInfo:function(openid){
     var self = this;
     userModel.getUserInfo(openid,function(res){
       if(res){
          self.userInfo = res;
          wx.setStorageSync('college',res.college)
          // 将用户的信息缓存在storage中
          wx.setStorageSync('userInfo', res)
       }else{
          self.updateUser()
       }

     },false)
  },
  
  // 全新的用户，把用户的openid和college插入数据库
  updateUser:function(){
    const data = {
      openid: wx.getStorageSync('openid'),
      avatarUrl: '',
      nickName: '',
      ad: '',
      wechat: '',
      douyin: '',
      weibo: ''
    }

    userModel.updateUser(data,function(res){
       console.log('在app.js中保存新用户')
    },false)   
  },
  
  // 弹出微信分享，给全局调用
  wechatShare (res) {
    let is_goods = util.is_goods(res.category)
    let title = '' 
    let imageUrl = './img/v2/default.jpg'
    let price  = '' 
    let path = "pages/date/detail/index?&id=" + res.id;
    if (res.price) {
      price = res.price + res.symbol + ','
    } else {
      price = ''
    } 
    if (is_goods){
      title = res.college+'：'+ price + res.cont;
    } else {
      title = res.college+'：'+ res.cont;
    }
    
    if (res.imgs.length) {
      imageUrl = res.imgs[0];
    }
    let obj = {
      title: title,
      path: path,
      imageUrl:imageUrl
    }
    console.log(obj)
    return obj
  }

});
