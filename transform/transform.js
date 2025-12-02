// transform.js
const app = getApp()

Page({
  data: {
    searchText: '',
    showAchievementModal: false,
    currentAchievement: {},
    latestNews: [],
    achievements: []
  },

  onLoad: function (options) {
    console.log('转化中心页面加载')
    this.loadTransformData()
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  // 搜索输入处理
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: ''
    })
  },

  // 执行搜索
  performSearch: function() {
    const { searchText } = this.data
    if (!searchText.trim()) {
      wx.showToast({
        title: '请输入搜索关键字',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '搜索中...'
    })

    // 模拟搜索API调用
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: `搜索"${searchText}"`,
        icon: 'none'
      })
    }, 1000)
  },

  // 加载转化中心数据
  loadTransformData: function() {
    wx.showLoading({
      title: '加载中...'
    })

    // 从云数据库加载科技成果转化项目数据
    const db = app.getDB()
    if (db) {
      // 从transform_achievements集合加载数据，获取title, image, description, tags, number, unit字段，并按number字段升序排列
      db.collection('transform_achievements')
        .field({
          title: true,
          image: true,
          description: true,
          tags: true,
          number: true,
          unit: true
        })
        .orderBy('number', 'asc')
        .get()
        .then(res => {
          wx.hideLoading()
          if (res.data && res.data.length > 0) {
            console.log('从云数据库加载科技成果转化项目数据成功')
            this.setData({
              achievements: res.data
            })
          } else {
            console.log('未找到科技成果转化项目数据')
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('加载科技成果转化项目数据失败:', err)
        })
    } else {
      wx.hideLoading()
    }
  },

  // 最新消息卡片点击
  onNewsCardTap: function(e) {
    const newsId = e.currentTarget.dataset.id
    const news = this.data.latestNews.find(item => item.id === newsId)
    
    if (news) {
      wx.showModal({
        title: news.title,
        content: news.description + '\n\n发布时间：' + news.date,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '了解更多',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '更多详情即将推出',
              content: '获取更多详细资料，请联系：秘书长何忠成：18917688962（微信同号）',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  // 显示科技成果详情弹窗
  showAchievementModal: function(e) {
    const index = e.currentTarget.dataset.index;
    const achievement = this.data.achievements[index];
    
    // 设置页面禁止滚动（不自动滚动到顶部，保持当前位置）
    wx.setPageStyle({
      style: {
        overflow: 'hidden'
      }
    });
    
    this.setData({
      currentAchievement: achievement,
      showAchievementModal: true
    });
  },

  // 隐藏科技成果详情弹窗
  hideAchievementModal: function() {
    // 恢复页面滚动
    wx.setPageStyle({
      style: {
        overflow: 'visible'
      }
    });
    
    this.setData({
      showAchievementModal: false
    });
  },

  // 联系项目
  contactAchievement: function() {
    wx.showModal({
      title: '联系我们',
      content: '获取更多详细资料，请联系：秘书长何忠成：18917688962（微信同号）',
      showCancel: false
    });
  },

  // 阻止事件冒泡
  stopPropagation: function() {
    // 空函数，仅用于阻止事件冒泡
    return;
  },

  // 查看更多信息
  viewMoreInfo: function() {
    wx.showModal({
      title: '历史成果展示',
      content: '转化中心致力于推动科技成果产业化，已成功孵化多个创新项目。更多历史成果信息正在整理中，敬请期待！',
      showCancel: true,
      cancelText: '关闭',
      confirmText: '订阅通知',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '订阅成功，我们将及时通知您',
            icon: 'success'
          })
        }
      }
    })
  },

  // 图片加载错误处理
  onImageError: function(e) {
    console.log('图片加载失败:', e.detail)
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    
    if (type === 'news' && index !== undefined) {
      const key = `latestNews[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    } else if (type === 'achievement' && index !== undefined) {
      const key = `achievements[${index}].image`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    }
  },

  // 弹窗图片加载错误处理
  onModalImageError: function(e) {
    console.log('弹窗图片加载失败:', e.detail)
    this.setData({
      'currentAchievement.image': '/images/default-goods-image.png'
    });
  },

  // 图片预览
  //previewImage: function(e) {
  //  const url = e.currentTarget.dataset.url
  // if (url && !url.includes('default-goods-image.png')) {
  //  wx.previewImage({
  //  current: url,
  //     urls: [url]
  //   })
  //}
  //},

  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 科学成果转化中心',
      path: '/pages/transform/transform',
      imageUrl: '/images/share-transform.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadTransformData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success'
      })
    }, 1500)
  },

  // 触底加载更多
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多...'
    })

    // 模拟加载更多数据
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '暂无更多内容',
        icon: 'none'
      })
    }, 1000)
  }
})