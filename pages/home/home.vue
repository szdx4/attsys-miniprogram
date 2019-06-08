<template>
    <view class="content">
		<view>
			<view class="title" @click="goMessage">
				您好 {{userName}}
			</view>
		</view>
		<view class="check">
			<view>
				签到情况: {{check_message}}
			</view>
			<view>
				班次开始: {{start_at}}
			</view>
			<view>
				班次结束: {{end_at}}
			</view>
		</view>
		<view class="btn-row" v-if="isNotCheck">
			<button type="primary" class="primary" @tap="checkIn">扫码</button>
		</view>
		<view class="btn-row" v-if="canCheckOff">
			<button type="primary" class="primary" @tap="checkOff">签退</button>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="goShiftArrangement">查看班次安排</button>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="goLeave">申请/查看请假</button>
		</view>
		<view class="btn-row" v-if="canICU">
			<button type="primary" class="primary" @tap="goICU">申请加班</button>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="goInfo">查看/修改信息</button>
		</view>
    </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	
    export default {
		components: {
			uniPopup
		},
		data() {
			return {
				userName: '',
				token:'',
				check_message:'未签到',
				start_at:'',
				end_at:'',
				isNotCheck:true,
				check_token:'',
				user_id:0,
				isShowPopup:false,
				canICU:false,
				canCheckOff:false,
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			// 检查用户签到状态
			// var checkStatus = 204;
			// uni.request({
			// 	url: 'https://???path???/sign/user/' + this.user_id,
			// 	header:{
			// 		'Authorization': 'Bearer '+ this.token,
			// 	},
			// 	method: 'GET',
			// 	success:(res) => {
			// 		console.log(res);
			// 		checkStatus = res.status;
			// 		this.start_at = result.start_at;
			// 		this.end_at = result.end_at;
			// 		if(checkStatus==204){
			// 			this.check_message = "未签到";
			// 			this.IsNotcheck = true;
			// 		}
			// 		else if(checkStatus==200){
			// 			this.check_message = "已签到";
			// 			this.isNotCheck = false;
			//			this.canCheckOff = true;
			// 		}
			// 		else{
			// 			this.check_message = "服务器异常";
			// 		}
			// 	}
			// });
			// 获取用户基本信息，并存入缓存
			var name = 'default name';
			var department = 0;
			var role = 'default role';
			var hours = 0;
			uni.request({
				url: 'https://???path???/user/' + this.user_id,
				header: {
					'Authorization': 'Bearer '+ this.token,
				},
				method:'GET',
				success: res=> {
					console.log(res);
					if (res.status==200) {
						console.log("获取用户信息成功");
						name = res.data.name;
						department = res.data.department;
						role = res.data.role;
						hours = res.data.hours;
						// 存储用户信息到本地
						try{
							uni.setStorageSync('name',name);
							uni.setStorageSync('department',department);
							uni.setStorageSync('role',role);
							uni.setStorageSync('hours',hours);
						}catch(e){
							console.log("存储出现问题");
						}
					} else{
						console.log("获取用户信息失败");
						// 刷新info页面
						uni.redirectTo({
							url: '../info/info'
						});
					}
				}
			});
        },
		methods:{
			goShiftArrangement(e) {
				console.log(e)
				uni.navigateTo({
					url: '../shiftarrangement/shiftarrangement'
				});
			},
			goLeave(e){
				console.log(e)
				uni.navigateTo({
					url: '../leave/apply/apply'
				});
			},
			goICU(e){
				console.log(e)
				uni.navigateTo({
					url: '../icu/icu'
				});
			},
			goInfo(e){
				console.log(e)
				uni.navigateTo({
					url: '../info/info'
				});
			},
			checkIn(e){
				// 先扫描获得签到token(只允许通过相机扫码)
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						console.log('条码内容：' + res.result);
						this.check_token = res.result.token;
						// 通过二维码获得的token，向服务器签到
						uni.request({
							url:'https://???path???/sign/qrcode/' + this.user_id,
							method:'POST',
							header:{
								'Authorization': 'Bearer '+ this.token,
							},
							data:{
								token: this.check_token
							},
							success: res => {
								console.log(res);
								try{
									if (res.status==200) {
										console.log("签到成功");
										// 存储sign_id到本地
										try{
											uni.setStorageSync('sign_id',res.sign_id);
										}catch(e){
											console.log("sign_id存储出现问题");
										}
									} else{
										console.log("签到失败");
									}
								}catch(e){
									console.log("签到失败:",e);
								}
							},
							fail() {
								console.log("接口调用失败");
							}
						})
					},
					fail() {
						console.log("扫码失败");
					},
					complete() {
						// 刷新home页面
						uni.redirectTo({
							url: '../home/home'
						});
					}
				});
			},
			goMessage(e){
				console.log(e)
				uni.navigateTo({
					url: '../message/message'
				});
			},
			checkOff(e){
				var sign_id = uni.getStorageSync('sign_id');
				uni.request({
					url: 'https://???path???/sign/off/' + sign_id,
					method: 'POST',
					header:{
						'Authorization': 'Bearer ' + this.token
					},
					success: (res) => {
						console.log(res);
						if(res.status==200){
							this.canICU = res.overtime;
						}
						else{
							console.log("签退失败");
						}
					},
					fail() {
						console.log("签退失败");
					}
				});
			}
		}
    }
</script>

<style>
    .check {
    	margin-top: 5upx;
    }
	.check view {
		font-size: 40upx;
	}
    .title {
		font-size: 40upx;
        color: #8f8f94;
		text-decoration: underline;
    }
	.message {
		background-color: #D9D9D9;
		height: 55upx;
		width: 500upx;
		border-bottom: 4upx solid #555555;
		border-left: 4upx solid #555555;
		border-right: 4upx solid #555555;
	}
	.clear {
		height: 55upx;
		width: 500upx;
		text-align: center;
		background-color: #B2B2B2; 
		border-bottom: 4upx solid #555555;
		border-left: 4upx solid #555555;
		border-right: 4upx solid #555555;
		text-decoration: underline;
	}
</style>
