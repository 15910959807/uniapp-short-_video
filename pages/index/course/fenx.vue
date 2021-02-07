<template>
  <view class="page-wrapper">
    <!-- header start -->
    <view class="cu-bar">
      <uni-icons @tap="BackPage" class="action"  type="arrowleft" size="24"></uni-icons>

      <view class="cu-bar-center">
        <text>课程详情</text>
      </view>

      <view class="cu-bar-box">

        <view class="cu-bar-right" @tap="openPopup('share')">
          <image src="/static/images/fenx.png" mode=""></image>
        </view>
      </view>
    </view>


    <fu-share
      ref="share"
      :info="shareInfo"
      @getPosterInfo="getShareCode"

    ></fu-share>


  </view>

</template>

<script>
export default {
  data() {
    return {
      shareCode: '',
    }
  },
  computed: {
    shareInfo() {
      return {

        href: 'https://juejin.im/', // H5地址
        code: this.shareCode, // 二维码
      };
    },
    cartNumber(){
      return this.$store.getters.allNum;
    }
  },
  onLoad() {


  },
  methods: {

    // 打开弹窗
    openPopup(type, param) {
      this.$refs[type].open(param);
    },
  }
}

</script>

<style lang="scss">
  // header start
  	.cu-bar{
      width: 100%;
      position: fixed;top: 0;left: 0; z-index: 9;
      border-bottom: 1rpx solid #EEEEEE;
      background-color: #FFFFFF;

      .cu-bar-center{
        padding-left: 60rpx;
        color: #333333;
        font-size: 36rpx;
      }

      .cu-bar-box{
        display: flex;
        align-items: center;
        padding-right: 32rpx;



        .cu-bar-left{

          .action{
            margin: 0;
          }
        }
        .cu-bar-right{
          width: 40rpx;
          height: 40rpx;
          margin-left: 24rpx;

          image{
            width: 40rpx;
            height: 40rpx;
          }
        }
      }
    }
  // header end



</style>
