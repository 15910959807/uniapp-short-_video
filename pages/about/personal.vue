<template>
  <view class="page-wrapper">
    <view class="grace-body">
      <form @submit="formSubmit" class="grace-form grace-margin-top">
        <!-- header start -->
        <view class="cu-bar">
        	<uni-icons @tap="BackPage" class="action"  type="arrowleft" size="24"></uni-icons>

          <view class="title">
            <text>个人信息</text>
          </view>

          <view class="cu-bar-text">
            <!-- 保存按钮 -->
            <button formType="submit">保存</button>
          </view>
        </view>
        <!-- header end -->
        <!-- 顶部头像模块 -->
        <view class="head_list cu-list menu">
          <view class="cu-item">
            <view class="content" style="display: flex;justify-content: space-between;align-items: center;">
              <text class="title text-lg text-black">头像</text>
              <view class="demo-face grace-relative grace-img-in">
                <u-lazy-load img-mode="widthFix" style="width: 88rpx;height: 88rpx;" border-radius="88" @tap="chooseImage" :image="head_img || thumb"></u-lazy-load>
              </view>
            </view>
          </view>
        </view>
        <view class="cu-list menu">
          <!-- 昵称 -->
          <view class="cu-item">
            <view class="content" style="display: flex;justify-content: space-between;align-items: center;">
              <text class="title text-lg text-black">姓名</text>
              <input type="text" class="input text-black text-lg" name="user_nickname" maxlength="10" v-model="user_nickname" placeholder="请输入昵称"
                style="text-align: right;"></input>
            </view>
          </view>

          <!-- 手机号 -->

          <view class="cu-item arrow" @tap="handleJump" data-url="/pages/index/setting/verify-oldphone" >
            <view class="content" style="display: flex;justify-content: space-between;align-items: center;">
              <text class="title text-lg text-black">手机号码</text>
              <input type="text" class="input text-black text-lg" name="mobile" maxlength="10" v-model="mobile" disabled="" placeholder="请输入手机号"
                style="text-align: right;"/>
            </view>
          </view>

          <!-- 性别 -->
          <view class="cu-item arrow">
            <view class="content" style="display: flex;justify-content: space-between;">
              <text class="title text-lg text-black">性别</text>
              <picker @change="bindPickerChange" :value="sexIndex" :range="sex" name="sex">
                <text class="text-black text-lg">{{sex[sexIndex]}}</text>
              </picker>
            </view>
          </view>


        </view>
      </form>
      <w-picker mode="region" :defaultVal="defaultVal" @confirm="onConfirm" ref="region" themeColor="#f00"></w-picker>
      <fu-notwork></fu-notwork>
    </view>



  </view>
</template>

<script>
  import wPicker from "@/components/w-picker/w-picker.vue";
  import {
    UploadImage
  } from '@/common/utils/index';
  // const Checker = require("@/common/js/formValidation.js")
  let timer = null;
  export default {
    components: {
      wPicker
    },
    data() {
      return {
        isLoading: false, // 是否加载中
        userInfo: {},
        head_img: '', // 用户头像
        user_nickname: '', // 用户昵称
        sexIndex: 0,
        sex: ['保密', '男', '女'],
        // dateValue: "请选择生日",
        mobile: '', // 手机号码
        name: "点击选择",
        mode: "region",
        defaultVal: [1, 0, 0], // 城市编码
        city1: [], // 对应的省市区
        thumb: global.SYSTEM_CONFIG.logo
      }
    },
    onShow(){
      if(global.userInfo == null){
        uni.navigateTo({
          url:'/pages/login/login'
        })
      }

    },
    onLoad(option) {
      console.log('传过来的数据',global.userInfo)
      let userInfo = Object.assign({}, global.userInfo);
      this.userInfo = userInfo;
      this.head_img = userInfo.head_img ? userInfo.head_img : '';
      this.user_nickname = userInfo.user_nickname;
      this.sexIndex = userInfo.sex ? userInfo.sex : 0;
      // this.dateValue = userInfo.birthday ? userInfo.birthday : '请选择生日';
      this.mobile = userInfo.mobile;
      this.name = userInfo.address ? userInfo.address : '点击选择';
      this.defaultVal = userInfo.address ? userInfo.address_code : [1, 0, 0];
      //手机号修改之后
      uni.$on('changeMobile',data=>{
        // console.log(data);
        var mobile = data.substr(0,3)+"****"+data.substr(7);
        this.mobile = mobile;
      })
      // 监听上传头像
      uni.$on('uAvatarCropper', path => {
        this.uploadUserImg(path);
      })
    },
    onUnload() {
      uni.$off("uAvatarCropper");
    },
    methods: {
      //返回上一页
      BackPage() {
      	uni.navigateBack({
      		delta: 1
      	});
      },
      handleJump(){
        uni.navigateTo({
          url:"./verify-oldphone"
        })
      },
      toggleTab() {
        this.$refs[this.mode].show();
      },

      // 性别选择
      bindPickerChange: function(e) {
        this.sexIndex = e.detail.value;
      },

      // 生日选择
      bindDateChange: function(e) {
        let selectTime = new Date(e.detail.value)
        let nowTime = new Date()
        if(selectTime > nowTime) {
          this.$message.info('请选择正确的时间')
          return
        }
        this.dateValue = e.detail.value;
      },

      // 所在地选择
      onConfirm(result) {
        let { province, city, area } = result.obj;
        let text = [province.label, city.label, area.label];
        let code = [province.value, city.value, area.value];
        this.name = text.join("-");
        this.city1 = text;
        this.defaultVal = code;
      },

      chooseImage() {
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: res => {
            // 抽离出uview-ui中的头像裁剪插件来使用
            uni.navigateTo({
              url: '/pages/about/avatar-cropping?destWidth=200&rectWidth=200&fileType="jpg"&myImgUrl=' +
                res.tempFilePaths[0],
              animationDuration: 0
            })
          }
        });
      },
      // 修改头像


      // 表单提交
      formSubmit: function(e) {
        console.log(e.detail.value)
        if (this.isLoading) return;
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          var formData = e.detail.value;

          // 添加头像
          formData.head_img = this.head_img;

          // 添加用户ID
          formData.user_id = this.userInfo.id ? this.userInfo.id : '';

          // 进行表单验证操作
          let validateRes = this.doValidate(formData);
          if (validateRes) {
            this.$message.info(validateRes);
            return;
          }

          this.isLoading = true;
          this.$api.post(global.apiUrls.perfectData, formData).then(res => {
            // setTimeout(() => {
            //   this.isLoading = false;
            // }, 500)
            if (res.data.code == 1) {
              this.isLoading = false;
              // 更新本地缓存
              uni.setStorageSync('USER_INFO', res.data.data.userinfo);

              // 更新global
              global.userInfo = res.data.data.userinfo;
              this.$message.info('修改成功');
              setTimeout(() => {
                uni.navigateBack();
              }, 500);
            }

          }).catch(err => {
            this.isLoading = false;
            console.log(err)
          })
        }, 300);
      },

      // 进行表单字段值校验
      doValidate(formData) {
        console.log(formData);

        // 昵称
        if (!formData.user_nickname) {
          return '请输入您的用户昵称';
        }

        if (formData.user_nickname.length > 10) {
          return '请检查您的昵称(最多10个字符)'
        }

        // 生日
        // if (!formData.birthday) {
        //   return '请选择您的生日';
        // }

        return '';
      },

      // 上传用户头像
      uploadUserImg(blob) {
        uni.showLoading()
        let _this = this;

        // 开始上传
        new UploadImage([blob], {
          complete: function(res) {
            uni.hideLoading();
            if (res.length) {
              _this.head_img = res[0].path;
               var formData = {
                 head_img: res[0].path
               };
               // _this.$api.post(global.apiUrls.perfectData, formData).then(res => {
               //   if (res.data.code == 1) {
               //     // 更新本地缓存
               //     uni.setStorageSync('USER_INFO', res.data.data.userinfo);
               //     // 更新global
               //     global.userInfo = res.data.data.userinfo;
               //   }
               // })
            }
          }
        });
      }
    },
  }
</script>

<style lang="scss">
page {
  width: 100%;
  height: auto;
  min-height: 100%;
  background: #F6F6F6;
}
.cu-list.menu>.cu-item.arrow:before{
  font-size: 28rpx;
}
.cu-list.menu>.cu-item.arrow{
  padding-right: 68rpx;
}
.cu-list.menu>.cu-item{
  min-height: auto;
  padding: 32rpx 32rpx;
}
.cu-list.menu{
  margin-top: 0rpx;
}
// header start
  .cu-bar{
    position: relative; z-index: 9;
    border-bottom: 1px solid #E6E6E6;
        background: #ffffff;

    .title{

      text{
        color: #333333;
        font-size: 36rpx;
      }
    }

    .cu-bar-text{
      margin-right: 30rpx;
      button{
        color: #999999;

        &:after{
          opacity: 0;
        }
      }

      text{
        color: #999999;
        font-size: 28rpx;
      }
    }
  }
  // header end

  .demo text {
    margin: 10upx;
  }

  .demo-face {
    width: 88rpx;
    height: 88rpx;
  }

  .demo-face image {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
  }

  .picker {
    background: #00B26A;
    width: 100%;
    line-height: 40px;
  }

  .head_list {
    background: #fff;
    border-bottom: 1px solid #EEEEEE;
  }

  .other {
    width: 500rpx;
    text-align: right;
  }

  .address {
    display: inline-block;
    width: 110rpx;
  }
  .cu-item.arrow::before{
    color: #BFBFBF!important;
  }

  .address-select {
    display: inline-block;
    width: 350rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .content .title{
    display: inline-block;
    font-size: 32rpx;
  }
  .text-align-right{text-align: right;}

button::after{
  border: none;
}
button{
  background-color: #FFFFFF;
  color: #999999;
  font-size: 28rpx;
  padding: 0;
}

.content{

  .title{
    width: 140rpx;
  }
  .text{
    color: #666666;
    font-size: 32rpx;
  }
}

</style>
