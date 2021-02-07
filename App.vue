<style lang="scss">
  /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
  @import "uview-ui/index.scss";
</style>
<script>
  import {
    WS_HOST
  } from '@/common/config.js'
  import {
    mapActions
  } from 'vuex';
  export default {
    onLaunch: function() {
      uni.onTabBarMidButtonTap(() => {
        console.log('666')
        this.$urouter.navigateTo('/pages/global_pop/publish/index')
      })
    },

    onShow: function() {
      console.log('App Show')
    },

    onHide: function() {
      uni.$emit('APP_HIDE', {
        msg: 'app hide'
      })
    },

    methods: {
      ...mapActions(['messageReceived']),
      updateApp() {
        let _this = this;
        plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
          this.$api.post(global.apiUrls.publicUpdateAPP, {
            version_name: widgetInfo.version,
            type: 1
          }).then(res => {
            if (res.data.code == 1 && res.data.data.is_new == 1) {
              plus.nativeUI.toast('检测到新版本' + res.data.data.version_name + '，后台更新中...');
              let wgtUrl = res.data.data.version_url;
              let apkUrl = res.data.data.version_apk_url || '';
              uni.downloadFile({
                url: wgtUrl,
                success: (downloadResult) => {
                  if (downloadResult.statusCode === 200) {
                    plus.runtime.install(downloadResult.tempFilePath, {
                      force: false
                    }, function() {
                      plus.runtime.restart();
                    }, function(e) {
                      if (plus.os.name == 'Android' && apkUrl) {
                        uni.downloadFile({
                          url: apkUrl,
                          success: (downloadResult) => {
                            if (downloadResult.statusCode === 200) {
                              plus.runtime.install(downloadResult.tempFilePath);
                            }
                          }
                        });
                      }
                    });
                  } else if (downloadResult.statusCode === 400) {
                    if (plus.os.name == 'Android' && apkUrl) {
                      uni.downloadFile({
                        url: apkUrl,
                        success: (downloadResult) => {
                          if (downloadResult.statusCode === 200) {
                            plus.runtime.install(downloadResult.tempFilePath);
                          }
                        }
                      });
                    }
                  }
                }
              });
            }
          })
        });
      }
    }
  }
</script>

<style>
  /* #ifndef APP-PLUS-NVUE */
  @import "./common/css/base.css";
  @import "./common/css/icon.css";
  @import "./common/css/main.css";
  @import "./common/css/animation.css";
  @import "./common/css/font/iconfont.css";
  @import "./common/css/font/iconfont2.css";
  /* #endif */

  /* #ifdef H5 */
  uni-toast {
    z-index: 999999999;
  }

  uni-toast .uni-sample-toast {
    z-index: 999999999;
  }

  checkbox .uni-checkbox-input {
    width: 38upx;
    height: 38upx;
    border-radius: 50%;
  }

  checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    border: 1px solid #FE922B;
    background: #FE922B;
    color: #fff !important;
    border-color: #FFFFFF !important;
  }

  uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
    border-color: #CCCCCC !important;
  }

  checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
    font-size: 18px;
  }

  radio .uni-radio-input {
    width: 38upx;
    height: 38upx;
    border-radius: 50%;
  }

  radio .uni-radio-input.uni-radio-input-checked {
    border: 1px solid #FE922B;
    background: #FE922B;
    color: #fff !important;
  }

  radio .uni-radio-input.uni-radio-input-checked:before {
    font-size: 18px;
  }

  /* #endif */
  /* #ifndef APP-PLUS-NVUE */
  checkbox .wx-checkbox-input {
    width: 38upx;
    height: 38upx;
    border-radius: 50%;
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    border: 1px solid #FE922B;
    background: #FE922B;
    color: #fff !important;
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    font-size: 18px;
  }

  radio .wx-radio-input {
    width: 38upx;
    height: 38upx;
    border-radius: 50%;
  }

  .uni-input-input {
    color: #333;
  }

  radio .wx-radio-input.wx-radio-input-checked {
    border: 1px solid #01CBD3;
    background: #01CBD3;
    color: #fff !important;
  }

  radio .wx-radio-input.wx-radio-input-checked::before {
    font-size: 18px;
  }

  /* #endif */
</style>
