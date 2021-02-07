<template>
  <view class="page-wrapper">
    <!-- header start -->
    <view class="cu-bar">
      <uni-icons @tap="BackPage" class="action" type="" size="24"></uni-icons>
      <view class="cu-bar-text">
        <text @tap="CompilePage()">编辑</text>
      </view>
    </view>
    <!-- header end -->
    <view class="page-header">
      <!-- <image src="" mode="" class="bg_img"></image> -->
      <u-lazy-load class="bg_img" img-mode="widthFix" image="/static/images/about-bg.png"></u-lazy-load>
    </view>
    <!-- 用户登录 -->
    <view class="" v-if="userInfo.id > 0">
      <view class="header-portrait">
        <view class="left" @tap="CompilePage()">
          <u-lazy-load img-mode="widthFix" border-radius="127" style="width: 127rpx;height: 127rpx;" :image="userInfo.head_img || '/static/images/touxiang.png'"></u-lazy-load>
          <view class="title"><text>{{ user_type != 1 ? '普通用户' : '白银会员' }}</text></view>
        </view>
        <view class="right">
          <view class="title">
            <text @tap="CompilePage()">{{ userInfo.user_nickname }}</text>
          </view>
          <view class="text">
            <text @tap="CompilePage()">账号：{{ userInfo.mobile }}</text>
          </view>
        </view>
      </view>
      <view class="header-vip" @tap="clickVipTow()">
        <u-lazy-load img-mode="widthFix" style="width: 686rpx;height: 125rpx;" :image="user_img"></u-lazy-load>
        <view class="text">
          <text>{{ user_type != 1 ? '未开通' : vipTime + ' 到期' }} </text>
        </view>
      </view>
    </view>
    <!-- 用户未登录 -->
    <view class="" v-else>
      <view class="header-portrait">
        <view class="left">
          <u-lazy-load img-mode="widthFix" border-radius="127" style="width: 127rpx;height: 127rpx;" image="/static/login/logo.jpg"></u-lazy-load>
          <view class="title"><text>未登录</text></view>
        </view>
        <view class="right">
          <view class="title">
            <text>未登录</text>
          </view>
          <view class="text">
            <text>未登录</text>
          </view>
        </view>
      </view>
      <view class="header-vip">
        <u-lazy-load img-mode="widthFix" style="width: 686rpx;height: 125rpx;" image="/static/images/vip3.png"></u-lazy-load>
        <view class="text">
          <text>未开通</text>
        </view>
      </view>
    </view>




    <view class="page-about">
      <view class="about">
        <view class="content" @tap="UserCollect()">
          <view class="img">
            <image src="/static/images/about1.png" mode=""></image>
          </view>
          <text>我的收藏</text>
        </view>
        <view class="content" @tap="UserAbout()">
          <view class="img">
            <image src="/static/images/about2.png" mode=""></image>
          </view>
          <text>关于我们</text>
        </view>
        <view class="content" @tap="UserFeedback()">
          <view class="img">
            <image src="/static/images/about3.png" mode=""></image>
          </view>
          <text>意见反馈</text>
        </view>
        <view class="content" @tap="UserQuit()">
          <view class="img">
            <image src="/static/images/about4.png" mode=""></image>
          </view>
          <text>退出登录</text>
        </view>
      </view>
    </view>

    <fu-notwork></fu-notwork>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {}, // 当前登录用户的用户信息
        user_type: "",
        user_img: "",
        vipTime: "",
      }
    },
    onShow() {
      if(global.userInfo == null){
        uni.reLaunch({
          url:'/pages/login/login'
        })
      }

      this.userInfo = global.userInfo || {};
      // this.user_type = userInfo.user_type;
      // console.log(this.userInfo)
      this.user_img = this.user_type != 1 ? "/static/images/vip3.png" : "/static/images/vip3.png";
      // console.log(global.userInfo)
      this.getdata(); //获取数据

    },
    onLoad() {

    },
    methods: {
      //获取数据
      getdata() {
        uni.showLoading({
            title: '加载中'
        });
        this.$api.post(global.apiUrls.postAbout, {
          // 传入参数
        }).then(res => {
          setTimeout(function() {
            uni.hideLoading();
          }, 500);
          // 接口请求成功做些什么
          this.vipTime = res.data.data.vip_last_time;
          this.user_type = res.data.data.user_type;
          // console.log(this.user_type)
        }).catch(err => {
          // 接口请求失败做些什么

        })
      },
      //点击登录
      login() {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      },
      //返回上一页
      BackPage() {
        uni.navigateBack({
          delta: 1
        });
      },
      // 我的收藏
      UserCollect() {
        uni.navigateTo({
          url: '/pages/about/collect'
        })
      },
      // 关于我们
      UserAbout() {
        uni.navigateTo({
          url: '/pages/about/about'
        })
      },
      // 意见反馈
      UserFeedback() {
        uni.navigateTo({
          url: '/pages/about/feedback'
        })
      },
      // 编辑
      CompilePage() {
        uni.navigateTo({
          url: '/pages/about/personal'
        })
      },

      // 跳转vip的充值页面
      clickVipTow() {
        uni.navigateTo({
          url: '/pages/index/vip-center-two/index'
        })
      },


      // 退出登录 弹窗
      UserQuit() {
        let that = this;
        uni.showModal({
          title: '是否确认退出登录？',
          // content: '取消',
          showCancel: true,
          confirmText: '确定',
          confirmColor: '#01CBD3',
          success: (res) => {
            // console.log(res)
            if (res.confirm) {

              console.log("你點擊了確認");
              global.token = '';
              global.userInfo = null;
              uni.removeStorageSync('USER_TOKEN');
              uni.removeStorageSync('USER_INFO');
              uni.navigateTo({
                url: '/pages/login/login'
              });

            }
          },
          fail: (res) => {
            console.log("你點擊了取消")
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
