Page({
    data: {
      publicCourses: [
        { id: 1, name: '《智慧农业的发展方向及国家政策》', duration: '4个课时' }
      ],
      marketServices: [
        { id: 1, name: '筹备"博士农场"优质农产品供应体系，协助科技农业开阔市场。', form: '专门项目' }
      ],
      services: [
        { id: 1, name: '针对科技农业的技术需求，对接技术服务', form: '项目服务' },
        { id: 2, name: '推行"科技筑牢安全屏障"理念，帮助科技农业企业开展升级改造。', form: '项目服务' },
        { id: 3, name: '农业政策辅导服务', form: '项目服务' },
        { id: 4, name: '科技农业企业的投融资服务', form: '项目服务' },
        { id: 5, name: '其他与科技农业相关的项目咨询', form: '项目服务' }
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