<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset">
				<view>
					<view class="uni-title">申请加班理由：</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<textarea class="uni-textarea" name="nickname" placeholder="请填写申请加班理由..." />
							</view>
					</view>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">Submit</button>
					<button type="default" formType="reset">Reset</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	import webSiteUrl from '../../common/webSiteUrl.js';
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var  graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				userName: '',
				token:'',
				user_id:'',
				title: '表单验证',
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
		},
		methods: {
			formSubmit: function (e) {
				//将下列代码加入到对应的检查位置
				//定义表单规则
				var rule = [
					{name:"nickname", checkType : "string", checkRule:"3,1000",  errorMsg:"理由应在3-1000个字"},
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
					var now = new Date()
					now = now.toJSON().replace('T',' ').slice(0,-5)
					uni.request({
						url: webSiteUrl + '/overtime/user/' + this.user_id,
						method: 'POST',
						data: {
							remark: formData.nickname
						},
						header: {
							'Authorization': 'Bearer '+ this.token,
							'content-type': 'application/json',// 也有可能是application/x-www-form-urlencoded
						},
						success: (res) => {
							console.log(res);
							if(res.statusCode == 201){
								console.log('request success');
								console.log(res);
								uni.showToast({title:"提交成功!", duration:2500, icon:"none"});
								try{
									uni.setStorageSync('canICU', false);
								}catch(e){
									console.log('存储出现问题');
								}
								uni.navigateBack({});
							} else {
								var errCode = (res.statusCode == undefined)?'连接失败':res.statusCode;
								uni.showToast({title:"提交失败! "+errCode, icon:"none"});
								uni.setStorageSync('canICU', true);
							}
						},
						fail: (err) => {
							uni.setStorageSync('canICU', true);
							console.log(err);
						}
					});
					
				}else{
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
			},
			formReset: function (e) {
				console.log("清空数据")
				this.chosen = ''
			}
		}
	}
</script>

<style>
</style>
