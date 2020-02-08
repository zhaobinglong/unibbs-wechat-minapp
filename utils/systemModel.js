const network = require("./network.js")
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调


// 获取大学列表
function getCurrency(callback,fail){
    var url = '/user.php?code=getCurrency';
    network.get(url,callback,fail)  
}

// 获取分类信息
function getTypeList(callback,fail){
    var url = 'wechat.php?ctrl=api&action=getTypeList';
    let classify = wx.getStorageSync('classify')
    if (classify) {
      callback(classify)
    } else {
      network.post(url,{},callback,fail)  
    }
}


// 更新用户信息
function  sendWXNotice(data,callback,fail){
    var url = '/push.php?action=pushAfterMessgae';
    if(!data.name){
      data.name = '匿名用户'
    }
    network.post(url,data,callback,fail)
}

// 获取城市列表
function getCitys(callback,fail){
    var url = '/user.php?code=getCitys';
    network.get(url,callback,fail)  
}

// 获取二手列表
function getUni(value, callback, fail){
    var url = 'user.php?code=search&keyword=' + value;
    network.get(url,callback,fail)  
}

// 获取城市下面的大学
function getColleges(name,callback,fail){
    var url = '/user.php?code=getColleges&name='+name;
    network.get(url,callback,fail)        
}

// 根据定位的城市，获取城市下面的大学
function getCollegesByCity(name,callback,fail){
    var url = '/user.php?code=getCollegesByCity&city='+name;
    network.get(url,callback,fail)        
}

// 根据名字获取大学信息
function getCollege(name,callback,fail){
    var url = '/user.php?code=getCollege&uName='+name;
    network.get(url,callback,fail)     
}

// 根据大学id获取学校名字
function getCollegeById(id,callback,fail){
    var url = '/user.php?code=getCollegeById&sid='+id;
    network.get(url,callback,fail)     
}



// 收集formid 不需要callback
function collectFormId(e){
    var openid = wx.getStorageSync('openid');
    if(!openid){
       return false;
    }
    var self = this;
    var url = "user.php?code=formId";
    if( e.detail.formId == 'the formId is a mock one'){
      return false
    }
    var data = {
      openid:openid,
      formId:e.detail.formId
    }
    console.log(data)
    network.post(url, data, function(res) {
       console.log(res)
    }, false);
}

// 数据异常上报
function errorUpload(data){
    var url = '/user.php?code=errorUpload';
    network.post(url,data,function(res){
      console.log(res)
    },false)
}


module.exports = {
  getCurrency:getCurrency,
  getTypeList:getTypeList,
  sendWXNotice:sendWXNotice,
  getCitys:getCitys,
  collectFormId:collectFormId,
  getColleges:getColleges,
  getCollegesByCity:getCollegesByCity,
  getCollege:getCollege,
  errorUpload:errorUpload,
  getCollegeById:getCollegeById,
  getUni: getUni
}

