<template>
  <view @touchmove.stop.prevent :class="{'modal-box': true, 'modal-box-show': showModal, 'modal-box-show1': showModal1}">
    <view class="mask" @tap="handleClick('cancel')"></view>
    <view class="modal">
      <view class="modal__hd" v-if="title" :style="{'padding-bottom': content ? '30upx' : '70upx'}"><strong class="modal__title">{{title}}</strong></view>
      <view class="modal__bd" v-if="content" :style="'color: '+contentColor">{{content}}</view>
      <view class="modal__ft">
        <view v-if="showCancel" class="modal__btn modal__btn_default" :style="'color: '+cancelColor" @tap="handleClick('cancel')">{{cancelText}}</view>
        <view class="modal__btn modal__btn_primary" :style=" 'color:'+ confirmColor" @tap="handleClick('confirm')">{{confirmText}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'custom-pop-modal',
  data() {
    return {
      showCancel: true,
      showModal: false,
      showModal1: true,
      content: '',
      title: '',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#333333',
      cancelColor: '#333333',
      contentColor: '#999999',
    }
  },
  methods: {
    handleShow(options){
      for(let key in options) if(key != 'success') this[key] = options[key]
      this.showModal = true;
      this.showModal1 = false;
    },
    handleClick(type){
      this.showModal = false;
      global.customShowModelPopupSucess({[type]: true})
      // setTimeout(()=>{
        // #ifdef APP-PLUS
        uni.navigateBack()
        // #endif
        this.showModal1 = true;
        global.customShowModelPopupOptions = null;
        global.customShowModelPopupSucess = null;
      // }, 10)
    }
  }
};

</script>

<style lang="scss">
.modal-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: block;
  box-sizing: border-box;
  z-index: 999999;
  transition: all ease .3s;
  // transition: opacity .6s ease-in-out;
  opacity: 0;

  .mask {
    position: fixed;
    z-index: 1300;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    // transition: all ease .3s;
  }

  .modal {
    // transition: all ease .3s;
    position: fixed;
    z-index: 1300;
    width: 80%;
    max-width: 300px;
    top: 45%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #fff;
    text-align: center;
    border-radius: 28upx;
    overflow: hidden;
  }

  .modal__hd {
    padding: 70upx 50upx 30upx;
  }

  .modal__title {
    font-weight: 400;
    font-size: 32upx;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .modal__bd {
    padding: 70upx 100upx;
    font-size: 28upx;
    line-height: 1.4;
    word-wrap: break-word;
    word-break: break-all;
    color: #999;
    max-height: 400px;
    overflow-y: auto;
  }

  .modal__ft {
    position: relative;
    line-height: 100upx;
    font-size: 28upx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;

    &:after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #eee;
      color: #eee;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }

  .modal__btn {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    color: #3cc51f;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;

    &:after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      bottom: 0;
      border-left: 1px solid #eee;
      color: #eee;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleX(0.5);
      transform: scaleX(0.5);
    }
  }

  .modal__btn_default {
    color: #353535;
  }

  .modal__btn_primary {
    color: #353535;
    // background:linear-gradient(141deg,rgba(255,89,85,1) 0%,rgba(120,8,178,.8) 100%);
    // background: linear-gradient(180deg, rgba(255, 229, 142, 1) 0%, rgba(250, 216, 103, 1) 100%);
  }
}

.modal-box.modal-box-show {
  opacity: 1;
}

.modal-box.modal-box-show1 {
  z-index: -1;
}
</style>
