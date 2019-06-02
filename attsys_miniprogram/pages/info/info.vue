<template>
	<view>
		<view class="title">
		    您好 {{userName}}，您已成功登录。
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName: '',
				token:'',
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
		},
		methods: {
			
		}
	}
</script>

<style>
.title {
        color: #8f8f94;
        margin-top: 50upx;
    }
</style>
