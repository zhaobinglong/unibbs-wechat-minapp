Component({
  properties: {
    form: {
      type: Object ,
      value: {},
      observer:'loadData'
    },
  },
  data: {
    swiperArr:[], // 保存每张图片需要的高度
    indicatorDots:false, //是否显示切换原点
    Hei:'300px'
  },
  attached: function(){


  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){

    },

    loadData: function(){
      if(this.data.form.imgs && this.data.form.imgs.length>1){
        this.setData({
          indicatorDots:true
        })
      }else{
        this.setData({
          indicatorDots:false
        })        
      }
    },

    // 点击头像，前往个人主页
    clickAvatar(){
      wx.redirectTo({
        url:'/pages/set/index/index?openid='+this.data.form.openid
      })
    },
    
    // https://developers.weixin.qq.com/miniprogram/dev/api/wx.previewImage.html
    clickImg (res) {
      console.log(res)
      let url = res.currentTarget.dataset.name
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: this.data.form.imgs // 需要预览的图片http链接列表
      })
    },

    clickAddWechat: function(){
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

    swiperChange:function(e){
       console.log(e)
       const swiperArr = this.data.swiperArr;
       this.setData({
          Hei:swiperArr[e.detail.current]
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
  }
})