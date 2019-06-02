<template>
    <view class="content">
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
        <view class="btn-row">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
        <view class="action-row">
            <navigator url="../reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="../pwd/pwd">忘记密码</navigator>
        </view>
    </view>
</template>

<script>
    import mInput from '../../components/m-input.vue'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                account: '',
                password: '',
                positionTop: 0,
				token: '',
            }
        },
		onLoad:function(){
			try{
				// 检查是否储存过用户登陆信息
				const res = uni.getStorageInfoSync();
				if(res.keys[0] == 'userName'){
					console.log("存储过该用户的信息");
					// 检查token是否到期
					let expired_ms = uni.getStorageSync('expired_ms');
					let current_time = new Date();
					let current_ms = current_time.getTime();
					if(expired_ms>current_ms){
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
					console.log("初次登陆！");
				}
			}catch(e){
				console.log(e);
			}
		},
        methods: {
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin(e) {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                // if (this.account.length < 5) {
                //     uni.showToast({
                //         icon: 'none',
                //         title: '账号最短为 5 个字符'
                //     });
                //     return;
                // }
                // if (this.password.length < 6) {
                //     uni.showToast({
                //         icon: 'none',
                //         title: '密码最短为 6 个字符'
                //     });
                //     return;
                // }
                /**
                 * 检测用户账号密码是否在已注册的用户列表中
                 */
				var status = 200;
				// 这里token为了测试，将过期时间设置在2019-06-30
				this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkX2F0IjoiVGh1IEp1biAzMCAwMjoyMTo0NiBVVEMgMjAxOSIsImlkIjoxLCJyb2xlIjoibWFzdGVyIn0=.NwUOTTY5ZbPVRQdQRFQwZ3Na-hNfemMrFSTGv63aJjs';
				// uni.request({
				// 	/**
				// 	* 路径待修改！！！
				// 	*/
				// 	url: 'https://???path???/user/auth',
				// 	method: 'POST',
				// 	data: {
				// 		name:this.account,
				// 		password:this.password
				// 	},
				// 	success: res => {
				// 		console.log(res);
				// 		status = res.data.status;
				//		this.token = res.data.token;
				// 	},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
				
                if (status==200) {
					let userName = this.account;
					let token = this.token;
					// 提取token中的相关信息
					let key_info_base64 = token.split(".")[1];
					// console.log("key_info_base64="+key_info_base64);
					let key_info_str = atob(key_info_base64);  //base64编码解码
					let key_info_obj = JSON.parse(key_info_str);
					let user_id = key_info_obj.id;
					let expired_at_init = key_info_obj.expired_at;
					// 将expired_at格式化
					let expired_at_splited = expired_at_init.split(" ");
					let month_init = expired_at_splited[1];
					let day = parseInt(expired_at_splited[2]);
					let time = expired_at_splited[3].split(":");
					let hours = parseInt(time[0])-1;
					let minutes = parseInt(time[1])-1;
					let seconds = parseInt(time[2])-1;
					let year = parseInt(expired_at_splited[5]);
					let month_array = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
					var month;
					for (var i = 0; i < 12; i++) {
						if(month_init==month_array[i]){
							month = i;
							break;
						}
					}
					let expired_ms = Date.UTC(year,month,day,hours,minutes,seconds);
					console.log(key_info_obj);
					// 存储用户登陆信息到本地
					try{
						uni.setStorageSync('userName',userName);
						uni.setStorageSync('token',token);
						uni.setStorageSync('expired_ms',expired_ms);
						uni.setStorageSync('user_id',user_id);
					}catch(e){
						console.log("存储出现问题");
					}
                    uni.redirectTo({
                    	url: '../home/home'
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '用户账号或密码不正确',
                    });
                }
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

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 100upx;
        height: 100upx;
        border: 1upx solid #dddddd;
        border-radius: 100upx;
        margin: 0 40upx;
        background-color: #ffffff;
    }

    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 20upx;
    }
</style>
