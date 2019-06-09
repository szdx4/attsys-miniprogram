<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit">
			<view class="uni-list">
					<button class="tab uni-common-mt uni-comment-replay-btn" :class="[{'active':index==tabIndex}]" @tap="toggleTab(index)" v-for="(item,index) in tabList" :key="index">{{item.name}}</button>
					<w-picker 
						:mode="mode" 
						startYear="1926" 
						endYear="2112" 
						step="1" 
						:defaultVal="defaultVal" 
						:current="true" 
						@confirm="onConfirm" 
						ref="picker" 
						themeColor="#439057"
					></w-picker>
				<view class="uni-list-cell">
					<view class="result">请假起始日期时间：{{date}}</view>
				</view>
				<view class="uni-list-cell">
					<view class="result">请假结束日期时间：{{dateend}}</view>
				</view>
				<view class="uni-list-cell">
					<textarea class="uni-textarea" name="nickname" placeholder="请填写申请加班理由..." />
				</view>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">提交请假申请</button>
					<button type="primary" @click="gotoApply">查看已申请的请假</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	import wPicker from "@/components/w-picker/w-picker.vue"
	import webSiteUrl from '../../../common/webSiteUrl.js'

	function getDate(type) {
		const date = new Date();
	
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	var  graceChecker = require("../../../common/graceChecker.js");

	export default {
		components:{
			wPicker
		},
		data() {
			return {
				userName: '',
				token:'',
				user_id:'',
				//开始
				date: new Date(),
				//结束
				dateend: new Date(),
				//控制选择日期
				defaultVal1: [1,1,1,1,2,5],
				defaultVal2: [1,1,1,1,2,5],
				startDate:getDate('start'),
				endDate:getDate('end'),
				startDate2:getDate('start'),
				endDate2:getDate('end'),
				
				tabList:[
				{
					mode:"dateTime",
					name:"请假起始日期时间选择",
					value:[1,1,1,1,2,5]
				},{
					mode:"dateTime",
					name:"请假结束日期时间选择",
					value:[1,1,1,1,2,5]
				}],
				tabIndex:0,
			}
		},
		computed:{
			mode(){
				return this.tabList[this.tabIndex].mode
			},
			defaultVal(){
				return this.tabList[this.tabIndex].value
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
		},
		methods: {
			bindDateChange: function(e) {
				this.date = e.target.value;
				console.log(this.date);
			},
			bindDateChange2: function(e) {
				this.dateend = e.target.value;
				console.log(this.dateend);
			},
			toggleTab(index){
				this.tabIndex=index;
				this.$refs.picker.show();
			},
			onConfirm(val){
				console.log(val);
				if(this.tabIndex == 0)
				{
					this.date=val.result;
				}
				else if(this.tabIndex == 1)
				{
					this.dateend = val.result;
				}
			},
			formSubmit: function (e) {
				// var begin = this.date.toLocaleString();
				// var end = this.dateend.toLocaleString();
				// begin = begin.replace(/-/g,"\/");
				// end = end.replace(/-/g,"\/");
				var begin = new Date(this.date);
				var end = new Date(this.dateend);
				var today = new Date()
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"nickname", checkType: "string", checkRule:"3,1000", errorMsg:"理由应在3-1000个字"},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				//时间检查
				if(begin>=end)
				{
					uni.showToast({title:"错误:结束日期应大于开始日期!", icon:"none"});
				}
				else if(begin<today)
				{
					uni.showToast({title:"错误:开始日期不应在今天之前!", icon:"none"});
				}
				//表单检查
				else if(!checkRes)
				{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
				//输入通过
				else
				{
					uni.request({
						url: 'https://webSiteUrl/leave/user/' + this.user_id,
						data: {
							start_at: this.date,
							end_at: this.dateend,
							remark: formData
						},
						dataType: 'json',
						method:"POST",
						header: {
							'content-type': 'application/json',// 也有可能是application/x-www-form-urlencoded
							'Authorization': 'Bearer '+ this.token
						},
						success: (res) => {
							if(res.data.status == 201){
								console.log('request success');
								console.log(res.data);
								uni.showToast({title:"验证通过!", icon:"none"});
							}
							else{
								var errCode = (res.data.status == undefined)?'连接失败':res.data.status;
								uni.showToast({title:"提交失败! "+errCode, icon:"none"});
							}
						}
					});
				}
			},
			gotoApply: function (e){
				uni.navigateTo({
					url:"../leave",
				})
			}
		}
	}
</script>

<style>
	.content {
		text-align: left;
		height: 400upx;
	}
	.tab{
		padding:40upx 0;
		font-size: 32upx;
	}
	.tab.active{
	}
	.result{
		margin-top: 20upx;
	}
	textarea {
		margin-top: 20upx;
	}
</style>
