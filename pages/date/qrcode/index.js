
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");
const systemModel = require("../../../utils/systemModel.js");
const util = require("../../../utils/util.js");
const config = require("../../../config/index.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    imgbase:app.imgbase,
    form: {

    },
    current_img:'',
    message:'',
    list:[],
    reBack:'',
  },
  // 在详情页面的分享，要带上来源信息
  // 每个页面都要写这个函数，不科学呀
  onShareAppMessage: function() {

    var title = "出个二手：" +this.data.form.price+'元,'+this.data.form.cont;

    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    var imageUrl =app.imgbase + this.data.form.imgs[0];
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
     
       res.current_img=config.static_source+res.imgs[0];
       self.setData({
           form:res
       })

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
  // 如果宝贝的主人就是自己，自己给自己留言，就不要通知自己了

  sendWXNotice(cont){

    if(this.data.form.openid == app.userInfo.openid){
       return false;
    }

     var json = {
       openid:this.data.form.openid,
       cont:cont,
       name:app.userInfo.nickName,
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
  preViewImg(e){
    const name = e.currentTarget.dataset.name;
    const form = this.data.form;
    form.current_img = config.static_source+name;
    this.setData({
        form
    })
  },




  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {



  },
  

  // 点击生成按钮，开始绘制
  drawImg(){
    var ctx = wx.createCanvasContext('share_img');
    
    ctx.drawImage(this.data.form.current_img, 0, 0, 300, 300);

    ctx.setFontSize(14);
    ctx.fillText(this.data.form.price+'￡,'+this.data.form.cont, 0, 320);

    ctx.drawImage('https://examlab.cn/ershou/user.php?code=getLittleImg', 100, 330, 100, 100)

    //绘制的样式进行描边绘制，fill为填充位置
    ctx.stroke();

    ctx.draw();     
  },



  clickShare:function(){
      console.log('123')
      var self = this;
      wx.showActionSheet({
        itemList: [ '生成二维码分享'],
        success: function(res) {
          if(res.tapIndex == 0){
             self.drawImg();
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
  },

  /**
  * 点击编辑按钮，弹出两个选项 编辑
  * 重复的日程在编辑时需要提示是编辑当前还是编辑未来所有。 对于非重复日程，不需要有该选项，每次编辑都是编辑全部
  **/
  clickEdit: function() {
      var url = '../create/index?type=edit&id='+this.data.form.id;
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
   },




});
