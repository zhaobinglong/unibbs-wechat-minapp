
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");
const systemModel = require("../../../utils/systemModel.js");
const util = require("../../../utils/util.js");
const config = require("../../../config/index");


//获取应用实例
let app = getApp();
Page({
  data: {
    imgbase:config.cdn_url,
    form: {

    },
    current_img:'',
    message:'',
    list:[],
    reBack:'',
    show_qrcode:false,
    Hei:'300px',
    swiperArr:[], // 保存每张图片需要的高度
    imgLoadIndex:0, //图片载入计数器，图片载入发生多次
    indicatorDots:true, //是否显示切换原点
    id:'',
    comment:[],
    placeholder:'写评论',
    current_index:'', //当前点击的评论索引
    show_action: true // 是否显示底部操作按钮
  },
  // 在详情页面的分享，要带上来源信息
  // 如果是商品类，分享标题为：大学名字：价格 + 价格符号 + 描述
  onShareAppMessage: function() {
    // return app.wechatShare(this.data.form)
    let is_goods = util.is_goods(this.data.form.category)
    var title = '' 
    var imageUrl = '/img/v2/default.jpg'
    let price  = '' 
    if (this.data.form.price) {
      price = this.data.form.price + this.data.form.symbol + ','
    } else {
      price = ''
    } 
    if (is_goods){
      title = this.data.form.college+'：'+ price +this.data.form.cont;
    } else {
      title = this.data.form.college+'：'+ this.data.form.cont;
    }
    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    if (this.data.form.imgs.length) {
      imageUrl = this.data.form.imgs[0];
    }
    return {
      title: title,
      path: path,
      imageUrl:imageUrl
    };
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

  // 下拉刷新
  onPullDownRefresh:function(e){
     wx.stopPullDownRefresh();
  },

  /**
  * 详情页面逻辑
  * 获取小程序码接口
  * 如果来自小程序扫码，会有一个scene参数
  * 如果status == 0 ，表示这个二手已经下架或者卖出
  * 如果是新的用户加入，
  **/
  onLoad: function(e) {

    var id='';


    if(e.scene){
       id=e.scene;
    }else{
       id=e.id;
    }
    
  
    this.data.id = id;
    app.id = id;

    
    // 在详情页面开始提前下载微信二维码
    // 保存在app中备用
    // var url = 'https://examlab.cn/unapi/user.php?code=getLittleImg&id='+id;
    // wx.downloadFile({
    //   url: url, //仅为示例，并非真实的资源
    //   success: function(res) {
    //     if (res.statusCode == 200) {
    //        app.canvas.qrcode = res.tempFilePath;
    //     }
    //   }
    // })

    wx.showLoading();
    if (wx.getStorageSync('classify')) {
      this.getDetail(this.data.id)
    } else {
     systemModel.getTypeList((res)=>{
        wx.setStorageSync('classify',res)
        this.getDetail(this.data.id)
     },false)
    }
    
  },

  // 获取详情
  getDetail(id){
    const self = this;
    const openid = wx.getStorageSync('openid');
    ershouModel.getDetail(id,function(r){
      console.log(r)
       var indicatorDots = false;
       let res = r.res
       if(res.status == 0){
         self.setData({
             form:res
         })     
          wx.hideLoading();
          return false;
       }else{

         if(res.imgs.length == 1){
            indicatorDots = false;
         }
         
         if(res.openid == openid){
             res.is_creater = true;
         } else {
            res.show_add_wechat = true;
         }

         if(!res.symbol){
            res.symbol = config.default_symbol
         }

         if (util.is_goods(res.category)) {
          res.cont_tips = '联系我时，请说是在UNIBBS上看到的，谢谢！'
          res.is_goods = true
         }

         res.current_img=res.imgs[0];
         self.setData({
             form:res,
             indicatorDots:indicatorDots
         })

          // 拿到详情就开始下载
          // 这里的tempFilePath为什么总是放不到canvas对象里面
          // wx.downloadFile({
          //   url: res.imgs[0],
          //   success: function(res) {
          //     if (res.statusCode == 200) {
          //         app.tempFilePaths = [];
          //         app.tempFilePaths.push(res.tempFilePath);
          //     }
          //   }
          // })

          wx.hideLoading();
          
          // 新用户从分享的详情页面进入，写入college
          if(!wx.getStorageSync('college')){
            wx.setStorageSync('college',res.college)
          }        
       }

       self.getComment(id)
      
    },false)
  },

  // 获取消息
  getComment(id){
    var self = this;
    var json = {
      id:id,
    };
    userModel.getMessageByDetail(json,function(res){
       for (var i = 0; i < res.length; i++) {
         let time = parseInt(res[i].createtime)*1000;
         res[i].createtime = util.formatTimeStamp(time) 
       }
       self.setData({
          comment:res
       })
       
    },false)    
  },
  
  // 点击评论，弹出选择，可以选择复制内容或者回复
  commentClick(e){
    let item = e.currentTarget.dataset.item
    let self = this
    const itemList = ['复制评论内容','回复' + item.nickName]
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        if(res.tapIndex == 0 ){
          wx.setClipboardData({
            data: item.cont ,
            success: function(res) {
               if(res.errMsg == 'setClipboardData:ok'){
                    wx.showToast({
                      title: '复制成功',
                      icon: 'success',
                      duration: 2000
                    })                      
               }
            }
          })            
        } else {
          const placeholder = '@' + item.nickName;
          self.setData({
            placeholder,
            show_action: false,
            current_index: e.currentTarget.dataset.index
          })
        }
      }
    })
  },
  

  /**
  * 用户发送留言后返回，清空留言框中的内容
  **/
  onShow: function() {
     var form = this.data.form;
     form.message = '';
     this.setData({
      form
     })
  },
  


  swiperChange:function(e){
     console.log(e)
     const swiperArr = this.data.swiperArr;
     this.setData({
        Hei:swiperArr[e.detail.current]
     })
  },

  // 点击编辑按钮
  editClick:function(){
    var url="../create/index?id="+this.data.form.id+"&type=edit"
    wx.navigateTo({
        url: url
    })    
  },

  // 图片载入
  // 根据canva中所需要的头图比例，计算要在目标图片上截取的尺寸
  // 头图比例：300/300
  // 计算多张图片的情况下，高度的最低的图片，将该高度设置为swipe
  imgLoad:function(e){
    console.log(e)
    var winWid = wx.getSystemInfoSync().windowWidth; 
    var imgh=e.detail.height;　　　
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw;
    if(swiperH>=500){
       swiperH = '500px';
    }else{
       swiperH = swiperH+'px';
    }
　　
    var swiperArr = this.data.swiperArr;
    swiperArr.push(swiperH);　　　　　　　
    this.setData({
        Hei:swiperArr[0]
    })
    
    // 竖图
    if(this.data.imgLoadIndex == 0){
        if(imgh>=imgw){
          app.canvas.sx = 0;
          app.canvas.sy = (imgh-imgw)/2;
          app.canvas.width = imgw;
          app.canvas.height = imgw;
        // 横图
        }else{
          app.canvas.sx = (imgw-imgh)/2;
          app.canvas.sy = 0;
          app.canvas.height = imgh;
          app.canvas.width = imgh;
        }    
    }

    this.data.imgLoadIndex++;
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

  // 留言情况：
  // 1. 用户主动留言
  // 2. 用户回复的消息
  // 发送成功后跳转回复页面
  // 如果curre_index存在，就是给人回复
  pushMessage:function(){

    if(!this.data.form.message ){
      wx.showModal({
        title: '提示',
        content: '空消息不能发送',
        showCancel: false,
        success: function(res) {}
      })
      return false;
    }
    
    let self = this;
    let fromopenid = wx.getStorageSync('openid')

    
    
     var data = {}
     // console.log(this.data.current_index)
     // if(wx.getStorageSync('openid') == this.data.form.openid){
     // 这是回复 
     if(this.data.current_index || this.data.current_index === 0){
      console.log(this.data.current_index)
       const replay = this.data.comment[this.data.current_index]
       data = {
        tag:'',
        cont:'@'+replay.nickName+' '+this.data.form.message,
        name:app.userInfo.nickName,
        toopenid:replay.fromopenid,
        fromopenid:fromopenid,
        id: this.data.id
       }
     
     // 这是正常留言
     }else{

       data = {
        tag:'',
        cont:this.data.form.message,
        name:app.userInfo.nickName,
        toopenid:this.data.form.openid,
        fromopenid:fromopenid,
        id:this.data.id
       }

     }


     wx.showLoading({
      title:'发送中'
     });    

     // 消息发送成功，在详情页面自动添加一个消息
     userModel.pushMessage(data,function(res){
       wx.showToast('发送成功');
       let comment = self.data.comment;
       let userInfo = wx.getStorageSync('userInfo')
       comment.push({
          "avatarUrl":userInfo.avatarUrl,
          "cont":data.cont,
          "createtime": util.formatTimeStamp(new Date().getTime()),
          "nickName":userInfo.nickName
       })
       let form = self.data.form;
       form.message = '';
       self.setData({
        comment,
        form,
        show_action: true
       })
       self.sendWXNotice(data);
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        }) 
     },false)
  },

  // 发送微信通知给宝贝的主人
  // 如果宝贝的主人就是自己，自己给自己留言，就不要通知自己了

  sendWXNotice(obj){

     systemModel.sendWXNotice(obj,function(res){
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

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  clickShare:function(){
      wx.navigateTo({
          url: '../share/index?id='+this.data.form.id
      })
      // var self = this;
      // wx.showActionSheet({
      //   itemList: [ '生成小程序卡片分享','分享到微信群'],
      //   success: function(res) {
      //     if(res.tapIndex == 0){
      //         wx.navigateTo({
      //             url: '../share/index?id='+self.data.form.id
      //         })
      //     }
      //   },
      //   fail: function(res) {
      //     console.log(res.errMsg)
      //   }
      // })
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
  

  // 0删除，1正常，2卖出, 3下架
  delClick(e){
    console.log(e)
    let status = e.currentTarget.dataset.status
    let self = this
    if (status === '0') { 
      wx.showModal({
        title: '提示',
        content: '确定删除这条内容吗',
        success(res) {
          if (res.confirm) {
            app.need_update = true
            self.data.form.status = status
            ershouModel.push(self.data.form,function(res){
              wx.navigateBack({})
            })
          } else if (res.cancel) {
            return false
          }
        }
      })
    } else {
      app.need_update = true;
      this.data.form.status = status
      ershouModel.push(this.data.form,function(res){
        wx.navigateBack({});
      })
    }

  },


  // 返回主页
  backHome(){
    let url = '../index/index?college='+this.data.form.college;
    wx.reLaunch({
      url: url
    })
  },
  

  // 删除二手
  // clickDel:function(){
  //   var id = this.data.form.id;
  //   wx.showModal({
  //     title: "提示",
  //     content: "确定删除该信息吗？",
  //     success: function(res) {
        
  //       if (res.confirm) {
  //         wx.showLoading();
  //         ershouModel.delDetail(id,function(res) {
  //             wx.hideLoading();
  //             util.showToast('已删除')
  //             setTimeout(function() {
  //               // wx.navigateTo({
  //               //     url: '../index/index'
  //               // })
  //               wx.switchTab({
  //                 url: '../index/index'
  //               })
  //             }, 2000);

  //           },
  //           false
  //         );
  //       }
  //     }
  //   });       
  // },


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

   
   // 通过用户点击发送按钮，绑定用户信息
   // 判断用户有没有头像和昵称
   getUserInfoByButton (e) {
      let self = this;
      let userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo)
      if (!userInfo.nickName || !userInfo.avatarUrl) {
        if(e.detail.errMsg == 'getUserInfo:ok'){
        const data = e.detail.userInfo;
        userInfo.nickName = data.nickName;
        userInfo.avatarUrl = data.avatarUrl;
        console.log(userInfo)
        userModel.updateUser(userInfo,function(res){
          console.log(res)
          wx.setStorageSync('userInfo',userInfo)
          self.getComment(self.data.id)
        },false)
        this.setData({
          is_oauth:true
        })      
      }else{
        return false;
      }
      }
   }


});
