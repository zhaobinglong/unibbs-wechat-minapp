

const network = require("./network");
// const pinyinUtil = require("./pinyinUtil.js");
var QQMapWX = require('./qqmap-wx-jssdk.min.js');
// pinyinUtil.getFirstLetter(username);

// a 开始时间 YYYY-MM-DD
// b 结束时间 YYYY-MM-DD
function  diffDate(a,b){
      var aArr = a.split('-');
      var bArr = b.split('-');
      return moment(bArr).diff(moment(aArr), 'days') 
}

// 将UTC时间转根据timezone进行转换  目标格式HH:mm
function convertTimeByTimezone(utc,timezone){
	if(!timezone){
		timezone = 'Asia/Chongqing';
	}
	if(utc){
		return  moment(utc).tz(timezone).format("HH:mm");
	}else{
		return '-';
	}
}

function convertDateByTimezone(utc,timezone){
	if(!timezone){
		timezone = 'Asia/Chongqing';
	}
	if(utc){
		return  moment(utc).tz(timezone).format("YYYY-MM-DD HH:mm");
	}else{
		return '-';
	}
}

// 判断时间是否已经过期
function isBefore(form){
    var today = moment().format('YYYY-MM-DD');
    // 跨天的日程，第一天的结束时间为-，看开始时间
	if(form.endDate == '-' ){
       return moment(form.startDate.split(' ')[0]).isBefore(today);
	}else{
       if(form.isAllDay){
           return moment(form.endDate.split(' ')[0]).isBefore(today);
       }else{
       	   today = moment().format('YYYY-MM-DD HH:mm');
       	   return moment(form.endDate).isBefore(today);
       }
	}

}

/** 日程列表排序
* 优先展示全天类型的日程
* 非全天的日程，按照持续时间长短排列，长的排在前面‘
* 持续时间相同，则按照名字首字母排列
**/
function sortActivity(arr){
   for (var i = 0; i < arr.length; i++) {
       arr[i].continueTime = this.diffTime(arr[i]);
       arr[i].firstLetter = pinyinUtil.getFirstLetter(arr[i].name);
   }
   arr.sort(function(a,b){
   	  if(a.continueTime == b.continueTime){
          return a.firstLetter.toString().localeCompare(b.firstLetter);
   	  }else{
   	  	 return b.continueTime - a.continueTime;
   	  }
   	  
   })

   return arr
}

// 计算日程开始时间和结束时间相差的分钟数
function diffTime(obj){
   var startDate = '00:00';
   var endDate = '24:00';
   if(obj.isAllDay){
   	  return 24*60;
   }else{
   	  if(obj.startDate == '-'){
         startDate = '00:00';
   	  }else{
         startDate = obj.startDate;
   	  }
   	  if(obj.endDate == '-'){
         endDate = '00:00';
   	  }else{
         endDate = obj.endDate;
   	  }
      
      var hours = parseInt(endDate.split(':')[0])-parseInt(startDate.split(':')[0]);
      var minutes = parseInt(endDate.split(':')[1])-parseInt(startDate.split(':')[1]);
      return hours*60+minutes

   }
}

// // 获取微信信息
// function getLocation(){
//   // 实例化API核心类
//   var demo = new QQMapWX({
//       key: 'ZT2BZ-C7FWP-DUMD2-VASMB-EUKXJ-ADF7N' // 必填
//   });
   
//   // 调用接口
//   demo.reverseGeocoder({
//       location: {
//           latitude: 39.984060,
//           longitude: 116.307520
//       },
//       success: function(res) {
//           console.log(res);
//       },
//       fail: function(res) {
//           console.log(res);
//       },
//       complete: function(res) {
//           console.log(res);
//       }
//   });  
// }


// 获取国家
function getLocationDesc(callback,fail){


  // var demo = new QQMapWX({
  //     key: 'ZT2BZ-C7FWP-DUMD2-VASMB-EUKXJ-ADF7N' // 必填
  // });


  // wx.getLocation({
  //   type: 'wgs84',
  //   success: function(res) {
  //     console.log(res)
  //     var wxLocation = res;
  //     demo.reverseGeocoder({
  //         location: {
  //             latitude: res.latitude,
  //             longitude: res.longitude
  //         },
  //         success: function(res) {
  //             console.log(res)

  //             callback(res.result.address_component);
  //         },
  //         fail: function(res) {
  //             console.log('fail了，重新打印：')
  //             console.log(res)
  //             fail(res)
  //         },
  //         complete: function(res) {
  //             console.log('进入complete：')
  //             console.log(res)
  //         }
  //     }); 
  //   },
  //   fail:function(res){
  //       wx.showModal({
  //         title: '定位提示',
  //         content: res.errMsg,
  //         success: function(res) {},
  //         showCancel:false
  //       })
  //   },
  //   complete:function(res){
  //       // wx.showModal({
  //       //   title: '定位提示',
  //       //   content: res.errMsg,
  //       //   success: function(res) {},
  //       //   showCancel:false
  //       // })
  //   }
  // })
  var key = 'ZT2BZ-C7FWP-DUMD2-VASMB-EUKXJ-ADF7N';
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
        // console.log(res)
        // 英国利物浦的坐标
        // var res = {
        //   latitude:53.404,
        //   longitude:-2.9645
        // }
        var url =  '/user.php?code=getLocation&lat='+res.latitude+'&lng='+res.longitude;

        network.get(url,function(res){
          callback(res.result.address_component);
        },false);  
    },
    fail:function(res){
        console.log(res)
        wx.showModal({
          title: '定位提示',
          content: res.errMsg,
          success: function(res) {},
          showCancel:false
        })
    },
    complete:function(res){
    }
  })   
 
}

function showToast(str){
    wx.showToast({
      title: str,
      icon: 'success',
      duration: 2000
    })
}

// 获取小程序码
function getLittleImg(data,callback,fail){
   network.post('/user.php?code=getLittleImg',data,callback,fail)
}

// 数组乱序排列
function shuffle(array) {
    return array.sort(function(){return Math.random() > 0.5});
}

function getDateStr (AddDayCount) {
     var dd = new Date();
     dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
     var y = dd.getFullYear();
     var m = dd.getMonth()+1;//获取当前月份的日期
     if(m<10){
       m='0'+m
     }
     var d = dd.getDate();
     if(d<10){
       d='0'+d
     }
     return y+"-"+m+"-"+d;
}

// 是不是商品
function is_goods (str) {
  let classify = wx.getStorageSync('classify')
  if (classify[0].name === '全部') {
    classify.shift()
  }
  for (var i = 0; i < classify.length; i++) {
    if (!classify[i].subCategory) {
      break;
    }
    let subCategory = classify[i].subCategory;
    for (var j = 0; j < subCategory.length; j++) {
      if (subCategory[j] == str) {
        if (classify[i].name == '二手' || classify[i].name == '租房' || classify[i].name == '兼职') {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

// 根据一级分类判断是不是商品
function is_goods_by_classify (str) {
  if (str == '二手' || str == '租房' || str == '兼职') {
    return true;
  } else {
    return false;
  }
}


function get_classify (str) {
  const classify = wx.getStorageSync('classify')
  for (var i = 0; i < classify.length; i++) {
    let subCategory = classify[i].subCategory;
    for (var j = 0; j < subCategory.length; j++) {
      if (subCategory[j] == str) {
        return classify[i].name
      }
    }
  }  
}

//字符串转换为时间戳
function getDateTimeStamp(dateStr) { 
  return Date.parse(dateStr.replace(/-/gi,"/"))
}

// 根据时间戳，计算是几天前几小时前几分钟前
function getDateDiff(dateStr) {  
  dateStr = parseInt(dateStr)
  var d_seconds,  d_minutes,  d_hours,  d_days, timeNow = parseInt(new Date().getTime()/1000),  d,  date = new Date(dateStr * 1000),  Y = date.getFullYear(), M = date.getMonth() + 1,  D = date.getDate(), H = date.getHours(),  m = date.getMinutes(),  s = date.getSeconds();  
  //小于10的在前面补0  
  if (M < 10) {   
    M = '0' + M;  
  } 
  if (D < 10) {   
    D = '0' + D;  
  } 
  if (H < 10) {   
    H = '0' + H;  
  } 
  if (m < 10) {  
   m = '0' + m;  
  } 
  if (s < 10) {   
    s = '0' + s;  
  } 
  d = timeNow - dateStr;  
  d_days = parseInt(d / 86400); 
  d_hours = parseInt(d / 3600); 
  d_minutes = parseInt(d / 60); 
  d_seconds = parseInt(d);  
  if (d_days > 0 && d_days < 3) {   
    return d_days + '天前'; 
  } else if (d_days <= 0 && d_hours > 0) {   
    return d_hours + '小时前'; 
  } else if (d_hours <= 0 && d_minutes > 0) {   
    return d_minutes + '分钟前'; 
  } else if (d_seconds < 60) {  
    if (d_seconds <= 0) {    
      return '刚刚发表';    
    } else {     
      return d_seconds + '秒前';    
    } 
  } else if (d_days >= 3 && d_days < 30) {   
   return M + '-' + D + ' ' + H + ':' + m; 
  } else if (d_days >= 30) {    
    // return Y + '-' + M + '-' + D + ' ' + H + ':' + m; 
    return Y + '-' + M + '-' + D ; 
  }
}

function formatTimeStamp(s) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(parseInt(s));
  var y = time.getFullYear();
  var m = time.getMonth()+1 < 10 ? '0' + (time.getMonth()+1) : time.getMonth()+1 
  var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
}



module.exports = {

  diffDate: diffDate,
  diffTime:diffTime,
  getLocationDesc:getLocationDesc,
  convertTimeByTimezone:convertTimeByTimezone,
  convertDateByTimezone:convertDateByTimezone,
  isBefore:isBefore,
  sortActivity:sortActivity,
  showToast:showToast,
  getLittleImg:getLittleImg,
  shuffle:shuffle,
  getDateStr:getDateStr,
  is_goods: is_goods,
  get_classify: get_classify,
  getDateDiff: getDateDiff,
  is_goods_by_classify: is_goods_by_classify,
  formatTimeStamp: formatTimeStamp
}
