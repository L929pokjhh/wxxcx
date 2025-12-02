// pages/ai-committee/ai-committee.js
Page({
    data: {
      // 可以在这里定义数据，如果需要动态加载内容
    },
    
    onLoad: function (options) {
      // 页面加载时的逻辑
    },
    
    onReady: function () {
      // 页面初次渲染完成时的逻辑
    },
    
    onShow: function () {
      // 页面显示时的逻辑
    },
    
    onHide: function () {
      // 页面隐藏时的逻辑
    },
    
    onUnload: function () {
      // 页面卸载时的逻辑
    },
    
    // 自定义方法
    onRowTap: function(e) {
      // 处理行点击事件
      console.log('行被点击', e);
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
    }
  })