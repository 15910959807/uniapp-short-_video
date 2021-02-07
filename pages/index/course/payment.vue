<template>
  <view class="page">
    <view class="cu-bar">
      <uni-icons @tap="BackPage" class="action" type="arrowleft" size="24"></uni-icons>

      <view class="cu-bar-center">
        <text>去付款</text>
      </view>

      <view class="cu-bar-box">

      </view>
    </view>

    <view class="price-box">
      <view>
        <view class="text-price">
          支付金额
        </view>
        <text class="price">￥{{this.payable_money}}</text>
      </view>
    </view>
    <view class="pay-type-list">
      <view class="padding-bottom text-bold pay-text">选择支付方式</view>
      <!-- <view class="type-item b-b" @click="changePayType('balance')" v-if="canUseBalance">
        <view class="margin-right">
          <image class="block-44" src="/pages/order/static/order-process/ye.png"></image>
        </view>
        <view class="con">
          <text class="tit">余额支付</text>
          <text class="text-999 text-sm">可用余额: {{user_money}}</text>
        </view>
        <label class="radio">
          <radio class="radio-scale" color="#01CBD3" :checked='payType == "balance"' :disabled="!canUseBalance" />
        </label>
      </view> -->
      <view class="type-item b-b" @click="changePayType('wxpay')">
        <view class="margin-right">
          <image class="block-44" src="/static/images/way1.png"></image>
        </view>
        <view class="con">
          <text class="tit">微信</text>
        </view>
        <label class="radio">
          <radio class="radio-scale" color="#01CBD3" :checked='payType == "wxpay"' />
        </label>
      </view>
      <!-- #ifndef MP-WEIXIN -->
      <view class="type-item b-b" @click="changePayType('alipay')">
        <view class="margin-right">
          <image class="block-44" src="/static/images/way2.png"></image>
        </view>
        <view class="con">
          <text class="tit">支付宝</text>
        </view>
        <label class="radio">
          <radio class="radio-scale" color="#01CBD3" :checked='payType == "alipay"' />
        </label>
      </view>
      <!-- #endif -->
    </view>
    <view class="bottom-btn" @click="submit">确认支付</view>
    <!-- <FuPayKeyboard ref="passkeyborad" :show="payShow" :money="" @close="payClose" @callback="paymentByBalance"></FuPayKeyboard> -->
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
  import FuPayKeyboard from '@/components/fu-pay-keyboard/fu-pay-keyboard.vue';
  export default {
    components: {
      FuPayKeyboard
    },
    data() {
      return {
        payType: 'wxpay',
        orderInfo: {},
        payable_money: 0,
        user_money: 0,
        order_money: 0,
        order_sn: '',
        order_type: 3,
        payShow: false,
        loading: false, // 按钮状态
        alipay: '',
      };
    },
    onLoad(options) {
      console.log(JSON.parse(options.data));
      this.moneyData = JSON.parse(options.data);
      this.payable_money = JSON.parse(options.data).price;
      this.type_id = JSON.parse(options.data).type_id;
      this.vip_id = JSON.parse(options.data).vip_id;
      console.log('会员类型ID', this.type_id)
      console.log('会员ID', this.vip_id)
      console.log('金额', this.payable_money)
      // this.order_sn = options.order_sn;
      // this.order_type = options.order_type;
      this.loadData();

    },
    methods: {
      //返回上一页
      BackPage() {
        uni.navigateBack({
          delta: 1
        });
      },
      // 获取订单
      loadData() {

      },
      // 关闭支付密码输入框
      payClose() {
        this.payShow = false;
      },
      // 选择支付方式
      changePayType(type) {
        // if (type == 'balance' && !this.canUseBalance) ;
        // if (type == 'mix' && !this.canUseMix) return;
        this.payType = type;
      },
      // 确认支付
      submit() {
        // 防止二次点击
        if (this.payType == 'wxpay' || this.payType == 'alipay') {
          // if (this.loading) return;
          this.loading = true;
          this.callPay();
        } else {
          this.$message.info("至少选择一种支付方式");
        }

      },
      // 判断调用哪种支付方式
      callPay() {
        if (this.payType == 'wxpay') {
          // this.$message.info("三方接口审核中，等待对接");
          // return
          this.paymentByWxpay(this.order_sn);
        } else if (this.payType == 'alipay') {
          this.paymentByAlipay(this.order_sn);
        }
      },
      // 微信支付
      // paymentByWxpay(sn) {
      //   this.$api.post(global.apiUrls.wxpayOrder, {
      //     order_sn: this.sn,
      //     // #ifdef APP-PLUS
      //     wxpaytype: 'apppay',
      //     // #endif
      //     // #ifdef MP-WEIXIN
      //     wxpaytype: 'minipay',
      //     // #endif
      //   }).then(res => {
      //     console.log("微信支付回调", res);
      //     if (res.data.code == 1) {
      //       let data = res.data.data;
      //       uni.requestPayment({
      //         provider: 'wxpay',
      //         // #ifdef MP-WEIXIN
      //         timeStamp: data.timeStamp,
      //         nonceStr: data.nonceStr,
      //         package: data.package,
      //         signType: data.signType,
      //         paySign: data.paySign,
      //         // #endif
      //         // #ifdef APP-PLUS
      //         orderInfo: data,
      //         // #endif
      //         success: (e) => {
      //           console.log('success', e)
      //           if (e.errMsg == 'requestPayment:ok') {
      //             this.paySuccess(this.sn);
      //           }
      //         },
      //         fail: (e) => {
      //           console.log('fail', e);
      //           // #ifdef APP-PLUS
      //           let failMsg = 'requestPayment:fail canceled';
      //           // #endif
      //           if (e.errMsg == failMsg) {
      //             this.$message.info('取消支付');
      //           } else {
      //             this.$message.info("支付失败,原因为: " + e.errMsg);
      //           }
      //         },
      //         complete: () => {
      //           this.loading = false;
      //         }
      //       });
      //     } else {
      //       this.loading = false;
      //       this.$message.info("订单无效，支付失败!");
      //     }
      //   }).catch(err => {
      //     this.loading = false;
      //     console.error('微信支付失败 =>', err);
      //   })
      // },
      // 微信支付
      paymentByWxpay() {
        let _this = this;
        let moneyData = _this.moneyData;
        let payable_money = _this.payable_money;
        console.log(payable_money)
        this.$api.post(global.apiUrls.postPayment, {
          order_type: 4,
          product_id: this.vip_id,
          pay_vip_type: this.type_id,
          pay_type: 'wxpay',
        }).then(res => {
          console.log(res);
          this.sn = res.data.data.order_sn;
          console.log(this.sn);
          if (this.sn != '') {
            this.$api.post(global.apiUrls.wxpayOrder, {
              order_sn: this.sn,
            }).then(res => {
              console.log("微信支付回调", res);
              if (res.data.code == 1) {
                let data = res.data.data;
                console.log(data)
                uni.requestPayment({
                  provider: 'wxpay',
                  // #ifdef MP-WEIXIN
                  // timeStamp: data.timeStamp,
                  // nonceStr: data.nonceStr,
                  // package: data.package,
                  // signType: data.signType,
                  // paySign: data.paySign,
                  // #endif
                  // #ifdef APP-PLUS
                  orderInfo: data,
                  // #endif
                  success: (e) => {
                    console.log('success', e)
                    if (e.errMsg == 'requestPayment:ok') {
                      this.paySuccess(payable_money);
                    }
                  },
                  fail: (e) => {
                    console.log('fail', e);
                    // #ifdef APP-PLUS
                    let failMsg = 'requestPayment:fail canceled';
                    // #endif
                    if (e.errMsg == failMsg) {
                      this.$message.info('取消支付');
                    } else {
                      this.$message.info("支付失败");
                      // this.$message.info("支付失败,原因为: " + e.errMsg);
                    }
                  },
                  complete: () => {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
                this.$message.info("订单无效，支付失败!");
              }
            }).catch(err => {
              this.loading = false;
              console.error('微信支付失败 =>', err);
            })
          }


        }).catch(err => {

        })

      },

      // 支付宝支付
      // #ifndef MP-WEIXIN
      paymentByAlipay() {
        let _this = this;
        let moneyData = _this.moneyData;
        let payable_money = _this.payable_money;
        console.log(payable_money)
        this.$api.post(global.apiUrls.postPayment, {
          order_type: 4,
          product_id: this.vip_id,
          pay_vip_type: this.type_id,
          pay_type: 'alipay',
        }).then(res => {
          console.log(res);
          this.sn = res.data.data.order_sn;
          console.log(this.sn);
          if (this.sn != '') {
            this.$api.post(global.apiUrls.alipayOrder, {
              order_sn: this.sn,
            }).then(res => {
              console.log("支付宝支付回调", res);
              if (res.data.code == 1) {
                uni.requestPayment({
                  provider: 'alipay',
                  orderInfo: res.data.data,
                  success: (e) => {
                    console.log(e)
                    if (e.errMsg == 'requestPayment:ok') {
                      this.paySuccess(payable_money);
                    }
                  },
                  fail: (e) => {
                    console.log(e)
                    if (e.errMsg == 'requestPayment:fail canceled') {
                      this.$message.info('取消支付');
                    } else {
                      this.$message.info("支付失败");
                    }
                  },
                  complete: () => {
                    this.loading = false;
                  }
                })
              } else {
                this.loading = false;
                this.$message.info("订单无效，支付失败");
              }
            }).catch(err => {
              this.loading = false;
              console.log("支付宝支付失败 => ", err);
            })
          }


        }).catch(err => {

        })

      },
      // #endif

      // 支付成功
      paySuccess(payable_money) {
        console.log(payable_money)
        uni.reLaunch({
          url: '/pages/index/course/payment-success?data=' + payable_money
        })
      },

    },
  }
</script>

<style lang='scss'>
  .page{
    padding-top: 100rpx;
  }
  .cu-bar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    border-bottom: 1rpx solid #EEEEEE;
    background-color: #FFFFFF;

    .cu-bar-center {
      padding-left: 60rpx;
      color: #333333;
      font-size: 36rpx;
    }

    .cu-bar-box {
      display: flex;
      align-items: center;
      padding-right: 32rpx;
      width: 100rpx;
      height: 1rpx;
      margin-right: 32rpx;




      .cu-bar-left {

        .action {
          margin: 0;
        }
      }

      .cu-bar-right {
        width: 40rpx;
        height: 40rpx;
        margin-left: 24rpx;

        image {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }

  .radio-scale {
    transform: scale(0.7);
  }

  .price-box {
    background-color: #fff;
    height: 220rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #FE535B;
    margin-bottom: 20rpx;
    text-align: center;

    .text-price {
      color: #202020;
      font-size: 32rpx;
      margin-bottom: 20rpx;
    }

    .text-price::before {
      display: none;
    }

    .price {
      font-size: 32rpx;
      font-weight: 400;
    }
  }

  .pay-type-list {
    background-color: #fff;
    padding: 40rpx 32rpx 0;

    .type-item {
      padding: 32rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30upx;
      position: relative;
      border-bottom: 1rpx solid #EEEEEE;
    }

    .pay-text {
      color: #202020;
      font-size: 32rpx;
      padding-bottom: 10rpx;
    }

    .icon {
      width: 100upx;
      font-size: 52upx;
    }

    .icon-erjiye-yucunkuan {
      color: #fe8e2e;
    }

    .icon-weixinzhifu {
      color: #36cb59;
    }

    .icon-alipay {
      color: #01aaef;
    }

    .tit {
      font-size: 28rpx;
      color: #202020;
      margin-bottom: 10rpx;
    }

    .con {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: $uni-font-size-sm;
      color: #909399;
    }

  }

  .block-44 {
    width: 44rpx;
    min-width: 44rpx;
    height: 44rpx;
    min-height: 44rpx;
  }

  .bottom-btn {
    position: fixed;
    bottom: 40rpx;
    left: 32rpx;
    right: 32rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    color: #ffffff;
    background: #01CBD3;
    border-radius: 50rpx;
  }

  .type-item:last-child {
    border-bottom: none;
  }
</style>
