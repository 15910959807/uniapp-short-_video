<template>
  <view class="">
    <view class="per">

      <view class="cu-list menu">
        <view class="cu-item" :class="menuArrow?'arrow':''">
          <view class="cu-item-img">
            <image src="/static/images/old3.png" mode=""></image>
          </view>
          <view class="content flex">
            <input type="number" value="" v-model="mobile" placeholder="请输入新手机号" placeholder-style="color:#999;" maxlength="11"/>
          </view>
        </view>
        <view class="cu-item" :class="menuArrow?'arrow':''">
          <view class="cu-item-img">
            <image src="/static/images/old2.png" mode=""></image>
          </view>
          <view class="content flex">
            <input type="number" value="" v-model="code" maxlength="4" placeholder="请输入验证码" placeholder-style="color:#999;" />
            <view class="get-code" @click="getCode">{{getCodeText}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btn_cloce" style="padding:30rpx;" >
      <view class="types" @click="submit">确认</view>
    </view>
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
  import { validate } from '@/common/utils/index.js'
  export default {
    data() {
      return {
        islogin: 0,
        menuArrow: false,
        jiupassword: '',
        xinpassword: '',
        new_mobile: '',
        mobile: "",
        code: '',
        codeNew:'',
        getCodeText: '获取验证码',
        getCodeisWaiting: false,
        code_id: 0,
        change:0,
        user_nickname:'',
        head_img:'',
        sex: '',
      };
    },
    onLoad(options) {
      var user = uni.getStorageSync('USERINFO');
      this.userInfo = global.userInfo || {};
      console.log(this.userInfo)
      if (user.id > 0) {
        this.islogin = 1
      }
      // this.postGetUserInfo();
    },
    onBackPress() {
      uni.hideKeyboard()
    },
    methods: {
      getCode() {
        uni.hideKeyboard()
        if (this.getCodeisWaiting) return;
        if (!validate(this.mobile ,'phone')) {
          this.$message.info(!this.mobile ? '请输入手机号' : '请填写正确手机号码')
          return false;
        }
        // this.getCodeText = "发送中..."
        this.getCodeisWaiting = true;
        let user_id = uni.getStorageSync('USER_INFO').id
        this.$api.post(global.apiUrls.GetVerifyCode, {
          is_test: global.IS_DEV,
          mobile: this.mobile,
          type: 5,
          user_id: user_id,
        }).then(res => {
          var res = res.data;

          if (res.code == 1) {
            this.code_id = 1;
            this.$message.info('验证码已发送到您的手机，请注意查收。')
            this.setTimer();
          } else {
            this.$message.info(res.msg);
            this.getCodeText = '获取验证码';
            this.getCodeisWaiting = false;

          }
        })
      },
      setTimer() {
        clearInterval(this.Timer);
        let holdTime = 60;
         this.getCodeText = "重新获取(60)"
        this.Timer = setInterval(() => {
          if (holdTime <= 0) {
            this.getCodeisWaiting = false;
            this.getCodeText = "获取验证码"
            clearInterval(this.Timer);
            return;
          }
          this.getCodeText = "重新获取(" + holdTime + ")"
          holdTime--;

        }, 1000)
      },
      submit() {
        var type = this.change
        if (!this.mobile) {
          this.$message.info('请输入新手机号');
          return false;
        }
        if (!validate(this.mobile ,'phone')) {
          this.$message.info(!this.mobile ? '请正确输入手机号' : '请填写正确手机号码')
          return false;
        }
        if (!this.code_id) {
          this.$message.info('请先获取验证码')
          return false;
        }
        if (!this.code) {
          this.$message.info('请输入验证码')
          return false;
        }

       let data = {mobile:this.mobile,code:this.code,step:2,}
       this.$api.post(global.apiUrls.postUserGet_user_phone, data)
          .then(res => {
            var res = res.data
            this.$message.info(res.msg)
            if (res.code == 1) {
              this.postGetUserInfo();
              // if(this.isChange == 1){
                uni.$emit('changeMobile',this.mobile);
              // }
              setTimeout(() => {
               uni.navigateBack({
                   delta: 2
               });
              }, 1000)
            }

          });
      },
      //更新用户信息

      postGetUserInfo(){
        console.log(this.userInfo.head_img,this.userInfo.user_nickname,this.userInfo.sex)
        this.$api.post(global.apiUrls.perfectData, {
          head_img : this.userInfo.head_img,
          user_nickname : this.userInfo.user_nickname,
          sex : this.userInfo.sex,

        })
         .then(res => {
           console.log(res);
           //这里有问题
           if(res.data.code == 1){
             uni.setStorageSync('USER_INFO', res.data.data.userinfo);
             // 更新global
             global.userInfo = res.data.data.userinfo;
             console.log(global.userInfo)
           }


         });
      }
    }
  };
</script>

<style lang="scss">
  .get-code {
    position: absolute;
    width: 200rpx;
    height: 90upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    right: 0;
    top: 0;
    font-size: 24rpx;
    z-index: 3;
    color: $fu-main-color;

    &:after {
      content: " ";
      width: 1upx;
      height: 50upx;
      background-color: #fff;
      position: absolute;
      z-index: 3;
      left: 0;
      top: 20upx;
    }
  }

  .types {
    width: 686upx;
    height: 88upx;
    color: #FFFFFF;
    line-height: 88upx;
    background: $fu-main-color;
    opacity: 1;
    border-radius: 40px;
    margin: 0 auto;
  }

  .per {
    padding: 0;
    font-size: 28upx;
    background-color: #fff;

    .per_row {
      padding: 30upx 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ededed;

      .row_right {
        text-align: right;

        .aa {
          color: #999999;
          display: inline-block;
          margin-right: 10upx;
        }
      }
    }
  }

  .out_login {
    margin-top: 30%;
    line-height: 88upx;
    background-color: rgb(0, 129, 255);
    color: #fff;
    text-align: center;
    border-radius: 45px;
    margin-left: 25upx;
    margin-right: 25upx;
  }

  .btn_cloce {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .cu-list.menu>.cu-item{
    padding: 18rpx 0;
    min-height: auto;
    border-bottom: 1rpx solid #EEEEEE;
  }
  .cu-list.menu>.cu-item .content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 0rpx;
  }
  .cu-list{
    padding: 0 32rpx;
  }
  .cu-item-img{
    margin-right: 24rpx;
    display: flex;
    align-items: center;

    image{
      width: 36rpx;
      height: 36rpx;
    }
  }
</style>
