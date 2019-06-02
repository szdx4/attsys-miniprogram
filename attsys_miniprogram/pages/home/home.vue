<template>
    <view class="content">
        <view class="hello">
            <view class="title">
                您好 {{userName}}，您已成功登录。
            </view>
			<view>
				签到情况: {{check_message}}
			</view>
			<view>
				班次开始: {{start_at}}
			</view>
			<view>
				班次结束: {{end_at}}
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="scanQrCode" :data-account='account' data-token='token'>扫码</button>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="goShiftArrangement" :data-account='account' data-token='token'>查看班次安排</button>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="goLeave" :data-account='account' data-token='token'>申请/查看请假</button>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="goICU" :data-account='account' data-token='token'>申请加班</button>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="goInfo" :data-account='account' data-token='token'>查看/修改信息</button>
			</view>
        </view>
    </view>
</template>

<script>
    export default {
		data() {
			return {
				userName: '',
				token:'',
				check_message:'',
				start_at:'',
				end_at:''
			}
		},
        onLoad: function(){
			// 从存储中获取用户登陆信息
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			// 检查用户签到状态
			var result;
			// uni.request({
			// 	url: 'https://???path???/user/auth',
			// 	header:{
			// 		Authorization: this.token
			// 	},
			// 	method: 'GET',
			// 	success:function(res){
			// 		console.log(res);
			// 		result = res;
			// 	}
			// })
			// let checkStatus = result.status;
			let checkStatus = 200;
			if(checkStatus==204){
				this.check_message = "未签到";
			}
			else if(checkStatus==200){
				this.check_message = "已签到";
				// this.start_at = result.start_at;
				// this.end_at = result.end_at;
			}
			else{
				this.check_message = "服务器异常";
			}
        },
		methods:{
			goShiftArrangement(e) {
				console.log(e)
				var userName = this.userName;
				var token = this.token;
				uni.navigateTo({
					url: '../shiftarrangement/shiftarrangement'
				});
			},
			goLeave(e){
				console.log(e)
				var userName = this.userName;
				var token = this.token;
				uni.navigateTo({
					url: '../leave/leave'
				});
			},
			goICU(e){
				console.log(e)
				var userName = this.userName;
				var token = this.token;
				uni.navigateTo({
					url: '../icu/icu'
				});
			},
			goInfo(e){
				console.log(e)
				var userName = this.userName;
				var token = this.token;
				uni.navigateTo({
					url: '../info/info'
				});
			},
			scanQrCode(e){
				// 只允许通过相机扫码
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
			}
		}
    }
</script>

<style>
    .hello {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .title {
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul {
        font-size: 30upx;
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul>view {
        line-height: 50upx;
    }
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	}
</style>
