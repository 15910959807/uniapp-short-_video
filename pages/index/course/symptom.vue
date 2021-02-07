<template>
	<view class="page-wrapper">
		<!-- header start -->
		<view class="cu-bar">
			<uni-icons @tap="BackPage" class="action" type="arrowleft" size="24"></uni-icons>

			<view class="cu-bar-center">
				<text>症状自检</text>
			</view>

			<view class="cu-bar-box">

			</view>
		</view>

		<!-- header end -->
		<view class="page-health">
			<view class="health">
				<view class="health-title">
					<view class="title">
						<text>请选择症状</text>
						<text class="title_text">（可多选）</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="this.infoArr.length>1" class="symptom">

			<view class="symptom-con" v-for="(item,index) in infoArr" :key="index" @tap="tapInfo(index,item.id)">
				<view class="symptom-img">
					<u-lazy-load img-mode="widthFix" style="width: 200rpx;height: 150rpx;" border-radius="16" :image="item.image_url"></u-lazy-load>
					<view class="xieyi_txt">
						<view :class="{'cur': rSelect.indexOf(index)!=-1}">
							<uni-icons class="cur1" type="checkbox" size="16" color="#01CBD3"></uni-icons>
							<uni-icons class="cur2" type="checkbox-filled" size="16" color="#01CBD3"></uni-icons>
						</view>
					</view>
				</view>
				<view class="title ellipsis">
					<text>{{item.part_title}}</text>
				</view>
			</view>

		</view>
		<view v-else class="search-img">
			<image src="/static/images/shibai.png" mode=""></image>
			<view class="search-text">
				<text>没有相匹配的病症</text>
			</view>
		</view>


		<button class="symptom_button" @tap="submit(rSelectData)" type="default">确定</button>


	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				rSelect: [],
				infoArr: [],
				rSelectData: [],
				user_token: null,
			}
		},
		onShow() {
			this.userInfo = global.userInfo || null;
			this.user_token = global.token || null;
		},
		onLoad(e) {

			let id = e.symptom;
			console.log(e)
			// 请求分类
			uni.showLoading({
				title: '加载中'
			});
			this.$api.post(global.apiUrls.getWorkTypeSymptom, {
				symptoms_cate_id: id
				// 传入参数
			}).then(res => {
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
				// 接口请求成功做些什么
				this.infoArr = res.data.data;
				// console.log(this.infoArr)
			}).catch(err => {
				// 接口请求失败做些什么
			})


		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			submit(data) {
				// uni.navigateTo({
				//   url: "cure?id=" + data
				// })
				if (data != '') {
					uni.navigateTo({
						url: "cure?id=" + data
					})
				} else {

					this.$message.info('至少选择一种病症');

				}

				// console.log(this.user_token)
				// if( !this.user_token){
				//   uni.navigateTo({
				//     url:"/pages/login/login"
				//   })
				// }else if( userInfo.user_type == 1 ){
				//   if ( data != '' ) {
				//     uni.navigateTo({
				//       url: "cure?id=" + data
				//     })
				//   } else {

				//     this.$message.info('至少选择一种病症');

				//   }
				// }else {

				//   uni.navigateTo({
				//     url:'/pages/index/vip-center-two/index'
				//   })

				// }

				// if( userInfo.user_type == 1 ){
				//   if ( data != '' ) {
				//     uni.navigateTo({
				//       url: "cure?id=" + data
				//     })
				//   } else {

				//     this.$message.info('至少选择一种病症');

				//   }
				// }else {

				//   uni.navigateTo({
				//     url:'/pages/index/vip-center-two/index'
				//   })

				// }

			},
			tapInfo(e, data) {
				console.log(data)
				if (this.rSelect.indexOf(e) == -1) {

					this.rSelect.push(e); //选中添加到数组里
					this.rSelectData.push(data)
				} else {
					this.rSelect.splice(this.rSelect.indexOf(e), 1); //取消
					this.rSelectData.splice(this.rSelectData.indexOf(data), 1)
					// console.log(this.rSelectData)
				}
			}


		}
	}
</script>

<style lang="scss">
	// header start
	.cu-bar {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #FFFFFF;

		.cu-bar-center {
			padding-left: 60rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 700;
		}

		.cu-bar-box {
			width: 130rpx;

		}
	}

	// header end
	.page-health {
		padding-top: 100rpx;
	}

	page {
		width: 100%;
		height: auto;
		min-height: 100%;
		background: #FFFFFF;

		.page-wrapper {}
	}

	// 保健推拿
	.page-health {


		.health {}

		.health-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 40rpx 40rpx 40rpx;

			.title {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				position: relative;
				padding-left: 35rpx;
				flex: 1;

				&:after {
					content: "";
					position: absolute;
					left: 16rpx;
					top: 8rpx;
					width: 8rpx;
					height: 29rpx;
					border-radius: 45rpx;
					background-color: #01CBD3;
				}

				.title_text {
					color: #BFBFBF;
					font-size: 28rpx;
					font-weight: 400;
				}
			}

		}

	}


	.symptom {
		display: flex;
		flex-wrap: wrap;
		padding: 0 32rpx 150rpx;

		.symptom-con {
			width: 200rpx;
			margin-left: 43rpx;


			.symptom-img {
				width: 200rpx;
				height: 150rpx;
				position: relative;

				image {
					width: 200rpx;
					height: 150rpx;
					border-radius: 16rpx;
				}

				.xieyi_txt {
					position: absolute;
					top: 8rpx;
					right: 8rpx;
					z-index: 1;

					.cur2 {
						display: none;
					}

					.cur {
						color: #01CBD3 !important;

						.cur1 {
							display: none;
						}

						.cur2 {
							display: block;
						}
					}
				}
			}

			.title {
				text-align: center;
				padding: 16rpx 0 32rpx;
				color: #333333;
				font-size: 28rpx;
			}
		}
	}

	.symptom-con:nth-child(3n-2) {
		margin-left: 0rpx !important;
	}

	.symptom_button {
		position: fixed;
		left: 50%;
		bottom: 30rpx;
		transform: translate(-50%, 0%);
		background-color: $fu-btn-bg !important;
		border-radius: 44px;
		color: #FFFFFF !important;
		font-size: 32rpx;
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;

		&::after {
			border: none;
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
