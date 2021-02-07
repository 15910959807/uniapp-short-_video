<template>
  <view class="page-wrapper">

    <view class="comment-issue">
      <view class="comment-issue-input">
        <uni-icons type="search" size="16" color="#BFBFBF"></uni-icons>
        <input type="text" value="" placeholder="请输入相应病症..." />
      </view>
      <button type="default">搜索</button>
    </view>

    <view class="search-img">
      <image src="/static/images/shibai.png" mode=""></image>
      <view class="search-text">
        <text>没有相匹配的病症</text>
      </view>
    </view>



  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  onLoad() {


  },
  methods: {



  }
}

</script>

<style lang="scss">
page {
  width: 100%;
  height: auto;
  min-height: 100%;
  background: #FFFFFF;

  .page-wrapper {


  }
}

.search-img{
  padding: 100rpx 32rpx 0;

  image{
    width: 100%;
    margin: 0 auto;
  }
  .search-text{
    margin-top: -80rpx;
    color: #6E7A7C;
    font-size: 24rpx;
    text-align: center;
  }

}


.comment-issue{
  width: 100%;
  display: flex;
  align-items: center;
  padding: 32rpx 32rpx;

  .comment-issue-input{
    display: flex;
    align-items: center;
    background-color: #F6F7F9;
    border-radius: 45rpx;
    padding-left: 32rpx;

  }

  input {
    width: 520rpx;
    height: 72rpx;
    box-sizing: border-box;
    border: none !important;
    padding-left: 6rpx;
    color: #BFBFBF;
    font-size: 28rpx;
  }
  button{
    height: 56rpx;
    line-height: 56rpx;
    color: #01CBD3;
    font-size: 28rpx;
    background: rgba(0,0,0,0);
    margin-left: 32rpx;
    padding: 0;

    &::after{
      border: none;
    }
  }
}

</style>
