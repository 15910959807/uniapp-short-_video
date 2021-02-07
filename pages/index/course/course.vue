<template>
  <view class="page-wrapper">
    <!-- header start -->
    <view class="cu-bar">
      <uni-icons @tap="BackPage" class="action" type="arrowleft" size="24"></uni-icons>

      <view class="cu-bar-center">
        <text>课程详情</text>
      </view>

      <view class="cu-bar-box">
        <view class="cu-bar-left">
          <view @click="agree">
            <uni-icons v-if="is_collection==0" class="action1" color="#666666" type="star" size="24"></uni-icons>
            <uni-icons v-else class="action2" color="#01CBD3" type="star-filled" size="24"></uni-icons>
          </view>
        </view>
        <view class="cu-bar-right" @tap="openPopup('share')">
          <image src="/static/images/fenx.png" mode=""></image>
        </view>
      </view>
    </view>

    <!-- header end -->
    <!-- 视频 -->
    <view class="header-video">
      <!-- <video autoplay src="http://dsp.niurenjianzhan.com/uploads/files/duanshipin/20201219/356eee4f1d91baf2ebabd928244906d8.mp4" controls></video> -->
      <video v-if="this.user_type==1" enable-play-gesture="true" show-center-play-btn="true"
        enable-progress-gesture="true" @play="playVideo()" :src="video_path_url" controls></video>
      <view v-else class="header-video-bg" @click="playVideoVip()">
        <image src="/static/images/bo_fang.png" mode=""></image>
      </view>
      <!-- <video show-center-play-btn="true" src="http://dsp.niurenjianzhan.com/uploads/files/duanshipin/20201219/356eee4f1d91baf2ebabd928244906d8.mp4" controls></video> -->

    </view>

    <view class="video-bg">

    </view>
    <view class="course-wrapper">
      <view class="course-con">
        <view class="title">
          <text>{{title}}</text>
        </view>
        <view class="text1">
          <text>按摩时长{{duration}}分钟</text>
        </view>
        <view class="text">
          <!-- <fu-parse class="site" :content="body"></fu-parse> -->
          <rich-text class="site" :nodes="body"></rich-text>
        </view>
      </view>
    </view>

    <view class="page-health">
      <view class="health">
        <view class="health-title">
          <view class="title">
            <text>评论({{comment_list_total}})</text>
          </view>
        </view>

        <view class="comment">
          <view class="header-portrait" v-for="(item ,index) in comment_list" :key="index" v-if="comment_list.length>0">
            <view class="left">
              <u-lazy-load img-mode="widthFix" style="width: 72rpx;
        height: 72rpx;" border-radius="72" :image="item.head_img"></u-lazy-load>
            </view>
            <view class="right">
              <view class="title ellipsis">
                <text>{{item.user_nickname}}</text>
              </view>
              <view class="text ellipsis">
                <text>{{item.comment_create_time}}</text>
              </view>
              <view class="comment-text">
                <text>{{item.content}}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="emptypinglun" v-if="comment_list.length==0">暂无评论，快来说两句吧！</view>



        <fu-notwork></fu-notwork>

        <view class="comment-issue" :style="{bottom:inputHeight}">
          <input :adjust-position="false" maxlength="200" type="text" value="" placeholder="写评论..." @focus="focusFn"
            @blur="blurFn" v-model="content" @confirm="send()" @keyboardheightchange="inputHeightChange($event)" />
          <button type="default" v-if="isFocus" @click="send">发布</button>
        </view>

      </view>
    </view>

    <fu-share ref="share" :info="shareInfo"></fu-share>
    <!-- <fu-share ref="share" :info="shareInfo" @getPosterInfo="getShareCode"></fu-share> -->
  </view>

</template>

<script>
  export default {
    data() {
      return {
        src: '',
        comment_list: [], //评论列表
        isFocus: false,
        content: '',
        comment_listLength: '', //评论长度
        comment_list_total: '', //评论总数
        title: '', //标题
        duration:'',//按摩时长
        body: '', //文章
        video_path_url: '', //视频链接
        is_collection: 0, //是否收藏
        inputHeight: 0, // 输入框距离底部的距离 === 键盘的高度
        last_page: '', //总页数
        page: 2, //上拉加载的起始页(默认从第二页开始加载) 2
        loadingnum: 5, //加载条数
        sends: false, //上拉加载的状态  避免数据没更新时重复请求
        // productlist:[],//数据盒子
        info:[],//分享
        shareInfo: {},
		user_type:'',

      }
    },
    computed: {
      // shareInfo() {
      //   return {
      //     goodsName: '家有儿推',
      //     summary: '家有儿推，家有儿推，家有儿推，家有儿推！',
      //     href: 'http://dsp.niurenjianzhan.com/index/index/register?invite_code=10001',
      //     goodsImage: 'http://qiniu.hnmengfan.com/144x144.png',
      //     imageUrl: 'http://qiniu.hnmengfan.com/144x144.png',
      //   };
      // }

    },
    onShow() {
      this.getdata();
      this.userInfo = global.userInfo || {};
      this.userToken = global.token || {};
      // let user_type = userInfo.user_type;
      // console.log(user_type)


    },
    onLoad(options) {
      console.log(options)
      this.id = options.id;
      this.bind_id = options.bind_id;
      console.log(this.id,this.bind_id)
      this.getShare();
      // this.agree();
      // this.getComments()
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
            this.$api.post(global.apiUrls.getVideoVideoDetail, {
                video_id: this.id,
                is_more: 1,
                page: this.page,
                limit: this.loadingnum,
                bind_id:this.bind_id,
              })
              .then(res => {
                const {
                  comment_list
                } = this;
                console.log(res)
                if (res.data.code == 1) {
                  //延迟加载数据 减少并发量
                  // setTimeout(() => {
                  _this.comment_list = [...comment_list, ...res.data.data.comment_list.data];
                  _this.sends = false;
                  console.log(_this.comment_list, 'comment_list');
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
      //获取数据
      getdata() {
        uni.showLoading({
            title: '加载中'
        });
        this.$api.post(global.apiUrls.getVideoVideoDetail, {
          // 传入参数
          video_id: this.id,
          is_more: 1,
          page: 1,
          limit: this.loadingnum,
          bind_id:this.bind_id,
        }).then(res => {
          // 接口请求成功做些什么
          setTimeout(function () {
              uni.hideLoading();
          }, 500);
          // console.log(res)
          this.comment_list = res.data.data.comment_list.data;
          this.comment_listLength = this.comment_list.length;
          this.comment_list_total = res.data.data.comment_list.total;
          this.body = res.data.data.desc;
          this.title = res.data.data.title;
          this.duration = res.data.data.duration;
          this.video_path_url = res.data.data.video_path_url;
          this.is_collection = res.data.data.is_collection;
          this.last_page = res.data.data.comment_list.last_page;
          this.info = res.data.data;
          this.user_type = res.data.data.user_arr.user_type;
          console.log(this.user_type)


        }).catch(err => {
          // 接口请求失败做些什么
        })
        uni.onKeyboardHeightChange(res => {
          // console.log(res.height,res.height*750/uni.getSystemInfoSync().windowWidth,uni.getSystemInfoSync())
          // let bottom = 32*750/uni.getSystemInfoSync().windowWidth
          // this.inputHeight = Math.floor(res.height*750/uni.getSystemInfoSync().windowWidth - bottom)+'rpx';
          this.inputHeight = (res.height) + 'px'

        })
      },
      // 监听键盘高度变化
      inputHeightChange(event) {
        // console.log('xxxxx', event)
        this.inputHeight = event.detail.height
      },
      //返回上一页
      BackPage() {
        uni.navigateBack({
          delta: 1
        });
      },
      // 收藏是否选中
      agree() {
        var self = this;
        // console.log(this.id)
        this.$api.post(global.apiUrls.postWorkLike, {
          // 传入参数
          video_id: this.id,
          bind_id: this.bind_id,

        }).then(res => {
          // 接口请求成功做些什么
          var res = res.data;
          if (res.code == 1) {
            // 收藏
            self.is_collection = self.is_collection == 1 ? 0 : 1
            // console.log(self.is_collection)
            // self.detail.collection_num = self.is_collection==1 ? self.detail.collection_num+1 : self.detail.collection_num-1
            // self.$message.info(res.msg)
          }

        }).catch(err => {
          // 接口请求失败做些什么
        })

      },
      getComments() {
        var self = this
        this.$api.post(global.apiUrls.getVideoVideoDetail, {
          video_id: this.id,
          bind_id:this.bind_id,
        }).then(res => {
          var res = res.data
          // console.log(res)
          if (res.code == 1) {
            self.comment_list = res.data.comment_list.data;
            self.comment_listLength = self.comment_list.length;
            self.comment_list_total = res.data.comment_list.total;

            // console.log(self.last_page)
            // console.log(self.comment_list.total)
            let data = {
              id: this.id,
              num: self.comment_list.total
            }
            // console.log(data)
            // uni.$emit('undateCommentNum',data);
          }
        })
      },
      focusFn() {
        this.isFocus = true;
      },
      blurFn() {
        uni.hideKeyboard();
        if (this.content == '') return this.isFocus = false;
      },
      // 提交评论
      send() {
        if (!global.token) {
          this.$urouter.navigateTo({
            url: '/pages/login/login',
            params: {}
          })
          this.$util.navigateToLogin();
          return false
        }
        var self = this
        if (this.content.trim() == '') {
          self.$message.info('评论不能为空')
          return false
        }
        // this.$util.throttle(()=>{
          this.$api.post(global.apiUrls.postWorkAddRemark, {
            video_id: this.id,
            content: this.content
          }).then(res => {
            // console.log(1)
            self.content = ''
            // self.$message.info(res.data.msg)
            self.$message.info('评论成功');
            self.isFocus = false;
            self.getComments();


          })
        // },2000)

      },

      // 视频播放
      playVideo: function(e) {},
      // 视频购买会员提示
      playVideoVip() {
        uni.showModal({
          title: '该视频仅为会员免费开放',
          // content: '取消',
          showCancel: true,
          confirmText: '成为会员',
          confirmColor: '#01CBD3',
          success: (res) => {
            if (res.confirm) {
              if(!token){
                uni.navigateTo({
                  url:'/pages/login/login'
                })
              }else{
                uni.navigateTo({
                  url:'/pages/index/vip-center-two/index'
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        })
      },


      // 打开弹窗
      openPopup(type, param) {
        this.$refs[type].open(param);
      },

      //获取分享信息
      getShare(){
        this.$api.post(global.apiUrls.getShare, {
          // 传入参数
        }).then(res => {
          // 接口请求成功做些什么
          this.shareInfo = res.data.data
          // console.log(this.shareInfo,'分享信息')
        }).catch(err => {
          // 接口请求失败做些什么
        })
      }
    }
  }
</script>

<style lang="scss">
  // header start
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

  // header end


  page {
    width: 100%;
    height: auto;
    min-height: 100%;
    background: #F6F7F9;

    .page-wrapper {}
  }

  .header-video {
    width: 100%;
    height: 340rpx;
    position: fixed;
    left: 0;
    top: 100rpx;
    z-index: 1;
    background-color: #000000;


    .header-video-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 340rpx;

      image {
        width: 60rpx;
        height: 60rpx;
      }
    }

    video {
      width: 100%;
      height: 340rpx;
    }
  }

  .video-bg {
    height: 440rpx;
  }

  .course-wrapper {
    padding: 40rpx 32rpx;
    margin-bottom: 20rpx;
    background-color: #FFFFFF;

    .course-con {
      .title {
        color: #333333;
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 24rpx;
      }
      .text1{
        color: #000;
        font-size: 30rpx;
        line-height: 54rpx;
      }

      .text {
        color: #666666;
        font-size: 28rpx;
        line-height: 54rpx;
        word-wrap: break-word;

        image {
          width: 100%;
        }
      }
    }
  }

  // 保健推拿
  .page-health {
    padding-bottom: 104rpx;

    .health {
      background-color: #FFFFFF;
    }

    .health-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 17rpx 32rpx;
      height: 109rpx;

      .title {
        color: #333333;
        font-size: 32rpx;
        font-weight: bold;
        position: relative;
        padding-left: 35rpx;
        flex: 1;

        &:after {
          content: "";
          position: absolute;
          left: 16rpx;
          top: 8rpx;
          width: 8rpx;
          height: 29rpx;
          border-radius: 45rpx;
          background-color: #01CBD3;
        }
      }

    }




  }

  .header-portrait {
    position: relative;
    display: flex;
    padding: 16rpx 32rpx 16rpx;


    .left {
      width: 72rpx;
      height: 72rpx;
      border-radius: 50%;

      image {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
      }
    }

    .right {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-left: 16rpx;
      border-bottom: 1rpx solid #EEEEEE;
      overflow: hidden;

      .title {
        width: 100%;
        color: #333333;
        font-size: 24rpx;
        margin-bottom: 8rpx;
      }

      .text {
        color: #999999;
        font-size: 22rpx;
        margin-bottom: 24rpx;
      }

      .comment-text {
        width: 100%;
        color: #333333;
        font-size: 32rpx;
        padding-bottom: 32rpx;
        word-wrap: break-word;
      }
    }

  }

  .header-portrait:last-child {
    padding-bottom: 0rpx;

    .right {
      border: none;
    }
  }

  .emptypinglun {
    text-align: center;
    padding-bottom: 30rpx;
  }

  .comment-issue {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 14rpx 32rpx;
    border: 1px solid #EEEEEE;
    position: fixed;
    bottom: 0;
    background: #FFFFFF;

    input {
      height: 72rpx;
      box-sizing: border-box;
      border: none !important;
      border-radius: 45rpx;
      width: 100%;
      background-color: #F6F7F9;
      padding-left: 32rpx;
      color: #BFBFBF;
      font-size: 28rpx;
    }

    button {
      width: 136rpx;
      height: 56rpx;
      line-height: 56rpx;
      color: #FFFFFF;
      font-size: 28rpx;
      background-color: #01CBD3;
      border-radius: 50rpx;
      margin-left: 32rpx;

      &::after {
        border: none;
      }
    }
  }

  .loading-wapper {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20upx;

    &.mj {
      display: flex;
    }

    text {
      font-size: 24upx;
      color: #999999;
    }
  }

  .loading-icon {
    margin: 0 10upx;
    width: 40upx;
    height: 40upx;
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: a 1s steps(12) infinite;
    animation: a 1s steps(12) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }

  .loading-txt {
    font-size: 24upx;
    font-weight: normal;
    line-height: 40upx;
    color: #999999;
  }

  @-webkit-keyframes a {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg)
    }

    to {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn)
    }
  }

  @keyframes a {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg)
    }

    to {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn)
    }
  }

  .public-page-empty {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 120upx 0 0 0;

    .txt {
      font-size: 28upx;
      color: $uni-text-color;
      text-align: center;
      line-height: 100upx;
      color: #999;
    }

    .loadTips {
      line-height: 30upx;
    }

    .btn {
      width: 260upx;
      height: 78upx;
      line-height: 78upx;
      background: $fu-btn-bg;
      opacity: 1;
      border-radius: 44upx;
      font-size: 28upx;
      color: #fff;
      text-align: center;
      margin-top: 100upx;
    }
  }
</style>
