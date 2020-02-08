
Component({
  properties: {
    list: {
      type: Array ,
      value: [],
    },
    load_over:{
      type:Boolean,
      value:false
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  // 生命周期中，执行一次
  attached: function(){
    // var list = this.data.list;
    // for (var i = 0; i < list.length; i++) {
    //    if(list[i].nickName.length>5){
    //      list[i].nickName = list[i].nickName.substring(0,4)+'···'
    //    }
    // }
    // this.setData({
    //   list
    // })
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){
      console.log('ok')
    },

    handleClick(e) {
      // c参数：一级分类，二级分类
      this.triggerEvent('handleClick',e.currentTarget.dataset.obj)
    }
    // 下面将是我的天下
  }
})