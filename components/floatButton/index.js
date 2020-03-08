const util = require("../../utils/util.js");
Component({
  properties: {
    type: {
      type: String ,
      value: 'default'
      // observer:'loadData'
    },
    // obj: {
    //   type: Object ,
    //   value: [],
    //   observer:'loadData'
    // }  
  },
  data: {
    'navigatePath':{
      'default': '/pages/feedback/index'
    }
  },
  attached: function(){
  },
  methods: {

    onClick: function() {
      console.log(this.properties.type)
      wx.navigateTo({
         url: this.data.navigatePath[this.properties.type]
      }) 
    }
  }
})