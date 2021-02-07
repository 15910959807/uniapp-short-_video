export default {

  /*========================================
  =            public interface            =
  ========================================*/

  // type 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手机号5绑定手机号
  GetVerifyCode: '/v1/5b5bdc44796e8',                                         // 发送验证码

  postRegisterByMobile: '/v1/5cad9f63e4f94',                                   // 注册
  perfectData: '/v1/5fc8950622139',                                     // 完善资料
  forgetPassword: '/v1/5caeeba9866aa',                                  // 忘记密码
  loginByAccount: '/v1/5c78dbfd977cf',                                  // 账号密码登录
  postUserMobileLogin: '/v1/5c78dca45ebc1',                             // 验证码登录
  postUserGet_user_phone: '/v1/5d5f4c28b8636',                          // 修改手机号，更换手机号
  postOperationGetAds: '/v1/5fe6956c9525e',                             // 获取引导页图片
  // isApplicationExist: '/v1/5d7660a421e69',                              // 第三方登录
  loginByWechat: '/v1/5d7757d28d076',                                   // 微信登录绑定手机号
  postAliYunGetStsvoucher: '/v1/5f0594f25b428',                         // 阿里云oss图片直传签名
  postQINIUToken: '/v1/5f0d5773a93d0',                                  // 七牛云视频直传上传签名
  getRechargeRule: '/v1/5fc8e418de825',                                 // 会员充值金额列表
  postPayment: '/v1/5d784b976769e',                                     // 支付
  alipayOrder: '/v1/5d7a088403825',                                     // 支付宝支付
  wxpayOrder: '/v1/5d7868c138418',                                      // 微信支付
  postUserSocialLogin: '/v1/5d7660a421e69',                             // 微信登录
  getShare: '/v1/5ff44de27b110',                                        // 微信分享
  getPutaway:'/v1/600e7e9a158f6',										// 用于苹果上架隐藏三方登录  


  /*====================================
  =            work control            =
  ====================================*/

  getWorkType: '/v1/5fc859132be45',                                     // 作品分类
  getWorkTypeSymptom: '/v1/5fc86042147f8',                              // 作品分类子级（症状自检）
  getWorkTypeSymptomCure: '/v1/5fc86111cc4eb',                          // 作品分类孙子级的视频（治疗方法）
  postWorkAddWork: '/v1/5ef01a165d430',                                 // 发布图文
  getWorkWorkList: '/v1/5ef023c308ca0',                                 // 作品列表
  postWorkConcern: '/v1/5ef05070e6780',                                 // 关注用户
  postWorkLike: '/v1/5fc885242134f',                                    // 作品/视频点赞收藏
  getWorkWorkDetail: '/v1/5ef05eef032c8',                               // 作品详情
  postWorkAddRemark: '/v1/5fc8867722475',                               // 作品/视频添加评论
  getWorkRemark: '/v1/5ef07cf0b5a40',                                   // 评论列表
  postWorkRemarkLike: '/v1/5ef083ad27100',                              // 作品/视频评论点赞
  postWorkCollect: '/v1/5fc89d8662a54',                                 // 作品/视频收藏
  postWorkComplain: '/v1/5ef16888c3ff0',                                // 发布投诉
  postWorkSend: '/v1/5ef87b9843df0',                                    // 送花朵数
  postWorkDashang: '/v1/5ef9a2c1a9ad8',                                 // 作品打赏/视频打赏
  getWorkPlate: '/v1/5f0308be35b60',                                    // 送花/打赏模板
  getWorkWorkType: '/v1/5f0440f19a650',                                 // 作品/视频分类
  getWorkMyConcern: '/v1/5f0d6f74afd48',                                // 首页-关注
  postAbout: '/v1/5fc890aad1aa2',                                       // 个人中心
  postMessage:'/v1/5fc88c69d2923',                                      // 消息列表
  postMessageDetails:'/v1/5fe1e19152418',                               // 消息详情
  /*=========================================
  =            operation control            =
  =========================================*/

  postOperationGetColumn: '/v1/5fce26641a085',                          // 获取指定的文章单页信息
  postOperationGetText: '/v1/5fc61ae683f65',                          // 获取服务协议

  postArticleList:'/v1/5fc85ad397b76',									// 文章列表



  /*=====================================
  =            index control            =
  =====================================*/

  getIndexImages: '/v1/5fc857ca92b9b',                                  // 获取首页轮播图
  getIndexImagesText: '/v1/5fc85c122c1ab',								// 获取首页轮播图详情

  /*=====================================
  =            video control            =
  =====================================*/

  postVideoGetVideoSign: '/v1/5ef1c6702b2a0',                           // 上传视频签名
  postVideoAddVideo: '/v1/5ef1da16429a0',                               // 发布视频内容
  getVideoVideoList: '/v1/5ef2f1dee4778',                               // 视频列表
  getVideoVideoDetail: '/v1/5fc8824428820',                             // 视频详情
  postVideoShare: '/v1/5ef303689ee30',                                  // 转发成功接口
  postVideoVideo: '/v1/5ef322ef33f40',                                  // 视频上传成功回调




  feedbackType: '/v1/5d63ba953ee01',                                    // 获取意见反馈类型
  feedbackSubmit: '/v1/5cc3f28296cf0',                                  // 提交意见反馈
  publicUpdateAPP: '/api/index/getVersion',                             // 静默更新
  publicGetAgreement: '/api/index/getAgreement',                        // 注册协议

  /*=====  End of public interface  ======*/









}
