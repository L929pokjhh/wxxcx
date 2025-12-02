// alliance.js
const app = getApp()

Page({
  data: {
    searchText: '',
    allianceImages: [
      {
        id: 1,
        url: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250920161051_21_90.jpg?sign=4caaf1e88e9adda8cd99ff8a1ad784f9&t=1758358161',
        alt: '法治赋能未来产业研讨会'
      },
      {
        id: 2, 
        url: 'https://6d79-mysql-8g56ytryd3fbd84d-1379178678.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250920161051_21_90.jpg?sign=5052d124fd7540eae27f420715e34fdf&t=1758356121',
        alt: '访问同济南昌智能新能源汽车研究院'
      }
    ],
    businessCards: [
      {
        id: 1,
        title: '知识共融 携手共进',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        icon: '🤝'
      },
      {
        id: 2,
        title: '赋能地方 助力发展',
        bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        icon: '🚀'
      },
      {
        id: 3,
        title: '产学联动 共创未来',
        bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        icon: '🏢'
      },
      {
        id: 4,
        title: '创新赋能 生态共建',
        bgColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        icon: '💡'
      }
    ]
  },

  onLoad: function (options) {
    console.log('联盟介绍页面加载')
    this.loadAllianceData()
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

  // 加载联盟数据
  loadAllianceData: function() {
    wx.showLoading({
      title: '加载中...'
    })

    // 从云数据库加载联盟数据
    const db = app.getDB()
    if (db) {
      db.collection('alliance_info').limit(1).get()
        .then(res => {
          wx.hideLoading()
          if (res.data && res.data.length > 0) {
            console.log('从云数据库加载联盟数据成功')
            // 可以更新页面数据
          } else {
            console.log('使用默认联盟数据')
          }
        })
        .catch(err => {
          wx.hideLoading()
          console.log('加载联盟数据失败，使用默认数据:', err)
        })
    } else {
      wx.hideLoading()
    }
  },

  // 图片点击预览
  previewImage: function(e) {
    const current = e.currentTarget.dataset.url
    const urls = this.data.allianceImages.map(img => img.url)
    
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  // 业务卡片点击
  onBusinessCardTap: function(e) {
    const cardId = e.currentTarget.dataset.id
    const card = this.data.businessCards.find(item => item.id === cardId)
    
    if (card) {
      const detailMap = {
        1: {
          title: '知识共融 携手共进',
          content: '同心济世博士联盟致力于打造知识共享平台，促进会员间的学术交流与合作。通过定期举办学术研讨会、专业论坛等活动，推动多学科交叉融合，实现知识资源的优化配置和共同发展。'
        },
        2: {
          title: '赋能地方 助力发展',
          content: '发挥博士联盟的智力优势，为地方政府和企业提供决策咨询、技术指导和人才支持。通过产学研合作，推动科技成果转化，助力地方经济社会发展和产业升级转型。'
        },
        3: {
          title: '产学联动 共创未来',
          content: '构建产业界与学术界的桥梁，促进高校科研成果与市场需求的有效对接。通过建立产学研合作基地，推动技术创新和产业化发展，实现产学研深度融合。'
        },
        4: {
          title: '创新赋能 生态共建',
          content: '以创新为驱动力，构建开放包容的创新生态系统。整合优质资源，为创新创业项目提供全方位支持，培育新兴产业，推动经济高质量发展。'
        }
      }
      
      const detail = detailMap[cardId]
      wx.showModal({
        title: detail.title,
        content: detail.content,
        showCancel: true,
        cancelText: '关闭',
        confirmText: '了解更多',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '更多详情即将推出',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  // 图片加载错误处理
  onImageError: function(e) {
    console.log('图片加载失败:', e.detail)
    const index = e.currentTarget.dataset.index
    if (index !== undefined) {
      const key = `allianceImages[${index}].url`
      this.setData({
        [key]: '/images/default-goods-image.png'
      })
    }
  },

  // 底部导航 - 首页
  navigateToHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  // 底部导航 - 联盟介绍 (当前页面)
  navigateToAlliance: function() {
    // 当前页面，无需跳转
  },

  // 底部导航 - 活动详情
  navigateToActivities: function() {
    wx.navigateTo({
      url: '/pages/latest activity/latest activity'
    })
  },

  // 页面分享
  onShareAppMessage: function () {
    return {
      title: '同心济世博士联盟 - 联盟介绍',
      path: '/pages/alliance/alliance',
      imageUrl: '/images/share-alliance.jpg'
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...'
    })

    this.loadAllianceData()
    
    setTimeout(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新完成',
        icon: 'success'
      })
    }, 1500)
  }
})
