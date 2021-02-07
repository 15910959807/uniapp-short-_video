<template>
	<view class="page-wrapper">
		<!-- 轮播 -->
		<view class="page-swiper">
			<swiper style="height: 442rpx;" class="swiper" :autoplay="true" :circular="true" :interval="5000" :duration="500"
			 :current="swiperCurrent" @change="changeSwiper">
				<swiper-item v-if="index<3" v-for="(item,index) in swiperImg" :key="index">
					<image class="swiper-item" :src="item.thumb_url" mode="widthFix" @click="bannerDetail(item.href_type,item.href)"></image>
				</swiper-item>
			</swiper>
			<!-- 轮播指示点样式修改 -->
			<view class="dots">
				<block v-if="index<3" v-for="(item,index) in swiperImg.length" :key="index">
					<view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
				</block>
			</view>
		</view>
		<view class="page-health">
			<view class="health">
				<view class="health-title" @click="clickSearch()">
					<view class="title">
						<text>保健推拿</text>

					</view>
					<view class="more">
						<text>查看更多</text>
						<image src="/static/images/more.png" mode=""></image>
					</view>
				</view>

				<view class="health-content">
					<view class="list" v-for="(item2 ,index) in classification" :key="index" v-if="index<8" @click="clickSymptom(item2.id,index)">
						<view class="list_img">
							<!-- <image :src="item2.image_url" mode=""></image> -->
							<u-lazy-load img-mode="widthFix" style="width: 153rpx;height: 104rpx;" border-radius="16" :image="item2.image_url"></u-lazy-load>
						</view>
						<view class="ellipsis">
							<text>{{item2.title}}</text>
						</view>
					</view>
				</view>

			</view>
		</view>

		<view class="">
			<view v-if="user_token" class="">
				<view v-if="userInfo.user_type == 0" class="vip-banner">
					<u-lazy-load @click="clickVip()" img-mode="widthFix" style="width: 686rpx;height: 185rpx;" image="/static/images/banner2.png"></u-lazy-load>
				</view>
				<view v-else></view>
			</view>
			<view v-else class="">
				<view class="vip-banner">
					<u-lazy-load @click="clickLogin()" img-mode="widthFix" style="width: 686rpx;height: 185rpx;" image="/static/images/banner2.png"></u-lazy-load>
				</view>
			</view>
		</view>

		<view class="page-health" style="height: auto;">
			<view class="health">
				<view class="health-title" @tap="recommendList()">
					<view class="title">
						<text>资讯推送</text>

					</view>
					<view class="more">
						<text>查看更多</text>
						<image src="/static/images/more.png" mode=""></image>
					</view>
				</view>
				<view class="recommend_xian">

				</view>

				<view class="recommend-swiper">
					<swiper style="height: 222rpx;min-height: 222rpx;" class="screen-swiper" :autoplay="true" :circular="true"
					 :interval="5000" :duration="500" :current="swiperCurrenta" @change="changeSwipera">
						<swiper-item v-if="index<6" v-for="(item3 ,index) in article" :key="item3.id" @click="recommend(item3.id)">
							<view class="swiper-item recommend-item">
								<view class="left">
									<image :src="item3.image_url" mode=""></image>
								</view>
								<view class="right">
									<view class="title ellipsis">
										<text>{{item3.title}}</text>
									</view>
									<view class="text ellipsis">
										<text>{{item3.article_create_time}}</text>
									</view>
								</view>
							</view>
						</swiper-item>


					</swiper>
					<!-- 轮播指示点样式修改 -->
					<view class="dotsa">
						<block v-if="index<6" v-for="(item3,index) in article.length" :key="item3">
							<view class="dota" :class="index==swiperCurrenta ? ' activea' : ''"></view>
						</block>
					</view>
				</view>
			</view>
		</view>
		
		<u-modal class="newNameModal"
		v-model="show" 
		confirm-color="#333333" 
		:title-style="{color: '#333333'}" 
		@confirm="confirm"
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
				userInfo: {}, // 当前登录用户的用户信息
				user_token: '',
				user_type: "",
				info: [],
				classification: [],
				article: [],
				image_url: "",
				swiperImg: [],
				current: 0,
				swiperCurrent: 0,
				swiperCurrenta: 0,
				show: false,
				cate_prompt: '',
				clickSymptomData:'',
			}
		},
		onShow() {
			this.userInfo = global.userInfo || {};
			this.user_token = global.token || null;
			// console.log(this.user_token)
		},
		onLoad() {
			// 请求banner轮播
			uni.showLoading({
				title: '加载中'
			});
			this.$api.post(global.apiUrls.getIndexImages, {
				// 传入参数
			}).then(res => {
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
				// 接口请求成功做些什么
				this.swiperImg = res.data.data;
			}).catch(err => {
				// 接口请求失败做些什么
			})
			// 请求分类
			this.$api.post(global.apiUrls.getWorkType, {
				// 传入参数
			}).then(res => {
				// 接口请求成功做些什么
				this.classification = res.data.data;
				// console.log(this.classification)
			}).catch(err => {
				// 接口请求失败做些什么
			})
			// 请求推送轮播
			this.$api.post(global.apiUrls.postArticleList, {
				// 传入参数
			}).then(res => {
				// 接口请求成功做些什么
				this.article = res.data.data;
				// console.log(this.articleLength)
			}).catch(err => {
				// 接口请求失败做些什么
			})

		},
		onReady() {
			// uni.hideLoading();
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
			// banner详情文章
			bannerDetail(a, b) {
				// console.log(a,b)
				let href_type = a;
				let id = b;
				console.log(href_type, id)
				if (href_type == 1) {
					uni.navigateTo({
						url: '/pages/index/details/index?detail=' + id
					})
				} else if (href_type == 2) {
					uni.navigateTo({
						url: '/pages/index/course/course?detail=' + id
					})
				}
			},
			// 登录页面
			clickLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			// vip充值页面
			clickVip() {
				uni.navigateTo({
					url: '/pages/index/vip-center-two/index'
				})
			},
			//分类子级，进入症状自检
			clickSymptom(data, index) {
				// console.log(index)
				this.clickSymptomData = data
				this.cate_prompt = this.classification[index].cate_prompt;
				// console.log(this.cate_prompt)

				if (this.cate_prompt == "") {
					uni.navigateTo({
						url: '/pages/index/course/symptom?symptom=' + data
					})
				} else {
					
					this.open();
				}

			},
			//查看更多进去推送中心
			recommendList(id) {
				uni.navigateTo({
					url: '/pages/index/consult/index'
				})
			},
			//查看更多进去推送中心详情
			recommend(id) {
				uni.navigateTo({
					url: '/pages/index/details/index?detail=' + id
				})
			},
			//查看更多进入分类进去搜索页面
			clickSearch() {
				uni.navigateTo({
					url: '/pages/index/course/search'
				})
			},
			// banner 轮播图
			changeSwiper(e) {
				// console.log(e)
				this.swiperCurrent = e.detail.current;
			},
			// 推送 轮播图
			changeSwipera(index) {
				this.swiperCurrenta = index.detail.current;
			}

		}
	}
</script>

<style lang="scss">
	@import './index.scss';
</style>
