
//线上环境
var lsjHost = 'https://testapi.prise.shop';
//  var lsjHost = 'https://api.prise.shop';

var config ={
  // 获取首页资源
  getIndex: `${lsjHost}/major/index`,
  // 获取首页 改版
  getIndexNew: `${lsjHost}/major/index/one`,
  // 个人中心 获取订单数量
  getOrderNumber: `${lsjHost}/orders/get/number/user`,
  // 个人中心 获取收藏数量
  getCollectNum: `${lsjHost}/collection/get/collection/number`,
  // 个人中心 获取消息数量
  getMessageNum: `${lsjHost}/user/message/get/user/message/num`,
  // 获取商品详情
  // getProductDetails: `${lsjHost}/product/get/id`,
  getProductDetails: `${lsjHost}/product/get/available/id`,
  // 添加到购物车
  postCar: `${lsjHost}/cart/add`,
  // 查看购物车
  getCar: `${lsjHost}/cart/get`,
  // 从购物车中删除一个商品
  postDeleteCar: `${lsjHost}/cart/remove`,
  // 购物车修改商品数量
  postNumber: `${lsjHost}/cart/modify/num`,
  // 购物车商品的勾选
  postChangeChoose: `${lsjHost}/cart/modify/choose`,
  // 购物车全选切换
  postSelectAll: `${lsjHost}/cart/modify/choose/all`,
  // 确认订单信息
  postOrder: `${lsjHost}/orders/confirm`,
  // 获取专题商品列表
  // getSpecial: `${lsjHost}/product/get/special/id`,
  // getSpecial: `${lsjHost}/product/get/special/available/id`,
  getSpecial: `${lsjHost}/product/get/special/available/id/group`,
  // 立即购买
  postBuyNow: `${lsjHost}/cart/add/temp`,
  // 添加地址
  postAddaddress: `${lsjHost}/user/address/add`,
  // 修改地址
  postModifyAddress: `${lsjHost}/user/address/modify`,
  //意见反馈
  getFeedback: `${lsjHost}/user/feedback/add`,
  // 添加地址
  getAddRess: `${lsjHost}/user/address/add`,
  // 查看地址列表
  getAddressList: `${lsjHost}/user/address/get/user`,
  // 提交订单
  postOrderSubmit: `${lsjHost}/orders/submit`,
  // 查询用户自己的订单:
  getUserOrder: `${lsjHost}/orders/get/user`,
  // 查询订单详情：
  getOrderDetail: `${lsjHost}/orders/get/details/id`,
  // 单独支付订单：
  postOrderPay: `${lsjHost}/orders/pay`,
  // 确认收货
  postReceive: `${lsjHost}/orders/affirm`,
  // 添加收藏
  postAddCollect: `${lsjHost}/collection/add`,
  // 取消收藏
  postRemoveCollect: `${lsjHost}/collection/remove`,
  // 查看收藏列表
  getCollectList: `${lsjHost}/collection/get`,
  // 获取用户消息
  getMessage: `${lsjHost}/user/message/get/all`,
  // 获取用户手机号
  getUserPhone: `${lsjHost}/user/px/get/phone`,
  // 更新用户手机号
  postUpdatePhone: `${lsjHost}/user/px/update/phone`,
  // 授权创建用户
  postCreateUser: `${lsjHost}/user/wechat/authorize`,
  postCreateUserNew: `${lsjHost}/user/wechat/get/unionId`,
  postRefreshToken: `${lsjHost}/user/wechat/afresh/token`,
  // 获取验证码
  postGetCode: `${lsjHost}/user/px/get/phone/code`,
  // 校验验证码
  postSumbitCode: `${lsjHost}/user/px/verification/code`,
  // 退出登陆
  postLogout: `${lsjHost}/user/px/sign/out`,
  // 商品是否收藏
  postHasCollected: `${lsjHost}/collection/is/collection`,
  // 获取购物车商品数量
  getShoppingCarNumber: `${lsjHost}/cart/get/cart/num`,
  // 获取用户信息
  getUserInformation: `${lsjHost}/user/px/get/userinfo`,
  // 送给好友
  postAddGift: `${lsjHost}/cart/gift/add`,
  // 查看知礼购物车
  getGiftCar: `${lsjHost}/cart/gift/get`,
  // 知礼购物车数量修改
  postModifyGiftNum: `${lsjHost}/cart/gift/modify/num`,
  // 知礼支付订单 
  postPayGiftOrder: `${lsjHost}/orders/gift/pay`,
  // 开箱子支付订单
  postPayBoxOrder: `${lsjHost}/orders/lucky/pay`,
  // 拼图支付订单
  postPayPintuOrder: `${lsjHost}/orders/jigsaw/pay`,
  // 答题支付订单
  postPayAnswerOrder: `${lsjHost}/orders/answer/pay`,
  // 群送礼 支付
  postPayGroupOrder: `${lsjHost}/orders/group/pay`,
  // 群送礼 提交订单
  postSubmitGroupOrder: `${lsjHost}/orders/group/submit`,
  // 知礼提交订单明细
  postSubmitGiftOrder: `${lsjHost}/orders/gift/submit`,
  // 开箱子提交订单明细
  postSubmitBoxOrder: `${lsjHost}/orders/lucky/submit`,
  // 拼图提交订单明细
  postSubmitPintuOrder: `${lsjHost}/orders/jigsaw/submit`,
  // 答题提交订单明细
  postSubmitAnswerOrder: `${lsjHost}/orders/answer/submit`,
  // 获取礼物卡详情
  getGiftCardDetails: `${lsjHost}/orders/gift/get/details/id`,
  // 送礼记录
  getGiftRecords: `${lsjHost}/orders/gift/get/user`,
  // 查看抽奖情况
  // getGiftCardInfo: `${lsjHost}/orders/gift/partake/get/details/id`,
  getGiftCardInfo: `${lsjHost}/orders/quiet/partake/get/details/id`,  
  // 查看抽奖情况 开箱子
  getBoxCardInfo: `${lsjHost}/orders/lucky/partake/get/details/id`,
  // 查看抽奖情况 拼图
  getPintuCardInfo: `${lsjHost}/orders/jigsaw/partake/get/details/id`,
  // 查看抽奖情况 答题
  getAnswerCardInfo: `${lsjHost}/orders/answer/partake/get/details/id`,
  // 参加礼物领取
  postJoinGame: `${lsjHost}/orders/quiet/partake/add`,
  // postJoinGame: `${lsjHost}/orders/gift/partake/add`,
  // 开箱抽奖
  postJoinOpenBox: `${lsjHost}/orders/lucky/partake/add`,
  // 开箱中奖
  postBoxWinner: `${lsjHost}/orders/lucky/address/fix`,
  // 开始拼图
  postStartGame: `${lsjHost}/orders/jigsaw/partake/add`,
  // 拼图完成 提交时间
  postPintuTime: `${lsjHost}/orders/jigsaw/game/finish`,
  // 判断是否可以助力
  getCanAssistant: `${lsjHost}/orders/lucky/user/share/accept`,
  // 判断是否可以助力 拼图
  getCanAssistantPintu: `${lsjHost}/orders/jigsaw/user/share/accept`,
  // 发起助力
  postAssistant: `${lsjHost}/orders/lucky/user/share/accept/Assist`,
  // 发起助力 拼图
  postAssistantPintu: `${lsjHost}/orders/jigsaw/user/share/accept/Assist`,
  // 获取用户默认地址
  getUserDefaultAddress: `${lsjHost}/user/address/get/user/default/address`,
  // 获取收礼人列表
  // getReceiverList: `${lsjHost}/orders/gift/partake/get`,
  getReceiverList: `${lsjHost}/orders/quiet/partake/get`,  
  // 确认收礼人
  postConfirmReceiver: `${lsjHost}/orders/quiet/address/fix`,
  // postConfirmReceiver: `${lsjHost}/orders/gift/address/fix`,
  // 是否参与过活动
  getIsJoin: `${lsjHost}/orders/quiet/partake/status`,
  // getIsJoin: `${lsjHost}/orders/gift/partake/status`,
  // 获取专题列表
  getAllSpecial: `${lsjHost}/product/special/get/all/available`,
  // 获取小程序二维码地址
  postwachatCode: `${lsjHost}/user/wechat/get/wachat/code/unlimit`,
  // 倒计时
  getCountSeconds: `${lsjHost}/product/special/get/week/time/remain`,
  // 获取所有图片分类
  getGalleryCategory: `${lsjHost}/major/jigsaw/get/all/classify`,
  // 获取图片库
  getGallery: `${lsjHost}/major/jigsaw/get/classify`,
  // 拼图开奖 判断服务通知页面跳转状态
  getIsWinner: `${lsjHost}/orders/jigsaw/game/bingo`,
  // 拼图 填地址
  postPintuAddress: `${lsjHost}/orders/jigsaw/address/fix`,
  // 答题 获取指定答题数量的随机题目
  getQuestion: `${lsjHost}/major/interlocution/get/stochastic`,
  // 答题页面部分数据
  getAnswerActiveData: `${lsjHost}/orders/answer/partake/page/active/data`,
  // 提交答题时间
  postAnswerGameTime: `${lsjHost}/orders/answer/game/finish`,
  // 开始答题
  postJoinAnswerGame: `${lsjHost}/orders/answer/partake/add`,
  // 判断是否可以助力 答题
  getCanAssistantAnswer: `${lsjHost}/orders/answer/user/share/accept`,
  // 答题 助力
  postAssistAnswer: `${lsjHost}/orders/answer/user/share/accept/Assist`,
  // 判断是否中奖
  getIsWinnerAnswer: `${lsjHost}/orders/answer/game/bingo`,
  // 提交答题地址
  postAnswerAddress: `${lsjHost}/orders/answer/address/fix`,
  // 记录分享次数
  postShareNumber: `${lsjHost}/orders/gift/share/num`,
  // 记录拼图的formid
  postPintuFormid: `${lsjHost}/orders/jigsaw/game/finish/notify`,
  // 记录答题的formid
  postAnswerFormid: `${lsjHost}/orders/answer/game/finish/notify`,
  // 查看所有标签
  getAllSpecialLabel: `${lsjHost}/product/special/label/get/by/special`,
  // 获取优惠券
  getCouponIndex: `${lsjHost}/major/coupon/select/all`,
  // getCouponIndex: `${lsjHost}/major/coupon/select/operate`,
  // 用户领取优惠券
  postAddCoupon: `${lsjHost}/user/coupon/user/add/batch`,
  // 获取用户优惠券
  getUserCoupon: `${lsjHost}/user/coupon/get/user/coupon`,
  // 查询用户是否领取了优惠券
  postHasCoupon: `${lsjHost}/user/coupon/check/user/is/receive`,
  // 个人中心获取用户可用的优惠券数量
  getUserCanUserCoupon: `${lsjHost}/user/coupon/get/user/use/coupon/number`,
  // 更新优惠券选中状态
  postUpdateCouponStatus: `${lsjHost}/user/coupon/update/user/coupon/choose`,
  // 提交吐槽（确认）
  submitFuck: `${lsjHost}/orders/free/fuck/partake/submit`,
  //  查看抽奖情况
  whatchPartakeDetail: `${lsjHost}/orders/free/fuck/partake/get/details/id`,
  //  切换吐槽列表数据的排序
  swichPartakeFuck: `${lsjHost}/orders/free/fuck/switch/partake/fuck`,
  //  获取吐槽优惠券
  getFuckOperate: `${lsjHost}/major/coupon/select/operate/free`,
  //  参加吐槽（开始吐槽）
  addFreePartake: `${lsjHost}/orders/free/fuck/partake/add`,
  //  参加吐槽（开始吐槽）
  addFreeLikes: `${lsjHost}/orders/free/fuck/partake/encourage`,
  // 获取活动列表
  getActivity: `${lsjHost}/orders/free/get/activity`,
  // 查看免费活动拼图抽奖情况
  getActivityPintuInfo: `${lsjHost}/orders/free/jigsaw/partake/get/details/id`,
  // 免费活动 参加拼图
  postJoinActivityPintu: `${lsjHost}/orders/free/jigsaw/partake/add`,
  // 免费活动 提交拼图时间
  postSubmitPintuActivityTime: `${lsjHost}/orders/free/jigsaw/partake/submit`,
  // 免费活动 单独提交formid 拼图
  postFormIdPintuActivity: `${lsjHost}/orders/free/jigsaw/partake/submit/form`,
  // 查看免费活动 答题抽奖情况
  getActivityAnswerInfo: `${lsjHost}/orders/free/answer/partake/get/details/id`,
  // 免费活动 参加答题
  postJoinActivityAnswer: `${lsjHost}/orders/free/answer/partake/add`,
  // 免费活动 答题页面动态数据
  getActivityAnswerData: `${lsjHost}/orders/free/answer/partake/page/active/data`,
  // 免费活动 提交拼图时间
  postSubmitAnswerActivityTime: `${lsjHost}/orders/free/answer/partake/submit`,
  // 免费活动 单独提交formid 拼图
  postFormIdAnswerActivity: `${lsjHost}/orders/free/answer/partake/submit/form`,
  // 免费活动 判断是否可以助力
  getCanAssistantActivityAnswer: `${lsjHost}/orders/free/answer/user/share/accept`,
  // 免费活动 答题助力
  postActivityAnswerAssistance: `${lsjHost}/orders/free/answer/user/share/accept/assist`,
  // 免费活动 开奖通知 查看是否中奖
  getIsWinnerActivity: `${lsjHost}/orders/free/game/bingo`,
  // 免费活动 提交中奖地址
  postActivityAddress: `${lsjHost}/orders/free/address/fix`,
  // 查看免费拼图活动是否可以助力
  getCanAssistantActivityPintu: `${lsjHost}/orders/free/jigsaw/user/share/accept`,
  // 免费拼图活动助力
  addAssistantActivityPIntu: `${lsjHost}/orders/free/jigsaw/user/share/accept/assist`,
  // 群送礼 查看送礼情况
  getGroupPartakeInfo: `${lsjHost}/orders/group/partake/get/details/id`,
  // 群送礼 参加送礼
  postJoinGroup: `${lsjHost}/orders/group/partake/add`,
  // 群送礼 支付回调
  postJoinGroupCallback: `${lsjHost}/orders/group/partake/submit`,
  // 群送礼 留下祝福
  postSubmitMessage: `${lsjHost}/orders/group/partake/blessing`,
  // 群送礼 填地址
  postAddaddressGroup: `${lsjHost}/orders/group/address/fix`,
  // 查看物流
  getLogistictsInfo: `${lsjHost}/orders/logistics/select`,
  // 查看物流 通过订单号
  getLogistictsByOrder: `${lsjHost}/orders/logistics/by/orders`,
  // 我收到的 详情
  getReceiveDetails: `${lsjHost}/orders/gift/get/receive/details`,
  // 支付订单
  postGiftOrderAll: `${lsjHost}/orders/gift/pay`,
  // 提交订单
  postsubmitGiftOrderAll: `${lsjHost}/orders/gift/submit`,
  // 获取下期免费活动时间
  getNextActivityTime: `${lsjHost}/orders/free/get/activity/next/date`,
  // 摇骰子获取活动内容
  getDiceOrderDetail: `${lsjHost}/orders/free/dice/partake/get/details/id`,
  // 参加摇骰子活动
  postJoinDiceActivity: `${lsjHost}/orders/free/dice/partake/add`,
  // 获取骰子点数
  postDiceNumber: `${lsjHost}/orders/free/dice/partake/get/dice`,
  // 摇骰子 单独提交formId
  postDiceFormId: `${lsjHost}/orders/free/dice/partake/submit/form`,
  // 查看是否可以助力 摇骰子
  getCanHelpDice: `${lsjHost}/orders/free/dice/user/share/accept`,
  // 助力 摇骰子
  postHelpDice: `${lsjHost}/orders/free/dice/user/share/accept/assist`,
  // 摇骰子 知礼活动详情
  getDiceDetails: `${lsjHost}/orders/dice/partake/get/details/id`,
  // 摇骰子 知礼参加活动
  postJoinDiceGame: `${lsjHost}/orders/dice/partake/add`,
  // 单独提交formid
  postSubmitDiceFormid: `${lsjHost}/orders/dice/partake/submit/form`,
  // 知礼 判断是否可以助力 摇骰
  getCanHelpDiceGift: `${lsjHost}/orders/dice/user/share/accept`,
  // 知礼 助力骰子
  postHelpDiceGift: `${lsjHost}/orders/dice/user/share/accept/assist`,
  // 知礼 提交中奖地址
  postGiftOrderAddress: `${lsjHost}/orders/gift/address/fix`,
  // 判断是否中奖 摇骰子
  getIsWinnerDice: `${lsjHost}/orders/gift/game/bingo`,
  // 获取分享小图
  getSharePic: `${lsjHost}/major/system/config/get/by/key`,
  // 分页获取游戏排行榜 摇骰子
  getRankList: `${lsjHost}/orders/free/dice/partake/get/user/list`,
  // 分页获取游戏排行榜 答题
  getRankListAnswer: `${lsjHost}/orders/free/answer/partake/get/user/list`,
  // 分页获取游戏排行榜 拼图
  getRankListPintu: `${lsjHost}/orders/free/jigsaw/partake/get/user/list`,
  // 查看是否已经购买
  getIsBuy: `${lsjHost}/buy/qualification`,
  // 获取专题所有产品
  getSecKillList: `${lsjHost}/product/special/get/relative/timelimit`,
  // 获取秒杀产品详情
  getSeckillProductInfo: `${lsjHost}/product/get/timelimit`,
  // 获取当前秒杀专题
  getCurrentSeckill: `${lsjHost}/product/special/get/available/timelimit`,
  // 直接送参与活动
  postJoinGameDirect: `${lsjHost}/orders/direct/partake/add`,
  // 直接送填地址
  postAddressDirect: `${lsjHost}/orders/direct/address/fix`,
  // 直接送查看详情
  getGiftCardInfoDirect: `${lsjHost}/orders/direct/partake/get/details/id`, 
  // 送出礼物 收集formid
  postFormIdSender: `${lsjHost}/orders/gift/send/out`,
  // 获取用户种树状态
  getWishTreeStatus: `${lsjHost}/promise/index/judge/player/status`,
  // 获取愿望
  getWishesIndex: `${lsjHost}/promise/index/new`,
  // 确定愿望 生成许愿树
  postWishTree: `${lsjHost}/promise/tree/create`,
  // 获取许愿树
  getWishTreeInfo: `${lsjHost}/promise/index/tree`,
  // 获取树友
  getTreeFriends: `${lsjHost}/promise/tree/friends`,
  // 给许愿树浇水
  postTreeWatering: `${lsjHost}/promise/tree/watering`,
  // 判断好友是否有许愿树
  getIsFriendsHasTree: `${lsjHost}/promise/tree/judge/friend/tree/have`,
  // 参加拼图游戏 判断是否为首次参与游戏
  postIsFirstTimeJoin: `${lsjHost}/promise/partake/jigsaw/game`,
  // 分享拼图游戏 判断是否为首次分享
  postIsFirstTimeShare: `${lsjHost}/promise/share/tree/game`,
  // 获取拼图详情
  getTreeGameInfo: `${lsjHost}/promise/jigsaw/partake/get/details`,
  // 参加拼图游戏
  postJoinTreeGame: `${lsjHost}/promise/jigsaw/partake/add`,
  // 提交挑战成功接口
  postSuccessGame: `${lsjHost}/promise/jigsaw/partake/success`,
  // 提交挑战失败接口
  postFailGame: `${lsjHost}/promise/jigsaw/partake/fail`,
  // 收集许愿树能量
  postGatherEnergy: `${lsjHost}/promise/tree/gather/tree/value`,
  // 浇水页面 获取许愿树信息
  getWateringTreeInfo: `${lsjHost}/promise/friends/index/tree`,
  // 判断访客是否有许愿树
  getHasTreeVisiter: `${lsjHost}/promise/tree/judge/myself/tree/have`,
  // 许愿树游戏助力
  postAssistTreeGame: `${lsjHost}/promise/jigsaw/user/share/accept/assist`,
  // 许愿树收货果实提交地址
  postWishTreeAddress: `${lsjHost}/promise/orders/submit/address`,
  // 根据promiseId获取许愿树果实名称
  getFruitName: `${lsjHost}/promise/tree/get/fruit/by/pid`,
  // 重新许愿
  postAfreshTree: `${lsjHost}/promise/tree/afresh/create`,
  // 重新闯关
  postAfreshGame: `${lsjHost}/promise/jigsaw/afresh/jigsaw/grade`,
  // 获取攻略
  getStrategyList: `${lsjHost}/promise/strategy/get/filter/list`,
  // 当前愿望记录
  getWishRecordNow: `${lsjHost}/promise/orders/get/promise/current`,
  // 愿望记录
  getWishRecordList: `${lsjHost}/promise/orders/get/promise/finish/list`,
  // 领取详情
  getWishRecordDetails: `${lsjHost}/promise/orders/get/promise/details`,
  // 排行榜本期榜单
  getCurrentRank: `${lsjHost}/promise/rank/get/current/ranking`,
  // 排行榜上期榜单
  getLastRank: `${lsjHost}/promise/rank/get/last/ranking`,
  // 排行榜中奖情况
  getRankWinnerInfo: `${lsjHost}/promise/orders/ranking/judge`,
  // 中奖后收集能量接口
  postRankWinnerEnergy: `${lsjHost}/promise/orders/ranking/gather/value`,
  // 提交地址排行榜中实物奖励
  postRankWinnerAddress: `${lsjHost}/promise/orders/ranking/submit/address`,
  // 获取奖励说明
  getStrategyContent: `${lsjHost}/promise/strategy/get/rank`,
  // 获取每日福利
  getDailyTask: `${lsjHost}/promise/task/list/daily`,
  // 获取成长福利
  getPeriodTask: `${lsjHost}/promise/task/list/period`,
  // 领取任务奖励
  getTaskRewards: `${lsjHost}/promise/task/take/reward`,
  // 我的道具列表
  getUserToolList: `${lsjHost}/promise/tools/catalog`,
  // 获取时间静止卡（对象）
  getMyTimeTool: `${lsjHost}/promise/tools/get/jigsaw/view`,
  // 消耗一张道具卡
  postConsumeTools: `${lsjHost}/promise/tools/consume/one`,
  // 查看钱包余额
  postAccountDetail: `${lsjHost}/user/account/selectinto`,
  // 兑换接口1
  postRechargeFirst: `${lsjHost}/user/account/getcard`,
  // 兑换接口2
  postRechargeConfirm: `${lsjHost}/user/account/recharge`,
  // 查询账户明细
  getAccountDetails: `${lsjHost}/user/account/selectUserWaterVo`,
  // 获取首页热销商品
  getHotProduct: `${lsjHost}/product/get/special/available/id/group/home`,
  // 获取是否存在惊喜红包
  getHasSurprise: `${lsjHost}/promise/tree/surprise/get/one`,
  // 领取惊喜红包
  postReceiveSurprise: `${lsjHost}/promise/tree/surprise/take/one`,
  // 收获红包果实
  postSubmitMoneyFruit: `${lsjHost}/promise/orders/submit/fictitious`,
  // 红包提现接口
  postGetCash: `${lsjHost}/user/account/redWithdrawal`,
  // 获取答题机会数
  getAnswerGameDetails: `${lsjHost}/promise/answer/partake/get/details`,
  // 参加答题游戏
  postJoinTreeAnswer: `${lsjHost}/promise/answer/partake/add`,
  // 许愿树答题获取题库
  getTreeAnswers: `${lsjHost}/promise/answer/get/stochastic`,
  // 许愿树答题提交
  postTreeAnswersResult: `${lsjHost}/promise/answer/partake/submit`,
  // 许愿树答题助力
  postTreeAnswerHelp: `${lsjHost}/promise/answer/user/share/accept/assist`
}
export {
  config
}