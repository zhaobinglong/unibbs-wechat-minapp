const network = require("./network.js")
const userModel = require("./userModel.js")
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调

// 日程点击量统计


// 获取二手详情
function getDetail(id,callback,fail){
    var url =  "/wechat.php?ctrl=api&action=getDetail&id="+id;
    let data = {
      'id': id
    }
    network.post(url,data,callback,fail);    
}

// 删除二手
function delDetail(id,callback,fail){
    var url =  "/user.php?code=delDetail&id="+id;
    network.get(url,callback,fail);    
}

// 获取二手评论
function getMessage(id,callback,fail){
    var url =  "/user.php?code=getMessage&id="+id;
    network.get(url,callback,fail);    
}

// 更新评论数量
function updateMessageCount(data,callback,fail){
    var url =  "/user.php?code=updateMessageCount";
    network.post(url,data,callback,fail);    
}


// 发布二手
function push(data,callback,fail){
    var url =  "wechat.php?ctrl=api&action=push";
    network.post(url,data,callback,fail); 
} 

// 获取二手列表
// data={
//  nation:XX
//  city:XX
// }
function getList(data,callback,fail){
  // var url = "/user.php?code=getList&college="+college+'&page='+page+'&type='+type;
  var url = "wechat.php?ctrl=api&action=getList";
  network.post(url,data,callback,fail);  	
  
}

// 获取指定用户的二手列表
function getMyList(openid,page,callback,fail){
  var url = "/user.php?code=getMyList&openid="+openid+'&page='+page;
  network.get(url,callback,fail);   
}


// 搜素
function search(data,callback,fail){
  var url = "/wechat.php?ctrl=api&action=search";
  network.post(url,data,callback,fail);   
}

module.exports = {
   push:push,
   delDetail:delDetail,
   getList:getList,
   getMyList:getMyList,
   getDetail:getDetail,
   updateMessageCount:updateMessageCount,
   getMessage:getMessage,
   search: search
}

