
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");
const systemModel = require("../../../utils/systemModel.js");
const util = require("../../../utils/util.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    imgbase:app.imgbase,
    form: {

    },
    message:'',
    list:[],
    reBack:'',
  },
  // 在详情页面的分享，要带上来源信息
  // 每个页面都要写这个函数，不科学呀
  onShareAppMessage: function() {
    if(this.data.form.address){
       var title = "出个二手：" + this.data.form.title+','+this.data.form.price+'元,'+this.data.form.address;
    }else{
       var title = "出个二手：" + this.data.form.title+','+this.data.form.price+'元';
    }
    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    var imageUrl =app.imgbase + this.data.form.imgs[0];
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
    var self = this;
    
    ershouModel.getDetail(e.id,function(res){

       console.log(app.userInfo)
       if(res.openid == app.userInfo.openid){
        res.isCreater = true;
       }
       self.setData({
           form:res
       })
       console.log(res) 
        self.getMessage(e.id);
    },false)

    app.id = e.id;

    userModel.updateMessageStatus(e,function(res){
      console.log(res) 
    },false)
  },

  onShow: function() {
     
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

  // 获取留言
  getMessage:function(id){
    var self = this;
    ershouModel.getMessage(id,function(res){
      for (var i = 0; i < res.length; i++) {
          res[i].createtime = parseInt(res[i].createtime)*1000;
          res[i].createtime = moment(res[i].createtime).format('MM-DD HH:mm')
      }
      self.setData({
        list:res
      })
      self.updateMessageCount();
    },false)
  },

  // 留言情况：
  // 用户主动留言
  // 用户回复的消息
  pushMessage:function(){
    var len = this.data.reBack.length;
    console.log(this.data.form.message)
    console.log(this.data.reBack)
    

    // 这是回复
    if(this.data.reBack == this.data.form.message.substr(0,len)){
       this.data.form.message = this.data.form.message.substr(len);
       // console.log(this.data.form.message)
    // 不是回复
    }else{
       this.data.reBack = '';
    }

     var data = {
      tag:this.data.reBack,
      cont:this.data.form.message,
      toopenid:this.data.form.openid,
      fromopenid:app.userInfo.openid,
      id:this.data.form.id
     }
     
     // console.log(data)
     // return false;

     wx.showLoading();
     var self = this;
     userModel.pushMessage(data,function(res){
       wx.hideLoading;
       console.log(res)
       wx.showToast('留言成功');
       self.sendWXNotice(data.cont);
       self.getMessage(self.data.form.id);
       var form = self.data.form;
       form.message = '';
       self.setData({
          form
       })
     },false)
  },

  // 发送微信通知给宝贝的主人
  sendWXNotice(cont){
     var json = {
       openid:this.data.form.openid,
       cont:cont,
       name:this.data.form.nickName,
       id:this.data.form.id
     }
     systemModel.sendWXNotice(json,function(res){
       console.log(res)
     },false)
  },

  // 更新评论数量
  updateMessageCount(){
    this.data.form.message = this.data.list.length;
    ershouModel.updateMessageCount(this.data.form,function(res){
      console.log(res)
    },false)
  },



  // 预览图片
  preViewImg(){
    var imgs = this.data.form.imgs;
    for (var i = 0; i < imgs.length; i++) {
      imgs[i] = this.data.imgbase+imgs[i];
    }
    var current =imgs[0];
    var urls = imgs;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  // 获取日程详情
  getDetail(id) {
    var self = this;

    wx.showLoading();
    dateModel.getDetail(id,function(res){
        self.setData({
          form: res
        });
        if (app.userInfo.id) {
          self.buildData(res);
        } else {
          userModel.getUserInfo(function(res) {
            app.userInfo = res;
            self.buildData(self.data.form);
          }, false);
        }
    },false)

  },



  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},


  

  // // 点击扫描图标
  // scanClick: function() {
  //   var showFinger = !this.data.showFinger;
  //   this.setData({
  //     showFinger
  //   });
  // },

  clickShare: function(e) {
    var showShareMenu = !this.data.showShareMenu;
    console.log(showShareMenu)
    this.setData({
      showShareMenu
    });
  },

  /**
  * 点击编辑按钮，弹出两个选项 编辑
  * 重复的日程在编辑时需要提示是编辑当前还是编辑未来所有。 对于非重复日程，不需要有该选项，每次编辑都是编辑全部
  **/
  clickEdit: function() {
      var url = '../edit/index?id='+this.data.form.id;
      wx.navigateTo({
          url: url
      })
  },

  // 加微信
  clickAddWechat:function(){
      var wechat = this.data.form.wechat;
      if(!wechat){
          wx.showModal({
            title: '提示',
            content: '卖家没有添加微信，请留言',
            showCancel:false,
            success: function(res) {
               
            }
          })
          return false;
      }
      var itemList = [wechat,'复制微信号到剪贴板']
      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          console.log(res.tapIndex)
          if(res.tapIndex == 0 || res.tapIndex == 1){
              wx.setClipboardData({
                data:wechat ,
                success: function(res) {
                   console.log(res)
                   if(res.errMsg == 'setClipboardData:ok'){
                        wx.showToast({
                          title: '复制成功',
                          icon: 'success',
                          duration: 2000
                        })                      
                   }
                }
              })             
          }
        }
      })     
  },
  

  // 删除二手
  clickDel:function(){
    var id = this.data.form.id;
    wx.showModal({
      title: "提示",
      content: "确定删除该信息吗？",
      success: function(res) {
        
        if (res.confirm) {
          wx.showLoading();
          ershouModel.delDetail(id,function(res) {
              wx.hideLoading();
              util.showToast('已删除')
              setTimeout(function() {
                // wx.navigateTo({
                //     url: '../index/index'
                // })
                wx.switchTab({
                  url: '../index/index'
                })
              }, 2000);

            },
            false
          );
        }
      }
    });       
  },


   // 回复用户留言
   clickMessage(e){
     console.log(e)
     var name = e.currentTarget.dataset.name;
     var form = this.data.form;
     form.message = '回复'+name+':';
     this.setData({
        form
     })

     this.data.reBack='回复'+name+':';
   }


});
