Page({
    data: {
      publicCourses: [
        { id: 1, name: '《科技型企业融资实务》', duration: '4个课时' }
      ],
      practicalCourses: [
        { id: 3, name: '《科技型企业融资实务》', duration: '18个课时' }
      ],
      services: [
        { id: 1, name: '融资合规咨询服务', form: '专项服务' },
        { id: 2, name: '商业模式提升服务', form: '专项服务' },
        { id: 3, name: '融资谈判辅导服务', form: '专项服务' },
        { id: 4, name: '尽职调查服务', form: '专项服务' },
        { id: 5, name: '指导搭建融资交易架构并监督实施', form: '专项服务' }
      ],
      date: '2025.8.19'
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