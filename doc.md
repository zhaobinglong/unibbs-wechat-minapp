## 配置项目基础数据

// app.js
App({
  globalData: 1
})

<view>{{text}}</view>

## 定时返回上一层
setTimeout(function(){
    wx.navigateBack({
      delta: 1
   })
},2000)






## 在子页面中获取数据，传递到全局app中
var app = getApp()
app.globalData++




## 给元素绑定事件

<!-- 单击 -->
<button  bindtap="toLogin">登录</button>
<!-- 长按⌚️ -->
<button  bindlongpress="toLogin">登录</button>

## 在绑定的函数中传递参数

<button  bindtap="toLogin" data-ctype="2">登录</button>
//js函数中获取
  toggleType: function (event) {
    var ctype=event.target.dataset.ctype;
    //console.log(ctype);
  },

## 动态设置data中的数据

this.setData({
      key: value
})


## 条件渲染，if else模式

< div wx:if="{{coupons.length > 1}}">length>1渲染</div>
< div wx:else="{{coupons.length == 0}}">length>1渲染</div>


## 利用数据绑定机制获取

<input bindinput="bindReplaceInput" />

//在js中获取，注意是e.detail.value
bindUserInput: function (e) {
     //console.log(e.detail.value);
}


## 发起ajax请求
注意：微信小程序只能使用https协议，需要在微信后台配置服务器域名

    wx.request({
      url: 'https://baidu.com/user/send_validate_code_message',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      data:{},
      success: function(res) {
        //console.log(res)
      }
    })

## 设置当前页面title，如果你的文件目录是pages/login, 需要新建login.json文件，注意名字必须一样

{
  "navigationBarTitleText": "微信接口功能演示"
}

## 动态设置页面title
    wx.setNavigationBarTitle({
      title: that.data.mername//页面标题为路由参数
    })

## 常见报错：不在以下合法域名列表中，请参考文档

登陆微信小程序后台，在配置中添加域名

## 跳转到新的页面，使用相对路径

//跳转之后带返回
wx.navigateTo({
    url: '../coupons/coupons'
})
//不带返回
wx.redirectTo({
      url: '../login/login'
})

## 列表循环

//循环输出p标签
<p  wx:for="{{array}}">
   <a>array.name</a>
</p>

## 路由

### 页面内跳转（必须使用navigator 标签）

//跳转到应用内的其他页面，可以在右上角返回
<navigator  url="../explain/explain" open-type="navigate">呆币说明</navigator>
//跳转应用内其他页面，会关闭之前的页面，无法返回
<navigator  url="../explain/explain" open-type="navigate">呆币说明</navigator>


### 自动回退到上一个页面
wx.navigateBack({
  delta: 2
})
### 点击页面中的标签跳转
    <navigator  open-type="navigate"  url="../daibi/daibi">
      点击跳转
    </navigator>

### 在url中带参数
//直接在url中写入参数 
user/index?name=123
//在目标页面中获取url参数
onLoad: function (e) {
   //e.name
}

### ddd

在任意目录新建js文件
//filter.js
var filters={
   getName:function(index){
       return index+1
   }
}
module.exports=filters;


## 引用模块

//注意这里是基于当前页面的相对路径
var  utils = require('../../../common/module/utils.js');


## 如何设置体验版本给测试人员

- 由管理员在编辑器中上传上传代码
- 在后台设置为体验版本，点击发布
- 在后台用户身份中，绑定多名体验者


## tab上的icon图标，放在哪里比较好



## 获取url中的参数

onLoad:function(options){
    options.name
}

## 在业务页面中，调用app中的公用函数，回调到页面中来

//业务页面 user.js,调用app.js中的login函数
//tologin是user页面绑定的函数，getUserInfo也是user的函数，
toLogin:function(){
   app.login(this.getUserInfo)
},

//在app中的login函数
//我们通常会把一些通用逻辑，比如登陆，比如退出登陆，封装到app中。然后在其他页面调用，调用结束后，执行回调逻辑
login:function (callback) {
         wx.request({
                url: self.apibase+'/wechat/decrypt',
                method:'POST',
                header: {'content-type': 'application/x-www-form-urlencoded'},
                success: function(info) {
                    //执行其他页面的callback回调函数
                    callback && typeof callback =='function' && callback();
                }
         })
}


## 分享

小程序可以在每个页面添加单独的分享，分享应用内的页面链接，分享图片是当前屏幕截取的图片，开发者无法自定义，建议将分享title和path在app中定义，然后全局引用，维护方便

onShareAppMessage: function () {
    return {
      title: app.shareTitle,
      path: app.shareUrl,
    }
},


## 20200308
- 搜索时注意过滤被删除的帖子，要倒序
- 对上传的内容接入微信内容审核接口
- 发布成功后，增加分享按钮
- 引入iconfont字体
- 首页增加学校广播

