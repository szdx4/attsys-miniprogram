<template>
    <view class="_content">
		<caption>
			<label class="caption_label">来自&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				标题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				操作
			</label>
		</caption>
		<scroll-view :scroll-y="true" class="uni-center center-box">
			<view v-for="(item, index) in message_list" :key="index" class="uni-list-item message">
				{{ item.from_user_name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				{{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*
				<text @tap="showMessage" :data-messageId='item.id' :data-id='index'>查看</text>
			</view>
		</scroll-view>
		<view>
			<uni-popup :show="isShowPopup" position="middle" mode="insert" buttonMode="right" @hidePopup="closeMessage">
				<scroll-view :scroll-y="true" class="specificMessage">
						<view class="sec_cap">{{message_title}}</view>
						<p class="p_from">From:&nbsp;&nbsp;{{message_from}}</p>
						<p>·&nbsp;&nbsp;&nbsp;&nbsp;{{message_content}}</p>
				</scroll-view>
			</uni-popup>
		</view>
		<view class="bottom-btn">
			<button class="btn_left" size="mini" @tap="clearAll">清除所有消息</button>
			<button class="btn_right" size="mini" @click="goMessageRead">查看已读消息</button>
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
				user_id:0,
				isShowPopup:false,
				message_content:'',
				message_title:'',
				message_from:'',
				message_list: [
					{
						"id": 1,
						"from_user_id": 1,
						"from_user_name": "Jack",
						"to_user_id": 2,
						"to_user_name": "test",
						"title": "test title1",
						"status": "unread"
					},
					{
						"id": 2,
						"from_user_id": 1,
						"from_user_name": "Tom",
						"to_user_id": 2,
						"to_user_name": "test",
						"title": "test title2",
						"status": "unread"
					}
				],
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			// 向服务器查询unread消息。用total除以per_page，向下取整，得出需要查询的总页数
			// var pages = 0;
			// for (var i = 0; i <= pages; i++) {
			// 	uni.request({
			// 		url: 'https://???path???/message?to_user_id=' + this.user_id + '&status=unread&page=' + i,
			// 		header:{
			// 			'Authorization': 'Bearer '+ this.token,
			// 		},
			// 		method: 'GET',
			// 		success: (res) => {
			// 			console.log(res);
			// 			if (res.status==200) {
			// 				if (res.total != 0) {
			// 					pages = Math.floor(res.total / res.per_page);
			// 					// 将得到的数组加入message_list中
			// 					this.message_list.push().apply(this.message_list,res.data);
			// 				} else{
			// 					uni.showToast({
			// 						title:'无未读信息',
			// 						duration:3000
			// 					})
			// 					console.log("无未读信息")
			// 				}
			// 			} else {
			// 				console.log("系统通知信息获取失败")
			// 			}
			// 		}
			// 	});
			// }
			var data_m = [
				{
					"id": 1,
					"from_user_id": 1,
					"from_user_name": "Rose",
					"to_user_id": 2,
					"to_user_name": "test",
					"title": "test title3",
					"status": "unread"
				},
				{
					"id": 2,
					"from_user_id": 1,
					"from_user_name": "Tony",
					"to_user_id": 2,
					"to_user_name": "test",
					"title": "test title4",
					"status": "unread"
				}
			]
			this.message_list.push.apply(this.message_list,data_m);
		},
		onPullDownRefresh() {
			console.log('refresh');
			// 向服务器查询unread消息。用total除以per_page，向下取整，得出需要查询的总页数
			// var pages = 0;
			// for (var i = 0; i <= pages; i++) {
			// 	uni.request({
			// 		url: 'https://???path???/message?to_user_id=' + this.user_id + '&status=unread&page=' + i,
			// 		header:{
			// 			'Authorization': 'Bearer '+ this.token,
			// 		},
			// 		method: 'GET',
			// 		success: (res) => {
			// 			console.log(res);
			// 			if (res.status==200) {
			// 				if (res.total != 0) {
			// 					pages = Math.floor(res.total / res.per_page);
			// 					// 将得到的数组加入message_list中
			// 					this.message_list.push().apply(this.message_list,res.data);
			// 				} else{
			// 					uni.showToast({
			// 						title:'无未读信息',
			// 						duration:3000
			// 					})
			// 					console.log("无未读信息")
			// 				}
			// 			} else {
			// 				console.log("系统通知信息获取失败")
			// 			}
			// 		},
			// 		complete() {
			// 			uni.stopPullDownRefresh();
			// 		}
			// 	});
			// }
			// 测试用，记得删除
			var data_m = [
				{
					"id": 1,
					"from_user_id": 1,
					"from_user_name": "Rose",
					"to_user_id": 2,
					"to_user_name": "test",
					"title": "test title3",
					"status": "unread"
				},
				{
					"id": 2,
					"from_user_id": 1,
					"from_user_name": "Tony",
					"to_user_id": 2,
					"to_user_name": "test",
					"title": "test title4",
					"status": "unread"
				}
			]
			this.message_list.push.apply(this.message_list,data_m);
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods:{
			showMessage(e) {
				console.log(e)
				var messageId = e.currentTarget.dataset.messageid;
				var id = e.currentTarget.dataset.id;
				this.message_title = 'test title';
				this.message_from = 'Tom';
				this.message_content = messageId + 'test contenttest contenttest contenttest contenttest contenttest content';
				// uni.request({
				// 	url: 'https://???path???/message/' + messageId,
				// 	method: 'GET',
				// 	header: {
				// 		'Authorization': 'Bearer '+ this.token,
				// 	},
				// 	success: (res) => {
				// 		this.message_title = res.data.title;
				// 		this.message_from = res.data.from_user_name;
				// 		this.message_content = res.data.content;
				// 	},
				// 	fail() {
				// 		console.log(查询失败);
				// 	}
				// })
				this.isShowPopup = true;
				// 将该消息从消息列表中删除
				this.message_list.splice(id,1);
				// 当消息列表为空时，将定时器的控制变量设置为true
				if (this.message_list.length==0) {
					uni.showToast({
						title:'无未读信息',
						duration:3000
					})
					try{
						uni.setStorageSync('start_interval',true);
					}catch(e){
						console.log("存储出现问题");
					}
				}
			},
			closeMessage() {
				this.isShowPopup = false;
			},
			clearAll() {
				uni.showModal({
					title: '提示',
					content: '是否确定清除',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.message_list = [];
							// 将所有消息通过api接口标记为read
							// for (var i in this.message_list) {
							// 	uni.request({
							// 		url: 'https://???path???/message/' + this.message_list[i].messageId,
							// 		method: 'GET',
							// 		header: {
							// 			'Authorization': 'Bearer '+ this.token,
							// 		},
							// 		success: (res) => {
							// 			console.log('标记消息成功：' + this.message_list[i].messageId)
							// 		},
							// 		fail() {
							// 			console.log('查询失败');
							// 		}
							// 	})
							// }
							// 将定时器的控制变量设置为true
							try{
								uni.setStorageSync('start_interval',true);
							}catch(e){
								console.log("存储出现问题");
							}
							uni.showToast({
								duration:2000,
								title:'清除成功'
							})
						} else {
							console.log('用户点击取消');
						}
					}
				});
			},
			goMessageRead() {
				uni.navigateTo({
					url: 'message_read/message_read'
				});
			}
		}
    }
</script>

<style>
    ._content{
    	display: flex;
    	flex: 1;
    	flex-direction: column;
    	background-color: #CCCCCC;
    }
	.message {
		background-color: #EBEDF0;
		height: 55upx;
		border-bottom: 4upx solid #555555;
		border-left: 4upx solid #555555;
		border-right: 4upx solid #555555;
	}
	.specificMessage{
		min-height: 300upx;
		max-height: 700upx;
		width: 600upx;
		background-color: #F8F8F8;
		border: 4upx solid #555555;
	}
	caption {
		height: 70upx;
		line-height: 70upx;
		font-weight: bold;
		border-bottom: 4upx solid #555555;
	}
	.sec_cap {
		text-align: center;
		font-weight: bold;
		border-bottom: 3upx solid #000000;
		font-size: 35upx;
	}
	.caption_label {
		margin-left: 13%;
	}
	p {
		padding-left: 8upx;
		font-size: 30upx;
	}
	.p_from {
		border-bottom: 1upx solid #000000;
		font-size: 30upx;
	}
	.bottom-btn {
		position: absolute;
		bottom: 1%;
	}
	.btn_left {
		left: 20%;
	}
	.btn_right {
		left: 60%;
	}
</style>
