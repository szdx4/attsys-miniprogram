<template>
	<view class="calendar-content">
		<view v-if="show" class="calendar-mask" @click="closeMask">
			<view class="calendar-box" @click.stop="">
				<uni-calendar :lunar="tags[0].checked" :fixed-heihgt="tags[1].checked" :slide="slide" :disable-before="tags[6].checked"
				 :start-date="startDate" :end-date="endDate" :date="date" @change="change" @to-click="toClick" />
				<uni-popup :show="popUp === 'true'" position="middle" mode="fixed" @hidePopup="togglePopup('false')">
					<scroll-view :scroll-y="true" class="uni-center center-box">
						<view v-for="(item, index) in list" :key="index" class="uni-list-item">
							{{ item.type }} {{ item.text }}
						</view>
					</scroll-view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		components: {
			uniCalendar,
			uniPopup
		},
		data() {
			/**
			 * 时间计算
			 */
			function getDate(date, AddDayCount = 0) {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				let dd = new Date(date)
				dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return y + '-' + m + '-' + d
			}
			let tags = [{
					id: 0,
					name: '农历',
					checked: false,
					attr: 'lunar'
				},
				{
					id: 1,
					name: '固定高度',
					checked: false,
					attr: 'fixedHeihgt'
				},
				{
					id: 2,
					name: '垂直滚动',
					checked: false,
					attr: 'vertical'
				},
				{
					id: 3,
					name: '水平滚动',
					checked: false,
					attr: 'horizontal'
				},
				{
					id: 4,
					name: '开始日期(' + getDate(new Date(), -1) + ')',
					checked: false,
					value: getDate(new Date(), -1),
					attr: 'startDate'
				},
				{
					id: 5,
					name: '结束日期(' + getDate(new Date(), 2) + ')',
					value: getDate(new Date(), 2),
					checked: false,
					attr: 'endDate'
				},
				{
					id: 6,
					name: '禁用今天之前的日期',
					checked: false,
					attr: 'disableBefore'
				},
				{
					id: 7,
					name: '自定义当前日期(' + getDate(new Date(), 1) + ')',
					value: getDate(new Date(), 1),
					checked: false,
					attr: 'date'
				}
			]

			return {
				userName: '',
				token: '',
				user_id: '',
				list: [{
						type: 'type：', // type/status
						text: '1'
					},
					{
						type: 'status：',
						text: '2'
					}
				],
				data: [
					{
						"id": 1,
						"user_id": 1,
						"start_at": "2019-06-02 11:11:11",
						"end_at": "2019-06-03 11:11:11",
						"type": "normal",
						"status": "no"
					},
					{
						"id": 1,
						"user_id": 1,
						"start_at": "2019-06-19 11:11:11",
						"end_at": "2019-06-20 11:11:11",
						"type": "allovertime",
						"status": "leave"
					},
				], //just for test, from backend

				popUp: 'false',
				show: true,
				tags,
				slide: 'none',
				date: '',
				startDate: '',
				endDate: '',
				timeData: {}
			}
		},
		onLoad: function() {
			this.token = uni.getStorageSync('token');
			this.userName = uni.getStorageSync('userName');
			this.user_id = uni.getStorageSync('user_id');
			uni.request({
				url: 'https://www.example.com/shift?user_id=' + this.user_id + '&page=' + 0,
				// data: {
				// 	text: 'uni.request'
				// },
				header: {
					'Authorization': 'Bearer ' + this.token //'Authorization'加引号？
				},
				method: 'GET',
				success: (res) => {
					if (res.data.status == 200) {
						console.log('request success');
						console.log(res.data);
						this.data = res.data.data;
					}
				}
			});
		},
		methods: {
			closeMask() {
				this.show = false
			},
			change(e) {
				console.log('change 返回:', e.fulldate)
				this.timeData = e
			},
			toClick(e) {
				console.log('点击事件', e.fulldate)
				this.popUp = 'true'

				for (var i in this.data) {
					var d = this.data[i]
					var start = d.start_at.toLocaleString().slice(0, 10).replace(/-/g, "\/")
					var end = d.end_at.toLocaleString().slice(0, 10).replace(/-/g, "\/")

					var month = (e.month >= 10) ? '' + e.month : '0' + e.month;
					var day = (e.date >= 10) ? day = '' + e.date : day = '0' + e.date;
					var selectedDate = '' + e.year + '/' + month + '/' + day;
					//debugger;
					if (start <= selectedDate && selectedDate <= end) {
						this.list[0].text = d.type;
						this.list[1].text = d.status;
						break;
					}
					else
					{
						this.list[0].text = 'error';
						this.list[1].text = 'error';
					}
				}

				this.timeData = e
			},
			confirm() {
				this.show = false
			},
			togglePopup(type) {
				this.popUp = type
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

	page {
		background: #fff;
	}

	.calendar-content {
		padding: 20upx 0;
		padding-bottom: 60upx;
		font-size: 26upx;
	}

	.calendar-content>.calendar-title {
		line-height: 80upx;
		/* font-weight: bold; */
		color: #666;
		font-size: 32upx;
		/* border-left: 2px #0d9ebb solid; */
		/* padding-left: 20upx; */
		margin: 0 20upx;
	}

	.calendar-tags-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 10upx;
	}

	.calendar-tags {
		width: 50%;
		box-sizing: border-box;
	}

	.calendar-tags-item {
		padding: 10upx 20upx;
		border: 1px rgba(0, 0, 0, 0.2) solid;
		color: #333;
		border-radius: 10upx;
		text-align: center;
		margin: 10upx;
		background: #f8f8f8;
	}

	.calendar-tags-item:active {
		background: #f8f8f8;
	}

	.checked .calendar-tags-item {
		background: rgb(0, 122, 255);
		color: #fff;
		border: 1px rgba(0, 0, 0, 0.1) solid;
	}

	.calendar-button {
		margin: 10upx 20upx;
	}

	.calendar-info {
		padding: 0 20upx;
	}

	.calendar-mask {
		position: fixed;
		/* #ifdef H5 */
		top: 45px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		bottom: 0;
		display: flex;
		align-items: center;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.calendar-box {
		/* margin: 20upx; */
		border: 1px #f5f5f5 solid;
		/* border-radius: 10upx; */
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.calendar-button-groups {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
	}

	.calendar-button-confirm {
		width: 50%;
		margin: 10upx;
		border: 1px #eee solid;
		font-size: 32upx;
	}

	.calendar-button-confirm:after {
		border: none;
	}
</style>
