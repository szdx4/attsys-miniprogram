<template>
    <view class="content">
		<view class="_caption">
			<view class="title">
				{{userName}},&nbsp;您好
			</view>
			<view class="message_img">
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
			<button type="warn" @tap="goICU">申请加班</button>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="goInfo">查看个人信息</button>
		</view>
    </view>
</template>

<script>
	import webSiteUrl from '../../common/webSiteUrl.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	
	// 向服务器查询是否有unread消息
	function hasUnreadMessage(that){
		uni.request({
			url: webSiteUrl + 'message?to_user_id=' + that.user_id + '&status=unread&page=' + 1,
			header:{
				'Authorization': 'Bearer '+ that.token,
			},
			method: 'GET',
			success: (res) => {
				// console.log('计时器：',res);
				if (res.statusCode==200) {
					// unread消息不为空，则提醒用户有新消息，用户点击确认后，关闭计时器
					uni.vibrateLong();
					uni.showModal({
						title: '提示',
						content: '您有新消息了，请前往查看',
						showCancel:false,
					});
					// 将localstorage中的start_query_unread_message设置为false，即停止查询
					try{
						uni.setStorageSync('start_query_unread_message',false);
					}catch(e){
						// console.log("存储出现问题");
					}
				} else if (res.statusCode==204) {
					// console.log("无未读信息");
				} else {
					// console.log("系统通知信息获取失败");
				}
			}
		});
	}
	
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
				messageIntervalID:-1,
				canWarn:false,
				start_shift:new Date().toString(),
				end_shift:new Date()
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			this.messageSrc = '../../static/img/message_2.png';
			// 获取用户基本信息，并存入缓存
			uni.request({
				url: webSiteUrl + '/user/' + this.user_id,
				header: {
					'Authorization': 'Bearer '+ this.token,
				},
				method:'GET',
				success: res=> {
					if (res.statusCode==200) {
						// console.log("获取用户信息成功");
						// 存储用户信息到本地
						try{
							uni.setStorageSync('name',res.data.data.name);
							uni.setStorageSync('department',res.data.data.department);
							uni.setStorageSync('role',res.data.data.role);
							uni.setStorageSync('hours',res.data.data.hours);
						}catch(e){
							// console.log("存储出现问题");
						}
					} else{
						uni.showToast({
							icon:'none',
							duration: 2000,
							title: '用户信息获取失败'
						});
					}
				}
			});
			// 获取用户今日排班，若有status为no的排班则将控制是否 判断提醒用户的变量设置为 true
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth();
			var day = today.getDate();
			var today_start_at = (new Date(year,month,day,0,0,0)).toJSON();
			var today_end_at = (new Date(year,month,day,23,59,59)).toJSON();
			// console.log(today_start_at);
			// console.log(today_end_at);
			uni.request({
				url: webSiteUrl + '/shift?user_id=' + this.user_id + '&start_at=' + today_start_at + '&end_at=' + today_end_at + '&page=' + 1,
				header: {
					'Authorization': 'Bearer '+ this.token,
				},
				method:'GET',
				success: (res) => {
					if (res.statusCode == 200){
						if (res.data.total != 0){
							for (var i = 0; i < res.data.data.length; i++) {
								if (res.data.data[i].status == 'no') {  // 获取最早的未签到的班次开始时间
									this.canWarn = true;
									this.start_shift = (new Date(res.data.data[i].start_at)).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
								} else if (res.data.data[i].status == 'on') {  //获取最晚的已签到未签退的班次结束时间
									var temp_date_string = (new Date(res.data.data[i].end_at)).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
									if (this.end_shift < (new Date(temp_date_string))) {
										this.end_shift = (new Date(temp_date_string));
									}
								}
							}
						}
					}
				}
			})
			// 存储是否控制是否查询的变量
			try{
				uni.setStorageSync('start_query_unread_message',true);
			}catch(e){
				// console.log("存储出现问题");
			}
			// （页面加载时）查询一次用户是否有unread消息
			var that = this;
			hasUnreadMessage(that);
			/** 
			* ·开启计时器，每隔 60s，利用localstorage中的变量start_query_unread_message判断是否进行查询。
			*	·停止查询的条件:
			*		上一次查询查到有unread信息
			*	·重新开始查询的条件：
			* 		在message页面将unread全部“查看”
			* ·停止计时器：页面unload时
			* ·计时器的功能：
			* 	·是否有未读消息
			* 	·是否即将到上班时间
			* 
			*/
			this.messageIntervalID = setInterval(function(that){
				if (uni.getStorageSync('start_query_unread_message')) {
					hasUnreadMessage(that);
				} else {
					// console.log("上次的新信息还没处理完");
				}
				// 有未签到班次的时候判断是否需要提醒用户上班时间
				if (that.canWarn) {
					// 如果当前时间距离上班时间半个小时，则提醒用户
					var time_interval = ( ( (new Date(that.start_shift)) - (new Date()) ) / 1000 / 60 );
					if (time_interval < 30) {
						uni.vibrateLong();
						if (time_interval > 0) {
							uni.showModal({
								title: '提示',
								content: '距离上班时间还有：' + Math.floor(time_interval) + "分钟",
								showCancel:false,
							});
						} else{
							uni.showModal({
								title: '提示',
								content: '您已经迟到了',
								showCancel:false,
							});
						}
						that.canWarn = false;
					}
				}
				// 设置计时器的间隔，为了方便调试设为30s，单位为ms
			},10000,that);
        },
		// 当退出小程序的时候，关闭计时器
		onUnload:function(){
			if(this.messageIntervalID != -1) {
				clearInterval(this.messageIntervalID);
				this.messageIntervalID = -1;
				// console.log('关闭计时器');
			}
		},
		onShow:function(){
			// 检查用户签到状态
			uni.request({
				url: webSiteUrl + '/sign/user/' + this.user_id,
				header:{
					'Authorization': 'Bearer '+ this.token,
				},
				method: 'GET',
				success:(res) => {
					// console.log(res);
					if(res.statusCode==204){
						this.check_message = "未签到";
						this.IsNotcheck = true;
					} else if (res.statusCode == 200) {
						uni.setStorageSync('sign_id', res.data.sign_id)
						this.check_message = "已签到";
						this.isNotCheck = false;
						this.canCheckOff = true;
						uni.setStorageSync('canICU', false);
						this.start_at = (new Date(res.data.shift.start_at)).toLocaleString('zh-CN', {
							timeZone: 'Asia/Shanghai',
							hour12: false
						});
						this.end_at = (new Date(res.data.shift.end_at)).toLocaleString('zh-CN', {
							timeZone: 'Asia/Shanghai',
							hour12: false
						});
					} else {
						this.check_message = "服务器异常";
					}
				}
			});
			try {
				const value = uni.getStorageSync('canICU');
				if (value === true) {
					this.canICU = true;
				} else {
					this.canICU = false;
				}
			} catch (e) {
				this.canICU = false;
			}
		},
		methods:{
			goShiftArrangement(e) {
				uni.navigateTo({
					url: '../shiftarrangement/shiftarrangement'
				});
			},
			goLeave(e){
				uni.navigateTo({
					url: '../leave/apply/apply'
				});
			},
			goICU(e){
				this.canICU = false
				uni.navigateTo({
					url: '../icu/icu'
				});
			},
			goInfo(e){
				uni.navigateTo({
					url: '../info/info'
				});
			},
			checkIn(e){
				// 先扫描获得签到token(只允许通过相机扫码)
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						this.canWarn = false;
						// console.log('条码内容：' + res.result);
						this.check_token = res.result;
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
								// console.log(res);
								if (res.statusCode == 200) {
									// console.log("签到成功");
									// 存储sign_id到本地
									try{
										uni.setStorageSync('sign_id',res.data.sign_id);
									}catch(e){
										// console.log("sign_id存储出现问题");
									}
									uni.showToast({
										duration:2000,
										title:'签到成功'
									})
									// 刷新home页面
									uni.redirectTo({
										url: '../home/home'
									});
								} else {
									// console.log("签到失败");
									uni.showToast({
										duration: 2000,
										icon: 'none',
										title: '签到失败'
									})
								}
							},
							fail() {
								// console.log("接口调用失败");
								uni.showToast({
									duration: 2000,
									icon: 'none',
									title: '网络错误'
								})
							}
						})
					},
					fail() {
						// console.log("扫码失败");
						uni.showToast({
							duration:2000,
							icon:'none',
							title:'签到失败'
						})
					}
				});
			},
			goMessage(e){
				uni.navigateTo({
					url: '../message/message'
				});
			},
			// 签退
			checkOff(e){
				uni.request({
					url: webSiteUrl + '/sign/off/' + uni.getStorageSync('sign_id'),
					method: 'POST',
					header:{
						'Authorization': 'Bearer ' + this.token
					},
					success: (res) => {
						if(res.statusCode==200){
							this.canICU = res.data.overtime;
							this.isNotCheck = true;
							this.canCheckOff = false;
							this.check_message = "未签到";
							uni.showToast({
								duration:2000,
								title:'签退成功'
							})
							if ((new Date()) > this.end_shift) {
								try{
									uni.setStorageSync('canICU',true);
								}catch(e){
									// console.log('存储出现问题');
								}
							}
							// 刷新home页面
							uni.redirectTo({
								url: '../home/home'
							});
						}
						else{
							// console.log("签退失败");
							uni.showToast({
								duration:2000,
								icon:'none',
								title:'签退失败'
							})
						}
					},
					fail() {
						// console.log("签退失败");
						uni.showToast({
							duration:2000,
							icon:'none',
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
	.message_img {
		display: inline;
		position: absolute;
		right: 5%;
		margin-top: 11upx;
		height: 50upx;
	}
</style>
