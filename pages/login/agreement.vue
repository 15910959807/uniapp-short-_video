<template>
  <view class="page">

    <view class="">
      <!-- {{dataText}} -->
      <rich-text :nodes="desc"></rich-text>
    </view>

    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        desc: '',
      };
    },
    onLoad() {
      this.getData();
    },
    onReady() {

    },
    methods: {
      getData() { //获取协议
        uni.showLoading({
          title: '加载中'
        });
        this.$api.post(global.apiUrls.postOperationGetText, {
        }).then(res => {
          setTimeout(function() {
            uni.hideLoading();
          }, 500);
          var res = res.data
          console.log(res)
          if (res.code == 1) {
            this.desc = res.data
          }
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .page {
    background: #fff;
    overflow: hidden;
    height: 100vh;
    padding: 20upx;
    overflow-y: scroll;
    line-height: 48rpx;
    font-size: 32rpx;
    word-wrap: break-word;
  }
</style>
