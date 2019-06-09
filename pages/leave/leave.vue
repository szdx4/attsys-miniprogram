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
						<view class="uni-input">{{data[index].id}}.&nbsp;&nbsp;{{data[index].start_at}}<p>至&nbsp;{{data[index].end_at}}</p></view>
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
					<text class="remark">反馈理由: {{remark}}</text>
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
			
			uni.request({
				url: 'https://webSiteUrl/leave/user/' + this.user_id + '?page=' + 0,
				// data: {
				// 	text: 'uni.request'
				// },
				header: {
					'Authorization': 'Bearer' + this.token //'Authorization'加引号？
				},
				method: 'GET',
				success: (res) => {
					if (res.data.status == 200) {
						this.haveWorkOff = true;
						console.log('request success');
						console.log(res.data);
						this.data = res.data.data;
						
					}
				}
			});
			//为让一开始就能显示
			var show = {target:{value:0}};
			this.bindPickerChange(show);
		},

		data() {
			return {
				userName: '',
				token: '',
				user_id: '',
				haveWorkOff: true, //控制显示
				data: [
					{
						"id": 1,
						"user_id": 1,
						"start_at": "2019-06-01 11:11:11",
						"end_at": "2019-06-06 11:11:11",
						"remark": "身体原因",
						"status": "pass"
					},
					{
						"id": 2,
						"user_id": 1,
						"start_at": "2019-06-20 11:11:11",
						"end_at": "2019-06-22 11:11:11",
						"remark": "心理原因",
						"status": "wait"
					},
					{
						"id": 3,
						"user_id": 1,
						"start_at": "2019-06-10 11:11:11",
						"end_at": "2019-06-12 11:11:11",
						"remark": "没有原因",
						"status": "reject"
					}, //for test
				],
				remark: '',//显示理由
				index: 0,//选择器
				resumeAvailable:false, //通过（pass）状态才能点击'销假'按钮

				datebegin: new Date(), //用于显示起止日期
				dateend: new Date(),
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
					url: 'https://webSiteUrl/leave/user/leave/'+this.data[this.index].id,
					method: 'DELETE',
					header:{
						'Authorization': 'Bearer' + this.token //'Authorization'加引号？
					},
					data: {},
					success: res => {
						if (res.data.status == 200) {
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
							var errCode = (res.data.status == undefined)?'连接失败':res.data.status;
							uni.showToast({title:"提交失败! "+errCode, icon:"none"});
						}
					},
					fail: () => {},
					complete: () => {}
				});

				
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为（同样为index值）：' + e.target.value);
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
		line-height: 85upx;
		height: 130upx;
	}
</style>
