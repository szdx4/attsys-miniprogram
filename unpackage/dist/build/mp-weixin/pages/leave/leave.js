(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/leave/leave"],{"058e":function(t,e,a){"use strict";a.r(e);var i=a("ce53"),s=a.n(i);for(var n in i)"default"!==n&&function(t){a.d(e,t,function(){return i[t]})}(n);e["default"]=s.a},"119b":function(t,e,a){"use strict";var i=a("f5c0"),s=a.n(i);s.a},"693a":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},s=[];a.d(e,"a",function(){return i}),a.d(e,"b",function(){return s})},c4f7:function(t,e,a){"use strict";a.r(e);var i=a("693a"),s=a("058e");for(var n in s)"default"!==n&&function(t){a.d(e,t,function(){return s[t]})}(n);a("119b");var r=a("2877"),o=Object(r["a"])(s["default"],i["a"],i["b"],!1,null,null,null);e["default"]=o.exports},ce53:function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=s(a("98fb"));function s(t){return t&&t.__esModule?t:{default:t}}var n=function(){return a.e("components/uni-steps/uni-steps").then(a.bind(null,"8a6b"))},r={components:{uniSteps:n},onLoad:function(){var e=this;this.token=t.getStorageSync("token"),this.userName=t.getStorageSync("userName"),this.user_id=t.getStorageSync("user_id");var a=1,s=!0;this.data=[];for(var n=1;n<=a;n++)t.request({url:i.default+"/leave/user/"+this.user_id+"?page="+n,header:{Authorization:"Bearer "+this.token},method:"GET",success:function(i){if(console.log(i),200==i.statusCode){if(console.log("request success"),0!=i.data.total){e.haveWorkOff=!0,a=Math.ceil(i.data.total/i.data.per_page),e.data.push.apply(e.data,i.data.data);for(var n=0;n<e.data.length;n++)e.data[n].start_at=new Date(i.data.data[n].start_at).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai",hour12:!1}),e.data[n].end_at=new Date(i.data.data[n].end_at).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai",hour12:!1})}else t.showToast({title:"无请假信息",duration:2e3}),console.log("无请假信息");if(s){if(console.log(e.data.length),e.data.length>0){e.datebegin=e.data[e.index].start_at,e.dateend=e.data[e.index].end_at,e.remark=e.data[e.index].remark;var r=e.data[e.index].status;"wait"==r?(e.active=0,e.progress[1].title="申请结果",e.resumeAvailable=!1):"pass"==r?(e.active=1,e.progress[1].title="通过",e.resumeAvailable=!0):"reject"==r&&(e.active=1,e.progress[1].title="不予通过",e.resumeAvailable=!1)}s=!1}}},fail:function(){console.log("请假信息获取失败")}})},data:function(){return{userName:"",token:"",user_id:"",haveWorkOff:!1,data:[],remark:"",index:0,resumeAvailable:!1,datebegin:"",dateend:"",active:1,progress:[{title:"申请中"},{title:"申请结果"},{title:"销假"}]}},methods:{resume:function(){var e=this;t.request({url:i.default+"/leave/user/leave/"+this.data[this.index].id,method:"DELETE",header:{Authorization:"Bearer"+this.token},data:{},success:function(a){if(200==a.statusCode)e.active<e.progress.length-1?e.active+=1:e.active=0,e.resumeAvailable=!1,t.showToast({title:"销假成功!",icon:"none"});else{var i=void 0==a.statusCode?"连接失败":a.statusCode;t.showToast({title:"提交失败! "+i,icon:"none"})}},fail:function(){},complete:function(){}})},bindPickerChange:function(t){console.log("picker发送选择改变，携带值为（同样为index值）："+t.target.value),this.index=t.target.value,this.datebegin=this.data[this.index].start_at,this.dateend=this.data[this.index].end_at,this.remark=this.data[this.index].remark;var e=this.data[this.index].status;"wait"==e?(this.active=0,this.progress[1].title="申请结果",this.resumeAvailable=!1):"pass"==e?(this.active=1,this.progress[1].title="通过",this.resumeAvailable=!0):"reject"==e&&(this.active=1,this.progress[1].title="不予通过",this.resumeAvailable=!1)}}};e.default=r}).call(this,a("543d")["default"])},f5c0:function(t,e,a){}},[["ac89","common/runtime","common/vendor"]]]);