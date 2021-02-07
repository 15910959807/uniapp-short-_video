<template>
  <view class="page-wrapper">

    <view class="page-header">
      <view class="page-content" v-for="(item ,index) in info" :key="index" @click="clickMessage(item.id)">
        <view class="title">
          <text>
            {{item.title}}
          </text>
        </view>
        <view class="text">
          <text>{{item.content}}</text>
        </view>
        <view class="time">
          <text>{{item.create_time}}</text>
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
        content: '',
        title: '',
        create_time: '',
        last_page: '', //总页数
        page: 2, //上拉加载的起始页(默认从第二页开始加载) 2
        loadingnum: 5, //加载条数
        send: false, //上拉加载的状态  避免数据没更新时重复请求

      };
    },
    onShow() {
      this.getdata(); //获取数据
    },
    onLoad() {
      this.userInfo = global.userInfo || {};


    },
    //上拉加载
    onReachBottom() {
      //判断总页数是否大于1
      console.log(this.page)

      let _this = this;
      if (this.last_page > 1) {
        if (this.send == false) {
          if (this.page <= this.last_page) {
            //开始加载
            this.send = true;
            // this.loadings = true;//这个是上拉的特效
            uni.showLoading({
              title: '加载中'
            });
            this.$api.post(global.apiUrls.postMessage, {
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
                  setTimeout(() => {
                    _this.info = [...info, ...res.data.data.data];
                    _this.send = false;
                    console.log(_this.info, 'info');
                    uni.hideLoading()
                  }, 500)
                  _this.page++;

                } else {
                  this.$message.info('诶呀,加载失败了稍后再试试吧');
                  this.send = false;
                }

              }).catch(err => {
                // console.log(res)
                this.send = false;
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
        this.$api.post(global.apiUrls.postMessage, {
          // 传入参数
          is_more: 1,
          page: 1,
          limit: this.loadingnum
        }).then(res => {
          setTimeout(function() {
            uni.hideLoading();
          }, 500);
          // 接口请求成功做些什么
          console.log(res)
          this.info = res.data.data.data;
          this.last_page = res.data.data.last_page;
          console.log(this.last_page)

        }).catch(err => {
          // 接口请求失败做些什么
        })
      },

      clickMessage(id) {
        uni.navigateTo({
          url: '/pages/index/details/message?detail=' + id
        })
      },
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
