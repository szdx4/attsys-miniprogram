<template>
    <view class="content">
		<view class="title">
			员工考勤系统
		</view>
		<view class="_content">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">账号：</text>
					<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
				</view>
				<view class="input-row">
					<text class="title">密码：</text>
					<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
				</view>
			</view>
		</view>
        <view class="btn-row">
            <button type="primary" @tap="bindLogin">登录</button>
        </view>
    </view>
</template>

<script>
    import mInput from '../../components/m-input.vue'
	import webSiteUrl from '../../common/webSiteUrl.js'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                account: '',
                password: '',
                positionTop: 0,
            }
        },
		onLoad:function(){
			try{
				// 检查是否储存过用户登录信息
				const res = uni.getStorageInfoSync();
				if(res.keys[0] == 'userName'){
					console.log("存储过该用户的信息");
					// 检查token是否到期
					let expired_at = new Date(uni.getStorageSync('expired_at'));
					let current_time = new Date();
					if(expired_at>current_time){
						uni.redirectTo({
							url: '../home/home'
						});
					}
					else{
						console.log("token过期，清除缓存");
						try {
							uni.clearStorageSync();
						} catch (e) {
							console.log(e);
						}
					}
				}
				else{
					console.log("初次登录！");
				}
			}catch(e){
				console.log(e);
			}
		},
        methods: {
            bindLogin(e) {
                if (this.account.length < 3) {
                    uni.showToast({
                        duration:2000,
						icon:'none',
                        title: '账号最短为 3 个字符'
                    });
                    return;
                }
                if (this.password.length < 4) {
                    uni.showToast({
                        duration:2000,
						icon:'none',
                        title: '密码最短为 4 个字符'
                    });
                    return;
                }
                // 检测用户账号密码是否在已注册的用户列表中
				var token;
				uni.showLoading({title: '登录中'});
				uni.request({
					url: webSiteUrl+'user/auth',
					method: 'POST',
					data: {
						name:this.account,
						password:this.password
					},
					success: (res) => {
						token = res.data.token;
						if (res.statusCode==200) {
							let userName = this.account;
							// 提取token中的相关信息
							let key_info_base64 = token.split(".")[1];
							// base64解码的js实现（atob函数用不了，只能强行转）
							var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
							var key_info_str = "";  
							var chr1, chr2, chr3;  
							var enc1, enc2, enc3, enc4;  
							var i = 0;  
							key_info_base64 = key_info_base64.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
							while (i < key_info_base64.length) {  
								enc1 = _keyStr.indexOf(key_info_base64.charAt(i++));  
								enc2 = _keyStr.indexOf(key_info_base64.charAt(i++));  
								enc3 = _keyStr.indexOf(key_info_base64.charAt(i++));  
								enc4 = _keyStr.indexOf(key_info_base64.charAt(i++));  
								chr1 = (enc1 << 2) | (enc2 >> 4);  
								chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
								chr3 = ((enc3 & 3) << 6) | enc4;  
								key_info_str = key_info_str + String.fromCharCode(chr1);  
								if (enc3 != 64) {  
									key_info_str = key_info_str + String.fromCharCode(chr2);  
								}  
								if (enc4 != 64) {  
									key_info_str = key_info_str + String.fromCharCode(chr3);  
								}  
							}
							// 上面的方法转自https://blog.csdn.net/u012369749/article/details/73784897
							let key_info_obj = JSON.parse(key_info_str);
							console.log(key_info_obj);
							let user_id = key_info_obj.id;
							let expired_at = key_info_obj.expired_at;
							// 将expired_at格式化
							// expired_at_init=new Date(expired_at_init)
							// let expired_at = Date.UTC(expired_at_init.getYear(),expired_at_init.getMonth(),expired_at_init.getDay(),expired_at_init.getHours(),expired_at_init.getMinutes(),expired_at_init.getSeconds());
							// 存储用户登录信息到本地
							try{
								uni.setStorageSync('userName',userName);
								uni.setStorageSync('token',token);
								uni.setStorageSync('expired_at',expired_at);
								uni.setStorageSync('user_id',user_id);
							}catch(e){
								console.log("存储出现问题");
							}
							uni.hideLoading();
						    uni.redirectTo({
						    	url: '../home/home'
						    });
						} else {
							uni.hideLoading();
						    uni.showToast({
						        icon: 'none',
						        title: '用户账号或密码不正确',
						    });
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
						    icon: 'none',
						    title: '登录认证失败',
						});
					}
				});
            },
		}
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }
	
	._content {
		margin-top: 300upx;
	}
	
	.title {
	    color: #8f8f94;
		text-align:center;
	}
</style>
