<template>
  <view class="page">
    <view class="bg-white">
      <view class="header">
        <view class="icon-success">
          <text class="cuIcon-check" style="font-size: 120rpx"></text>
        </view>
        <view class="margin-top text-bold">订单支付成功</view>
        <view class="cuIcon-money">
          <text>实付金额：¥{{this.price}}</text>
        </view>
      </view>
      <view class="bottom-action">
        <view class="symptom_button" @click="clickHome()">返回首页</view>
      </view>
    </view>
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
export default {
  data() {
    return {
      order_sn: "",
    };
  },
  onShow() {
    this.$api.post(global.apiUrls.postAbout, {
      // 传入参数
    }).then(res => {
      setTimeout(function() {
        uni.hideLoading();
      }, 500);
      // 接口请求成功做些什么
      this.vipTime = res.data.data;
      console.log(this.vipTime)
      // 更新本地缓存
      uni.setStorageSync('USER_INFO', res.data.data);
      // 更新global
      global.userInfo = res.data.data;
    }).catch(err => {
      // 接口请求失败做些什么

    })
  },
  onLoad(options) {
    console.log(options)
    this.price = JSON.parse(options.data);
    this.userInfo = global.userInfo || {};
    console.log(this.userInfo)
  },
  methods:{
    clickHome(){
      uni.reLaunch({
        url: '/pages/tab/index/index'
      })
    }

  }
};
</script>

<style lang="scss" scoped>
// 弹框样式
.Popups {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  .box {
    width: 553rpx;
    height: 730rpx;
    position: relative;
    margin: 236rpx auto 0;
    overflow: hidden;
    .bg {
      width: 553rpx;
      height: 730rpx;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }
    .texts {
      width: 320rpx;
      text-align: center;
      margin: 132rpx auto;
      .title {
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(206, 133, 45, 1);
      }
      .moneys {
        padding-top: 30rpx;
        font-size: 80rpx;
        font-family: Arial;
        font-weight: 400;
        color: rgba(206, 133, 45, 1);
        text {
          font-size: 40rpx;
        }
      }
      .tips_box {
        padding-top: 40rpx;
        font-size: 24rpx;
        line-height: 35rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(234, 166, 82, 1);
      }
    }
    .btns {
      width: 312rpx;
      height: 72rpx;
      background: rgba(255, 197, 126, 1);
      box-shadow: 0px 16rpx 32rpx rgba(147, 88, 8, 0.4);
      border-radius: 45rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 32rpx;
      color: #714b1d;
      margin: 210rpx auto 0;
    }
  }
  .close {
    display: block;
    width: 66rpx;
    height: 66rpx;
    margin: 60rpx auto;
  }
}
.icon-success {
  width: 150rpx;
  height: 150rpx;
  background-color: #17CA5D;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  margin-bottom: 56rpx;
}

.cuIcon-money{
  margin-top: 40rpx;

  text{
    color: #999999;
    font-size: 28rpx;
  }
}

.page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 170rpx;

  .margin-top{
    color: #333333;
    font-size: 32rpx;
  }
}



.symptom_button{
  background-color: #01CBD3;
  border-radius: 44px;
  color: #FFFFFF;
  font-size: 28rpx;
  width: 320rpx;
  height: 72rpx;
  line-height: 72rpx;
  margin: 200rpx auto 0;
  text-align: center;

  &::after{
    border: none;
  }
}
</style>
