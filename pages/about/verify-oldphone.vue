<template>
  <view class="page-wrapper">
    <view class="per">
      <view class="padding fu-flex fu-flex-center">
        <view class="img">
          <image src="/static/images/old1.png" mode=""></image>
        </view>
        <view class="text">
          <text class="">当前手机号：{{ mobileX || '' }}</text>
        </view>
      </view>
      <view class="oldphone-box"></view>

      <view class="cu-list menu" v-show="change==0">
        <view class="cu-item" :class="menuArrow?'arrow':''">
          <view class="cu-item-img">
            <image src="/static/images/old2.png" mode=""></image>
          </view>
          <view class="content flex">
            <input type="number" value="" v-model="code" maxlength="4" placeholder="请输入验证码" placeholder-style="color:#999;" />
            <view class="get-code" @click="getCode()">{{getCodeText}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btn_cloce" style="padding:30rpx;">
      <view class="types" @click="submit">下一步</view>
    </view>
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
  import {
    validate
  } from '@/common/utils/index.js'
  export default {
    data() {
      return {
        islogin: 0,
        menuArrow: false,
        getCodeBtnColor: "#259B3B",
        jiupassword: '',
        xinpassword: '',
        new_mobile: '',
        mobile: '',
        mobileX: '',
        code: '',
        codeNew: '',
        getCodeText: '获取验证码',
        getCodeisWaiting: false,
        code_id: 0,
        change: 0,
      };
    },
    onLoad() {
      console.log('传过来的数据', global.userInfo)
      let userInfo = Object.assign({}, global.userInfo);
      this.mobileX = userInfo.mobile;
      this.mobile = userInfo.whole_mobile;
      console.log(this.mobile)
      // this.getMobile()
      var user = uni.getStorageSync('USERINFO');
      if (user.id > 0) {
        this.islogin = 1
      }
    },
    onBackPress() {
      uni.hideKeyboard()
    },
    methods: {
      // getMobile(){  //获取手机号
      //   // console.log(user)
      //   this.$api.post(global.apiUrls.postUserGet_user_phone, {
      //     step:1
      //   }).then(res => {
      //     console.log(res)
      //     var mobile = res.data.data.substr(0,3)+"****"+res.data.data.substr(7);
      //     this.mobile = res.data.data
      //     this.mobileX = mobile
      //   })
      // },
      getCode() {
        uni.hideKeyboard();

        if (this.getCodeisWaiting) {
          return;
        }
        // if (!validate(this.mobile ,'phone')) {
        //   this.$message.info(!this.mobile ? '请输入手机号' : '请填写正确手机号码')
        //   return false;
        // }
        this.getCodeText = "发送中..."
        this.getCodeisWaiting = true;
        this.getCodeBtnColor = "#BFBFBF"
        let user_id = uni.getStorageSync('USER_INFO').id
        this.$api.post(global.apiUrls.GetVerifyCode, {
          is_test: global.IS_DEV,
          mobile: this.mobile,
          type: 4,
          user_id: user_id,
        }).then(res => {
          var res = res.data
          console.log(res)
          this.$message.info(res.msg)
          if (res.code == 1) {
            this.code_id = 1;
            this.$message.info('验证码已发送到您的手机，请注意查收。')
            this.setTimer();
          } else {
            this.getCodeText = '获取验证码';
            this.getCodeBtnColor = "#259B3B";
            this.getCodeisWaiting = false;
          }
        }).catch(err => {
          // 接口请求失败做些什么
        })
      },
      setTimer() {
        let holdTime = 60;
        this.getCodeText = "重新获取(60)"
        this.Timer = setInterval(() => {
          if (holdTime <= 0) {
            this.getCodeisWaiting = false;
            this.getCodeBtnColor = "#F74D58";
            this.getCodeText = "获取验证码"
            clearInterval(this.Timer);
            return;
          }
          this.getCodeText = "重新获取(" + holdTime + ")"
          holdTime--;

        }, 1000)
      },
      submit() {
        // var type = this.change
        // if (!this.mobile) {
        //   this.$message.info('请输入手机号');
        //   return false;
        // }
        // if (!validate(this.mobile ,'phone')) {
        //   this.$message.info(!this.mobile ? '请正确输入手机号' : '请填写正确手机号码')
        //   return false;
        // }
        if (!this.code_id) {
          this.$message.info('请先获取验证码')
          return false;
        }
        if (!this.code) {
          this.$message.info('请输入验证码')
          return false;
        }
        let data = {
          mobile: this.mobile,
          code: this.code,
          step: 1,
        }
        this.$api.post(global.apiUrls.postUserGet_user_phone, data
        ).then(res => {
            var res = res.data
            if (res.code == 1) {
              uni.navigateTo({
                url: '/pages/about/change-newphone'
              })
            } else if(res.code == 0) {
              this.$message.info(res.msg)
            }
          });

      }
    }
  };
</script>

<style lang="scss">
  page {
    width: 100%;
    height: auto;
    min-height: 100%;
    background: #FFFFFF;
  }

  .get-code {
    // position: absolute;
    width: 200rpx;
    height: 90upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // right: 0;
    // top: 0;
    color: $fu-main-color;
    // border-left: solid 1upx #fff;
    z-index: 3;
    font-size: 24rpx;

    &:after {
      content: " ";
      width: 1upx;
      height: 50upx;
      background-color: #fff;
      position: absolute;
      z-index: 3;
      left: 0;
      top: 20upx;
    }
  }

  .types {
    width: 686upx;
    height: 88upx;
    color: #FFFFFF;
    line-height: 88upx;
    background: $fu-main-color;
    opacity: 1;
    border-radius: 40px;
    margin: 0 auto;
  }

  .per {
    font-size: 28upx;
    background-color: #fff;

    .per_row {
      padding: 30upx 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ededed;

      .row_right {
        text-align: right;

        .aa {
          color: #999999;
          display: inline-block;
          margin-right: 10upx;
        }
      }
    }
  }

  .out_login {
    margin-top: 30%;
    line-height: 88upx;
    background-color: rgb(0, 129, 255);
    color: #fff;
    text-align: center;
    border-radius: 45px;
    margin-left: 25upx;
    margin-right: 25upx;
  }

  .btn_cloce {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .oldphone-box {
    width: 750rpx;
    height: 20rpx;
    background: #F8F6F8;
  }

  .fu-flex-center {
    flex-wrap: wrap;
    padding: 60rpx 0 40rpx;

    .img {
      width: 100%;
      text-align: center;
      margin-bottom: 48rpx;

      image {
        width: 80rpx;
        height: 130rpx;
      }
    }

    .text {

      text {
        color: #333333;
        font-size: 32rpx;
      }
    }
  }

  .cu-list.menu>.cu-item {
    padding: 0;
    min-height: auto;
    border-bottom: 1rpx solid #EEEEEE;
  }

  .cu-list.menu>.cu-item .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 0rpx;
  }

  .cu-list {
    padding: 0 32rpx;
  }

  .cu-item-img {
    margin-right: 24rpx;

    image {
      width: 36rpx;
      height: 36rpx;
    }
  }
</style>
