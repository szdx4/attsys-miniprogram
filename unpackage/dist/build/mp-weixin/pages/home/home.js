(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/home"],{"0248":function(e,t,o){"use strict";o.r(t);var n=o("688b"),a=o.n(n);for(var s in n)"default"!==s&&function(e){o.d(t,e,function(){return n[e]})}(s);t["default"]=a.a},"3f46":function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement;e._self._c},a=[];o.d(t,"a",function(){return n}),o.d(t,"b",function(){return a})},"688b":function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(o("98fb"));function a(e){return e&&e.__esModule?e:{default:e}}var s=function(){return o.e("components/uni-popup/uni-popup").then(o.bind(null,"d187"))};function c(t){e.request({url:n.default+"message?to_user_id="+t.user_id+"&status=unread&page=1",header:{Authorization:"Bearer "+t.token},method:"GET",success:function(t){if(console.log("计时器：",t),200==t.statusCode){e.showModal({title:"提示",content:"您有新消息了，请前往查看",showCancel:!1,success:function(e){e.confirm&&console.log("用户点击确定")}});try{e.setStorageSync("start_query_unread_message",!1)}catch(o){console.log("存储出现问题")}}else 204==t.statusCode?console.log("无未读信息"):console.log("系统通知信息获取失败")}})}var r={components:{uniPopup:s},data:function(){return{userName:"",token:"",check_message:"未签到",start_at:"",end_at:"",isNotCheck:!0,check_token:"",user_id:0,isShowPopup:!1,canICU:!1,canCheckOff:!1,messageSrc:"../../static/img/message.png",messageIntervalID:-1}},onLoad:function(){var t=this;this.token=e.getStorageSync("token"),this.userName=e.getStorageSync("userName"),this.user_id=e.getStorageSync("user_id"),this.messageSrc="../../static/img/message_2.png";try{e.setStorageSync("canICU",!1)}catch(a){console.log("存储出现问题")}e.request({url:n.default+"/sign/user/"+this.user_id,header:{Authorization:"Bearer "+this.token},method:"GET",success:function(o){console.log(o),204==o.statusCode?(t.check_message="未签到",t.IsNotcheck=!0):200==o.statusCode?(e.setStorageSync("sign_id",o.data.sign_id),t.check_message="已签到",t.isNotCheck=!1,t.canCheckOff=!0,t.start_at=new Date(o.data.shift.start_at).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai",hour12:!1}),t.end_at=new Date(o.data.shift.end_at).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai",hour12:!1})):t.check_message="服务器异常"}}),e.request({url:n.default+"/user/"+this.user_id,header:{Authorization:"Bearer "+this.token},method:"GET",success:function(t){if(200==t.statusCode){console.log("获取用户信息成功");try{e.setStorageSync("name",t.data.data.name),e.setStorageSync("department",t.data.data.department),e.setStorageSync("role",t.data.data.role),e.setStorageSync("hours",t.data.data.hours)}catch(a){console.log("存储出现问题")}}else console.log("获取用户信息失败")}});try{e.setStorageSync("start_query_unread_message",!0)}catch(a){console.log("存储出现问题")}var o=this;c(o),console.log("开启计时器"),this.messageIntervalID=setInterval(function(t){e.getStorageSync("start_query_unread_message")?c(t):console.log("上次的新信息还没处理完")},6e4,o)},onUnload:function(){-1!=this.messageIntervalID&&(clearInterval(this.messageIntervalID),this.messageIntervalID=-1,console.log("关闭计时器"))},onShow:function(){try{this.canICU=e.getStorageSync("canICU")}catch(t){console.log("存储出现问题")}},methods:{goShiftArrangement:function(t){console.log(t),e.navigateTo({url:"../shiftarrangement/shiftarrangement"})},goLeave:function(t){console.log(t),e.navigateTo({url:"../leave/apply/apply"})},goICU:function(t){console.log(t),e.navigateTo({url:"../icu/icu"})},goInfo:function(t){console.log(t),e.navigateTo({url:"../info/info"})},checkIn:function(t){var o=this;e.scanCode({onlyFromCamera:!0,success:function(a){console.log("条码内容："+a.result),o.check_token=a.result,e.request({url:n.default+"/sign/qrcode/"+o.user_id,method:"POST",header:{Authorization:"Bearer "+o.token},data:{token:o.check_token},success:function(n){console.log(n);try{if(200==n.statusCode){console.log("签到成功");try{e.setStorageSync("sign_id",n.data.sign_id)}catch(t){console.log("sign_id存储出现问题")}e.showToast({duration:2e3,title:"签到成功"}),o.start_at=n.data.shift.start_at,o.end_at=n.data.shift.end_at}else console.log("签到失败"),e.showToast({duration:2e3,title:"签到失败"})}catch(t){console.log("签到失败:",t),e.showToast({duration:2e3,title:"签到失败"})}},fail:function(){console.log("接口调用失败"),e.showToast({duration:2e3,title:"签到失败"})}})},fail:function(){console.log("扫码失败")},complete:function(){e.redirectTo({url:"../home/home"})}})},goMessage:function(t){console.log(t),e.navigateTo({url:"../message/message"})},checkOff:function(t){var o=this;e.request({url:n.default+"/sign/off/"+e.getStorageSync("sign_id"),method:"POST",header:{Authorization:"Bearer "+this.token},success:function(n){if(200==n.statusCode){o.canICU=n.data.overtime,o.isNotCheck=!0,o.canCheckOff=!1,o.check_message="未签到",e.showToast({duration:2e3,title:"签退成功"});try{e.setStorageSync("canICU",!0)}catch(t){console.log("存储出现问题")}}else console.log("签退失败"),e.showToast({duration:2e3,title:"签退失败"})},fail:function(){console.log("签退失败"),e.showToast({duration:2e3,title:"签退失败"})}})}}};t.default=r}).call(this,o("543d")["default"])},"8a93":function(e,t,o){"use strict";var n=o("e6c6"),a=o.n(n);a.a},"9e71":function(e,t,o){"use strict";o.r(t);var n=o("3f46"),a=o("0248");for(var s in a)"default"!==s&&function(e){o.d(t,e,function(){return a[e]})}(s);o("8a93");var c=o("2877"),r=Object(c["a"])(a["default"],n["a"],n["b"],!1,null,null,null);t["default"]=r.exports},e6c6:function(e,t,o){}},[["1d71","common/runtime","common/vendor"]]]);