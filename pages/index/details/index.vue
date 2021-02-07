<template>
  <view class="page-wrapper">
    <view class="page-header">

      <view class="title">
        <text>{{detail.title}}</text>
      </view>
      <view class="time">
        <text>{{detail.create_time}}</text>
      </view>
      <view class="content">
        <rich-text :nodes="desc"></rich-text>
      </view>

    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        detail: "",
        desc: '',
      }
    },
    onLoad(e) {
      let id = e.detail;
      // this.id
      console.log(e)
      // 请求分类
      uni.showLoading({
        title: '加载中'
      });
      this.$api.post(global.apiUrls.getIndexImagesText, {
        article_id: id
        // 传入参数
      }).then(res => {
        setTimeout(function() {
          uni.hideLoading();
        }, 500);
        // 接口请求成功做些什么
        this.detail = res.data.data;
        this.desc = res.data.data.desc;
        console.log(this.detail)
      }).catch(err => {
        // 接口请求失败做些什么
      })


    },
    methods: {

    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
