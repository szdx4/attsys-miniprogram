(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-badge/uni-badge"],{"2d7b":function(t,e,n){"use strict";n.r(e);var u=n("e8e7"),i=n.n(u);for(var a in u)"default"!==a&&function(t){n.d(e,t,function(){return u[t]})}(a);e["default"]=i.a},"4f08":function(t,e,n){"use strict";n.r(e);var u=n("63d5"),i=n("2d7b");for(var a in i)"default"!==a&&function(t){n.d(e,t,function(){return i[t]})}(a);n("9593");var r=n("2877"),d=Object(r["a"])(i["default"],u["a"],u["b"],!1,null,null,null);e["default"]=d.exports},"63d5":function(t,e,n){"use strict";var u=function(){var t=this,e=t.$createElement;t._self._c},i=[];n.d(e,"a",function(){return u}),n.d(e,"b",function(){return i})},9593:function(t,e,n){"use strict";var u=n("cdc6"),i=n.n(u);i.a},cdc6:function(t,e,n){},e8e7:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u={name:"uni-badge",props:{type:{type:String,default:"default"},inverted:{type:Boolean,default:!1},text:{type:String,default:""},size:{type:String,default:"normal"}},computed:{setClass:function(){var t=["uni-badge-"+this.type,"uni-badge--"+this.size];return!0===this.inverted&&t.push("uni-badge-inverted"),t.join(" ")}},methods:{onClick:function(){this.$emit("click")}}};e.default=u}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-badge/uni-badge-create-component',
    {
        'components/uni-badge/uni-badge-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("4f08"))
        })
    },
    [['components/uni-badge/uni-badge-create-component']]
]);                
