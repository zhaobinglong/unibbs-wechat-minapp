
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
    onClick: function(e){
      // const url = '/pages/date/detail/index?id=' + e.currentTarget.dataset.item.id
      this.triggerEvent('clickevent', {'obj': e.currentTarget.dataset.item})
    },

    getUserInfoByBtn:function(res) {
      console.log(res)
    },

    // 用户点赞，直接进行局部刷新
    onLike: function(e) {
      // console.log(this.data.list)
      // const id = e.currentTarget.dataset.item.id
      // for (var i = 0; i < this.data.list.length; i++) {
      //   if (id === this.data.list[i].id) {
      //     let obj = this.data.list[i];
      //     obj.liked = parseInt(obj.liked) + 1
      //     this.setData({
      //       ["list[" + i + "]"]:obj
      //     })
      //   }
      // }
      this.triggerEvent('likedevent', {'id': e.currentTarget.dataset.item.id})
    }
    // 下面将是我的天下
  }
})