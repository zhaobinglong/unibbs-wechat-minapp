Component({
  properties: {
    college: {
      type: String ,
      value: '',
    },
    page: {
      type: String,
      value: 'user'
    },
    unread: {
      type: String,
      value: ''
    },
    is_x: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    tabBar_user:'../../img/tabBar_user.png',
    tabBar_user_select:'../../img/tabBar_user_select.png',
    tabBar_home:'../../img/tabBar_home.png',
    tabBar_home_select:'../../img/tabBar_home_select.png',
  },
  attached: function(){


  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){
      console.log('ok')
    },

    clickPush: function(){
      wx.navigateTo({
         url: '/pages/date/classify/index'
      }) 
    },

    clickUser: function(){
      const path = '/pages/set/index/index?openid='+wx.getStorageSync('openid');
      wx.redirectTo({
        url:path
      })
    },
    clickHome: function(){
      const path = '/pages/date/index/index?college='+this.data.college;
      wx.redirectTo({
        url:path
      })
    }
  }
})