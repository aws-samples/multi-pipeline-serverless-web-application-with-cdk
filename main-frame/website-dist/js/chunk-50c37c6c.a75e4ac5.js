(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-50c37c6c"],{"26b2":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-card",[a("v-card-title",[t._v("Notice")]),a("demo-simple-table-basic")],1),a("br"),a("v-card",[a("v-card-title",[t._v("Board")]),a("demo-simple-table-dark")],1)],1)],1)},n=[],c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",{staticClass:"text-uppercase"},[t._v(" TITLE ")]),a("th",{staticClass:"text-center text-uppercase"},[t._v(" WRITER ")]),a("th",{staticClass:"text-center text-uppercase"},[t._v(" ID ")]),a("th",{staticClass:"text-center text-uppercase"},[t._v(" DELETE ")])])]),a("tbody",t._l(t.noticeList,(function(e){return a("tr",{key:e.id},[a("td",[t._v(t._s(e.title))]),a("td",{staticClass:"text-center"},[t._v(" "+t._s(e.writer||"NULL")+" ")]),a("td",{staticClass:"text-center"},[t._v(" "+t._s(e.id)+" ")]),a("td",{staticClass:"text-center"},[a("v-card-text",{staticClass:"py-3 px-4"},[a("v-icon",{attrs:{size:"30"},on:{click:function(a){return t.deleteData(e.id,e.title)}}},[t._v(" "+t._s(t.icon)+" ")])],1)],1)])})),0)]},proxy:!0}])})},i=[],r=(a("99af"),a("94ed")),o={setup:function(){var t=[{dessert:"Frozen Yogurt",calories:159,fat:6,carbs:24,protein:4}];return{desserts:t}},data:function(){return{noticeList:[],icon:r["gb"]}},mounted:function(){this.getNoticeList()},methods:{getNoticeList:function(){var t=this;axios.get("".concat(this.$window.API_URL,"notices")).then((function(e){200===e.status||201===e.status?t.noticeList=e.data:console.log("status not 200")})).catch((function(){console.log("catch error11")}))},deleteData:function(t,e){var a=this,s={data:{title:e}};console.log(s),axios.delete("".concat(this.$window.API_URL,"notices/").concat(t),s).then((function(t){200===t.status?(alert("Delete Complete!"),a.getNoticeList()):alert("Delete Fail")})).catch((function(t){alert("Error : ".concat(t))}))}}},l=o,d=a("2877"),u=a("6544"),h=a.n(u),p=a("99d9"),f=a("132d"),v=a("5530"),b=(a("a9e3"),a("8b37"),a("80d2")),x=a("7560"),_=a("58df"),m=Object(_["a"])(x["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(v["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(b["g"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}}),C=Object(d["a"])(l,c,i,!1,null,null,null),g=C.exports;h()(C,{VCardText:p["c"],VIcon:f["a"],VSimpleTable:m});var L=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-simple-table",{attrs:{dark:""},scopedSlots:t._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",{staticClass:"text-uppercase text--primary"},[t._v(" TITLE ")]),a("th",{staticClass:"text-center text-uppercase text--primary"},[t._v(" DATE ")]),a("th",{staticClass:"text-center text-uppercase text--primary"},[t._v(" ID ")]),a("th",{staticClass:"text-center text-uppercase text--primary"},[t._v(" DELETE ")])])]),a("tbody",t._l(t.boardList,(function(e){return a("tr",{key:e.id},[a("td",[t._v(t._s(e.TITLE))]),a("td",{staticClass:"text-center"},[t._v(" "+t._s(e.date)+" ")]),a("td",{staticClass:"text-center"},[t._v(" "+t._s(e.id)+" ")]),a("td",{staticClass:"text-center"},[a("v-card-text",{staticClass:"py-3 px-4"},[a("v-icon",{attrs:{size:"30"},on:{click:function(a){return t.deleteData(e.id)}}},[t._v(" "+t._s(t.icon)+" ")])],1)],1)])})),0)]},proxy:!0}])})},w=[],E={setup:function(){var t=[{dessert:"Frozen Yogurt",calories:159,fat:6,carbs:24,protein:4},{dessert:"Ice cream sandwich",calories:237,fat:6,carbs:24,protein:4}];return{desserts:t}},data:function(){return{boardList:[],icon:r["gb"]}},mounted:function(){this.getBoardList()},methods:{getBoardList:function(){var t=this;axios.get("".concat(this.$window.API_URL,"boards")).then((function(e){200===e.status?t.boardList=e.data[0]:alert("status not 200")})).catch((function(t){alert("".concat(t))}))},deleteData:function(t){var e=this;axios.delete("".concat(this.$window.API_URL,"boards/").concat(t)).then((function(t){200===t.status?(alert("Delete Complete!"),e.getBoardList()):alert("Delete Fail")})).catch((function(t){alert("".concat(t))}))}}},T=E,D=Object(d["a"])(T,L,w,!1,null,null,null),y=D.exports;h()(D,{VCardText:p["c"],VIcon:f["a"],VSimpleTable:m});var $={components:{DemoSimpleTableBasic:g,DemoSimpleTableDark:y},setup:function(){return{}}},I=$,k=(a("26c2"),a("b0af")),V=a("62ad"),B=a("0fd9"),R=Object(d["a"])(I,s,n,!1,null,"337eb2a1",null);e["default"]=R.exports;h()(R,{VCard:k["a"],VCardTitle:p["d"],VCol:V["a"],VRow:B["a"]})},"26c2":function(t,e,a){"use strict";a("b024")},"8b37":function(t,e,a){},b024:function(t,e,a){}}]);
//# sourceMappingURL=chunk-50c37c6c.a75e4ac5.js.map