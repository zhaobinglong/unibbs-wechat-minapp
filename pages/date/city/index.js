

const systemModel = require("../../../utils/systemModel.js");
const userModel = require("../../../utils/userModel.js");
const pinyinUtil = require("../../../utils/pinyinUtil.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    isSearch: false,
    list: [],
    value:'',
    allCitys:[], //全部城市
    from:'index',
    // hot:['利物浦大学','苏塞克斯大学','伯明翰大学','伦敦大学学院','东安格利亚大学','莱斯特大学','拉夫堡大学','纽卡斯尔大学','南安普顿大学','谢菲尔德大学',
    // '诺丁汉大学','帝国理工学院','利兹大学'],
    hot:['西北政法大学','西安外国语大学'],    
    show_hot:true,
    placeholder:'搜索你的大学',
    unis:[],
    openid: ''
  },

  // from === firstChoose 用户第一次选择大学
  onLoad: function(e) {
    this.data.from = e.from;
    if(e.from == 'uni'){
      wx.setNavigationBarTitle({
        title: '搜索'
      })   
      this.setData({
        placeholder:'搜索'
      })  
    } else if (e.from == 'bind') {
      this.data.openid = e.openid
      wx.setNavigationBarTitle({
        title: '绑定学校'
      }) 
    } else if(e.from == 'college'){
      this.setData({
        placeholder:'搜索大学'
      }) 
    } else {

    }
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  onShow: function() {

  },
  
 
  bindInput(e){
    console.log(e)
    this.data.value = e.detail.value;
    if(!e.detail.value){
       this.setData({
        list:[],
        placeholder: '搜索',
        show_hot:true,
        value: ''
       })
       return false;
    }
    
    this.searchByCollege()
    // if(this.data.from == 'uni') {
    //   this.searchMessage(e.detail.value)
    // }else{
    //   var self = this;
    //   systemModel.getColleges(e.detail.value,function(res){
    //      self.setData({
    //       list:res,
    //       show_hot:false
    //      })
    //   },false)       
    // } 
  },
  
  // 当搜索框失去焦点时，要记录当前的搜索关键词
  bindBlur(e) {
    console.log(e)
    let key_word = e.detail.value
    
  },
  
  // 模糊搜索学校
  searchByCollege () {
    var self = this;
    if(this.data.from == 'uni') {
      this.searchMessage(self.data.value)
    }else{
      systemModel.getColleges(self.data.value,function(res){
         self.setData({
          list:res,
          show_hot:false
         })
      },false)       
    } 
  },

  searchMessage(value){
      systemModel.getUni(value, (res) => {
        console.log(res)
        let college = wx.getStorageSync('college') || ''
        let list = []
        if (college) {
          res.map((item, index) => {
            if(item.college == college) {
              list.push(res.splice(index, 1)[0])
            }
          })      
        }
        list = list.concat(res)
        this.setData({
          unis: list
        }) 
      }, false)     
  }, 

  // 过滤国家或者城市为空的数据
  filterEmpty(arr){
    var res = [];
    for (var i = 0; i < arr.length; i++) {
       if(arr[i].city && arr[i].nation){
          res.push(arr[i]);
       }
    }
    return res
  },


  // 模糊查询
  search(){
    console.log(this.data.allCitys)
    var len = this.data.allCitys.length;
    var arr = [];
    var keyWord = this.data.value
    var reg = new RegExp(keyWord);
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        var citys = this.data.allCitys[i].citys;
        var items = [];
        for (var j = 0; j < citys.length; j++) {
          if(citys[j].city.match(reg)){
              items.push(citys[j]);
          }
        }
        if(items.length){
           arr.push({
            letter:this.data.allCitys[i].letter,
            citys:items
           })
        }

    }
    this.setData({
       list:arr
    })
  },

  // 过滤重复的城市
  uniqueCitys(arr){
    var res = []
    for (var i = 0; i < arr.length; i++) {
        if(res.length == 0){
            res.push(arr[i]);
        }else{
            for (var j = 0; j < res.length; j++) {
                if(arr[i].city == res[j].city){
                   break;
                }else{
                   if(j == res.length-1){
                      res.push(arr[i]);
                   }
                }

            }
        }

    }
    return res;
  },


  
  // 拿到用户昵称的首字母
  buildData(obj){
    obj = this.filterEmpty(obj);

    obj = this.uniqueCitys(obj);

    var res = [];
    var arr = []
    for (var i = 0; i < obj.length; i++) {
      var letter = obj[i].city.split('')[0];
      arr.push({
        city:obj[i].city,
        nation:obj[i].nation,
        firstLetter:pinyinUtil.getFirstLetter(letter)
      })
    }
    

    // 每个城市都有了首字母，现在开始合并
    for (var m = 0; m < arr.length; m++) {
      var isAdd = true;
      var index = 0;
      for (var n = 0; n < res.length; n++) {
          if(arr[m].firstLetter == res[n].letter){
             isAdd = false;
             index = n
          }
      }

      if(isAdd){
         var citys = [];
         citys.push({
           city:arr[m].city,
           nation:arr[m].nation
         });
         res.push({
           letter:arr[m].firstLetter,
           citys:citys
         })
       
      }else{
         res[index].citys.push({
           city:arr[m].city,
           nation:arr[m].nation
         })
      };

    }



    res.sort(this.sortCity);

    this.setData({
        list:res
    });
    this.data.allCitys = res;

  },
  

  // 修改学校
  // 一个用户只能修改一次学校
  // 但是可以随时切换学校查看其他学校的信息
  // 该页面还要承载公众号用户的绑定学校任务
  clickCity(e){

     let college = e.currentTarget.dataset.college;
     if (this.data.from == 'bind') {
        this.bindCollege(college, this.data.openid)
     } else {
       let obj = {
        openid: wx.getStorageSync('openid'),
        college: college
       }
       wx.setStorageSync('college', college)
       let userInfo = wx.getStorageSync('userInfo')
       // 用户第一次选择大学，只能选择一次
       if (!userInfo.college) {
         wx.showModal({
          title: college,
          content: '只有一次机会选择自己的学校,你确定选择' + college + '吗',
          success(res) {
            if (res.confirm) {
               userInfo.college = college
               wx.setStorageSync('userInfo',userInfo)
               userModel.chooseCollege(obj,function(res){
                 wx.removeStorageSync('collegeInfo')
                 wx.reLaunch({
                  url: '../index/index?college='+college
                 })
               },false) 
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
       } else {
          wx.removeStorageSync('collegeInfo')
          wx.reLaunch({
            url: '../index/index?college='+college
          })
       }
     }
  },
  
  // 公众号绑定学校
  bindCollege (college, openid) {
     let obj = {
      openid: openid,
      college: college
     }
     wx.showModal({
      title: college,
      content: '确定绑定' + college + '吗？',
      success(res) {
        if (res.confirm) {
           userModel.chooseCollege(obj,function(res){
             wx.removeStorageSync('collegeInfo')
             wx.reLaunch({
              url: '../index/index?college=' + college
             })
           },false) 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  clickUni (e) {
    const id = e.currentTarget.dataset.id;
    const url = '../detail/index?id=' + id;
    wx.navigateTo({
      url: url
    })  
  },
  

  // 好友按照首字母排序
  sortCity(a,b){
    return a.letter.toString().localeCompare(b.letter)
  },



  



});
