
const ershouModel = require("../../../utils/ershouModel.js");
const systemModel = require("../../../utils/systemModel.js");
const config = require("../../../config/index");


//获取应用实例
var app = getApp();
Page({
  data: {
    img:'',
    form: {}
  },


  onShareAppMessage: function() {
    var title = this.data.form.college+': ' + this.data.form.cont;

    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    var imageUrl =this.data.form.imgs[0] || this.data.img
    return {
      title: title,
      path: path,
      imageUrl:imageUrl
    };
  },

  /**
  * from = share ，前往详情页面
  **/
  onLoad: function(e) {
    wx.showLoading()
    let url = 'https://examlab.cn/uniapi/weixin.php?ctrl=weixin&action=getShareImg&id=' + e.id
    wx.request({
      // 基础路径 加上 接口的路径
      url: url,
      header: {
        // 这里用这种 是post请求时候，后台容易出问题 这种写法可以正常使用
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      // 请求方式
      method: 'GET',
      // 成功回调
      success: res => {
        console.log('=============')
        console.log(res.data)
        wx.hideLoading()
        this.setData({
          img: res.data.trim()
        })
      }
    })
    var self = this;
    ershouModel.getDetail(e.id,function(res){
       console.log(res)
       self.setData({
        form: res.data
       })
    
    },false)


    // 下载本页面的小程序二维码
    // 必须在load时候就开始下载，二维码必须先下载，才能绘制到canvas上
    // var url = 'https://examlab.cn/img/20180323231123.png';

    // var url = config.api+'user.php?page=detail&id='+e.id;
    // console.log(url)
    // wx.downloadFile({
    //   url: url, //仅为示例，并非真实的资源
    //   success: function(res) {
    //     console.log(res)
    //     if (res.statusCode == 200) {
    //        app.canvas.qrcode = res.tempFilePath;
    //        self.drawImg();
    //     }
    //   }
    // })

    

    // if(e.from == 'detail'){
    //      wx.setNavigationBarTitle({
    //        title: '分享'
    //     })       
    // }

    
  },

  // 如果没有这个函数，请求无法发送出去
  onReady: function() {},

  // 每次切出页面，获取当前的
  onShow: function() {},


  // 点击生成按钮，开始绘制
  // 绘制网络图片到canvas，需要先下载图片才可以
  // 如果没有价格，则描述要缩短一点，避免和‘价格待议’重叠
  drawImg(){
    wx.showLoading({title:'正在努力生成中…'});
    var index = 0;//计时器，如果超过5s，认为canvas失败
    var self = this;
    var timer = setInterval(function(){ 
         

        if(app.tempFilePaths[0] && app.canvas.qrcode ){
              clearInterval(timer);
        
              var ctx = wx.createCanvasContext('share_img');
              ctx.setFillStyle('#FFFFFF');
              ctx.fillRect(0, 0, 330, 524)

              // 绘制一个灰色的边框
              ctx.setStrokeStyle('#808080')
              ctx.strokeRect(0, 0, 330, 524)


              // ctx.setFillStyle('red')
              // ctx.setShadow(0,0, 50, 'blue')
              // box-shadow: 0 0 20rpx 0 rgba(122, 122, 122, 0.5);
              // 绘制顶部昵称
              ctx.setFontSize(14);
              ctx.setFillStyle('#505050');
              ctx.setTextBaseline('top');
              ctx.setTextAlign('left')
              ctx.fillText(self.data.form.nickName, 15, 12)   

              // 绘制描述
              ctx.setFontSize(12);
              ctx.setFillStyle('#8c8c8c');
              ctx.setTextBaseline('top');
              ctx.setTextAlign('left');
              ctx.fillText(self.data.form.cont, 15, 27);                

              // 绘制头图
              ctx.drawImage(app.tempFilePaths[0],app.canvas.sx,app.canvas.sy,app.canvas.width,app.canvas.height, 15, 54, 300, 300);
              
              // 绘制左边的描述
              // ctx.setFontSize(14);
              // ctx.setFillStyle('#666666');
              // ctx.setTextAlign('left');
              // ctx.fillText(self.data.form.cont, 20, 320);

              // 绘制右边价格
              ctx.setFontSize(18);
              ctx.setFillStyle('#f5a623');
              ctx.setTextAlign('center');
              if(self.data.form.price == ''){
                 self.data.form.price = '价格待议';
              }
              ctx.fillText('￡'+self.data.form.price, 165, 367);    
              
              // 灰色线条
              // ctx.beginPath();
              // ctx.setStrokeStyle('#e6e6e6');
              // ctx.setLineWidth(0.5);
              // ctx.moveTo(10, 330)
              // ctx.lineTo(310, 330)
              // ctx.stroke()
              
              // 二维码
              ctx.drawImage(app.canvas.qrcode, 115, 398, 100, 100);
              
              ctx.setFontSize(9);
              ctx.setFillStyle('#c8c8c8');
              ctx.setTextAlign('center');
              ctx.fillText('长按识别二维码查看详情', 165, 498);
              
              ctx.stroke();

              ctx.draw();   
              wx.hideLoading(); 


          }else{
             index++;
             if(index>=20){
                var json = {info:'[canvas]qrcode:'+self.data.canvas.qrcode+'img:'+self.data.canvas.img};
                systemModel.errorUpload(json)
                clearInterval(timer);
             }
          }

    }, 1000);

  
  },

  // 下载图片
  downQrcode(){
    wx.showLoading({title:'下载中'});
    var self = this;
    wx.downloadFile({
      url: this.data.img, 
      success: function(res) {
          wx.saveImageToPhotosAlbum({
              filePath:res.tempFilePath,
              success(res) {
                  console.log(res)
                  wx.hideLoading();
                  wx.showModal({
                    title: "提示",
                    content: "该图片已经保存到您的手机相册,可以直接去朋友圈分享啦～",
                    showCancel:false,
                    success: function(res) {
                      if (res.confirm) {
                        console.log("download ok");
                        wx.hideLoading();
                        self.setData({
                           show_qrcode:false
                        })
                      }
                    }
                  });
              },
              fail(){
                 wx.hideLoading();
              }
          })
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  // 头图下载ok
  loadimg:function(e){
    console.log(e)

  }
 

  

});
