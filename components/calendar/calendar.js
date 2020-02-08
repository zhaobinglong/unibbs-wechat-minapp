var app = getApp();
const utils = require("../../common/module/utils.js");
const conf = {
  data: {
    //hasEmptyGrid: false,
    options: {}
    /*
    cur_month,
    cur_year,
    begin,
    end,
    options
    */
  },
  onShareAppMessage: function() {
    return {
      title: app.shareTitle,
      path: app.shareUrl
    };
  },
  // getSystemInfo() {
  //   try {
  //     const res = wx.getSystemInfoSync();
  //     this.setData({
  //       scrollViewHeight: res.windowHeight * res.pixelRatio || 667
  //     });
  //   } catch (e) {
  //     //console.log(e);
  //   }
  // },
  // getThisMonthDays(year, month) {
  //   return new Date(year, month, 0).getDate();
  // },
  // getFirstDayOfWeek(year, month) {
  //   return new Date(Date.UTC(year, month - 1, 1)).getDay();
  // },
  // calculateEmptyGrids(year, month) {
  //   const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
  //   let empytGrids = [];
  //   if (firstDayOfWeek > 0) {
  //     for (let i = 0; i < firstDayOfWeek; i++) {
  //       empytGrids.push(i);
  //     }
  //     this.setData({
  //       hasEmptyGrid: true,
  //       empytGrids
  //     });
  //   } else {
  //     this.setData({
  //       hasEmptyGrid: false,
  //       empytGrids: []
  //     });
  //   }
  // },
  //tow
  buildLength(str) {
    str = str + "";
    return (str = str.length < 2 ? "0" + str : str);
  },
  // calculateDays(year, month) {
  //   var days = [];
  //   let self=this;
  //   const thisMonthDays = this.getThisMonthDays(year, month);
  //   month = self.buildLength(month)
  //   for (let i = 1; i <= thisMonthDays; i++) {
  //     var ii = self.buildLength(i);
  //     days[i]={
  //       days:ii,
  //       time:[year,month,ii].join('')
  //     };
  //   }
  //   days.shift()
  //   this.setData({
  //     days
  //   });
  //   //console.log(self.data.cur_month)
  //   self.getCancalendarPrice(days)
  // },
  // buildRange(year,month){
  //   let self=this,
  //     date=new Date();
  //   var cur_day=date.getDate(),
  //       next_day=+cur_day+1,
  //       next_month=month,next_year=year,
  //       begin,end,cur_time;
  //   if (next_day-1 > self.data.days.length) {
  //     next_month=next_month+1;
  //     if (next_month>12) {
  //       next_year=next_year+1;
  //     }
  //   }
  //   begin=cur_time=[year,self.buildLength(month),self.buildLength(cur_day)].join('');
  //   end=[next_year,self.buildLength(next_month),self.buildLength(next_day)].join('');

  //   this.setData({
  //     //begin,
  //     //end,
  //     cur_time
  //   });
  //   //this.getTotalPrice();
  // },
  onLoad(options) {
    let self = this;
    self.setData({ options });
    wx.setNavigationBarTitle({
      title: "和讯日程"
    });
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1,
      cur_day = date.getDate();
    const weeks_ch = ["日", "一", "二", "三", "四", "五", "六"];
    const room_type_id = options.room_type_id;
    const cur_time =
      cur_year +
      "" +
      self.buildLength(cur_month) +
      "" +
      self.buildLength(cur_day);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      room_type_id,
      cur_time
    });
    // this.calculateEmptyGrids(cur_year, cur_month);
    // this.calculateDays(cur_year, cur_month);
    // this.buildRange(cur_year,cur_month);
    // this.getSystemInfo();
    self.getCancalendarPrice();
  },
  // handleCalendar(e) {
  //   const handle = e.currentTarget.dataset.handle;
  //   const cur_year = this.data.cur_year;
  //   const cur_month = this.data.cur_month;
  //   if (handle === 'prev') {
  //     let newMonth = cur_month - 1;
  //     let newYear = cur_year;
  //     if (newMonth < 1) {
  //       newYear = cur_year - 1;
  //       newMonth = 12;
  //     }
  //     this.setData({
  //       cur_year: newYear,
  //       cur_month: newMonth
  //     })

  //     this.calculateDays(newYear, newMonth);
  //     this.calculateEmptyGrids(newYear, newMonth);

  //   } else {
  //     let newMonth = cur_month + 1;
  //     let newYear = cur_year;
  //     if (newMonth > 12) {
  //       newYear = cur_year + 1;
  //       newMonth = 1;
  //     }
  //     this.setData({
  //       cur_year: newYear,
  //       cur_month: newMonth
  //     })

  //     this.calculateDays(newYear, newMonth);
  //     this.calculateEmptyGrids(newYear, newMonth);

  //   }
  // },
  checkDay(e) {
    var self = this,
      data = e.currentTarget.dataset,
      time = data.time,
      app = self.data,
      is_full_booked = data.check,
      cur_time = app.cur_time,
      begin = app.begin,
      end = app.end,
      storage_idx = app.storage_idx,
      cur_idx = data.sidx;
    //invalid
    if (time < cur_time) {
      return;
    }

    //1.默认是没有选择
    //2.第一次点击是begin,第二次点击如果小于begin,那替代begin;如果大于begin那是end;
    //3.当begin和end都存在时,再次点击,取消end,且begin是当前点击;
    //4.当然begin和end之间不能有满房

    //第一次点击
    if (!begin) {
      //满房
      if (is_full_booked) {
        return;
      } else {
        //非满房
        begin = time;
        storage_idx = cur_idx;
      }
    } else if (time < begin) {
      //非第一次点击
      //在前面
      //满房不可选,否则重置并选中
      if (is_full_booked) {
        return;
      } else {
        end = null;
        begin = time;
        storage_idx = cur_idx;
      }
    } else if (time > begin) {
      //在后面
      //1.重置;2.满房变为退房;3.不可选(遍历范围内所以值来判断)
      //不进行遍历就可以进行判断的
      if (end && !is_full_booked) {
        begin = time;
        storage_idx = cur_idx;
        end = null;
      } else if (end && is_full_booked) {
        return;
      } else {
        //否则要遍历范围内的所有值,不能出现满房,否则不可选并重置;
        var day_list = self.data.day_list,
          enable = true;
        for (var i = storage_idx; i < cur_idx; i++) {
          if (day_list[i].is_full_booked) {
            enable = false;
            break;
          }
        }
        if (enable) {
          end = time;
        } else {
          self.setData({
            showMask: true,
            msg: "选中范围包含有满房,请重新选中",
            totalPrice: "--"
          });
          begin = end = storage_idx = 0;
        }
      }
    }

    //旧版
    // if (time<begin || (time>begin&&time<end)) {
    //   begin=time;
    // }else if (time >end) {
    //   end=time;
    // }else if(time==end&&end-begin>1){
    //   var date=new Date(end.slice(0,4),end.slice(4,6),end.slice(6,8)),
    //     year=date.getFullYear(),
    //     new_year=year,
    //     month=date.getMonth(),
    //     new_month=month,
    //     day=date.getDate(),
    //     new_day=day-1;
    //   if (new_day<=0) {
    //     new_month=month-1;
    //     if (new_month<=0) {
    //       new_month=12;
    //       new_year=year-1;
    //     }
    //     new_day=self.getThisMonthDays(year,month)
    //   }
    //   end=[new_year,self.buildLength(new_month),self.buildLength(new_day)].join('')
    // }
    self.setData({
      begin,
      end,
      storage_idx
    });
    //console.log(time)
    //console.log('begin:'+begin)
    //console.log('end:'+end)
    if (begin && end) {
      self.getTotalPrice();
    }
  },
  buildDate: function(str) {
    var year = str.slice(0, 4),
      month = str.slice(4, 6),
      day = str.slice(6, 8);
    return year + "-" + month + "-" + day;
  },
  goTo: function(e) {
    const self = this,
      data = self.data,
      end = data.end;
    if (!end) {
      return;
    }
    wx.navigateTo({
      url:
        "../../order/order_form/order_form?room_type_id=" +
        data.room_type_id +
        "&checkin_date=" +
        self.buildDate(data.begin) +
        "&checkout_date=" +
        self.buildDate(data.end)
    });
  },

  getCancalendarPrice: function(days) {
    var self = this,
      data = self.data,
      year = data.cur_year,
      month = data.cur_month,
      newYear = year,
      newMonth = month;
    if (month + 3 > 12) {
      newMonth = month - 9;
      newYear++;
    } else {
      newMonth = month + 1;
    }
    wx.showNavigationBarLoading();
    wx.request({
      url: app.apibase + "/order/calculate_price_calendar",
      method: "GET",
      data: {
        room_type_id: 406167,
        begin_date: year + "-" + month + "-" + "01",
        end_date: newYear + "-" + newMonth + "-" + "01",
        platform: 4,
        userid: app.userid || "",
        rd_session: app.rd_session || ""
      },
      success: function(res) {
        var body = res.data;
        if (body && body.status == "0") {
          //console.log(body)
          var data = body.data; //console.log(days)
          self.setData({ day_list: data });
          var total_day = [],
            total_empty = [],
            total_month = [],
            reg = /-01$/,
            index = -1;
          var cur_date = new Date(),
            cur_day = cur_date.getDate(),
            cur_week = cur_date.getDay();
          for (var i = 0, l = data.length; i < l; i++) {
            var date = data[i].date;
            var day = date.slice(8, 10) || 1,
              month = date.slice(5, 7) || 1,
              year = date.slice(0, 4) || 2017,
              dd = new Date(year, month - 1, day),
              ddWeek = dd.getDay();
            //console.log(month)
            //将月份分配数组
            if (reg.test(date)) {
              var week_day = new Date(date).getDay();
              index++;
              total_day[index] = [];
              total_month[index] = +month;
              total_empty[index] = Array(week_day)
                .fill("fill")
                .map((v, i) => {
                  return i;
                });
            }
            //周日0,周六6
            // if (ddWeek==0 || ddWeek==6) {
            //   data[i].weekend=true;
            // }
            //今天之前的价格不显示
            var p = data[i].price;
            // if (index<=0 && cur_day>+day) {
            //     data[i].price=null;
            //     //隐藏之前的日历--3.20
            //     // if (+day+cur_week<cur_day) {
            //     //   data[i].hide=true;
            //     // }
            //     //当第一周被隐藏时,前面的空白格也要隐藏--3.20
            //       //当日数+空白格数>8时,即是大于第一周的日子
            //     // if (total_empty[0].length+day>8) {
            //     //   total_empty[0]=[];
            //     // }
            // }else if (p==0 || data[i].is_full_booked==1) {
            //   data[i].price='满房';
            //   if (data[i].is_full_booked==1 && data[i-1] && /¥[0-9]/.test(data[i-1].price)) {
            //     data[i].booked_border=true;
            //   }
            //console.log(data[i])
            // }else{
            data[i].price = p + "个发现";
            // }
            data[i].day = day;
            data[i].time = year + "" + month + "" + day;
            data[i].index = i;
            total_day[index].push(data[i]);
          }
          total_month[0] = "";
          self.setData({ total_day, total_empty, total_month });
          //console.log(self.data)
        }
      },
      fail: function() {
        self.setData({ showMask: true, msg: "服务器异常" });
      },
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    });
  },
  getTotalPrice: function() {
    var self = this,
      data = self.data,
      options = data.options,
      begin = self.buildDate(data.begin),
      end = self.buildDate(data.end);
    self.setData({ totalPrice: "计算中..." });
    wx.request({
      url: app.apibase + "/order/calculate_total_price",
      method: "GET",
      data: {
        room_type_id: options.room_type_id,
        begin_date: begin,
        end_date: end,
        platform: 4,
        room_count: options.room_count || 1,
        userid: app.userid || "",
        rd_session: app.rd_session || ""
      },
      success: function(res) {
        var body = res.data;
        if (body && body.status == "0") {
          //console.log(body)
          var totalPrice = body.data.total_price || "";
          self.setData({ totalPrice });
        } else {
          self.setData({
            showMask: true,
            msg: body.msg,
            totalPrice: "--"
          });
        }
      },
      fail: function() {
        self.setData({ totalPrice: "数据异常" });
      }
    });
  },
  //关闭弹出层
  closeMask: function() {
    this.setData({
      showMask: false
    });
  }
};

Page(conf);
