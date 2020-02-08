var utils={
	trim: function (str) {
        if (!str) return str;
        return str.replace(/^\s+/g,'').replace(/\s+$/g,'')
    },
    decreaseDay:function (date) {
    	date = date || new Date();
    	var	year=date.getFullYear(),
	        month=date.getMonth()+1,
	        day=date.getDate(),
	        new_day=day-1,
	        new_year=year,new_month=year;
	    if (new_day<=0) {
		    new_month=month-1;
		    if (new_month<=0) {
		    	new_month=12;
		      new_year=year-1;
		    }
		    new_day=new Date(new_year, new_month, 0).getDate();
		}
		new_month = this.buildDateLength(new_month);
	    new_day = this.buildDateLength(new_day);
		return new_year+'-'+new_month+'-'+new_day;
    },
    addDay:function (date) {
    	date = date || new Date();
    	var	year=date.getFullYear(),
	        month=date.getMonth()+1,
	        day=date.getDate(),
	        new_day=day+1,
	        new_year=year,new_month=month,
	        max_day=new Date(year, month, 0).getDate();
	    if (new_day>max_day) {
		    new_month=month+1;
		    new_day=1;
		    if (new_month>=12) {
		    	new_month=1;
		      new_year=year+1;
		    }
		}
		new_month = this.buildDateLength(new_month);
	    new_day = this.buildDateLength(new_day);
		return new_year+'-'+new_month+'-'+new_day;
    },
    formatDate:function (date) {
    	date = date || new Date();
    	var	new_year=date.getFullYear(),
	        new_month=date.getMonth()+1,
	        new_day=date.getDate();
	    new_month = this.buildDateLength(new_month);
	    new_day = this.buildDateLength(new_day);
	    return new_year+'-'+new_month+'-'+new_day;
    },
    buildDateLength:function (str) {
    	str=str+'';
    	return str = str.length<2 ? '0'+str:str;
    },
    paramForGet:function (obj) {
    	var arr=[],
    		divide='&';
    	for (var a in obj){
    		arr.push(a+'='+obj[a]+divide)
    	}
    	return arr.join('').slice(0,-1)
    },
    getTimeDistance:function (begin,end) {
    	var begin=new Date(begin).getTime(),
    		end=new Date(end).getTime(),
    		distance=end-begin,
    		day=distance/24/60/60/1000,
    		result=Math.floor(day);
    		//console.log(day)
    		//console.log(result)
    	return result
    },
		jsonQuery:function(json){
			var str='';
			for(var i in json){
					str=str+'&'+i+'='+json[i];
			}
			return str.substring(1);
		}


}
module.exports=utils;
