
Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    scrollLop: 100,
    calendar:{},
    offSetLeft:0,
    num:20,
    url:''
  },
   onLoad: function(e) {
     const url = wx.getStorageSync('url')
     this.setData({
      url:url
     })
  },

  // 滚动到最左边
  upper: function(e) {
    // console.log(e)
    this.tap('nowMonth')
  },

  // 滚动到最右边
  lower: function(e) {
    // console.log(e)
    this.tap('nowMonth')
  },
  scroll: function(e) {
    // console.log(e)
  },
  

  // 切换视区域
  tap: function(e) {
    this.setData({
      toView: e
    })

  },


 initData() {
    var date = new Date();
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    if (cur_month < 10) {
      cur_month = "0" + cur_month;
    }
    var cur_week = date.getDay();
    var cur_day = date.getDate();
    var cur_index = cur_day - 1;
    var temp = new Date(cur_year, cur_month, 0);
    var len = temp.getDate();
    var total_day = [];





    for (var i = 1; i <= len; i++) {
      total_day[i] = {
        day: i,
        weekend: false,
        index: i
      };
    }


    var calendar={
      days:total_day,
      start_empty:3,
      end_empty:2
    }

    this.setData({
      calendar
    });
  },

  touchStart(e){
     this.data.offSetLeft = e.changedTouches[0].clientX
  },
  touchEnd(e){
     var touchMove = e.changedTouches[0].clientX - this.data.offSetLeft;
     console.log(touchMove)
     if(touchMove>50){
        this.tap('beforeMonth')
     }else if(touchMove< -50){
        this.tap('afterMonth')
     }else{
        this.tap('nowMonth')
     }
  }


})