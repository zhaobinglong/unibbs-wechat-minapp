
Page({
  data: {
     line:[],
     showInput:false,
     bottom:0,
     screenHeight:0,
     pageY:0,
     position:false
  },
   onLoad: function(e) {

    wx.getSystemInfo({
      success: (res) => {
        // this.screenHeight = res.windowHeight
        this.setData({
          screenHeight:res.windowHeight
        })
      }
    }) 
    let line = []
    for (var i = 0; i !=100; i++) {
      line.push(i)
    }
    this.setData({
      line:line
    })
  },

  // 随便点击某一行的数字，这一行的数字将滚动到键盘上方
  click: function(e){
    console.log(e)
    this.data.pageY = e.currentTarget.offsetTop
    this.data.clicntY = e.touches[0].clientY
    wx.pageScrollTo({
      scrollTop: this.pageY,
      duration: 300
    }) 

    this.setData({
      showInput:true
    })
  },
  
  // IDE中没有键盘出现，e.detail.height不存在
  bindfocus(e){
    let keyBoardHeight
    if(e.detail.height ){
      keyBoardHeight = e.detail.height 
    }else{
      keyBoardHeight =  292
    }
    
    const h = this.data.screenHeight - keyBoardHeight - 100
    const scrollTop = this.data.pageY - h
    wx.pageScrollTo({
      scrollTop: scrollTop,
      duration: 300
    }) 
    this.setData({
      value:'键盘高度：'+ keyBoardHeight,
    })
  },

  bindblur:function(){
    this.setData({
      showInput:false,
    })     
  }

})