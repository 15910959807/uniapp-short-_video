<template>
  <view class="page-wrapper">

    <view class="page-header">
      <view class="recommend-item" v-for="(item3 ,index) in article" :key="index.id" @click="recommend(item3.id)">
        <view class="left">
          <u-lazy-load img-mode="widthFix" style="width: 180rpx;
      height: 180rpx;" border-radius="16" :image="item3.image_url"></u-lazy-load>
        </view>
        <view class="right">
          <view class="title text-line">
            <text>{{item3.title}}</text>
          </view>
          <view class="text ellipsis">
            <text>{{item3.article_create_time}}</text>
          </view>
        </view>
      </view>


    </view>


  </view>
</template>

<script>
export default {
  data() {
    return {
      article:"",
      last_page: '', //总页数
      page: 2, //上拉加载的起始页(默认从第二页开始加载) 2
      loadingnum: 10, //加载条数
      send: false, //上拉加载的状态  避免数据没更新时重复请求
      // productlist:[],//数据盒子
    }
  },
	onShow() {

	},
  onLoad() {
    this.getdata();//获取初始列表数据
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
          this.$api.post(global.apiUrls.postArticleList, {
              is_more: 1,
              page: this.page,
              limit: this.loadingnum,
            })
            .then(res => {
              const {
                article
              } = this;
              console.log(res)
              if (res.data.code == 1) {
                //延迟加载数据 减少并发量
                setTimeout(() => {
                _this.article = [...article, ...res.data.data.data];
                _this.send = false;
                console.log(_this.article, 'article');
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
    getdata(){
		uni.showLoading({
		    title: '加载中'
		});
      // 请求文章推送
      this.$api.post(global.apiUrls.postArticleList, {
        // 传入参数
        is_more: 1,
        page: 1,
        limit: this.loadingnum
      }).then(res => {
        setTimeout(function () {
            uni.hideLoading();
        }, 500);
        // 接口请求成功做些什么
      	this.article = res.data.data.data;
        this.last_page = res.data.data.last_page;
        console.log(this.article)
        console.log(res)
      }).catch(err => {
        // 接口请求失败做些什么
      })
    },
	  //查看更多进去推送中心详情
    recommend(id){
      uni.navigateTo({
          url:'/pages/index/details/index?detail=' +id
      })
    },
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
