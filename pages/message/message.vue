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
				<text @tap="showMessage" :data-messageId='item.id'>查看</text>
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
						"status": "read"
					}
				],
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			
		},
		methods:{
			showMessage(e) {
				console.log(e)
				var messageId = e.currentTarget.dataset.messageid;
				console.log(messageId);
				this.message_title = 'test title';
				this.message_from = 'tom';
				this.message_content = messageId + 'test contenttest contenttest contenttest contenttest contenttest content';
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
</style>
