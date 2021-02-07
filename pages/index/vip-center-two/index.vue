<template>
  <view class="page-wrapper">
    <!-- header start -->
    <view class="cu-bar">
    	<uni-icons @tap="BackPage" class="action"  type="arrowleft" size="24"></uni-icons>
    </view>
    <!-- header end -->
    <view class="page-header">
      <image src="/static/images/vip-bg.png" mode="" class="bg_img"></image>
    </view>

    <view class="">

      <view v-if="user_type == 1 " class="">
        <view class="header-portrait">
          <view class="left">
            <image :src="userInfo.head_img || '/static/images/touxiang.png'" mode=""></image>
          </view>
          <view class="right">
            <view class="title">
              <text>{{ userInfo.user_nickname }}</text>
            </view>
            <view class="text">
              <text>恭喜您，已开通VIP</text>
            </view>
          </view>
        </view>

        <view class="header-vip">
          <image src="/static/images/vip.png" mode=""></image>
          <view class="text">
            <text>{{vipTime + ' 到期' }}</text>
          </view>
        </view>

      </view>

      <view v-else class="">
        <view class="header-portrait">
          <view class="left">
            <image :src="userInfo.head_img || '/static/images/touxiang.png'" mode=""></image>
          </view>
          <view class="right">
            <view class="title">
              <text>{{ userInfo.user_nickname }}</text>
            </view>
            <view class="text">
              <text>未开通会员</text>
            </view>
          </view>
        </view>

        <view class="header-vip">
          <image src="/static/images/vip.png" mode=""></image>
          <view class="text">
            <text>未开通</text>
          </view>
        </view>
      </view>

    </view>

    <view class="header-privilege">
      <view class="title">
        <text>VIP会员特权</text>
      </view>
      <view class="video">
        <image src="/static/images/video.png" mode=""></image>
      </view>
      <view class="text">
        <text>观看平台视频</text>
      </view>
    </view>

    <view class="header-common-vip">
      <view class="title">
        <text>开通普通会员</text>
      </view>

      <view class="common-vip">
        <view class="common" :class="selectedNum == index?'act':''" @tap="get_money(index,item)" v-for="(item,index) in moneyData" :key="index">
          <view class="common-title">
            <text>{{item.title}}</text>
          </view>
          <view class="text">
            <text class="text-m">￥</text>
            <text class="">{{item.price}}</text>
          </view>
        </view>


      </view>
    </view>


    <view @tap="payFn()" class="vip-button">立即支付</view>

    <fu-notwork></fu-notwork>

  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}, // 当前登录用户的用户信息
      user_type:"",
      user_img:"",
      vipTime:"",
      change_money: '', //充值金额
      selectedNum: -1,
      acc_type: 1, //充值方式
      act_type:-1,
      moneyData:[],
      product_id:0,
      money:'',
      rSelectData:[],
      data:[],
    }
  },
  onShow() {
    //返回上一页

  },
  onLoad() {
    this.userInfo = global.userInfo || {};
    // this.user_type = userInfo.user_type;
    // console.log(global.userInfo)
    this.getVip();
    let that = this;
    this.getDetali()
  },
  methods: {
    // 获取会员
    getVip(){
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
        // console.log(this.user_type,'11111111')
      }).catch(err => {
        // 接口请求失败做些什么

      })
    },

    //获取充值规则
    getDetali() {
        this.$api.get(global.apiUrls.getRechargeRule, {
          group: 0,
        }).then(res => {
          console.log(res)
          this.moneyData = res.data.data
        })
    },

    //点击选择充值金额
    get_money(i,data){
      console.log(data)
      console.log(i)
      if (this.selectedNum === i) {
        this.selectedNum = -1; //取消选中
      } else {
        this.selectedNum = i;
      }
    },
    //立即充值
    payFn() {
      if (this.selectedNum > -1) {
        uni.navigateTo({
          url:'/pages/index/course/payment?data=' + JSON.stringify(this.moneyData[this.selectedNum])
        })
      } else {
        this.$message.info('请选择一种充值会员类型');
      }
    },

    //返回上一页
    BackPage() {
      uni.navigateBack({
        delta: 1
      });
    },
  },
}

</script>

<style lang="scss">
@import './index.scss';
</style>
