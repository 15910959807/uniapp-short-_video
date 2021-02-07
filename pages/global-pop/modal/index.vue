<template>
  <view>
    <custom-pop-modal ref="customPopModal"></custom-pop-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  onReady(){
    this.$refs.customPopModal.handleShow(global.customShowModelPopupOptions)
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
<!-- {
      "path": "pages/global_pop/modal/index",
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "animationType": "none",
          "background": "transparent",
          "backgroundColor": "rgba(0,0,0,0)",
          "popGesture": "none"
        }
      }
    }, -->
<!-- global.customShowModalPopup(this)
<custom-pop-modal ref="customPopmodal"></custom-pop-modal>
 -->
