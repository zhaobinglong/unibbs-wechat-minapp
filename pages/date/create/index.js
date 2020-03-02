

const ershouModel = require("../../../utils/ershouModel.js");
const systemModel = require("../../../utils/systemModel.js");
const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");
const config = require("../../../config/index");
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
const COS = require("../../../lib/cos-wx-sdk-v5.js");
const Bucket = 'unibbs-1251120507';
const Region = 'ap-beijing';
// 初始化实例
let cos = new COS({
    getAuthorization: function (options, callback) {
        // 异步获取签名
        wx.request({
            url: 'https://examlab.cn/uniapi/cos-js-sdk-v5/sts.php', // 步骤二提供的签名接口
            data: {
                Method: options.Method,
                Key: options.Key
            },
            dataType: 'text',
            success: function (result) {
                let data = JSON.parse(result.data)
                callback({
                    TmpSecretId: data.credentials && data.credentials.tmpSecretId,
                    TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
                    XCosSecurityToken: data.credentials && data.credentials.sessionToken,
                    ExpiredTime: data.expiredTime,
                });
            }
        });
    }
});

var app = getApp();
Page({
  data: {
    form: {
      openid:'',
      title: '',
      cont: "",
      imgs: [],
      imgs_detail: [], 
      is_new:false,
      price:'',
      timeStamp:0, //记录单击时间
      college:'',
      address:'你在哪里？',
      is_my:false,
      is_edit:false,
      tempFilePaths:app.tempFilePaths,
      wechat:'',
      type_index:0, //宝贝默认分类索引
      category:'选择分类', //二级分类
      classify:'', // 一级分类
      symbol:'¥',
      status: 1, // 0删除，1正常，2卖出, 3下架
      cos: null
    },

    chooseImgCount: 9, //可以选择的图片数量
    imgbase:app.imgbase,
    level: [
       "全新" ,
       "九成新", 
       "八成新", 
       "七成新", 
       "六成新以下", 
    ],
    symbol:config.momey, //货币符号
    type:config.type,
    imgs:[], //保存上传的图片名字
    tempFile:[], //本地上传的图片，缓存的本地图片的路径，
    pageType:'', // 页面类型：新建或者编辑 add/edit
    default_address: '你在哪里？'

  },
  // onShareAppMessage: function() {
  //   return {
  //     title: app.shareTitle,
  //     path: app.shareUrl
  //   };
  // },
  // 下拉刷新
  // onPullDownRefresh:function(e){
  //    wx.stopPullDownRefresh();
  // },

  /**
  * 每次进入前，先判断用户有没有学校
  * 从微信菜单进入该页面，需要在这个页面获取当前用户定位信息
  * 从首页进入载入发布页面，立刻上传之前选择的照片
  *
  * 如果是全新的用户，它第一次进入发布页面，storage中只保存了它的openid和学校
  * 没有保存其他信息，所以需要调用已接口，获取它的信息
  **/
  onLoad: function(e) {
     const self = this;
     if(e.type == 'edit'){
        ershouModel.getDetail(e.id,function(r){
           r.res.is_edit = true;
           if(r.res.openid == app.userInfo.openid){
              r.res.is_my = true;
           }
           r.res.tempFilePaths=[];
           for (var i = 0; i < r.res.imgs.length; i++) {
              r.res.tempFilePaths.push(r.res.imgs[i]);
           }
           

           if(!r.res.symbol){
              r.res.symbol = config.default_symbol;
           }
          
           r.res.is_goods = util.is_goods_by_classify(r.res.classify)

           self.setData({
               form:r.res
           })
           
           //下载目前的第一张图片
           // self.downLoadImg(res.tempFilePaths[0]);
        },false)        
     }else if(e.type=='add'){
       this.data.form.openid = wx.getStorageSync('openid');
       this.data.form.wechat = wx.getStorageSync('wechat') || '';
       this.data.form.address = wx.getStorageSync('address') || this.data.form.address;
       this.data.form.symbol = wx.getStorageSync('symbol') || config.default_symbol;
       this.data.form.category = e.category
       this.data.form.classify = util.get_classify(e.category)
       this.data.form.is_goods = util.is_goods(e.category)
       this.setData({
         form:this.data.form
       })
               
     }else{
        console.log('other mode')
     }
     this.data.pageType=e.type;

     this.setData({
       symbol:config.momey
     })

     systemModel.getTypeList(function(res){
       self.setData({
        type:res
       })
     },false)

     systemModel.getCurrency((res)=>{
       console.log(res)
       this.setData({
         money:res
       })
     },false)


     // 判断storage中用户的信息全不全，如果没有头像和昵称，就重新获取一次用户信息
     let userInfo = wx.getStorageSync('userInfo')
     if (!userInfo.nickName) {
       let openid = wx.getStorageSync('openid')
       userModel.getUserInfo(openid,function(res){
         if(res){
            wx.setStorageSync('userInfo', res)
         }
       },false)
     }

    // 初始化实例
    // this.cos = new COS({
    //     getAuthorization: function (options, callback) {
    //         // 异步获取签名
    //         wx.request({
    //             url: 'https://examlab.cn/uniapi/cos-js-sdk-v5/sts.php', // 步骤二提供的签名接口
    //             data: {
    //                 Method: options.Method,
    //                 Key: options.Key
    //             },
    //             dataType: 'text',
    //             success: function (result) {
    //                 var data = result.data;
    //                 callback({
    //                     TmpSecretId: data.credentials && data.credentials.tmpSecretId,
    //                     TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
    //                     XCosSecurityToken: data.credentials && data.credentials.sessionToken,
    //                     ExpiredTime: data.expiredTime,
    //                 });
    //             }
    //         });
    //     }
    // });


  },
  
  // 下载第一张图片到本地，给生成二维码用
  downLoadImg(url){
    console.log(url)
      wx.downloadFile({
        url: url,
        success: function(res) {
          console.log(res)
          if (res.statusCode == 200) {
             app.tempFilePaths = [];
             app.tempFilePaths.push(res.tempFilePath);
             console.log(app.tempFilePaths)
          }
        }
      }) 
  },

  // 页面准备好之后再判断
  onReady: function() {

  },

  onShow: function() {
    const form = this.data.form;
    form.college = app.userInfo.college;

    this.setData({
       form:form
    })

    try {
      //保证数据干净
      wx.removeStorageSync('create_store_act');
      var create_store_type=wx.getStorageSync('create_store_type')
      if (create_store_type) {
         form.category = create_store_type;
         this.setData({
            form
         })
        wx.removeStorageSync('create_store_type');
      }
    } catch (e) {
      // Do something when catch error
    }
  },


  // 选择货币
  chooseMoney(e){
    const self = this;
    // const itemList = config.money.map(function(item,index){
    //   return item.symbol
    // })
    // wx.showActionSheet({
    //   itemList: itemList,
    //   success: function(res) {
    //     console.log(res.tapIndex)
    //     const form = self.data.form;
    //     form.symbol = config.money[res.tapIndex].symbol
    //     self.setData({
    //        form
    //     })
    //   },
    //   fail: function(res) {
    //     console.log(res.errMsg)
    //   }
    // }) 
    const moneyArr = this.data.money;
    const index = ~~e.detail.value
    const form = self.data.form;
    form.symbol = moneyArr[index].symbol
    self.setData({
       form
    })    
  },

  changeLevel:function(e){
     console.log(e)
     var index = parseInt(e.detail.value);
     var form = this.data.form;
     form.level = this.data.level[index];
     this.setData({
        form
     })
  },

  // 选择类型
  chooseType:function(e){
     var index = parseInt(e.detail.value);
     var form = this.data.form;
     form.type = this.data.type[index].name;
     this.setData({
        form
     })   
  },
  

  // 点击位置，选择地点
  chooseLocation:function(){
    var self = this;
    var form = this.data.form;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        form.address = res.name;
        self.setData({
          form: form
        });
      }
    });    
  },

  chooseCategory () {
    wx.setStorageSync('create_store_act','showCategory')
    wx.navigateTo({
        url: '../classify/index'
    })
  },
  
  // // 点击分类,弹出分类
  // chooseType:function(){
    
  // },

  // 预览图片
  preViewImg(e){
    var index = e.currentTarget.dataset.index;
    var urls = [];

    urls.push(this.data.imgbase+this.data.form.imgs[index]);
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
  },



  bindInput: function(e) {
    var name = e.target.dataset.value;
    var form = this.data.form;
    form[name] = e.detail.value;

  },

  /**
  * 切换全新
  **/
  switchChange(e) {
     console.log(e)
     var form = this.data.form;
     form.is_new = e.detail.value;
     this.setData({
        form
     })
  },

  // 点击上传图片
  // 图片只能上传九张，之后上传按钮消失
  // 图片多选上传
  addImg() {
    var self = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        
        // 当选中图片后，就更新本地的预览
        let form = self.data.form;
        form.tempFilePaths = form.tempFilePaths.concat(res.tempFilePaths);
        self.setData({
          form:form
        })
        
        for (var i = 0; i < res.tempFiles.length; i++) {
          let filePath = res.tempFiles[i].path;
          let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          self.uploadImg(filePath, filename)
        }      
      }
    });
  },

  uploadImg (filePath, filename) {
    // 给图片命令，名字：当前时间戳+五位数字的随机整数，开始上传
    // 图片名字前增加的参数，会被生成路径
    let self = this
    let key = 'img/' + new Date().getTime() + Math.floor(Math.random()*10000) + filename.substring(filename.lastIndexOf('.'))
    cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: key,
          FilePath: filePath,
          onProgress: function (info) {
              console.log(JSON.stringify(info));
          }
      }, function (err, data) {
          console.log(data);
          let form = self.data.form;
          form.imgs.push('https://static.examlab.cn/' + key);
      })
  },

  // 删除图片
  // 将缓存的本地图片数组中对应的也删除
  delImg(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var images = this.data.form.imgs;
    var arr = [];
    for (var i = 0; i < images.length; i++) {
      if (i != index) {
        arr.push(images[i]);
      }
    }
    const form = this.data.form;
    form.imgs = arr;
    this.data.form.tempFilePaths.splice(index,1);

    this.setData({
      form
    });

  },


  // 删除这个二手
  sellDown(){
    this.data.form.status = '0';
    this.create();
  },
  
  // 点击发布按钮，先尝试授权获取用户信息
  // 调用订阅消息，无法和获取用户信息一起
  async getUserInfo(e){
    let ids = ['dgp1OjAIjfz2mr9PbLJ5U2vU4edvkLO0uXpjJhSfAy4'];
    let  appleSubscribeMessage = await app.api.requestSubscribeMessage(ids);
    console.log(appleSubscribeMessage);
    // console.log(e)
    // if (e.detail.errMsg == "getUserInfo:ok") {
    //   let data = e.detail.userInfo
    //   let userInfo = wx.getStorageSync('userInfo')
    //   if (userInfo.nickName == '' || userInfo.avatarUrl == '') {
    //     let obj = Object.assign(userInfo, data)
    //     userModel.updateUser(obj,function(res){
    //        console.log(res)
    //     },false) 
    //   }

    // } 

    this.create();
  },



  /**
   * 发布二手
   * 如果地址没有选择，则重新设置为空
   * 将用户最近发布时用到的微信号和地理位置保存在storage中，下次直接读取
  **/
  create(e) {

    
    this.data.form.college = wx.getStorageSync('college');
    if(this.data.form.status != '0'){
       this.data.form.status = '1'
    }
  
    const self = this;

    if(!this.data.form.imgs.length && !this.data.form.cont && this.data.form.status!='0'){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '不能发布空内容',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return false;
    } 

    if (this.data.form.address === this.data.default_address) {
      this.data.form.address = ''
    }   
  
    wx.showLoading({title: '发布中…'});
    ershouModel.push(this.data.form,function(res){
        wx.hideLoading();
        if(res.res){
           wx.showToast({
            title: '成功',
            icon: 'success',
          })

          // 发布之后，设置一个标志位，返回首页后根据标志位刷新
          // app.need_update = true;
          
          // status == 0 
          // 删除物品，回退两层
          if(self.data.form.status == '0'){
              wx.navigateBack({
                delta: 2
              })             
          }else{
              // 保存用户第一次输入的基本信息，下次直接使用
              wx.setStorageSync('wechat',self.data.form.wechat);
              wx.setStorageSync('address',self.data.form.address);
              wx.setStorageSync('symbol',self.data.form.symbol);
              wx.redirectTo({
                 url: '../success/index?from=create&id='+res.res.id
              })            
          }


        }

        // var url = 'https://examlab.cn/uniapi/user.php?code=getLittleImg&page=detail&id='+res.id;
        // wx.downloadFile({
        //   url: url, //仅为示例，并非真实的资源
        //   success: function(res) {

        //     if (res.statusCode == 200) {
        //        app.canvas.qrcode = res.tempFilePath;
        //     }
        //   }
        // })

      },false)
    },


   // 点击选择城市
   selectCity(){
      wx.navigateTo({
          url: '../city/index?from=edit'
      })      
   },


   // 选择货币符号
   selectMoney(e){

     var index = parseInt( e.detail.value);
     var form = this.data.form;
     form.symbol = this.data.money[index].value;
     form.unit = this.data.money[index].unit;
     this.setData({
        form
     })
   },

    formSubmit: function(e) {
      userModel.collectFormId(e);
    },
});
