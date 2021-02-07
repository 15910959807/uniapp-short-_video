<template>
	<view class="warp">
		<!-- 顶部 -->
		<view class="cu-bar">
			<!-- <view class="" >&#xe7be;</view> -->
			<!-- <uni-icons @tap="BackPage" class="action"  type="arrowleft" size="24"></uni-icons> -->
			<view class="">

			</view>

		</view>
		<!-- //背景图 -->
		<image src="/static/login/login-bg.png" mode="" class="bg_img"></image>
		<view class="login-title">
			<view class="logo">
				<image :src="SYSTEM_CONFIG.logo" mode=""></image>
			</view>
		</view>

		<!-- 验证码登录 -->
		<view class="login-phone form-wapper">
			<view class="phone input-wapper">
				<view class="mobile rside">
					<input focus placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
				</view>
			</view>
			<view class="code input-wapper">
				<view class="rside">
					<input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
					<button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
				</view>
			</view>
			<view class="paw">
				<view @tap="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'login'">账号密码登录</view>
			</view>
		</view>

		<!-- 立即登录按钮 -->
		<!-- <button type="primary" :loading="is_click" class="login-btn" shape="circle" @click="handleLogin">登录</button> -->
		<view type="primary" :loading="is_click" class="login-btn" shape="circle" @click="handleLogin">登录</view>

		<view class="reg-paw">
			<text class="active" @tap="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'register'">注册账号</text>
			<text @click="handleJump" data-type="navigateTo" :data-url="PAGE_BASE_URL + 'forget-password'" class="wj_mh">忘记密码</text>
		</view>

		<!-- 快捷登陆 start -->
		<view class="quick" v-if="is_show_login == 1">
			<view class="quick-title"><text class="line"></text><text class="txt">快捷登录</text><text class="line"></text></view>
			<view class="sanfang">
				<image @click="wxLogin" src="/static/login/login-quick-001.png" mode=""></image>
			</view>
		</view>
		<fu-notwork></fu-notwork>
		<!-- 快捷登陆 end -->
	</view>
</template>
<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	// let _this;
	import {
		validate
	} from '@/common/utils/index';

	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				phone: '', //手机号
				vercode: '', //验证码
				is_click: false,
				verCodeBtnLoading: false, // 是否显示加载图标
				time: 60, //倒计时60S
				beginning: false, //显示倒计时
				PAGE_BASE_URL: '/pages/login/', // 页面基础路径
				timer: null,
				is_show_login:'',
			};
		},
		onShow() {
			this.getPutaway()
		},
		onLoad() {
			this.SYSTEM_CONFIG = global.SYSTEM_CONFIG;
		},
		onUnload() {
			clearInterval(this.timer);
		},
		methods: {
			// 用于苹果上架隐藏三方登录
			getPutaway(){
				this.$api.post(global.apiUrls.getPutaway, {
					
				})
				.then(res => {
					console.log(res)
					if(res.data.code == 1){
						this.is_show_login = res.data.data.is_show_login;
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			// 立即登录
			handleLogin() {
				let _this = this;
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					vercode,
				} = this;
				if (!phone) {
					_this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					_this.$message.info('请输入正确的手机号');
					return false;
				}
				if (!vercode) {
					_this.$message.info('验证码不能为空');
					return false;
				}
				_this.is_click = true;
				_this.$api.post(global.apiUrls.postUserMobileLogin, {
						mobile: phone,
						code: vercode,
					})
					.then(res => {
						if (res.data.code == 1 && res.data.data) {
							_this.$message.info(res.data.msg);
							global.token = res.data.data.userinfo.user_token;
							global.userInfo = res.data.data.userinfo;
							uni.setStorageSync('USER_TOKEN', global.token);
							uni.setStorageSync('USER_INFO', global.userInfo);
							uni.$emit('appLoginSuccess', {
								msg: '登录成功'
							})
							setTimeout(() => {
								// uni.navigateBack();
								uni.reLaunch({
									url: '/pages/tab/index/index',
								});
							}, 500)

						} else {
							_this.$message.info(res.data.msg);
						}
						this.is_click = false;
					})
			},
			//返回上一页
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 发送验证码
			handleSendVerCode() {
				let _this = this;
				let {
					phone
				} = this;
				if (!phone) {
					this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					this.$message.info('请正确输入手机号');
					return false;
				}
				if (this.beginning) return false;
				this.verCodeBtnLoading = true;
				this.$api.post(global.apiUrls.GetVerifyCode, {
						is_test: global.IS_DEV,
						mobile: phone,
						type: 3
					})
					.then(res => {
						_this.verCodeBtnLoading = false;
						if (res.data.code == 1) {
							this.beginning = true;
							//开始倒计时
							clearInterval(_this.timer);
							_this.timer = setInterval(() => {
								if (_this.time == 1) {
									//倒计时结束
									clearInterval(_this.timer);
									_this.time = 60;
									_this.beginning = false;
									return;
								}
								_this.time--;
							}, 1000);
							_this.$message.info('验证码已发送到您的手机，请注意查收。')
						} else {
							_this.$message.info(res.data.msg);
						}
					}).catch(function(err) {
						console.log(err);
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
							console.log(res)
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
					this.$message.info('请安装微信后再使用此功能')
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
								// console.log(infoRes.userInfo.unionId,'app微信登录')
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
										//   // uni.reLaunch({
										//   //   url: '/pages/user/user/my',
										//   // })
										// },500)
										setTimeout(() => {
											uni.reLaunch({
												url: '/pages/tab/index/index'
											});
										}, 500)

									} else if (res.data.code == -999) {

										_this.$urouter.redirectTo({
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
						uni.hideLoading()
						console.log(err)
					}
				});
			}
		}
	}
</script>
<style lang="scss">
	// 头部返回键
	.cu-bar .action {
		position: relative;
		z-index: 5;
	}

	// 主体 start
	.warp {
		background: #fff;
		min-height: 100vh;

		.login_tit {
			margin-top: 28upx;
			font-size: 30upx;
			color: #333;
			font-weight: 700
		}

		.bg_img {
			width: 100%;
			height: 441upx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2
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
		}

		.form-wapper,
		.logo {
			width: 100%;
			box-sizing: border-box
		}

		.form-wapper {
			position: relative;
			padding: 92upx 32rpx 20upx;
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

				.rside {
					flex: 1
				}

				.iconfont {
					font-size: 40upx;
					color: #bfbfbf
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
					color: #999
				}

				.icon-yanjing1.act {
					color: $fu-main-color
				}

				.icon-yanjing1.act:before {
					content: "\e681"
				}
			}

			.yanZhengMa {
				position: absolute;
				padding: 0;
				right: 0;
				color: $fu-main-color;
				font-size: 24rpx;
				background: none;
				height: 100rpx;
				line-height: 100rpx;
				top: 0;
				padding-right: 32rpx;

				&:after {
					border: none
				}
			}

			.paw {
				line-height: 80upx;
				width: 100%;
				height: 80upx;
				margin: 0;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				color: $fu-main-color;
				font-size: 24rpx;
				padding-right: 28rpx;
			}
		}

		.login-btn {
			display: block;
			line-height: 90upx;
			text-align: center;
			margin: 0 75upx;
			height: 90upx;
			font-size: 32upx;
			color: #fff;
			background: $fu-main-color;
			opacity: 1;
			border-radius: 50upx;
			background-blend-mode: normal, normal;

			&:after {
				border: 0
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

		.quick {
			text-align: center;

			.quick-title {
				margin: 60upx 0 50upx;
				display: flex;
				align-items: center;
				justify-content: center;

				.txt {
					font-size: 28upx;
					color: #BFBFBF;
					padding: 0 20upx
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
						transform: scaleY(0.5);
						transform-origin: 0 0
					}
				}
			}

			image {
				width: 80upx;
				height: 80upx;
				margin: 0 35upx
			}
		}
	}

	// 主体 end
</style>
