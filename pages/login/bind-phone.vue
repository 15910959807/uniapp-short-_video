<template>
  <view class="warp">
    <!-- <view class="cu-bar">
			<view class="action fu-iconfont" @tap="BackPage">&#xe7be;</view>
			<view class="cu-header-content"></view>
			<view class="home-topbar-right"><text></text></view>
		</view> -->
    <!-- //背景图 -->
    <!-- <image src="/static/login/login-bg.png" mode="" class="bg_img"></image>
		<view class="login-title">
			<view class="logo">
		    <image src="" mode=""></image>
		  </view>
		</view> -->

    <!-- 绑定手机号 -->
    <view class="login-phone form-wapper">
      <view class="phone input-wapper">
        <view class="iconfont_text">
          <text class="iconfont icon-shoujihao"></text>
        </view>
        <view class="mobile rside"><input focus placeholder-class="input-placeholder" type="number" v-model="phone"
            placeholder="请输入手机号" maxlength="11" /></view>
      </view>
      <view class="code input-wapper">
        <view class="iconfont_text">
          <image src="/static/login/yan_zheng_ma.png" mode=""></image>
        </view>
        <view class="rside">
          <input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
          <button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
        </view>
      </view>
      <view class="phone input-wapper">
        <view class="iconfont_text">
          <text class="iconfont icon-mima"></text>
        </view>
        <view class="mobile rside" style="display: flex;justify-content: space-between;width: 100%;height: 100%;align-items: center;">

          <input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'password'" type="password"
            v-model="password" placeholder="请输入字母加数字(6-12位)" minlength="6" maxlength="12" />
          <input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'text'" type="text" v-model="password"
            placeholder="请输入字母加数字(6-12位)" minlength="6" maxlength="12" />
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
      <!-- <block v-if="is_invite_code == '1'">
				<view class="code input-wapper">
					<view class="rside"><input placeholder-class="input-placeholder" @input="edti" type="text" maxlength="12" v-model="invite_code" placeholder="请输入邀请码" /></view>
				</view>
			</block> -->
    </view>

    <!-- 立即登录 -->
    <!-- <button type="primary" :loading="is_click" class="login-btn" @tap="handleLogin" style="margin-top: 24upx;">登录</button> -->
    <view type="primary" :loading="is_click" class="login-btn" @tap="handleLogin" style="margin-top: 24upx;">登录</view>
    <fu-notwork></fu-notwork>
  </view>
</template>
<script>
  import {
    validate
  } from '@/common/utils/index';
  let _this;
  export default {
    data() {
      let is_invite_code = uni.getStorageSync('is_invite_code');
      return {
        openid: '', //openid
        nickname: '', //昵称
        head_img_url: '', //头像图片
        sex: '', //性别
        phone: '', //手机号
        vercode: '', //验证码
        password: '', //密码
        loginBtnLoading: false, // 登录按钮加载动画
        verCodeBtnLoading: false,
        time: 60, //倒计时60S
        beginning: false, //显示倒计时
        is_click: false,
        type: 'password', //密码类型
        is_agree: false, // 协议
        invite_code: '', //邀请码
        is_invite_code: true, //是否显示邀请码,
        authType: '',
      };
    },
    onLoad(option) {
      _this = this;
      this.openid = option.openId;
      this.nickname = option.nickName;
      this.head_img_url = option.avatarUrl;
      this.sex = option.sex;
      this.unionId = option.unionId;
      this.authType = option.authType || '';

      console.log(option)
    },
    methods: {
      //密码是否可见
      is_kejian(e) {
        let type = e.currentTarget.dataset.type;
        if (type == 'password') {
          this.type = 'text';
          this.xianshi = true;
        } else {
          this.type = 'password';
          this.xianshi = false;
        }
      },
      //返回上一页
      BackPage() {
        uni.navigateBack({
          delta: 1
        });
      },
      edti(e) {
        e.detail.value = e.detail.value.replace(/[\u4e00-\u9fa5]/gi, ' ');
        this.invite_code = e.detail.value;
      },
      // 发送验证码
      handleSendVerCode() {
        let {
          phone
        } = this;
        if (!phone) {
          _this.$message.info('请输入手机号');
          return false;
        }
        if (!validate(phone, 'phone')) {
          _this.$message.info('请输入正确的手机号');
          return false;
        }
        if (this.beginning) return false;
        if (_this.verCodeBtnLoading) return false;
        this.verCodeBtnLoading = true;
        this.beginning = true;
        console.log(this.authType)
        this.$api
          .post(global.apiUrls.GetVerifyCode, {
            is_test: global.IS_DEV,
            mobile: phone,
            type: 5,
            auth_type: this.authType,

          })
          .then(res => {
            this.verCodeBtnLoading = false;
            if (res.data.code == 1) {
              clearInterval(_this.timer);
              //开始倒计时
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
              _this.$message.info('验证码为' + phone + '请注意查收');
            } else {
              clearInterval(_this.timer);
              _this.beginning = false;
              _this.$message.info(res.data.msg);
            }
          });
      },
      // 绑定
      handleLogin() {
        // #ifdef APP-PLUS
        plus.key.hideSoftKeybord();
        // #endif
        if (this.is_click) {
          return;
        }
        let {
          phone,
          vercode,
          password,
          openid,
          nickname,
          head_img_url,
          sex,
          type,
          unionId,
          invite_code
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
        if (!validate(password, 'password')) {
          _this.$message.info('请输入6-12位密码');
          return false;
        }
        // if(invite_code){
        // 	if (!validate(invite_code, 'invitecode')) {
        // 		_this.$message.info('请输入正确格式的邀请码');
        // 		return false;
        // 	}
        // }
        // #ifdef APP-PLUS
        // let clientId = plus.push.getClientInfo().clientid || '';
        // console.log(clientId)
        // #endif
        this.is_click = true;
        _this.$api
          .post(global.apiUrls.loginByWechat, {
            unionId: unionId,
            mobile: phone,
            openId: openid,
            nickName: nickname,
            avatarUrl: head_img_url,
            gender: sex,
            password: password,
            type: 5,
            code: vercode,
            province: '',
            // client_id: clientId,
            city: '',
            invite_code: invite_code,
          })
          .then(res => {
            if (res.data.code == 1 && res.data.data) {
              global.token = res.data.data.userinfo.user_token;
              global.userInfo = res.data.data.userinfo;
              uni.setStorageSync('USER_TOKEN', global.token);
              uni.setStorageSync('USER_INFO', global.userInfo);
              setTimeout(() => {
                // uni.navigateBack();
                uni.reLaunch({
                  url: '/pages/tab/index/index'
                });
              }, 500);
              _this.$message.info(res.data.msg);
            } else {
              _this.$message.info(res.data.msg);
            }
            this.is_click = false;
          });
      }
    }
  };
</script>
<style lang="scss">
  // 头部返回键
  .cu-bar .action {
    position: relative;
    z-index: 5;
  }

  // 主体
  .warp {
    background: #F6F7F9;

    .login_tit {
      margin-top: 28upx;
      font-size: 30upx;
      color: #333;
      font-weight: bold;
    }

    .bg_img {
      width: 100%;
      height: 441upx;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
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
        }
      }

      /* #ifdef MP */
      .logo {
        padding-top: 232upx;
      }

      /* #endif */
    }

    .form-wapper {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      border-radius: 10upx;
      z-index: 99;
      background-color: #FFFFFF;
      padding: 0 32rpx;

      .input-wapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
        align-items: center;
        position: relative;
        color: #333;
        height: 109rpx;
        background-color: #FFFFFF;
        border: none;
        border-bottom: 1rpx solid #EEEEEE;

        .iconfont_text {
          padding-right: 16rpx;
          display: flex;
          align-items: center;
          width: 60rpx;

          image {
            width: 32rpx;
            height: 32rpx;
          }

          text {
            color: #333333;
            font-weight: bold;
          }
        }

        .rside {
          flex: 1;

        }

        .iconfont {
          font-size: 40upx;
          color: #BFBFBF;
          line-height: 109rpx;
        }

        input {
          height: 109rpx;
          box-sizing: border-box;
          border: none !important;
          width: 100%;
        }

        .input-placeholder {
          color: #BFBFBF;
          font-size: 32upx;
          font-weight: 400;
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
          content: '\e681';
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

      position: relative;

      .yanZhengMa {
        position: absolute;
        padding: 0;
        right: 0;
        color: $fu-main-color;
        font-size: 24rpx;
        background: none;
        height: 109rpx;
        line-height: 109rpx;
        top: 0;

        &:after {
          border: none
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
        font-size: 24upx;
      }
    }

    .login-btn {
      display: block;
      line-height: 90upx;
      text-align: center;
      margin: 0 auto;
      width: 686rpx;
      height: 88rpx;
      font-size: 32upx;
      color: #fff;
      background: $fu-main-color;
      border-radius: 50upx;
      background-blend-mode: normal, normal;
      margin-top: 105% !important;
      // position: absolute;
      // left: 50%;
      // transform: translate(-50%,0%);
      // bottom: 50rpx;

      &:after {
        border: 0;
      }
    }

    .reg-paw {
      margin: 20upx 0;
      text-align: center;

      text {
        font-size: 28upx;
        display: inline-block;
        width: 25%;
        color: #999;
        position: relative;
        padding: 20upx 0;
      }

      .wj_mh:before {
        position: absolute;
        height: 26upx;
        width: 1px;
        background: #999;
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
        margin: 120upx 0 50upx 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .txt {
          font-size: 28upx;
          color: #999;
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
  }

  .input-wapper:last-child {
    border-bottom: none !important;
  }
</style>
