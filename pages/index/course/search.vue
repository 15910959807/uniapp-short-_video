<template>
	<view class="page-wrapper">

		<view class="comment-issue">
			<view class="comment-issue-input">
				<uni-icons type="search" size="16" color="#BFBFBF"></uni-icons>
				<input type="text" value="" v-model="searchTitle" @confirm="searchButton()" placeholder="请输入相应病症..." />
			</view>
			<button @click="searchButton" type="default">搜索</button>
		</view>

		<view v-if="this.classification.length>0" class="symptom">
			<view class="symptom-con" v-for="(item2 ,index) in classification" :key="index" @click="clickSymptom(item2.id,index)">
				<view class="symptom-img">
					<u-lazy-load img-mode="widthFix" style="width: 200rpx;height: 150rpx;" border-radius="16" :image="item2.image_url"></u-lazy-load>
				</view>
				<view class="title ellipsis">
					<text>{{item2.title}}</text>
				</view>
			</view>
		</view>
		<view v-else class="search-img">
			<image src="/static/images/shibai.png" mode=""></image>
			<view class="search-text">
				<text>没有相匹配的病症</text>
			</view>
		</view>

		<u-modal class="newNameModal" v-model="show" confirm-color="#333333" :title-style="{color: '#333333'}" @confirm="confirm"
		 title="">
			<view class="slot-content" style="padding: 0rpx 30rpx 40rpx;">
				{{this.cate_prompt}}
			</view>
		</u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				classification: [],
				searchTitle: '',
				last_page: '', //总页数
				page: 2, //上拉加载的起始页(默认从第二页开始加载) 2
				loadingnum: 30, //加载条数
				send: false, //上拉加载的状态  避免数据没更新时重复请求
				// productlist:[],//数据盒子
				show: false,
				cate_prompt: '',
				clickSymptomData: '',
			}
		},
		onShow() {
			this.userInfo = global.userInfo || {};
			// let user_type = userInfo.user_type;
			// console.log(user_type)
		},
		//上拉加载
		onReachBottom() {
			//判断总页数是否大于1
			console.log(this.page)

			let _this = this;
			if (this.last_page > 1) {
				if (this.send == false) {
					if (this.page <= this.last_page) {
						//开始加载
						this.send = true;
						// this.loadings = true;//这个是上拉的特效
						uni.showLoading({
							title: '加载中'
						});
						this.$api.post(global.apiUrls.getWorkType, {
								is_more: 1,
								page: this.page,
								limit: this.loadingnum,
							})
							.then(res => {
								const {
									classification
								} = this;
								console.log(res)
								if (res.data.code == 1) {
									//延迟加载数据 减少并发量
									setTimeout(() => {
										_this.classification = [...classification, ...res.data.data.data];
										_this.send = false;
										console.log(_this.classification, 'classification');
										uni.hideLoading()
									}, 500)
									_this.page++;

								} else {
									this.$message.info('诶呀,加载失败了稍后再试试吧');
									this.send = false;
								}

							}).catch(err => {
								// console.log(res)
								this.send = false;
							})

					} else {
						// this.nodata = true;	//当加载完没数据后 显示无更多数据
					}
				}

			}

		},
		onLoad(e) {
			this.getdata() //获取数据
		},
		methods: {
			open() {
				this.show = true;
			},
			confirm() {
				uni.navigateTo({
					url: '/pages/index/course/symptom?symptom=' + this.clickSymptomData
				})
			},
			//获取数据
			getdata() {
				uni.showLoading({
					title: '加载中'
				});
				// 请求分类
				this.$api.post(global.apiUrls.getWorkType, {
					// 传入参数
					is_more: 1,
					page: 1,
					limit: this.loadingnum
				}).then(res => {
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					// 接口请求成功做些什么
					this.classification = res.data.data.data;
					this.last_page = res.data.data.last_page;
					console.log(this.last_page)

				}).catch(err => {
					// 接口请求失败做些什么
				})
			},
			//分类子级，进入症状自检
			clickSymptom(data,index) {
				this.clickSymptomData = data
				this.cate_prompt = this.classification[index].cate_prompt;
				console.log(this.cate_prompt)
				
				if (this.cate_prompt == "") {
					uni.navigateTo({
						url: '/pages/index/course/symptom?symptom=' + data
					})
				} else {
					
					this.open();
				}
			},
			searchButton() {
				// if (!global.token) {
				//   this.$urouter.navigateTo({
				//     url: '/pages/login/login',
				//     params: {}
				//   })
				//   this.$util.navigateToLogin();
				//   return false
				// }
				var self = this
				console.log(this.searchTitle)
				if (self.searchTitle == '') {
					self.$message.info('搜索内容不能为空')
					return false
				}
				// 搜索结果
				this.$api.post(global.apiUrls.getWorkType, {
					title: this.searchTitle
				}).then(res => {
					this.classification = res.data.data;
					console.log(this.classification)

				})

			},



		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: auto;
		min-height: 100%;
		background: #FFFFFF;

		.page-wrapper {}
	}



	.symptom {
		display: flex;
		flex-wrap: wrap;
		padding: 0 32rpx 0rpx;


		.symptom-con {
			width: 200rpx;
			margin-left: 42rpx;


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
		margin-left: 0rpx;
	}

	.comment-issue {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 32rpx 32rpx;

		.comment-issue-input {
			display: flex;
			align-items: center;
			background-color: #F6F7F9;
			border-radius: 45rpx;
			padding-left: 32rpx;

		}

		input {
			width: 520rpx;
			height: 72rpx;
			box-sizing: border-box;
			border: none !important;
			padding-left: 6rpx;
			color: #BFBFBF;
			font-size: 28rpx;
		}

		button {
			height: 56rpx;
			line-height: 56rpx;
			color: #01CBD3;
			font-size: 28rpx;
			background: rgba(0, 0, 0, 0);
			margin-left: 32rpx;
			padding: 0;

			&::after {
				border: none;
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
