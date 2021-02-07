<template>
	<view class="warp">
		<!-- header start -->
		<view class="cu-bar">
			<uni-icons @click="BackPage" class="action" type="arrowleft" size="24"></uni-icons>
			<view class="cu-header-content"></view>
			<view class="home-topbar-right"><text></text></view>
		</view>
		<!-- header end -->

		<!-- 背景图 start -->
		<image src="/static/login/login-bg.png" mode="" class="bg_img"></image>
		<view class="login-title">
			<view class="logo">
				<image :src="SYSTEM_CONFIG.logo" mode=""></image>
			</view>
		</view>
		<!-- 背景图 end -->

		<!-- 账号密码登录  satrt -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="mobile rside">
					<input focus placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
				</view>
			</view>
			<view class="phone input-wapper">
				<view class="mobile rside" style="display: flex;justify-content: space-between;width: 100%;height: 100%;align-items: center;">
					<input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'password'" type="password" v-model="password"
					 placeholder="请输入密码(6-12位)" minlength="6" maxlength="12" />
					<input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'text'" type="text" v-model="password"
					 placeholder="请输入密码(6-12位)" minlength="6" maxlength="12" />
					<view class="yanjing">
						<!-- <text>&#xe7e6;</text> -->
						<image src="/static/login/yanjing2.png" mode="" class="iconfont yanjing2" :data-type="type" @click.stop="is_kejian"
						 v-if="type == 'text'"></image>
						<image src="/static/login/yanjing1.png" mode="" class="iconfont yanjing1" :data-type="type" @click.stop="is_kejian"
						 v-if="type == 'password'"></image>
						<!-- <text>&#xe7e9;</text> -->
					</view>
				</view>
			</view>
			<view class="paw">
				<view class="btn" @tap="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'login-code'">验证码登录</view>
			</view>
		</view>
		<!-- 账号密码登录 end -->
		<!-- <button type="primary" :loading="is_click" hover-class="login-btn-bg" class="login-btn" @tap="reg">登录</button> -->
		<view :loading="is_click" class="login-btn" @tap="reg">
			登录
		</view>

		<view class="reg-paw">
			<text class="active" @tap="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'register'">注册账号</text>
			<text @click="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'forget-password'" class="wj_mh">忘记密码</text>
		</view>

		<!-- 快捷登录 start -->
		<view class="quick" v-if="is_show_login == 1">
			<view class="quick-title"><text class="line"></text><text class="txt">快捷登录</text><text class="line"></text></view>
			<view class="sanfang">
				<image @click="wxLogin" src="/static/login/login-quick-001.png" mode=""></image>
			</view>
		</view>

		<!-- 快捷登录 end -->
		<fu-notwork></fu-notwork>
	</view>
</template>
<script>
	let _this
	import {
		validate
	} from '@/common/utils/index'
	import {
		mapState,
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				phone: '', //手机号
				password: '', //密码
				is_click: false, //加载动画
				type: 'password', //密码类型
				PAGE_BASE_URL: '/pages/login/', // 页面基础路径
				is_show_login: '',
			};
		},
		computed: {
			...mapState(['isLogin', 'is_language']),
		},
		onShow() {
			this.getPutaway()
		},
		onLoad() {
			_this = this;
			this.SYSTEM_CONFIG = global.SYSTEM_CONFIG;
		},
		methods: {
			// 用于苹果上架隐藏三方登录
			getPutaway() {
				this.$api.post(global.apiUrls.getPutaway, {

					})
					.then(res => {
						console.log(res)
						if (res.data.code == 1) {
							this.is_show_login = res.data.data.is_show_login;
						}
					}).catch(function(err) {
						console.log(err);
					})
			},
			//切换可见
			is_kejian(e) {
				let type = e.currentTarget.dataset.type;
				if (type == 'password') {
					_this.type = 'text';
				} else {
					_this.type = 'password';
				}
			},
			//返回上一页
			BackPage() {
				uni.switchTab({
					url: "/pages/tab/index/index"
				})
			},
			//登录
			reg() {
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					password
				} = _this;
				if (!phone) {
					_this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					_this.$message.info('请输入正确的手机号');
					return false;
				}
				if (!validate(password, 'password')) {
					_this.$message.info('请输入字母加数字6-12位密码');
					return false;
				}
				_this.is_click = true;
				console.log('phone', phone)
				_this.$api.post(global.apiUrls.loginByAccount, {
					mobile: phone,
					password
				}).then(res => {
					_this.is_click = false;
					if (res.data.code == 1 && res.data.data) {
						_this.$message.info(res.data.msg);
						global.token = res.data.data.userinfo.user_token
						global.userInfo = res.data.data.userinfo
						uni.setStorageSync('USER_TOKEN', global.token)
						uni.setStorageSync('USER_INFO', global.userInfo)
						uni.$emit('appLoginSuccess', {
							msg: '登录成功',
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/tab/index/index'
							});
						}, 500)
					} else {
						_this.$message.info(res.data.msg);
					}
				})
			},
			// 微信登录
			wxLogin() {
				// this.$message.info("三方接口审核中，等待对接");
				// return
				let _this = this;
				// #ifdef APP-PLUS
				if (plus.runtime.isApplicationExist({
						pname: 'com.tencent.mm',
						action: 'weixin://'
					})) {
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							//支持微信、qq和微博等
							if (~res.provider.indexOf('weixin')) {
								_this.wx_login_fn();
							}
						},
						fail: function(err) {
							console.log(err)
						}
					});
				} else {
					_this.$api.msg('请安装微信后再使用此功能')
				}
				// #endif
			},
			//微信授权登录
			wx_login_fn() {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								uni.showLoading({
									title: '加载中'
								})
								let {
									nickName,
									avatarUrl,
									gender
								} = infoRes.userInfo;
								// #ifdef APP-PLUS
								// let  clientId = plus.push.getClientInfo().clientid || '';
								let appSystem = uni.getSystemInfoSync().platform == 'ios' ? 1 : 2;
								// #endif
								_this.$api.post(global.apiUrls.postUserSocialLogin, {
									type: 1,
									wx_unionid: infoRes.userInfo.unionId,
									qq_unionid: '',
									wb_unionid: '',
									// clientId: clientId || '',
									appSystem: appSystem || '',
									nickname: nickName,
									avatar: avatarUrl,
									gender: gender,
								}).then(res => {
									global.tempUserLoginInfo = infoRes.userInfo;
									uni.hideLoading();
									if (res.data.code == 1) {
										_this.$message.info(res.data.msg);
										global.token = res.data.data.userinfo.user_token
										global.userInfo = res.data.data.userinfo
										uni.setStorageSync('USER_TOKEN', global.token)
										uni.setStorageSync('USER_INFO', global.userInfo)
										// setTimeout(()=>{
										//             uni.navigateBack();
										// },500)
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/tab/index/index'
											});
										}, 500)

									} else if (res.data.code == -999) {
										_this.$message.info(res.data.msg);
										_this.$urouter.navigateTo({
											url: _this.PAGE_BASE_URL + 'bind-phone',
											params: {
												unionId: infoRes.userInfo.unionId,
												openId: infoRes.userInfo.openId,
												sex: infoRes.userInfo.gender,
												nickName: infoRes.userInfo.nickName,
												avatarUrl: infoRes.userInfo.avatarUrl,
												authType: 'wx_unionid',
											}
										})
										// 点击手机号账号登录按钮
									} else if (res.code == -1) {
										_this.$message.info(res.data.msg);
										return;
									}
								}).catch(err => {
									uni.hideLoading();
									console.log(err)
								});
							}
						});
					},
					error: function(err) {
						console.log(err)
						uni.hideLoading()
					}
				});
			},

			// 禁止返回按钮
			onBackPress() {
				setTimeout(() => {
					uni.switchTab({
						url: "/pages/tab/index/index"
					})
				}, 0)

			},
		}
	};
</script>
<style lang="scss">
	// header start
	.cu-bar {
		z-index: 9;


	}

	// header end
	.warp {
		background: #fff;
		min-height: 100vh;

		// header start
		// .cu-header-content {position: absolute;left: 50%;transform: translateX(-50%);font-size: 36upx;color: #333;}
		// .home-topbar-right {margin-right: 30upx;color: $fu-main-color;}
		// header end
		.login_tit {
			margin-top: 28upx;
			font-size: 30upx;
			color: #333;
			font-weight: 700
		}

		// 背景图 start
		.bg_img {
			width: 100%;
			height: 441upx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 0;
		}

		.login-title {
			position: relative;
			z-index: 9;

			.logo {
				width: 158rpx;
				height: 158rpx;
				box-sizing: border-box;
				font-size: 56upx;
				font-weight: 500;
				margin: 88rpx auto 0;
				background-color: #35D3D4;
				border-radius: 32rpx;

				image {
					width: 158rpx;
					height: 158rpx;
					border-radius: 32rpx;
				}
			}

			/* #ifdef MP */
			.logo {
				padding-top: 232upx;
			}

			/* #endif */
		}

		// 背景图 end

		.form-wapper {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			padding: 92upx 32upx 40upx;
			border-radius: 10upx;
			z-index: 99;

			.input-wapper {
				display: flex;
				flex-direction: row;
				width: 100%;
				flex-wrap: wrap;
				align-items: center;
				position: relative;
				color: #333;
				height: 100rpx;
				background-color: #F9FAFC;
				border-radius: 45rpx;
				padding-left: 67rpx;
				margin-top: 56rpx;
				border: none;
				padding-right: 40rpx;

				.lside {
					width: 54upx;
					text-align: left;
				}

				.rside {
					flex: 1;
				}

				.iconfont {
					font-size: 40upx;
					color: #BFBFBF;
					line-height: 100rpx;
				}

				input {
					height: 100rpx;
					box-sizing: border-box;
					border: none !important;
					width: 100%;
					background-color: #F9FAFC;
				}

				.input-placeholder {
					color: #BFBFBF;
					font-size: 32upx;
					font-weight: 400;
					background: #F9FAFC;
				}

				.icon-yanjing1 {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translate(0, -50%);
					color: #999;
				}

				.icon-yanjing1.act {
					color: $fu-main-color;
				}

				.icon-yanjing1.act:before {
					content: "\e681";
				}

				.get-code-btn {
					border: 0;
					background: #fff;
					font-size: 24upx;
					color: $fu-main-color;
					text-align: right;
					padding-left: 0;
					padding-right: 0;

					&:after {
						border: 0;
					}
				}

				.yanjing {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 38rpx;

					.yanjing1 {
						width: 38rpx;
						height: 20rpx;
					}

					.yanjing2 {
						width: 38rpx;
						height: 38rpx;
					}
				}
			}

			.paw {
				line-height: 80upx;
				width: 94%;
				height: 80upx;
				margin: 0 3%;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				color: $fu-main-color;
				font-size: 24rpx;
			}
		}

		.login-btn {
			width: 480rpx;
			display: block;
			line-height: 90upx;
			text-align: center;
			margin: 0 75upx;
			height: 88rpx;
			font-size: 32rpx;
			color: #fff;
			background: $fu-main-color;
			border-radius: 50upx;
			background-blend-mode: normal, normal;
			margin: 0 auto;

			&:after {
				border: 0;
			}
		}

		.reg-paw {
			margin: 20upx 0;
			text-align: center;

			text {
				font-size: 24upx;
				display: inline-block;
				color: #BFBFBF;
				position: relative;
				padding: 20rpx 24rpx;
			}

			.wj_mh:before {
				position: absolute;
				height: 26upx;
				width: 1px;
				background: #EEEEEE;
				content: '';
				left: 0;
				top: 28upx;
			}

			.active {
				color: $fu-main-color;
			}
		}

		// 快捷登录 start
		.sanfang {
			display: flex;
			align-items: center;
			justify-content: center;

			.iconfont {
				font-size: 72upx;
				opacity: 0.7;
				color: #58d81f;
				margin: 0 40rpx;
			}
		}

		.quick {
			text-align: center;

			.quick-title {
				margin: 50upx 0 50upx 0;
				display: flex;
				align-items: center;
				justify-content: center;

				.txt {
					font-size: 28upx;
					color: #BFBFBF;
					padding: 0 20upx;
				}

				.line {
					display: block;
					width: 160upx;
					position: relative;

					&:after {
						content: '';
						position: absolute;
						z-index: 0;
						bottom: 0;
						left: 0;
						width: 100%;
						border-bottom: 1px solid #eee;
						-webkit-transform: scaleY(0.5);
						transform: scaleY(0.5);
						-webkit-transform-origin: 0 0;
						transform-origin: 0 0;
					}
				}
			}

			image {
				width: 80upx;
				height: 80upx;
				margin: 0 35upx;
			}
		}

		// 快捷登录 end
	}
</style>
