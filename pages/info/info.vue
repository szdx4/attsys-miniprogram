<template>
	<view>
		<view class="table">
			<caption class='_caption'>个人信息</caption>
			<view id="panel" class="flex-column">
				<view class="flex-row flex-cell row">
					<text class="flex-cell flex-row">姓名：</text>
					<text class="flex-cell flex-row">{{name}}</text>
				</view>
				<view class="flex-row flex-cell row">
					<text class="flex-cell flex-row">部门：</text>
					<text class="flex-cell flex-row">{{department.name}}</text>
				</view>
				<view class="flex-row flex-cell row">
					<text class="flex-cell flex-row">工时：</text>
					<text class="flex-cell flex-row">{{hours}}</text>
				</view>
				<view class="flex-row flex-cell">
					<text class="flex-cell flex-row">图片：</text>
					<view><image class='_img flex-cell flex-row-l' :src="imgSrc" :mode='scaleToFill'></image></view>
					<view style='width:0px;height:0px;overflow:hidden;'>
						<canvas canvas-id="myCanvas"></canvas>
					</view>
				</view>
			</view>
		</view>
		<view class="upload_button">
			<button class="primary" type="primary" @tap="submit">上传图片</button>
		</view>
		<view class="pwd_button">
			<button class="primary" type="warn" @tap="showPanel">修改密码</button>
		</view>
		<view>
			<uni-popup :show="isShowPopup" position="middle" mode="insert" buttonMode="right" @hidePopup="closePanel">
				<view class="pwd_panel">
					<view class="input-row border">
						<text class="_title">原密码：</text>
						<m-input type="password" displayable v-model="oldpwd" placeholder="请输入密码"></m-input>
					</view>
					<view class="input-row border">
						<text class="_title">新密码：</text>
						<m-input type="password" displayable v-model="newpwd_1" placeholder="请输入密码"></m-input>
					</view>
					<view class="input-row border">
						<text class="_title">新密码确认：</text>
						<m-input type="password" displayable v-model="newpwd_2" placeholder="请输入密码"></m-input>
					</view>
					<view class="bottom-btn">
						<button class="btn_left" size="mini" @tap="clear">重置</button>
						<button class="btn_right" size="mini" @click="changePwd">提交</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import webSiteUrl from '../../common/webSiteUrl.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import mInput from '../../components/m-input.vue'
	
	export default {
		components: {
			uniPopup,
			mInput
		},
		data() {
			return {
				userName: '',
				token:'',
				user_id:0,
				name:'Tony',
				department:1,
				role:'user',
				hours:12,
				imgSrc:'',
				isChanged: false,
				isShowPopup:false,
				oldpwd:'',
				newpwd_1:'',
				newpwd_2:'',
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.user_id = uni.getStorageSync('user_id');
			this.userName = uni.getStorageSync('userName');
			this.name = uni.getStorageSync('name');
			this.department = uni.getStorageSync('department');
			this.role = uni.getStorageSync('role');
			this.hours = uni.getStorageSync('hours');
			// 向服务器请求获取用户人脸信息
			// uni.request({
			// 	url: webSiteUrl + '/face/user/' + this.user_id,
			// 	header: {
			// 		'Authorization': 'Bearer '+ this.token,
			// 	},
			// 	method: 'GET',
			// 	success: (res) => {
			// 		if (res.statusCode==200) {
			// 			console.log(res);
			// 			console.log("获取用户图片成功");
			// 			if (res.data.data.status=="available") {
			// 				this.imgSrc = res.data.data.info;  // 服务器给的图片base64码，可以在image标签中直接解析
			// 			}
			// 			else {
			// 				console.log("用户图片暂时不可用")
			// 			}
			// 		} else{
			// 			console.log("获取用户图片失败");
			// 		}
			// 	},
			// });
		},
		methods: {
			// 提交用户的图片修改
			submit(e) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						plus.io.resolveLocalFileSystemURL(res.tempFilePaths[0], (entry) => {
							entry.file((file) => {
								var reader = new plus.io.FileReader();
								reader.onloadend = ({ target: { result } }) => {
									uni.request({
										url: webSiteUrl + '/face/user/' + this.user_id,
										header: {
											'Authorization': 'Bearer '+ this.token,
										},
										data: {
											info: result
										},
										method: 'POST',
										success: (res) => {
											console.log(res);
											if (res.statusCode == 201) {
												console.log("上传成功");
												uni.showToast({
													duration:2000,
													title:'上传成功'
												})
											} else {
												console.log("上传失败");
												uni.showToast({
													duration:2000,
													title:'上传失败'
												})
											}
										}
									});
								};
								reader.readAsDataURL(file);
							});
						});
					}
				})
			},
			showPanel(e) {
				console.log(e);
				this.oldpwd = '';
				this.newpwd_1 = '';
				this.newpwd_2 = '';
				this.isShowPopup = true;
			},
			closePanel() {
				this.isShowPopup = false;
			},
			clear() {
				this.oldpwd = '';
				this.newpwd_1 = '';
				this.newpwd_2 = '';
			},
			changePwd() {
				// 判断密码格式是否正确
				if (this.oldpwd.length < 4 || this.newpwd_1.length < 4 || this.newpwd_2.length < 4) {
				    uni.showToast({
				        duration:2000,
				        title: '密码最短为 4 个字符'
				    });
				    return;
				} else {
					// 判断两次新密码是否相同
					if (this.newpwd_1 == this.newpwd_2) {
						uni.request({
							url: webSiteUrl + '/user/' + this.user_id + '/password',
							header: {
								'Authorization': 'Bearer '+ this.token,
							},
							data: {
								old_password:this.oldpwd,
								new_password:this.newpwd_1
							},
							method: 'PUT',
							success: (res) => {
								if (res.statusCode == 200) {
									uni.showToast({
										duration:2000,
										title:'修改密码成功'
									})
									console.log('修改密码请求提交成功');
									// 修改密码成功，则清除缓存，重新登陆
									try {
										uni.clearStorageSync();
									} catch (e) {
										console.log(e);
									}
									uni.redirectTo({
										url: '../login/login'
									});
								} else{
									uni.showToast({
										duration:2000,
										title:'修改密码失败'
									})
									console.log('修改密码请求提交失败');
								}
							},
							fail() {
								uni.showToast({
									duration:2000,
									title:'修改密码失败'
								})
								console.log('修改密码请求提交失败');
							}
						})
					} else{
						uni.showToast({
							duration:2000,
							title:'两次输入的新密码不一致'
						})
					}
				}
			}
		}
	}
</script>

<style>
	.title {
			color: #8f8f94;
			margin-top: 50upx;
		}
	.table {
		width: 600upx;
		top: 9%;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0); 
	}
	._caption {
		text-align: center;
		margin-bottom: 40upx;
	}
	._img {
		width: 300upx;
		height: 400upx;
		margin-top: 12upx;
		margin-bottom: 7upx;
		margin-right: 12upx;
		background-color: #8F8F94;
	}

	#panel{
		background:#EEEEEE;
		border: 5upx solid #8F8F94;
	}

	.row{
		line-height: 5vh;
		border-bottom: 5upx solid #8F8F94;
	}

	.flex-row{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.flex-column{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
	}

	.flex-cell{
		flex: 1;
	}
	.img_button{
		margin-bottom: 12upx;
	}
	.upload_button{
		margin-top: 30upx;
		position: absolute;
		bottom: 20%;
		left: 50%;
		transform: translate(-50%, 0); 
	}
	.pwd_button{
		margin-top: 30upx;
		position: absolute;
		bottom: 12%;
		left: 50%;
		transform: translate(-50%, 0); 
	}
	.pwd_panel{
		padding-top: 8upx;
		padding-right: 20upx;
		height: 300upx;
		width: 600upx;
		background-color: #FFFFFF;
		border: 2upx solid #000000;
	}
	.input-row ._title {
		width: 45%;
		height: 50upx;
		min-height: 50upx;
		padding: 10upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}
	.bottom-btn {
		position: absolute;
		bottom: 12%;
	}
	.btn_left {
		left: 40%;
	}
	.btn_right {
		left: 130%;
	}
</style>
