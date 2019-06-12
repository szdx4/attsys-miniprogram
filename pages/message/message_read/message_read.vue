<template>
    <view class="_content">
		<scroll-view :scroll-y="true">
			<uni-list v-for="(item, index) in message_list" :key="index">
				<uni-list-item :title="item.title" :note="item.from.name" :id_1='item.id' @click="showMessage" ></uni-list-item>
			</uni-list>
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
    </view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import webSiteUrl from '../../../common/webSiteUrl.js'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	
	// 向服务器查询read消息。用total除以per_page，向下取整，得出需要查询的总页数
	function queryReadMessage(that) {
		var pages = 1;
		that.message_list = [];
		for (var i = 1; i <= pages; i++) {
			uni.request({
				url: webSiteUrl + '/message?to_user_id=' + that.user_id + '&status=read&page=' + i,
				header:{
					'Authorization': 'Bearer '+ that.token,
				},
				method: 'GET',
				success: (res) => {
					// console.log(res);
					if (res.statusCode==200) {
						if (res.data.total != 0) {
							pages = Math.ceil(res.data.total / res.data.per_page);
							// 将得到的数组加入message_list中
							that.message_list.push.apply(that.message_list,res.data.data);
						} else{
							uni.showToast({
								title:'无未读信息',
								icon:'none',
								duration:2000
							})
							// console.log("无未读信息")
						}
					} else if (res.statusCode==204) {
						uni.showToast({
							title:'无已读信息',
							icon:'none',
							duration:2000
						})
						// console.log("无系统通知信息")
					} else {
						// console.log("系统通知信息获取失败")
						uni.showToast({
							title:'已读信息获取失败',
							icon:'none',
							duration:2000
						})
					}
				},
				fail() {
					uni.showToast({
						title:'已读信息获取失败',
						icon:'none',
						duration:2000
					})
				}
			});
		}
	}
	
    export default {
		components: {
			uniPopup,
			uniList,
			uniListItem
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
					// {
					// 	"id": 1,
					// 	"from": {
					// 		"id": 1,
					// 		"name": "test",
					// 	},
					// 	"to": {
					// 		"id": 2,
					// 		"name": "test2",
					// 	},
					// 	"title": "test title",
					// 	"status": "read"
					// }
				],
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			var that = this;
			uni.showLoading({title: '加载中'});
			setTimeout(function () {
				uni.hideLoading();
			}, 1500);
			queryReadMessage(that);
		},
		onPullDownRefresh() {
			// console.log('refresh');
			var that = this;
			queryReadMessage(that);
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods:{
			showMessage(e) {
				// console.log(e)
				var messageId = e.currentTarget.dataset.one;
				uni.showLoading({title: '加载中'});
				uni.request({
					url: webSiteUrl + '/message/' + messageId,
					method: 'GET',
					header: {
						'Authorization': 'Bearer '+ this.token,
					},
					success: (res) => {
						uni.hideLoading();
						// console.log(res);
						this.message_title = res.data.data.title;
						this.message_from = res.data.data.from.name;
						this.message_content = res.data.data.content;
					},
					fail() {
						uni.hideLoading();
						uni.showToast({
							icon:'none',
							duration:2000,
							title:"查看失败"
						})
						// console.log(查询失败);
					}
				})
				this.isShowPopup = true;
			},
			closeMessage() {
				this.isShowPopup = false;
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
	.specificMessage{
		min-height: 300upx;
		max-height: 700upx;
		width: 600upx;
		background-color: #F8F8F8;
		border: 4upx solid #555555;
	}
	.sec_cap {
		text-align: center;
		font-weight: bold;
		border-bottom: 3upx solid #000000;
		font-size: 35upx;
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
		height: 30upx;
		padding-top: 20upx;
		padding-bottom: 10upx;
		border-bottom: 1upx solid #000000;
	}
</style>
