// 艺术专委会页面
Page({
  data: {
    committeeInfo: {
      name: '艺术专委会',
      description: '艺术专委会致力于推动艺术与科技的融合发展，汇聚艺术领域的专家学者，促进艺术创新与文化交流。'
    }
  },

  onLoad: function(options) {
    console.log('艺术专委会页面加载')
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 显示联系我们弹窗
  showContactModal: function() {
    wx.showModal({
      title: '联系我们',
      content: '请联系：秘书长何忠成：18917688962（微信同号）',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#007AFF'
    })
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: '同心济世博士联盟 - 艺术专委会',
      path: '/pages/art committee/art committee'
    }
  }
})