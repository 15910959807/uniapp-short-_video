<template>
  <view class="warp">
    <!-- header start -->
    <view class="cu-bar">
      <uni-icons @tap="BackPage" class="action"  type="arrowleft" size="24"></uni-icons>
      <view class="">

      </view>
    </view>
    <!-- header end -->

    <!-- //背景图 -->
    <image src="/static/login/login-bg.png" mode="" class="bg_img"></image>
    <view class="login-title">
      <view class="logo">
        <image :src="SYSTEM_CONFIG.logo" mode=""></image>
      </view>
    </view>

    <!-- 忘记密码 -->
    <view class="login-phone form-wapper">
      <view class="phone input-wapper">
        <view class="mobile rside">
          <input focus placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号"
            maxlength="11" />
        </view>
      </view>
      <view class="code input-wapper">
        <view class="rside">
          <input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
          <button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
        </view>
      </view>
      <view class="phone input-wapper">
        <view class="mobile rside" style="display: flex;justify-content: space-between;width: 100%;height: 100%;align-items: center;">
          <input style="width: 80%;" placeholder-style="color:#bfbfbf;" placeholder-class="input-placeholder" v-if="type == 'password'"
            type="password" v-model="password" placeholder="请输入新密码(6-12位)" minlength="6" maxlength="12" />
          <input style="width: 80%;" placeholder-style="color:#bfbfbf;" placeholder-class="input-placeholder" v-if="type == 'text'"
            type="text" v-model="password" placeholder="请输入新密码(6-12位)" minlength="6" maxlength="12" />
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
        <!-- <view class="" @tap="toCodeLogin">验证码登录</view> -->
      </view>
    </view>

    <!-- 立即登录 -->
    <!-- <button
			type="primary"
			:loading="is_click"
			class="login-btn"
			@tap="reg"
			style="margin-top: 24upx;"
		>完成</button> -->
    <view type="primary" :loading="is_click" class="login-btn" @tap="reg" style="margin-top: 24upx;">完成</view>
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
      return {
        phone: '', //手机号
        vercode: '', //验证码
        password: '', //密码
        is_click: false, // 登录按钮加载动画
        verCodeBtnLoading: false,
        time: 60, //倒计时60S
        beginning: false, //显示倒计时
        is_used: false, // 手机号是否存在
        type: 'password', //密码类型
        is_agree: false, // 协议
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        code_id: 0,
      }
    },
    onLoad() {
      _this = this;
      this.SYSTEM_CONFIG = global.SYSTEM_CONFIG;
    },
    methods: {
      //密码是否可见
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
        uni.navigateBack({
          delta: 1

        });
      },
      //登录
      reg() {
        if (_this.is_click) {
          return;
        }
        let {
          phone,
          vercode,
          password
        } = this;
        if (!phone) {
          _this.$message.info('请输入手机号');
          return false;
        }
        if (!validate(phone, 'phone')) {
          _this.$message.info('请输入正确的手机号');
          return false;
        }
        if (!this.code_id) {
          this.$message.info('请先获取验证码')
          return false;
        }
        if (!vercode) {
          _this.$message.info('请输入验证码');
          return false;
        }
        if (!validate(password, 'password')) {
          _this.$message.info('请输入字母加数字6-12位密码');
          return false;
        }

        _this.is_click = true;
        _this.$api.post(global.apiUrls.forgetPassword, {
            password: password,
            mobile: phone,
            code: vercode,
            type: 2,
          })
          .then(res => {
            _this.is_click = false;
            if (res.data.code == 1 && res.data.data) {
              _this.$message.info(res.data.msg);
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/login/login',
                })
              }, 500)
            } else {
              _this.$message.info(res.data.msg);
            }
          })
      },
      // 发送验证码
      handleSendVerCode() {
        this.code_id = 1;
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
        if (_this.beginning) return false;
        _this.verCodeBtnLoading = true;
        _this.$api.post(global.apiUrls.GetVerifyCode, {
            is_test: global.IS_DEV,
            mobile: phone,
            type: 2
          })
          .then(res => {
            _this.verCodeBtnLoading = false;
            if (res.data.code == 1) {
              clearInterval(_this.timer);
              _this.beginning = true;
              // _this.$message.info('发送成功')
              _this.$message.info('验证码已发送到您的手机，请注意查收。');
              //显示倒计时
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
            } else {
              _this.$message.info(res.data.msg);
            }
          })
      }
    }
  }
</script>
<style lang="scss">
  // header start
  .cu-bar {
    position: relative;
    z-index: 9;
  }

  // header end

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

    .form-wapper {
      position: relative;
      width: 100%;
      box-sizing: border-box;
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
      display: block;
      line-height: 90upx;
      text-align: center;
      margin: 0 auto;
      width: 480rpx;
      height: 88rpx;
      font-size: 32upx;
      color: #fff;
      background: $fu-main-color;
      border-radius: 50upx;
      background-blend-mode: normal, normal;

      &:after {
        border: 0;
      }
    }
  }

  // 主体 end
</style>
