<template>
    <view class="content">
		<view class="_caption">
			<view class="title">
				{{userName}},&nbsp;您好
			</view>
			<view style="display: inline;">
				<image :src="messageSrc" :mode='scaleToFill'  @click="goMessage"></image>
			</view>
		</view>
		<view class="check">
			<view>
				签到情况: {{check_message}}
			</view>
			<view v-if="!isNotCheck">
				班次开始: {{start_at}}
			</view>
			<view v-if="!isNotCheck" style="padding-bottom: 10upx;">
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
			<button type="primary" class="primary" @tap="goInfo">查看个人信息</button>
		</view>
    </view>
</template>

<script>
	import webSiteUrl from '../../common/webSiteUrl.js';
	// 设置计时器查询是否有unread的消息,第二个参数单位是ms
	function startQueryMessage(that){
		console.log('已开启计时器')
		var messageintervalID;
		messageintervalID = setInterval(function(that){
			// 向服务器查询unread消息
			uni.request({
				url: webSiteUrl + 'message?to_user_id=' + that.user_id + '&status=unread&page=' + 1,
				header:{
					'Authorization': 'Bearer '+ that.token,
				},
				method: 'GET',
				success: (res) => {
					console.log('计时器：',res);
					if (res.statusCode==200) {
						// unread消息不为空，则提醒用户有新消息，用户点击确认后，关闭计时器
						uni.showModal({
							title: '提示',
							content: '您有新消息了，请前往查看',
							showCancel:false,
							success: function (res) {
								if (res.confirm) {
									console.log('用户点击确定');
								}
							}
						});
					} else if (res.statusCode==204) {
						console.log("无未读信息")
						try{
							uni.setStorageSync('start_interval',true);
						}catch(e){
							console.log("存储出现问题");
						}
					} else {
						console.log("系统通知信息获取失败")
						try{
							uni.setStorageSync('start_interval',true);
						}catch(e){
							console.log("存储出现问题");
						}
					}
				}
			});
		if(messageintervalID != -1) {
			clearInterval(messageintervalID);
			messageintervalID = -1;
			console.log('已关闭计时器');
			try{
				uni.setStorageSync('start_interval',false);
			}catch(e){
				console.log("存储出现问题");
			}
		}
		},60000,that);
		// 存储是否开起定时器的控制变量
		try{
			uni.setStorageSync('start_interval',true);
		}catch(e){
			console.log("存储出现问题");
		}
		return messageintervalID;
	}
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
				messageSrc:'../../static/img/message.png',
				messageintervalID:-1,
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			this.messageSrc = '../../static/img/message.png';
			// 检查用户签到状态
			var checkStatus = 204;
			uni.request({
				url: webSiteUrl + '/sign/user/' + this.user_id,
				header:{
					'Authorization': 'Bearer '+ this.token,
				},
				method: 'GET',
				success:(res) => {
					checkStatus = res.statusCode;
					if(checkStatus==204){
						this.check_message = "未签到";
						this.IsNotcheck = true;
					}
					else if(checkStatus==200){
						this.check_message = "已签到";
						this.isNotCheck = false;
						this.canCheckOff = true;
						this.start_at = res.data.start_at;
						this.end_at = res.data.end_at;
					}
					else{
						this.check_message = "服务器异常";
					}
				}
			});
			// 获取用户基本信息，并存入缓存
			var name = 'default name';
			var department = 0;
			var role = 'default role';
			var hours = 0;
			uni.request({
				url: webSiteUrl + '/user/' + this.user_id,
				header: {
					'Authorization': 'Bearer '+ this.token,
				},
				method:'GET',
				success: res=> {
					if (res.statusCode==200) {
						console.log("获取用户信息成功");
						name = res.data.data.name;
						department = res.data.data.department;
						role = res.data.data.role;
						hours = res.data.data.hours;
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
					}
				}
			});
			// 第一次加载时设置定时器的控制变量为true
			try{
				uni.setStorageSync('start_interval',true);
			}catch(e){
				console.log("存储出现问题");
			}
        },
		// 当退出小程序的时候，若定时器还没关闭，则关闭计时器
		onUnload:function(){
			if(this.messageintervalID != -1) {
				clearInterval(this.messageintervalID);
				this.messageintervalID = -1;
				console.log('已关闭计时器');
			}  
		},
		// 在页面每次显示时，若储存的定时器的控制变量为true，则开启定时器
		onShow:function(){
			// 先关闭上一次的定时器
			if(this.messageintervalID != -1) {
				clearInterval(this.messageintervalID);
				this.messageintervalID = -1;
				console.log('已关闭计时器');
			}  
			if (uni.getStorageSync('start_interval')) {
				var that = this;
				this.messageintervalID = startQueryMessage(that);
			}
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
							url: webSiteUrl + '/sign/qrcode/' + this.user_id,
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
									if (res.statusCode==200) {
										console.log("签到成功");
										// 存储sign_id到本地
										try{
											uni.setStorageSync('sign_id',res.data.sign_id);
										}catch(e){
											console.log("sign_id存储出现问题");
										}
										uni.showToast({
											duration:2000,
											title:'签到成功'
										})
									} else{
										console.log("签到失败");
										uni.showToast({
											duration:2000,
											title:'签到失败'
										})
									}
								}catch(e){
									console.log("签到失败:",e);
									uni.showToast({
										duration:2000,
										title:'签到失败'
									})
								}
							},
							fail() {
								console.log("接口调用失败");
								uni.showToast({
									duration:2000,
									title:'签到失败'
								})
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
					url: webSiteUrl + '/sign/off/' + sign_id,
					method: 'POST',
					header:{
						'Authorization': 'Bearer ' + this.token
					},
					success: (res) => {
						if(res.statusCode==200){
							this.canICU = res.data.overtime;
							uni.showToast({
								duration:2000,
								title:'签退成功'
							})
						}
						else{
							console.log("签退失败");
							uni.showToast({
								duration:2000,
								title:'签退失败'
							})
						}
					},
					fail() {
						console.log("签退失败");
						uni.showToast({
							duration:2000,
							title:'签退失败'
						})
					}
				});
			}
		}
    }
</script>

<style>
    .check {
    	margin-top: 5upx;
		border-bottom: 3.5upx solid #000000;
    }
	.check view {
		font-size: 40upx;
	}
    .title {
		font-size: 40upx;
        color: #8f8f94;
		display: inline;
    }
	.message {
		background-color: #D9D9D9;
		height: 55upx;
		width: 500upx;
		border-bottom: 4upx solid #555555;
		border-left: 4upx solid #555555;
		border-right: 4upx solid #555555;
	}
	image {
		margin-left: 12upx;
		width: 50upx;
		height: 50upx;
	}
	._caption {
		border-bottom: 3.5upx solid #000000;
	}
</style>
