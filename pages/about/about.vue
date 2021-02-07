<template>
	<view class="page">
		<view class="content">
      <view class="logo">
        <!-- <image :src="SYSTEM_CONFIG.logo"></image> -->
        <u-lazy-load img-mode="widthFix" style="width: 172rpx;
        height: 172rpx;" :image="SYSTEM_CONFIG.logo"></u-lazy-load>
        <p class="name">{{title}}</p>
      </view>
      <rich-text class="site" :nodes="desc"></rich-text>

      <p class="bottom">copyight@2020 <br> All Rights Reserved</p>
    </view>
    <fu-notwork></fu-notwork>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        SYSTEM_CONFIG:'',
        desc:'',
        title: '',
			};
		},
		onLoad() {
      this.SYSTEM_CONFIG = global.SYSTEM_CONFIG;
      console.log(this.SYSTEM_CONFIG)
      this.getData()
		},
		onReady() {

		},
		methods: {
      getData() {	//获取协议
          uni.showLoading({
              title: '加载中'
          });
          this.$api.post(global.apiUrls.postOperationGetColumn, {
          }).then(res => {
            setTimeout(function () {
                uni.hideLoading();
            }, 500);
            console.log(res)
            var res1 = res.data
            if(res1.code==1){
              this.desc = res1.data.app_desc;
              this.title = res.data.data.app_title;
            }
          })
      }
		}
	}
</script>

<style lang="scss" scoped='scoped'>
  .page{
    min-height: 100vh;
    background-color: #fff;
  }
	.content{
    width: 100%;
    overflow: hidden;
    padding: 0 50rpx;
    .logo{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 162rpx 0 52rpx;
      image{
        width: 172rpx;
        height: 172rpx;
      }
    }
    .name{
      margin-top: 32rpx;
      font-size: 28rpx;
      color: #1A1A1A;
    }
    .bottom{
      text-align: center;
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translate(-50%,-50%);
      color: #999999;
      font-size: 24rpx;
      line-height: 44rpx;
    }
    .site{
      width: 480rpx;
      color: #666666;
      font-size: 24rpx;
      text-align: center!important;
      line-height: 40rpx;
      margin: 0 auto;
      word-wrap: break-word;
    }
  }
</style>
