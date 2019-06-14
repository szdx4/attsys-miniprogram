<!-- 有和没有正在进行中的请假用两种view -->
<template>
	<view v-if="haveWorkOff">
		<!-- <view class="uni-title uni-common-pl">选取请假记录</view> -->
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left current-picker">
					当前选择
				</view>
				<view class="uni-list-cell-db current-picker">
					<picker @change="bindPickerChange" :value="index" :range="data" range-key="start_at">
						<view class="uni-input">开始：{{data[index].start_at}}<br>结束：{{data[index].end_at}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="example">
			<uni-steps :options="progress" :active="active" />
			<view class="uni-padding-wrap uni-common-mt">
				<view class="text-box">
					<text>请假开始日期: {{datebegin}}</text><br />
					<text>请假结束日期: {{dateend}}</text><br />
					<text class="remark">理由: {{remark}}</text>
				</view>
			</view>
			<!-- 批准阶段才能点击按钮 -->
			<button type="primary" @click="resume" :disabled="!resumeAvailable || active != 1">销假</button>
		</view>
	</view>
	<view v-else>
		<view class="no-content">
			<text>没有正在进行中的请假申请</text>
		</view>
	</view>
</template>

<script>
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import webSiteUrl from '../../common/webSiteUrl.js'
	
	export default {
		components: {
			uniSteps
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			// 向服务器查询请假项目。用total除以per_page，向下取整，得出需要查询的总页数
			var pages = 1;
			var showInit = true;
			this.data = [];
			uni.showLoading({title: '加载中'});
			setTimeout(function () {
				uni.hideLoading();
			}, 1500);
			for (var i = 1; i <= pages; i++) {
				uni.request({
					url: webSiteUrl + '/leave/user/' + this.user_id + '?page=' + i,
					header: {
						'Authorization': 'Bearer ' + this.token
					},
					method: 'GET',
					success: (res) => {
						// console.log(res);
						if (res.statusCode == 200) {
							// console.log('request success');
							if (res.data.total != 0) {
								this.haveWorkOff = true;
								pages = Math.ceil(res.data.total / res.data.per_page);
								// 将得到的数组加入data中
								this.data.push.apply(this.data,res.data.data);
								// 将data中的日期格式化
								for (var i = 0; i < this.data.length; i++) {
									this.data[i].start_at = (new Date(res.data.data[i].start_at)).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
									this.data[i].end_at = (new Date(res.data.data[i].end_at)).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
								}
							} else{
								uni.showToast({
									title:'无请假信息',
									duration:2000
								})
								// console.log("无请假信息")
							}
							// 显示第一个请假项目的信息
							if (showInit) {
								// console.log(this.data.length);
								if (this.data.length > 0) {
									this.datebegin = this.data[this.index].start_at;
									this.dateend = this.data[this.index].end_at
									this.remark = this.data[this.index].remark;
									var status = this.data[this.index].status;
									if (status == 'wait') {
										this.active = 0;
										this.progress[1].title = '申请结果';
										this.resumeAvailable = false;
									} else if(status == 'pass'){
										this.active = 1;
										this.progress[1].title = '通过';
										this.resumeAvailable = true;
									} else if(status == 'reject'){
										this.active = 1;
										this.progress[1].title = '不予通过';
										this.resumeAvailable = false;
									}
								}
								showInit = false;
							}
						}
					},
					fail() {
						// console.log('请假信息获取失败')
					}
				});
			}
			//为让一开始就能显示
			// var show = {target:{value:0}};
			// this.bindPickerChange(show);
		},

		data() {
			return {
				userName: '',
				token: '',
				user_id: '',
				haveWorkOff: false, //控制显示
				data: [],
				remark: '',//显示理由
				index: 0,//选择器
				resumeAvailable:false, //通过（pass）状态才能点击'销假'按钮

				datebegin:'', //用于显示起止日期
				dateend:'',
				active: 1,
				progress: [{
					title: '申请中'
				}, {
					title: '申请结果'
				}, {
					title: '销假'
				}],
			}
		},
		methods: {
			resume() {//销假按钮
				uni.request({
					url: webSiteUrl + '/leave/'+this.data[this.index].id,
					method: 'DELETE',
					header:{
						'Authorization': 'Bearer ' + this.token
					},
					data: {},
					success: res => {
						if (res.statusCode == 200) {
							//切换状态
							if (this.active < this.progress.length - 1) {
								this.active += 1
							} else {
								this.active = 0
							}
							this.resumeAvailable = false;
							uni.showToast({title:"销假成功!", icon:"none"});
							
						}
						else{
							var errCode = (res.statusCode == undefined)?'连接失败':res.statusCode;
							uni.showToast({title:"提交失败! "+errCode, icon:"none"});
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			bindPickerChange: function(e) {
				// console.log('picker发送选择改变，携带值为（同样为index值）：' + e.target.value);
				this.index = e.target.value;
				this.datebegin = this.data[this.index].start_at;
				this.dateend = this.data[this.index].end_at;
				this.remark = this.data[this.index].remark;
				var status = this.data[this.index].status;
				if (status == 'wait') {
					this.active = 0;
					this.progress[1].title = '申请结果';
					this.resumeAvailable = false;
				} else if(status == 'pass'){
					this.active = 1;
					this.progress[1].title = '通过';
					this.resumeAvailable = true;
				} else if(status == 'reject'){
					this.active = 1;
					this.progress[1].title = '不予通过';
					this.resumeAvailable = false;
				}
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}
	.no-content {
		margin-bottom: 40upx;
		padding: 40upx 0;
		display: flex;
		min-height: 300upx;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 50upx;
		color: #353535;
		line-height: 1.8;
	}
	button {
		margin: 30upx;
	}

	.text-box {
		width: 100%;
	}
	.remark {
		color: #FF3333;
	}
	.current-picker {
		line-height: 90upx;
		height: 130upx;
	}
</style>
