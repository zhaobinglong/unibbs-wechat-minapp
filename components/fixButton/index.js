const util = require("../../utils/util.js");
Component({
  properties: {
    // userinfo: {
    //   type: Object ,
    //   value: {}
    //   // observer:'loadData'
    // },
    // obj: {
    //   type: Object ,
    //   value: [],
    //   observer:'loadData'
    // }  
  },
  data: {
  },
  attached: function(){
  },
  methods: {

    onClick: function() {
      wx.navigateTo({
         url: '/pages/date/classify/index'
      }) 
    }
  }
})