<template>
  <view class="page-wrapper">
    <view class="page-content">
      <view v-if="info.length>0">
        <view class="content" v-for="(item ,index) in info" :key="index" @click="collectDetails(item.id,item.bind_id)">
          <view class="left">
            <view class="content-icon">
              <text>会员免费</text>
            </view>
            <u-lazy-load img-mode="widthFix" style="width: 180rpx;
          height: 180rpx;
          " border-radius="18"
              :image="item.image_url"></u-lazy-load>
          </view>
          <view class="right">
            <view class="title ellipsis">
              <text>{{item.title}}</text>
            </view>
            <view class="text text-line">
              <text>{{item.simple_desc}}</text>
            </view>
            <view class="right_duration">
              <view class="right_duration_text">
                按摩时长{{item.duration}}分钟
              </view>
              <view class="">
                <button type="default">查看</button>
              </view>
            </view>
          </view>
        </view>
      </view>


      <view v-else class="search-img">
        <image src="/static/images/shibai.png" mode=""></image>
        <view class="search-text">
          <text>还没有收藏，快去收藏吧</text>
        </view>
      </view>

    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        info: [],
        title: '',
        simple_desc: '',
        image: '',
        last_page: '', //总页数
        page: 2, //上拉加载的起始页(默认从第二页开始加载) 2
        loadingnum: 10, //加载条数
        sends: false, //上拉加载的状态  避免数据没更新时重复请求
        // productlist:[],//数据盒子
      }
    },
    onShow() {
      this.userInfo = global.userInfo || {};
      // this.user_type = this.userInfo.user_type;
      // console.log(this.userInfo)
      uni.showLoading({
        title: '加载中'
      });
      this.$api.post(global.apiUrls.postWorkCollect, {
        // 传入参数
        is_more: 1,
        page: 1,
        limit: this.loadingnum,
      }).then(res => {
        setTimeout(function() {
          uni.hideLoading();
        }, 500);
        // 接口请求成功做些什么
        if (res.data.data.data) {
          // console.log(res)
          this.info = res.data.data.data;
        }
        this.user_type = res.data.data.user.user_type;
        this.last_page = res.data.data.last_page;
        console.log(this.info)
      }).catch(err => {
        // 接口请求失败做些什么
      })
    },
    onLoad() {


    },
    //上拉加载
    onReachBottom() {
      //判断总页数是否大于1
      console.log(this.page)

      let _this = this;
      if (this.last_page > 1) {
        if (this.sends == false) {
          if (this.page <= this.last_page) {
            //开始加载
            this.sends = true;
            // this.loadings = true;//这个是上拉的特效
            uni.showLoading({
              title: '加载中'
            });
            this.$api.post(global.apiUrls.postWorkCollect, {
                video_id: this.id,
                is_more: 1,
                page: this.page,
                limit: this.loadingnum,
              })
              .then(res => {
                const {
                  info
                } = this;
                console.log(res)
                if (res.data.code == 1) {
                  //延迟加载数据 减少并发量
                  // setTimeout(() => {
                  _this.info = [...info, ...res.data.data.data];
                  _this.sends = false;
                  console.log(_this.info, 'info');
                  uni.hideLoading()
                  // }, 500)
                  _this.page++;

                } else {
                  this.$message.info('诶呀,加载失败了稍后再试试吧');
                  this.sends = false;
                }

              }).catch(err => {
                // console.log(res)
                this.sends = false;
              })

          } else {
            // this.nodata = true;	//当加载完没数据后 显示无更多数据
          }
        }

      }

    },

    methods: {
      collectDetails(a,b) {
        if(this.user_type == 1){
          uni.navigateTo({
            url: '/pages/index/course/course?id=' + a +'&bind_id='+b
          })
        }else{
          uni.navigateTo({
            url: '/pages/index/vip-center-two/index'
          })
        }
      },

    }
  }
</script>

<style lang="scss">
  page {
    width: 100%;
    height: auto;
    min-height: 100%;
    background: #F6F7F9;

    .page-wrapper {}
  }

  .page-matters {
    background-color: #DFEFFF;
    padding: 24rpx 32rpx;

    text {
      color: #007FFF;
      font-size: 28rpx;
    }
  }

  .page-content {
    padding: 32rpx 32rpx 0;

    .content {
      padding: 32rpx;
      margin-bottom: 20rpx;
      border-radius: 16px;
      display: flex;
      background-color: #FFFFFF;

      .left {
        width: 180rpx;
        height: 180rpx;
        border-radius: 16rpx;
        position: relative;

        .content-icon {
          position: absolute;
          left: 0rpx;
          top: 0rpx;
          z-index: 1;
          color: #FFFFFF;
          font-size: 20rpx;
          background: #01CBD3;
          border-radius: 16rpx 0rpx 16rpx 0rpx;
          padding: 2rpx 10rpx;
        }

        image {
          width: 180rpx;
          height: 180rpx;
          border-radius: 18rpx;
        }
      }

      .right {
        width: 442rpx;
        padding-left: 24rpx;

        .title {
          display: flex;
          color: #333333;
          font-size: 32rpx;
          margin-bottom: 16rpx;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;

          .time {
            margin-left: 24rpx;
          }
        }

        .text {
          color: #999999;
          font-size: 24rpx;
          line-height: 33rpx;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

        }
        .right_duration{
          display: flex;
          justify-content: space-between;

          .right_duration_text{
            font-size: 24rpx;
            line-height: 48rpx;
          }

        }

        button {
          background: #01CBD3;
          border-radius: 36rpx;
          width: 112rpx;
          height: 48rpx;
          line-height: 48rpx;
          color: #FFFFFF;
          font-size: 24rpx;
          display: flex;
          text-align: center;
          align-items: center;
          justify-content: center;
          float: right;

          &::after {
            border: none;
          }
        }
      }
    }
  }

  .search-img {
    padding: 100rpx 32rpx 0;

    image {
      width: 100%;
      margin: 0 auto;
    }

    .search-text {
      margin-top: -80rpx;
      color: #6E7A7C;
      font-size: 24rpx;
      text-align: center;
    }

  }
</style>
