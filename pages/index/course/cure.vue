<template>
	<view class="page-wrapper">
		<view class="page-header">

			<view class="page-matters">
				<text>{{matters != '' ? '注意事项：'+ matters : '注意事项：'+'暂无注意事项'}}</text>
			</view>

		</view>

		<view class="page-content">



			<view v-if="cure.length>0" class="">

				<view class="">
					<view class="content" v-for="(item,index) in cure" :key="index" @click="clickVideo(item.id,item.recipe_id)">
						<view class="left">
							<view class="content-icon">
								<text>会员免费</text>
							</view>
							<u-lazy-load img-mode="widthFix" style="width: 180rpx;height: 180rpx;" border-radius="16" :image="item.image"></u-lazy-load>
						</view>
						<view class="right">
							<view class="title">
								<text>{{item.title}}</text>
							</view>
							<view class="text">
								<text>{{item.simple_desc}}</text>
							</view>
							<view class="right_duration">
								<view class="right_duration_text">
									按摩时长{{item.duration}}分钟
								</view>
								<view class="">
									<button type="default">查看</button>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- <view v-if="vipcode == -99" class="search-img">
          <image src="/static/empty/empty10.png" mode=""></image>
          <view class="search-text">
            <text>您还不是会员，无法查看视频</text>
          </view>
        </view> -->

			</view>

			<view v-else class="search-img">
				<image src="/static/images/shibai.png" mode=""></image>
				<view class="search-text">
					<!-- <text>没有相匹配的治疗方法</text> -->
					<text>{{prompt}}</text>
				</view>
			</view>







		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				cure: [],
				matters: '',
				image_url: '',
				vipcode: '',
				prompt: '',
			}
		},
		onShow() {

		},
		onLoad(option) {
			this.id = option.id;
			console.log(this.id)
			this.getdata();
		},



		methods: {

			// 请求分类
			getdata() {
				uni.showLoading({
					title: '加载中'
				});
				this.$api.post(global.apiUrls.getWorkTypeSymptomCure, {
					// 传入参数
					bind_ids: this.id,
					is_more: 1,

				}).then(res => {
					// setTimeout(function () {
					uni.hideLoading();
					// }, 500);
					if (res.data.code == -99) {
						this.$message.info(res.data.msg);
						this.vipcode = res.data.code;
						// setTimeout(function(){
						uni.redirectTo({
							url: '/pages/index/vip-center-two/index'
						})
						// },1000);

					} else {
						// 接口请求成功做些什么
						this.cure = res.data.data.list;
						this.matters = res.data.data.matters;
						this.user_type = res.data.user.user_type;
						this.prompt = res.data.data.prompt;
						console.log(this.prompt)
					}


					// console.log(this.cure)
				}).catch(err => {
					// 接口请求失败做些什么
				})
			},



			clickVideo(a, b) {
				console.log(a, b)
				// const detail={ id:a,bind_id:b};
				uni.navigateTo({
					url: 'course?id=' + a + '&bind_id=' + b

				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: auto;
		min-height: 100%;
		background: #F6F7F9 !important;

		.page-wrapper {}
	}

	.page-matters {
		background-color: #DFEFFF;
		padding: 24rpx 32rpx;

		text {
			color: #007FFF;
			font-size: 28rpx;
		}
	}

	.page-content {
		padding: 0rpx 32rpx;

		.content {
			padding: 32rpx;
			margin-top: 20rpx;
			border-radius: 16px;
			display: flex;
			background-color: #FFFFFF;

			.left {
				width: 180rpx;
				height: 180rpx;
				border-radius: 16rpx;
				position: relative;

				.content-icon {
					position: absolute;
					left: 0rpx;
					top: 0rpx;
					z-index: 1;
					color: #FFFFFF;
					font-size: 20rpx;
					background: #01CBD3;
					border-radius: 16rpx 0rpx 16rpx 0rpx;
					padding: 2rpx 10rpx;
				}

				image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 18rpx;
				}
			}

			.right {
				width: 100%;
				padding-left: 24rpx;

				.title {
					display: flex;
					color: #333333;
					font-size: 32rpx;
					margin-bottom: 16rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;

					.time {
						margin-left: 24rpx;
					}
				}

				.text {
					color: #999999;
					font-size: 24rpx;
					line-height: 33rpx;
					margin-bottom: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;


				}

				.right_duration {
					display: flex;
					justify-content: space-between;

					.right_duration_text {
						font-size: 24rpx;
						line-height: 48rpx;
					}

				}

				button {
					background: #01CBD3;
					border-radius: 36rpx;
					width: 112rpx;
					height: 48rpx;
					line-height: 48rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					// display: flex;
					// text-align: center;
					// justify-content: center;
					// float: right;

					&::after {
						border: none;
					}
				}
			}
		}
	}

	.search-img {
		padding: 100rpx 32rpx 0;

		image {
			width: 100%;
			margin: 0 auto;
		}

		.search-text {
			margin-top: -80rpx;
			color: #6E7A7C;
			font-size: 24rpx;
			text-align: center;
		}

	}
</style>
